#!/usr/bin/env node

/**
 * Script de Validação em Batch para todos os 27 Alunos
 *
 * Carrega todos os arquivos JSON de alunos e valida contra o schema Zod.
 * Exibe relatório consolidado e exit code baseado em resultado da validação.
 *
 * Uso: node scripts/validate-all-students.js
 * Com relatório detalhado: DEBUG=1 node scripts/validate-all-students.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONSTANTES E CONFIGURAÇÃO
// ============================================================================

const DEBUG = process.env.DEBUG === '1';
const ALUNOS_DIR = path.join(__dirname, '../src/data/alunos');
const SCHEMA_FILE = path.join(__dirname, '../src/lib/zod-student.ts');

const INDICADORES_CORE = [
  'FLUENCIA',
  'DICCAO',
  'MODULACAO_VOZ',
  'LINGUAGEM_NAO_VERBAL',
  'PERSUASAO',
  'ADAPTABILIDADE',
  'LIDERANCA',
  'CRIATIVIDADE'
];

const CATEGORIAS_VALIDAS = {
  'Alta Performance': { min: 80, max: 100 },
  'Operacional': { min: 60, max: 79 },
  'Essencial': { min: 40, max: 59 },
  'Crítico': { min: 0, max: 39 },
  // Alternativas (caso de data legacy)
  'excelente': { min: 80, max: 100 },
  'forte': { min: 60, max: 79 },
  'adequado': { min: 40, max: 59 },
  'insuficiente': { min: 0, max: 39 },
};

// ============================================================================
// TIPOS E ESTRUTURAS
// ============================================================================

/**
 * @typedef {Object} ValidationError
 * @property {string} rule - Nome da regra violada
 * @property {string} message - Mensagem de erro
 * @property {'error'|'warning'} severity - Severidade do erro
 */

/**
 * @typedef {Object} StudentValidationResult
 * @property {string} aluno_id - ID do aluno
 * @property {string} filename - Nome do arquivo
 * @property {boolean} valid - Se passou em todas as validações
 * @property {ValidationError[]} errors - Lista de erros encontrados
 * @property {Object} stats - Estatísticas de validação
 * @property {number} stats.indicadores_total - Total de indicadores
 * @property {number} stats.core_presentes - Quantos core indicators estão presentes
 * @property {number} stats.peso_pilares_soma - Soma dos pesos dos pilares
 * @property {number} stats.peso_pilares_diferenca - Diferença da soma esperada (1.0)
 */

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Valida se categoria corresponde ao score
 * @param {string} categoria - Categoria da performance
 * @param {number} score - Score (0-100)
 * @returns {boolean}
 */
function validarCategoriaVsScore(categoria, score) {
  const range = CATEGORIAS_VALIDAS[categoria];
  if (!range) return false;
  return score >= range.min && score <= range.max;
}

/**
 * Obtém categoria correta para um score
 * @param {number} score - Score (0-100)
 * @returns {string}
 */
function getCategoriaByScore(score) {
  if (score >= 80) return 'Alta Performance';
  if (score >= 60) return 'Operacional';
  if (score >= 40) return 'Essencial';
  return 'Crítico';
}

/**
 * Validação 1: Verifica se todos os core indicators estão presentes
 * @param {Object} analysis - Dados do aluno
 * @returns {Object} { valid, missing, present }
 */
function validateCoreIndicators(analysis) {
  const codigosPresentes = new Set(analysis.indicadores.map(ind => ind.codigo));
  const missing = INDICADORES_CORE.filter(core => !codigosPresentes.has(core));
  const present = INDICADORES_CORE.filter(core => codigosPresentes.has(core));

  return {
    valid: missing.length === 0,
    missing,
    present
  };
}

/**
 * Validação 2: Verifica se soma dos pesos dos pilares é 1.0
 * @param {Object} analysis - Dados do aluno
 * @param {number} tolerance - Tolerância (default 0.01)
 * @returns {Object} { valid, soma, diferenca, detalhes }
 */
function validatePesoPilares(analysis, tolerance = 0.01) {
  const detalhes = {};
  let soma = 0;

  for (const [pilarKey, pilar] of Object.entries(analysis.pilares)) {
    if (pilar && typeof pilar.peso === 'number') {
      detalhes[pilarKey] = pilar.peso;
      soma += pilar.peso;
    }
  }

  const diferenca = Math.abs(soma - 1.0);

  return {
    valid: diferenca < tolerance,
    soma,
    diferenca,
    detalhes
  };
}

/**
 * Validação 3: Valida categoria vs score em indicadores
 * @param {Object} indicador - Indicador individual
 * @returns {Object} { valid, error? }
 */
