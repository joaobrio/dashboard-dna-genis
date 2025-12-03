const fs = require('fs');
const path = require('path');

// Framework DNA Genis 3.0 - 19 indicadores oficiais
const FRAMEWORK_OFICIAL = {
  ORATORIA: ['FLUENCIA', 'LINGUAGEM_NAO_VERBAL', 'MODULACAO_VOZ', 'DICCAO', 'ASSERTIVIDADE', 'VOCABULARIO', 'GRAMATICA'],
  INTERPESSOAL: ['ESCUTATORIA', 'PERSUASAO', 'MARKETING_PESSOAL', 'DIDATICA', 'ADAPTABILIDADE'],
  INTRAPESSOAL: ['CRIATIVIDADE', 'LIDERANCA'],
  REPERTORIO: ['VARIEDADE_CONHECIMENTO', 'CONEXAO_IDEIAS', 'ATUALIZACAO', 'CULTURA_GERAL', 'APLICACAO_REPERTORIO']
};

const TODOS_INDICADORES = Object.values(FRAMEWORK_OFICIAL).flat();

function extractJSON(content) {
  const startMarker = '---DNA_GENIS_DASHBOARD_START---';
  const endMarker = '---DNA_GENIS_DASHBOARD_END---';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    return null;
  }

  const jsonStr = content.substring(startIdx + startMarker.length, endIdx).trim();

  try {
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Erro ao fazer parse do JSON:', error.message);
    return null;
  }
}

