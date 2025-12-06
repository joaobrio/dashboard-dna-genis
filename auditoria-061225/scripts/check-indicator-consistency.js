#!/usr/bin/env node
/**
 * Script: Check Indicator Consistency
 * Verifica quais alunos têm menos de 13 indicadores e identifica gaps
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/alunos');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

// DNA Genis 3.0 - 13 indicadores oficiais
const STANDARD_INDICATORS = [
  // Oratória (5)
  'FLUENCIA',
  'DICCAO',
  'RITMO',
  'MODULACAO_VOZ',
  'LINGUAGEM_NAO_VERBAL',
  // Interpessoal (3)
  'PERSUASAO',
  'DIDATICA',
  'ADAPTABILIDADE',
  // Intrapessoal (3)
  'AUTOCONFIANCA',
  'LIDERANCA',
  'CRIATIVIDADE',
  // Repertório (2)
  'REPERTORIO_GERAL',
  'STORYTELLING',
];

const report = {
  compliant: [],
  needsReanalysis: [],
  summary: {
    total: files.length,
    compliant: 0,
    needsReanalysis: 0,
  },
};

console.log('🔍 Analisando consistência de indicadores...\n');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  const slug = file.replace('.json', '');

  const currentIndicators = data.indicadores.map(i => i.codigo);
  const count = currentIndicators.length;

  if (count === 13) {
    report.compliant.push({
      slug,
      nome: data.meta.aluno_id,
      count: 13,
    });
    report.summary.compliant++;
    console.log(`✅ ${slug.padEnd(25)} ${count} indicadores`);
  } else {
    const missing = STANDARD_INDICATORS.filter(code => !currentIndicators.includes(code));
    const extra = currentIndicators.filter(code => !STANDARD_INDICATORS.includes(code));

    report.needsReanalysis.push({
      slug,
      nome: data.meta.aluno_id,
      count,
      missing,
      extra,
    });
    report.summary.needsReanalysis++;

    console.log(`⚠️  ${slug.padEnd(25)} ${count} indicadores (faltam ${13 - count})`);
    if (missing.length > 0) {
      console.log(`   Faltando: ${missing.join(', ')}`);
    }
    if (extra.length > 0) {
      console.log(`   Extras: ${extra.join(', ')}`);
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log('RESUMO');
console.log('='.repeat(60));
console.log(`Total de alunos: ${report.summary.total}`);
console.log(`✅ Compliant (13 indicadores): ${report.summary.compliant} (${(report.summary.compliant / report.summary.total * 100).toFixed(1)}%)`);
console.log(`⚠️  Needs re-analysis: ${report.summary.needsReanalysis} (${(report.summary.needsReanalysis / report.summary.total * 100).toFixed(1)}%)`);

if (report.needsReanalysis.length > 0) {
  console.log('\n' + '='.repeat(60));
  console.log('ALUNOS QUE PRECISAM DE RE-ANÁLISE');
  console.log('='.repeat(60));
  report.needsReanalysis.forEach(item => {
    console.log(`\n${item.slug} (${item.count} indicadores)`);
    if (item.missing.length > 0) {
      console.log(`  Adicionar: ${item.missing.join(', ')}`);
    }
  });
}

// Salvar relatório JSON
const outputPath = path.join(__dirname, '../reports/indicator-consistency-report.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

console.log(`\n📄 Relatório salvo em: ${outputPath}`);

// Exit code
process.exit(report.needsReanalysis.length > 0 ? 1 : 0);
