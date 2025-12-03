const fs = require('fs');
const path = require('path');

/**
 * Script para adicionar indicadores faltantes aos feedbacks
 *
 * Adiciona os 6 indicadores que estao faltando em TODOS os feedbacks:
 * - ESCUTATORIA (INTERPESSOAL)
 * - VARIEDADE_CONHECIMENTO (REPERTORIO)
 * - CONEXAO_IDEIAS (REPERTORIO)
 * - ATUALIZACAO (REPERTORIO)
 * - CULTURA_GERAL (REPERTORIO)
 * - APLICACAO_REPERTORIO (REPERTORIO)
 */

// Template para indicadores nao avaliaveis
const INDICADORES_NAO_AVALIAVEIS = [
  {
    codigo: 'ESCUTATORIA',
    nome: 'Escutatoria',
    pilar: 'INTERPESSOAL',
    score: null,
    categoria: 'nao_avaliavel',
    delta: null,
    confianca: 0,
    evidencias: [],
    timestamps: [],
    aula_recomendada: null,
    tecnica_recomendada: null,
    prioridade_acao: null,
    observacao: 'Nao aplicavel em contexto de monologo - requer analise de dialogo/conversa'
  },
  {
    codigo: 'VARIEDADE_CONHECIMENTO',
    nome: 'Variedade de Conhecimento',
    pilar: 'REPERTORIO',
    score: null,
    categoria: 'nao_avaliavel',
    delta: null,
    confianca: 0,
    evidencias: [],
    timestamps: [],
    aula_recomendada: null,
    tecnica_recomendada: null,
    prioridade_acao: null,
    observacao: 'Nao avaliavel neste video - requer analise de conteudo mais extenso'
  },
  {
    codigo: 'CONEXAO_IDEIAS',
    nome: 'Conexao de Ideias',
    pilar: 'REPERTORIO',
    score: null,
    categoria: 'nao_avaliavel',
    delta: null,
    confianca: 0,
    evidencias: [],
    timestamps: [],
    aula_recomendada: null,
    tecnica_recomendada: null,
    prioridade_acao: null,
    observacao: 'Nao avaliavel neste video - requer analise de conteudo mais extenso'
  },
  {
    codigo: 'ATUALIZACAO',
    nome: 'Atualizacao',
    pilar: 'REPERTORIO',
    score: null,
    categoria: 'nao_avaliavel',
    delta: null,
    confianca: 0,
    evidencias: [],
    timestamps: [],
    aula_recomendada: null,
    tecnica_recomendada: null,
    prioridade_acao: null,
    observacao: 'Nao avaliavel neste video - requer analise de conteudo mais extenso'
  },
  {
    codigo: 'CULTURA_GERAL',
    nome: 'Cultura Geral',
    pilar: 'REPERTORIO',
    score: null,
    categoria: 'nao_avaliavel',
    delta: null,
    confianca: 0,
    evidencias: [],
    timestamps: [],
    aula_recomendada: null,
    tecnica_recomendada: null,
    prioridade_acao: null,
    observacao: 'Nao avaliavel neste video - requer analise de conteudo mais extenso'
  },
  {
    codigo: 'APLICACAO_REPERTORIO',
    nome: 'Aplicacao do Repertorio',
    pilar: 'REPERTORIO',
    score: null,
    categoria: 'nao_avaliavel',
    delta: null,
    confianca: 0,
    evidencias: [],
    timestamps: [],
    aula_recomendada: null,
    tecnica_recomendada: null,
    prioridade_acao: null,
    observacao: 'Nao avaliavel neste video - requer analise de conteudo mais extenso'
  }
];

function extractJSON(content) {
  const startMarker = '---DNA_GENIS_DASHBOARD_START---';
  const endMarker = '---DNA_GENIS_DASHBOARD_END---';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    return { json: null, beforeMarker: content, afterMarker: '' };
  }

  const beforeMarker = content.substring(0, startIdx);
  const jsonStr = content.substring(startIdx + startMarker.length, endIdx).trim();
  const afterMarker = content.substring(endIdx + endMarker.length);

  try {
    const json = JSON.parse(jsonStr);
    return { json, beforeMarker, afterMarker };
  } catch (error) {
    console.error('Erro ao fazer parse do JSON:', error.message);
    return { json: null, beforeMarker: content, afterMarker: '' };
  }
}

