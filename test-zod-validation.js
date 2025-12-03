/**
 * Script de Teste - Validação Zod dos JSONs
 *
 * Testa se todos os JSONs passam pela validação do schema Zod
 */

const fs = require('fs');
const path = require('path');

// Importa o schema Zod usando require (para CommonJS)
// Nota: Este script precisa ser executado com Node que suporte ESM ou compilado com TypeScript
// Para simplificar, vamos apenas testar o parsing básico aqui e deixar a validação Zod para o build

const FEEDBACKS_DIR = path.join(__dirname, 'data', 'feedbacks-supremos-011225');
const JSON_START_TAG = '---DNA_GENIS_DASHBOARD_START---';
const JSON_END_TAG = '---DNA_GENIS_DASHBOARD_END---';

/**
 * Extrai o JSON entre as tags do arquivo .md
 */
function extractJSON(content) {
  const startIndex = content.indexOf(JSON_START_TAG);
  const endIndex = content.indexOf(JSON_END_TAG);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Tags de JSON não encontradas');
  }

  const jsonStr = content.substring(
    startIndex + JSON_START_TAG.length,
    endIndex
  ).trim();

  return jsonStr;
}

/**
 * Valida que o campo observacao está presente em repertorio quando necessário
 */
function validateRepertorioObservacao(data, filename) {
  if (!data.pilares || !data.pilares.repertorio) {
    return {
      valid: false,
      error: 'Pilar repertorio ausente'
    };
  }

  const repertorio = data.pilares.repertorio;

  // Se o score é null ou categoria é nao_avaliavel, deve ter observacao
  if ((repertorio.score === null || repertorio.categoria === 'nao_avaliavel')) {
    if (!repertorio.observacao) {
      return {
        valid: false,
        error: 'Campo "observacao" ausente no pilar repertorio quando score é null ou não avaliável'
      };
    }
  }

  return { valid: true };
}

/**
 * Testa a compatibilidade com o schema Zod
 */
function testZodCompatibility(data, filename) {
  const errors = [];

  // Testa tipos esperados pelo Zod
  if (typeof data.meta?.versao !== 'string') {
    errors.push('meta.versao deve ser string');
  }

  if (typeof data.meta?.timestamp !== 'string') {
    errors.push('meta.timestamp deve ser string');
  }

  if (typeof data.resumo?.score_geral !== 'number') {
    errors.push('resumo.score_geral deve ser number');
  }

  if (typeof data.resumo?.score_autoconfianca !== 'number') {
    errors.push('resumo.score_autoconfianca deve ser number');
  }

  if (!Array.isArray(data.indicadores)) {
    errors.push('indicadores deve ser array');
  }

  // Valida pilares
  ['oratoria', 'interpessoal', 'intrapessoal', 'repertorio'].forEach(pilar => {
    if (!data.pilares[pilar]) {
      errors.push(`Pilar ${pilar} ausente`);
      return;
    }

    const p = data.pilares[pilar];

    // score pode ser null ou number
    if (p.score !== null && typeof p.score !== 'number') {
      errors.push(`${pilar}.score deve ser number ou null`);
    }

    // peso deve ser number
    if (typeof p.peso !== 'number') {
      errors.push(`${pilar}.peso deve ser number`);
    }

    // categoria pode ser null ou string
    if (p.categoria !== null && typeof p.categoria !== 'string') {
      errors.push(`${pilar}.categoria deve ser string ou null`);
    }

    // observacao deve ser string se presente
    if (p.observacao !== undefined && typeof p.observacao !== 'string') {
      errors.push(`${pilar}.observacao deve ser string se presente`);
    }
  });

  return errors;
}

/**
 * Processa um arquivo
 */
function processFile(filename) {
  const filepath = path.join(FEEDBACKS_DIR, filename);

  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const jsonStr = extractJSON(content);
    const data = JSON.parse(jsonStr);

    // Valida compatibilidade Zod
    const zodErrors = testZodCompatibility(data, filename);

    // Valida campo observacao
    const observacaoResult = validateRepertorioObservacao(data, filename);

    const allErrors = [
      ...zodErrors,
      ...(observacaoResult.valid ? [] : [observacaoResult.error])
    ];

    return {
      success: allErrors.length === 0,
      errors: allErrors,
      hasObservacao: !!data.pilares?.repertorio?.observacao,
      repertorioScore: data.pilares?.repertorio?.score,
    };

  } catch (error) {
    return {
      success: false,
      errors: [error.message],
      hasObservacao: false,
      repertorioScore: null,
    };
  }
}

/**
 * Main
 */
function main() {
  console.log('='.repeat(80));
  console.log('TESTE DE VALIDAÇÃO ZOD - FEEDBACKS SUPREMOS');
  console.log('='.repeat(80));
  console.log();

  const files = fs.readdirSync(FEEDBACKS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  const results = {
    total: files.length,
    success: 0,
    failed: 0,
    withObservacao: 0,
    withoutObservacao: 0,
  };

  const failures = [];
  const observacaoStats = [];

  files.forEach((file, index) => {
    const result = processFile(file);

    if (result.success) {
      results.success++;
      console.log(`✅ [${index + 1}/${files.length}] ${file}`);
    } else {
      results.failed++;
      console.log(`❌ [${index + 1}/${files.length}] ${file}`);
      failures.push({ file, errors: result.errors });
    }

    if (result.hasObservacao) {
      results.withObservacao++;
      observacaoStats.push({
        file,
        hasObservacao: true,
        score: result.repertorioScore
      });
    } else {
      results.withoutObservacao++;
      observacaoStats.push({
        file,
        hasObservacao: false,
        score: result.repertorioScore
      });
    }
  });

  console.log();
  console.log('='.repeat(80));
  console.log('RESULTADO FINAL');
  console.log('='.repeat(80));
  console.log(`Total: ${results.total}`);
  console.log(`✅ Sucesso: ${results.success}`);
  console.log(`❌ Falhas: ${results.failed}`);
  console.log();
  console.log('ESTATÍSTICAS DO CAMPO "observacao":');
  console.log(`  Com observacao: ${results.withObservacao}`);
  console.log(`  Sem observacao: ${results.withoutObservacao}`);
  console.log();

  if (failures.length > 0) {
    console.log('ERROS ENCONTRADOS:');
    console.log('-'.repeat(80));
    failures.forEach(({ file, errors }) => {
      console.log(`\n📄 ${file}`);
      errors.forEach(err => console.log(`  ❌ ${err}`));
    });
    console.log();
  }

  // Mostra quais arquivos não têm observacao mas deveriam ter
  const missingObservacao = observacaoStats.filter(
    s => !s.hasObservacao && s.score === null
  );

  if (missingObservacao.length > 0) {
    console.log('⚠️  ARQUIVOS COM repertorio.score=null MAS SEM observacao:');
    console.log('-'.repeat(80));
    missingObservacao.forEach(({ file }) => {
      console.log(`  - ${file}`);
    });
    console.log();
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

main();
