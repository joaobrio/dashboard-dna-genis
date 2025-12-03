/**
 * Script de Teste - Parsing de JSONs dos Feedbacks Supremos
 *
 * Valida se todos os arquivos .md contêm JSONs válidos e parseáveis
 * entre as tags ---DNA_GENIS_DASHBOARD_START--- e ---DNA_GENIS_DASHBOARD_END---
 */

const fs = require('fs');
const path = require('path');

// Configuração
const FEEDBACKS_DIR = path.join(__dirname, 'data', 'feedbacks-supremos-011225');
const JSON_START_TAG = '---DNA_GENIS_DASHBOARD_START---';
const JSON_END_TAG = '---DNA_GENIS_DASHBOARD_END---';

// Campos obrigatórios
const REQUIRED_FIELDS = {
  meta: ['versao', 'timestamp', 'analise_id', 'aluno_id'],
  resumo: ['score_geral', 'score_autoconfianca', 'categoria_geral', 'numero_analise'],
  pilares: true, // Object com pilares
  indicadores: true, // Array
  plano_acao: true, // Object
};

// Resultados
const results = {
  total: 0,
  success: 0,
  failed: 0,
  errors: [],
  warnings: [],
};

/**
 * Extrai o JSON entre as tags do arquivo .md
 */
function extractJSON(content, filename) {
  const startIndex = content.indexOf(JSON_START_TAG);
  const endIndex = content.indexOf(JSON_END_TAG);

  if (startIndex === -1) {
    throw new Error(`Tag de início ${JSON_START_TAG} não encontrada`);
  }

  if (endIndex === -1) {
    throw new Error(`Tag de fim ${JSON_END_TAG} não encontrada`);
  }

  if (endIndex <= startIndex) {
    throw new Error('Tag de fim aparece antes da tag de início');
  }

  // Extrai o JSON (pula a linha da tag de início)
  const jsonStr = content.substring(
    startIndex + JSON_START_TAG.length,
    endIndex
  ).trim();

  return jsonStr;
}

/**
 * Valida a estrutura do JSON
 */
function validateStructure(data, filename) {
  const errors = [];
  const warnings = [];

  // Valida meta
  if (!data.meta) {
    errors.push('Campo "meta" ausente');
  } else {
    REQUIRED_FIELDS.meta.forEach(field => {
      if (!data.meta[field]) {
        errors.push(`Campo "meta.${field}" ausente`);
      }
    });
  }

  // Valida resumo
  if (!data.resumo) {
    errors.push('Campo "resumo" ausente');
  } else {
    REQUIRED_FIELDS.resumo.forEach(field => {
      if (data.resumo[field] === undefined) {
        errors.push(`Campo "resumo.${field}" ausente`);
      }
    });
  }

  // Valida pilares
  if (!data.pilares) {
    errors.push('Campo "pilares" ausente');
  } else {
    const expectedPilares = ['oratoria', 'interpessoal', 'intrapessoal', 'repertorio'];
    expectedPilares.forEach(pilar => {
      if (!data.pilares[pilar]) {
        errors.push(`Pilar "${pilar}" ausente`);
      } else {
        // Verifica campo "observacao" em repertorio
        if (pilar === 'repertorio') {
          if (!data.pilares[pilar].observacao) {
            warnings.push('Campo "observacao" ausente no pilar "repertorio"');
          }
        }
      }
    });
  }

  // Valida indicadores
  if (!data.indicadores) {
    errors.push('Campo "indicadores" ausente');
  } else if (!Array.isArray(data.indicadores)) {
    errors.push('Campo "indicadores" deve ser um array');
  } else if (data.indicadores.length === 0) {
    warnings.push('Array "indicadores" está vazio');
  }

  // Valida plano_acao
  if (!data.plano_acao) {
    errors.push('Campo "plano_acao" ausente');
  }

  return { errors, warnings };
}

/**
 * Processa um arquivo .md
 */
function processFile(filename) {
  const filepath = path.join(FEEDBACKS_DIR, filename);

  try {
    // Lê o arquivo
    const content = fs.readFileSync(filepath, 'utf-8');

    // Extrai o JSON
    const jsonStr = extractJSON(content, filename);

    // Tenta fazer o parse
    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (parseError) {
      throw new Error(`Erro ao fazer parse do JSON: ${parseError.message}`);
    }

    // Valida a estrutura
    const { errors, warnings } = validateStructure(data, filename);

    if (errors.length > 0) {
      results.failed++;
      results.errors.push({
        file: filename,
        errors,
        warnings,
      });
      return false;
    }

    if (warnings.length > 0) {
      results.warnings.push({
        file: filename,
        warnings,
      });
    }

    results.success++;
    return true;

  } catch (error) {
    results.failed++;
    results.errors.push({
      file: filename,
      errors: [error.message],
      warnings: [],
    });
    return false;
  }
}

/**
 * Main
 */
function main() {
  console.log('='.repeat(80));
  console.log('TESTE DE PARSING - FEEDBACKS SUPREMOS');
  console.log('='.repeat(80));
  console.log();

  // Lista os arquivos .md
  const files = fs.readdirSync(FEEDBACKS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('❌ Nenhum arquivo .md encontrado em:', FEEDBACKS_DIR);
    process.exit(1);
  }

  console.log(`📁 Diretório: ${FEEDBACKS_DIR}`);
  console.log(`📄 Arquivos encontrados: ${files.length}`);
  console.log();

  // Processa cada arquivo
  results.total = files.length;

  files.forEach((file, index) => {
    const status = processFile(file) ? '✅' : '❌';
    console.log(`${status} [${index + 1}/${files.length}] ${file}`);
  });

  console.log();
  console.log('='.repeat(80));
  console.log('RESULTADO FINAL');
  console.log('='.repeat(80));
  console.log(`Total de arquivos: ${results.total}`);
  console.log(`✅ Sucesso: ${results.success}`);
  console.log(`❌ Falhas: ${results.failed}`);
  console.log(`⚠️  Avisos: ${results.warnings.length}`);
  console.log();

  // Detalha os erros
  if (results.errors.length > 0) {
    console.log('ERROS ENCONTRADOS:');
    console.log('-'.repeat(80));
    results.errors.forEach(({ file, errors, warnings }) => {
      console.log(`\n📄 ${file}`);
      errors.forEach(err => console.log(`  ❌ ${err}`));
      if (warnings.length > 0) {
        warnings.forEach(warn => console.log(`  ⚠️  ${warn}`));
      }
    });
    console.log();
  }

  // Detalha os avisos
  if (results.warnings.length > 0) {
    console.log('AVISOS:');
    console.log('-'.repeat(80));
    results.warnings.forEach(({ file, warnings }) => {
      console.log(`\n📄 ${file}`);
      warnings.forEach(warn => console.log(`  ⚠️  ${warn}`));
    });
    console.log();
  }

  // Exit code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Executa
main();