function rebuildContent(beforeMarker, json, afterMarker) {
  const jsonStr = JSON.stringify(json, null, 2);
  return `${beforeMarker}---DNA_GENIS_DASHBOARD_START---
${jsonStr}
---DNA_GENIS_DASHBOARD_END---${afterMarker}`;
}

function addMissingIndicators(json) {
  if (!json || !json.indicadores) {
    console.error('JSON invalido ou sem campo indicadores');
    return json;
  }

  const existingCodes = json.indicadores.map(ind => ind.codigo);
  let addedCount = 0;

  INDICADORES_NAO_AVALIAVEIS.forEach(indicador => {
    if (!existingCodes.includes(indicador.codigo)) {
      json.indicadores.push(indicador);
      addedCount++;
      console.log(`  + Adicionado: ${indicador.codigo}`);
    }
  });

  return { json, addedCount };
}

function processFile(filePath, dryRun = true) {
  const fileName = path.basename(filePath);
  console.log(`\nProcessando: ${fileName}`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const { json, beforeMarker, afterMarker } = extractJSON(content);

  if (!json) {
    console.error(`  ERRO: Nao foi possivel extrair JSON de ${fileName}`);
    return;
  }

  const totalBefore = json.indicadores.length;
  const { json: updatedJson, addedCount } = addMissingIndicators(json);
  const totalAfter = updatedJson.indicadores.length;

  console.log(`  Indicadores antes: ${totalBefore}`);
  console.log(`  Indicadores depois: ${totalAfter}`);
  console.log(`  Total adicionado: ${addedCount}`);

  if (!dryRun && addedCount > 0) {
    const newContent = rebuildContent(beforeMarker, updatedJson, afterMarker);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`  ✓ Arquivo atualizado`);
  } else if (dryRun && addedCount > 0) {
    console.log(`  [DRY RUN] Arquivo seria atualizado`);
  } else {
    console.log(`  ✓ Nenhuma alteracao necessaria`);
  }

  return { fileName, totalBefore, totalAfter, addedCount };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');

  console.log('='.repeat(80));
  console.log('SCRIPT: ADICIONAR INDICADORES FALTANTES');
  console.log('='.repeat(80));

  if (dryRun) {
    console.log('\nMODO: DRY RUN (simulacao)');
    console.log('Para aplicar as mudancas, execute: node fix-missing-indicators.js --apply\n');
  } else {
    console.log('\nMODO: APLICAR MUDANCAS');
    console.log('ATENCAO: Os arquivos serao modificados!\n');
  }

  const dataDir = path.join(__dirname, 'data', 'feedbacks-supremos-011225');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));

  console.log(`Total de arquivos a processar: ${files.length}\n`);

  const results = [];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const result = processFile(filePath, dryRun);
    if (result) results.push(result);
  });

  // Relatorio final
  console.log('\n' + '='.repeat(80));
  console.log('RELATORIO FINAL');
  console.log('='.repeat(80));

  const totalAdded = results.reduce((sum, r) => sum + r.addedCount, 0);
  const filesModified = results.filter(r => r.addedCount > 0).length;

  console.log(`\nArquivos processados: ${results.length}`);
  console.log(`Arquivos modificados: ${filesModified}`);
  console.log(`Total de indicadores adicionados: ${totalAdded}`);

  const avgBefore = results.reduce((sum, r) => sum + r.totalBefore, 0) / results.length;
  const avgAfter = results.reduce((sum, r) => sum + r.totalAfter, 0) / results.length;

  console.log(`\nMedia de indicadores ANTES: ${avgBefore.toFixed(1)}`);
  console.log(`Media de indicadores DEPOIS: ${avgAfter.toFixed(1)}`);

  if (dryRun) {
    console.log('\n' + '='.repeat(80));
    console.log('SIMULACAO CONCLUIDA');
    console.log('Para aplicar as mudancas, execute: node fix-missing-indicators.js --apply');
    console.log('='.repeat(80));
  } else {
    console.log('\n' + '='.repeat(80));
    console.log('ATUALIZACAO CONCLUIDA');
    console.log('Todos os feedbacks agora possuem os 19 indicadores do framework DNA Genis 3.0');
    console.log('='.repeat(80));
  }
}

main();