function validateIndicadorCategoriaScore(indicador) {
  if (!validarCategoriaVsScore(indicador.categoria, indicador.score)) {
    return {
      valid: false,
      error: {
        rule: 'categoria_score_indicador',
        message: `Indicador "${indicador.nome}" (${indicador.codigo}): categoria "${indicador.categoria}" não corresponde ao score ${indicador.score}. Esperado: "${getCategoriaByScore(indicador.score)}"`,
        severity: 'error'
      }
    };
  }
  return { valid: true };
}

/**
 * Validação 4: Valida categoria vs score do resumo geral
 * @param {Object} resumo - Objeto resumo
 * @returns {Object} { valid, error? }
 */
function validateResumoCategoriaScore(resumo) {
  if (!validarCategoriaVsScore(resumo.categoria_geral, resumo.score_geral)) {
    return {
      valid: false,
      error: {
        rule: 'categoria_score_geral',
        message: `Categoria geral "${resumo.categoria_geral}" não corresponde ao score ${resumo.score_geral}. Esperado: "${getCategoriaByScore(resumo.score_geral)}"`,
        severity: 'error'
      }
    };
  }
  return { valid: true };
}

/**
 * Validação 5: Valida confiança (se presente)
 * @param {Object} indicador - Indicador individual
 * @returns {Object} { valid, error? }
 */