function analyzeIndicators() {
  const dataDir = path.join(__dirname, 'data', 'feedbacks-supremos-011225');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.md'));

  console.log('='.repeat(100));
  console.log('ANALISE COMPLETA DOS INDICADORES DNA GENIS 3.0');
  console.log('='.repeat(100));
  console.log(`\nTotal de feedbacks encontrados: ${files.length}`);
  console.log(`Total de indicadores no framework: ${TODOS_INDICADORES.length}\n`);

  const results = [];

  files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = extractJSON(content);

    if (!data || !data.indicadores) {
      console.error(`Erro ao processar ${file}`);
      return;
    }

    const alunoId = data.meta?.aluno_id || file.replace('_FEEDBACK-SUPREMO.md', '');
    const indicadoresPresentes = data.indicadores.map(ind => ind.codigo);
    const totalIndicadores = indicadoresPresentes.length;

    // Identificar indicadores faltantes
    const indicadoresFaltantes = TODOS_INDICADORES.filter(
      ind => !indicadoresPresentes.includes(ind)
    );

    results.push({
      aluno: alunoId,
      total: totalIndicadores,
      presentes: indicadoresPresentes,
      faltantes: indicadoresFaltantes,
      scoreGeral: data.resumo?.score_geral || 0
    });
  });

  // Ordenar por quantidade de indicadores
  results.sort((a, b) => b.total - a.total);

  // RELATORIO 1: Tabela resumo
  console.log('\n' + '='.repeat(100));
  console.log('TABELA RESUMO: CONTAGEM DE INDICADORES POR ALUNO');
  console.log('='.repeat(100));
  console.log('Aluno'.padEnd(30) + '| Total | Faltantes | Score Geral');
  console.log('-'.repeat(100));

  results.forEach(r => {
    console.log(
      r.aluno.padEnd(30) +
      `| ${r.total.toString().padStart(5)} | ${r.faltantes.length.toString().padStart(9)} | ${r.scoreGeral.toFixed(1)}`
    );
  });

  // RELATORIO 2: Indicadores mais ausentes
  console.log('\n' + '='.repeat(100));
  console.log('INDICADORES MAIS AUSENTES (aparecem menos nos feedbacks)');
  console.log('='.repeat(100));

  const indicadoresCount = {};
  TODOS_INDICADORES.forEach(ind => {
    indicadoresCount[ind] = results.filter(r => r.presentes.includes(ind)).length;
  });

  const indicadoresOrdenados = Object.entries(indicadoresCount)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 10);

  indicadoresOrdenados.forEach(([ind, count]) => {
    const ausente = results.length - count;
    console.log(`${ind.padEnd(30)} | Presente em ${count}/${results.length} | Ausente em ${ausente} feedbacks`);
  });

  // RELATORIO 3: Detalhamento por aluno
  console.log('\n' + '='.repeat(100));
  console.log('DETALHAMENTO: INDICADORES FALTANTES POR ALUNO');
  console.log('='.repeat(100));

  results.forEach(r => {
    if (r.faltantes.length > 0) {
      console.log(`\n${r.aluno} (${r.total}/${TODOS_INDICADORES.length} indicadores)`);
      console.log(`Faltam ${r.faltantes.length} indicadores:`);

      // Agrupar por pilar
      const faltantesPorPilar = {
        ORATORIA: [],
        INTERPESSOAL: [],
        INTRAPESSOAL: [],
        REPERTORIO: []
      };

      r.faltantes.forEach(ind => {
        for (const [pilar, indicadores] of Object.entries(FRAMEWORK_OFICIAL)) {
          if (indicadores.includes(ind)) {
            faltantesPorPilar[pilar].push(ind);
          }
        }
      });

      for (const [pilar, indicadores] of Object.entries(faltantesPorPilar)) {
        if (indicadores.length > 0) {
          console.log(`  ${pilar}: ${indicadores.join(', ')}`);
        }
      }
    }
  });

  // RELATORIO 4: Estatisticas gerais
  console.log('\n' + '='.repeat(100));
  console.log('ESTATISTICAS GERAIS');
  console.log('='.repeat(100));

  const mediaIndicadores = results.reduce((sum, r) => sum + r.total, 0) / results.length;
  const minIndicadores = Math.min(...results.map(r => r.total));
  const maxIndicadores = Math.max(...results.map(r => r.total));

  console.log(`Media de indicadores por feedback: ${mediaIndicadores.toFixed(1)}`);
  console.log(`Minimo de indicadores: ${minIndicadores}`);
  console.log(`Maximo de indicadores: ${maxIndicadores}`);
  console.log(`\nFeedbacks com todos os 19 indicadores: ${results.filter(r => r.total === 19).length}`);
  console.log(`Feedbacks com menos de 19 indicadores: ${results.filter(r => r.total < 19).length}`);

  // DIAGNOSTICO FINAL
  console.log('\n' + '='.repeat(100));
  console.log('DIAGNOSTICO: ONDE ESTA O PROBLEMA?');
  console.log('='.repeat(100));

  const todosComTodos = results.every(r => r.total === 19);
  const algumComTodos = results.some(r => r.total === 19);

  if (todosComTodos) {
    console.log('\nTODOS os feedbacks tem os 19 indicadores.');
    console.log('O problema provavelmente esta NO CODIGO do componente de visualizacao.');
    console.log('Verificar se ha filtro ou limitacao no componente do grafico radar.');
  } else if (algumComTodos) {
    console.log('\nAPENAS ALGUNS feedbacks tem todos os 19 indicadores.');
    console.log('O problema esta PARCIALMENTE NOS DADOS:');
    console.log('- Alguns alunos tem feedbacks completos');
    console.log('- Outros tem indicadores faltantes');
    console.log('\nRecomendacao: Completar os indicadores faltantes nos JSONs.');
  } else {
    console.log('\nNENHUM feedback tem todos os 19 indicadores.');
    console.log('O problema esta NOS DADOS:');
    console.log('- Todos os feedbacks tem indicadores faltantes');
    console.log('- Possivelmente o pilar REPERTORIO nao foi avaliado completamente');
    console.log('\nRecomendacao: Adicionar indicadores do pilar REPERTORIO aos JSONs.');
  }

  console.log('\n' + '='.repeat(100));
}

analyzeIndicators();
