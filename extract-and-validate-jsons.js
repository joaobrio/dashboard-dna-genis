/**
 * Script de Extração e Validação - JSONs dos Feedbacks
 *
 * Extrai os JSONs dos arquivos .md e os salva individualmente
 * para facilitar o carregamento pelo dashboard
 */

const fs = require('fs');
const path = require('path');

const FEEDBACKS_DIR = path.join(__dirname, 'data', 'feedbacks-supremos-011225');
const OUTPUT_DIR = path.join(__dirname, 'src', 'data', 'alunos');
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
 * Extrai o aluno_id do filename
 */
function getAlunoId(filename) {
  return filename.replace('_FEEDBACK-SUPREMO.md', '');
}

/**
 * Processa um arquivo
 */
function processFile(filename) {
  const filepath = path.join(FEEDBACKS_DIR, filename);
  const alunoId = getAlunoId(filename);
  const outputPath = path.join(OUTPUT_DIR, `${alunoId}.json`);

  try {
    // Lê o arquivo
    const content = fs.readFileSync(filepath, 'utf-8');

    // Extrai o JSON
    const jsonStr = extractJSON(content);

    // Valida o parse
    const data = JSON.parse(jsonStr);

    // Formata o JSON com indentação
    const formattedJson = JSON.stringify(data, null, 2);

    // Salva o arquivo
    fs.writeFileSync(outputPath, formattedJson, 'utf-8');

    return {
      success: true,
      alunoId,
      outputPath,
    };

  } catch (error) {
    return {
      success: false,
      alunoId,
      error: error.message,
    };
  }
}

/**
 * Main
 */
function main() {
  console.log('='.repeat(80));
  console.log('EXTRAÇÃO DE JSONs - FEEDBACKS SUPREMOS');
  console.log('='.repeat(80));
  console.log();

  // Cria o diretório de output se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Diretório criado: ${OUTPUT_DIR}`);
  } else {
    console.log(`📁 Diretório existente: ${OUTPUT_DIR}`);
  }
  console.log();

  const files = fs.readdirSync(FEEDBACKS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  const results = {
    total: files.length,
    success: 0,
    failed: 0,
  };

  const failures = [];

  files.forEach((file, index) => {
    const result = processFile(file);

    if (result.success) {
      results.success++;
      console.log(`✅ [${index + 1}/${files.length}] ${result.alunoId}.json`);
    } else {
      results.failed++;
      console.log(`❌ [${index + 1}/${files.length}] ${result.alunoId} - ${result.error}`);
      failures.push(result);
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
  console.log(`📁 Arquivos salvos em: ${OUTPUT_DIR}`);
  console.log();

  if (failures.length > 0) {
    console.log('ERROS:');
    console.log('-'.repeat(80));
    failures.forEach(({ alunoId, error }) => {
      console.log(`  ❌ ${alunoId}: ${error}`);
    });
    console.log();
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

main();