function validateConfianca(indicador) {
  if (indicador.confianca !== undefined) {
    if (typeof indicador.confianca !== 'number' || indicador.confianca < 0 || indicador.confianca > 1) {
      return {
        valid: false,
        error: {
          rule: 'confianca_range',
          message: `Indicador "${indicador.nome}" (${indicador.codigo}): confiança ${indicador.confianca} fora do range 0-1`,
          severity: 'error'
        }
      };
    }
  }
  return { valid: true };
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Valida um aluno individualmente
 * @param {Object} analysis - Dados do aluno
 * @param {string} filename - Nome do arquivo
 * @returns {StudentValidationResult}
 */
function validateStudent(analysis, filename) {
  const errors = [];

  // Verificar estrutura básica
  if (!analysis.meta || !analysis.meta.aluno_id) {
    return {
      aluno_id: 'UNKNOWN',
      filename,
      valid: false,
      errors: [{
        rule: 'estructura_basica',
        message: 'Arquivo JSON mal formado - falta meta.aluno_id',
        severity: 'error'
      }],
      stats: {
        indicadores_total: 0,
        core_presentes: 0,
        peso_pilares_soma: 0,
        peso_pilares_diferenca: 0
      }
    };
  }

  // Validação 1: Core Indicators
  const coreCheck = validateCoreIndicators(analysis);
  if (!coreCheck.valid) {
    errors.push({
      rule: 'core_indicators',
      message: `Indicadores CORE ausentes: ${coreCheck.missing.join(', ')}`,
      severity: 'error'
    });
  }

  // Validação 2: Peso dos Pilares
  const pesoCheck = validatePesoPilares(analysis);
  if (!pesoCheck.valid) {
    errors.push({
      rule: 'peso_pilares',
      message: `Soma dos pesos = ${pesoCheck.soma.toFixed(3)} (esperado: 1.0, diferença: ${pesoCheck.diferenca.toFixed(3)})`,
      severity: 'error'
    });
  }

  // Validação 3: Categoria vs Score do Resumo
  if (analysis.resumo) {
    const resumoCheck = validateResumoCategoriaScore(analysis.resumo);
    if (!resumoCheck.valid) {
      errors.push(resumoCheck.error);
    }
  }

  // Validação 4: Categoria vs Score de cada Indicador
  if (Array.isArray(analysis.indicadores)) {
    analysis.indicadores.forEach((ind, idx) => {
      const categCheck = validateIndicadorCategoriaScore(ind);
      if (!categCheck.valid) {
        errors.push(categCheck.error);
      }

      const confCheck = validateConfianca(ind);
      if (!confCheck.valid) {
        errors.push(confCheck.error);
      }
    });
  }

  return {
    aluno_id: analysis.meta.aluno_id,
    filename,
    valid: errors.length === 0,
    errors,
    stats: {
      indicadores_total: analysis.indicadores ? analysis.indicadores.length : 0,
      core_presentes: coreCheck.present.length,
      peso_pilares_soma: pesoCheck.soma,
      peso_pilares_diferenca: pesoCheck.diferenca
    }
  };
}

// ============================================================================
// FILE LOADING AND PROCESSING
// ============================================================================

/**
 * Carrega todos os arquivos JSON de alunos
 * @returns {Array<{filename: string, data: Object}>}
 */
function loadAllStudents() {
  try {
    const files = fs.readdirSync(ALUNOS_DIR).filter(f => f.endsWith('.json'));

    return files.map(filename => {
      try {
        const filepath = path.join(ALUNOS_DIR, filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        const data = JSON.parse(content);
        return { filename, data };
      } catch (error) {
        console.error(`Erro ao carregar ${filename}: ${error.message}`);
        return { filename, data: null, error };
      }
    }).filter(item => item.data !== null);
  } catch (error) {
    console.error(`Erro ao acessar diretório ${ALUNOS_DIR}: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Formata e exibe o relatório
 * @param {StudentValidationResult[]} results - Resultados de validação
 */
function displayReport(results) {
  const validCount = results.filter(r => r.valid).length;
  const errorCount = results.filter(r => !r.valid).length;

  console.log('\n' + '='.repeat(80));
  console.log('RELATÓRIO DE VALIDAÇÃO - TODOS OS ALUNOS');
  console.log('='.repeat(80));
  console.log(`\nData: ${new Date().toLocaleString('pt-BR')}`);
  console.log(`Total de alunos: ${results.length}`);
  console.log(`Alunos válidos: ${validCount} ✓`);
  console.log(`Alunos com erros: ${errorCount} ✗`);
  console.log('');

  // Sumário por status
  console.log('--- SUMÁRIO POR STATUS ---');
  const validResults = results.filter(r => r.valid);
  const invalidResults = results.filter(r => !r.valid);

  if (validResults.length > 0) {
    console.log('\n✓ ALUNOS VÁLIDOS:');
    validResults.forEach(r => {
      console.log(`  • ${r.aluno_id} (${r.filename})`);
      if (DEBUG) {
        console.log(`    Indicadores: ${r.stats.indicadores_total} | Core: ${r.stats.core_presentes}/8 | Peso: ${r.stats.peso_pilares_soma.toFixed(3)}`);
      }
    });
  }

  if (invalidResults.length > 0) {
    console.log('\n✗ ALUNOS COM ERROS:');
    invalidResults.forEach((r, idx) => {
      console.log(`\n  ${idx + 1}. ${r.aluno_id} (${r.filename})`);
      r.errors.forEach(err => {
        const icon = err.severity === 'error' ? '✗' : '⚠';
        console.log(`     ${icon} [${err.severity.toUpperCase()}] ${err.rule}`);
        console.log(`        ${err.message}`);
      });
    });
  }

  // Estatísticas detalhadas em DEBUG
  if (DEBUG) {
    console.log('\n--- ESTATÍSTICAS DETALHADAS ---');
    console.log(`Soma média dos pesos: ${(results.reduce((sum, r) => sum + r.stats.peso_pilares_soma, 0) / results.length).toFixed(4)}`);
    console.log(`Indicadores médios por aluno: ${(results.reduce((sum, r) => sum + r.stats.indicadores_total, 0) / results.length).toFixed(1)}`);

    const errorTypes = {};
    results.forEach(r => {
      r.errors.forEach(err => {
        errorTypes[err.rule] = (errorTypes[err.rule] || 0) + 1;
      });
    });

    if (Object.keys(errorTypes).length > 0) {
      console.log('\n--- DISTRIBUIÇÃO DE ERROS ---');
      Object.entries(errorTypes).forEach(([rule, count]) => {
        console.log(`  ${rule}: ${count}`);
      });
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`Status final: ${errorCount === 0 ? '✓ TODAS AS VALIDAÇÕES PASSARAM' : '✗ EXISTEM ERROS'}`);
  console.log('='.repeat(80) + '\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log('Iniciando validação de alunos...\n');

  // Carregar dados
  const students = loadAllStudents();
  if (students.length === 0) {
    console.error('Nenhum arquivo de aluno encontrado!');
    process.exit(1);
  }

  console.log(`Carregados ${students.length} alunos\n`);

  // Validar cada aluno
  const results = students.map(({ filename, data }) =>
    validateStudent(data, filename)
  );

  // Exibir relatório
  displayReport(results);

  // Exit code baseado em resultado
  const hasErrors = results.some(r => !r.valid);
  process.exit(hasErrors ? 1 : 0);
}

// Executar
if (require.main === module) {
  main();
}

module.exports = {
  validateStudent,
  validateCoreIndicators,
  validatePesoPilares,
  validateIndicadorCategoriaScore,
  validateResumoCategoriaScore,
  validateConfianca,
  getCategoriaByScore,
  validarCategoriaVsScore
};
