#!/usr/bin/env node

/**
 * Script de Auto-Fix para Dados de Alunos
 *
 * Corrige automaticamente categorias baseadas em scores.
 * Itera sobre todos os 27 alunos e aplica correções.
 *
 * Uso: node scripts/auto-fix-students.js
 * Com backup: BACKUP=1 node scripts/auto-fix-students.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONSTANTES E CONFIGURAÇÃO
// ============================================================================

const ALUNOS_DIR = path.join(__dirname, '../src/data/alunos');
const BACKUP = process.env.BACKUP === '1';
const BACKUP_DIR = path.join(__dirname, '../backup', new Date().toISOString().split('T')[0]);

const CATEGORIAS_VALIDAS = {
  'Alta Performance': { min: 80, max: 100 },
  'Operacional': { min: 60, max: 79 },
  'Essencial': { min: 40, max: 59 },
  'Crítico': { min: 0, max: 39 },
  'excelente': { min: 80, max: 100 },
  'forte': { min: 60, max: 79 },
  'adequado': { min: 40, max: 59 },
  'insuficiente': { min: 0, max: 39 },
  'a_desenvolver': { min: 0, max: 39 },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtém categoria correta para um score
 */
function getCategoriaByScore(score) {
  if (score >= 80) return 'Alta Performance';
  if (score >= 60) return 'Operacional';
  if (score >= 40) return 'Essencial';
  return 'Crítico';
}

/**
 * Faz backup de um arquivo
 */
function backupFile(filepath) {
  if (!BACKUP) return;

  try {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const filename = path.basename(filepath);
    const backupPath = path.join(BACKUP_DIR, filename);
    fs.copyFileSync(filepath, backupPath);
    console.log(`  Backup: ${backupPath}`);
  } catch (error) {
    console.error(`  Erro ao fazer backup: ${error.message}`);
  }
}

/**
 * Corrige categorias em um objeto de análise
 */
function fixCategorias(analysis) {
  let changes = 0;

  // Fix categoria geral
  if (analysis.resumo && analysis.resumo.categoria_geral) {
    const expected = getCategoriaByScore(analysis.resumo.score_geral);
    if (analysis.resumo.categoria_geral !== expected) {
      console.log(`  Resumo: "${analysis.resumo.categoria_geral}" → "${expected}"`);
      analysis.resumo.categoria_geral = expected;
      changes++;
    }
  }

  // Fix categorias dos indicadores
  if (Array.isArray(analysis.indicadores)) {
    analysis.indicadores.forEach((ind, idx) => {
      const expected = getCategoriaByScore(ind.score);
      if (ind.categoria !== expected) {
        console.log(`  Indicador ${idx + 1}: "${ind.codigo}" (${ind.score}) "${ind.categoria}" → "${expected}"`);
        ind.categoria = expected;
        changes++;
      }
    });
  }

  // Fix categorias dos pilares
  if (analysis.pilares && typeof analysis.pilares === 'object') {
    Object.keys(analysis.pilares).forEach(key => {
      const pilar = analysis.pilares[key];
      if (pilar && pilar.score !== null && typeof pilar.score === 'number') {
        const expected = getCategoriaByScore(pilar.score);
        if (pilar.categoria !== expected) {
          console.log(`  Pilar "${key}": "${pilar.categoria}" → "${expected}"`);
          pilar.categoria = expected;
          changes++;
        }
      }
    });
  }

  return changes;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

function main() {
  console.log('Iniciando auto-fix de categorias...\n');

  if (BACKUP) {
    console.log(`Backups serão salvos em: ${BACKUP_DIR}\n`);
  }

  try {
    const files = fs.readdirSync(ALUNOS_DIR).filter(f => f.endsWith('.json'));
    let totalChanges = 0;
    let filesChanged = 0;

    files.forEach(filename => {
      try {
        const filepath = path.join(ALUNOS_DIR, filename);
        const content = fs.readFileSync(filepath, 'utf-8');
        const data = JSON.parse(content);

        const changes = fixCategorias(data);

        if (changes > 0) {
          console.log(`\n${filename}`);
          if (BACKUP) {
            backupFile(filepath);
          }

          fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
          console.log(`  Salvo com ${changes} mudança(s)`);

          totalChanges += changes;
          filesChanged++;
        }
      } catch (error) {
        console.error(`\n✗ Erro ao processar ${filename}: ${error.message}`);
      }
    });

    console.log('\n' + '='.repeat(80));
    console.log('RELATÓRIO DE AUTO-FIX');
    console.log('='.repeat(80));
    console.log(`Total de arquivos processados: ${files.length}`);
    console.log(`Arquivos com mudanças: ${filesChanged}`);
    console.log(`Total de categorias corrigidas: ${totalChanges}`);
    console.log('='.repeat(80) + '\n');

    if (filesChanged > 0) {
      console.log('Próximos passos:');
      console.log('1. Revisar as mudanças com: git diff src/data/alunos/');
      console.log('2. Rodar validação com: npm run validate:students');
      console.log('3. Se ok, commitar com: git commit -m "fix: corrigir categorias automáticamente"');
    }
  } catch (error) {
    console.error(`Erro ao acessar diretório: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { getCategoriaByScore, fixCategorias };
