const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/alunos');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

const report = {
  totalFiles: files.length,
  issues: [],
  fieldAnalysis: {
    hasMeta: 0,
    hasResumo: 0,
    hasPilares: 0,
    hasIndicadores: 0,
    hasEvolucao: 0,
    hasPlanoAcao: 0,
    hasMateriais: 0,
    hasProximosPassos: 0,
    hasInsights: 0,
    hasNarrativa: 0
  },
  indicadorCounts: {},
  categoriaGeral: {},
  versionCounts: {},
  pilarScores: {
    oratoria: { withScore: 0, withNull: 0 },
    interpessoal: { withScore: 0, withNull: 0 },
    intrapessoal: { withScore: 0, withNull: 0 },
    repertorio: { withScore: 0, withNull: 0 }
  }
};

files.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const data = JSON.parse(content);
    const slug = file.replace('.json', '');

    // Check required fields
    if (data.meta) report.fieldAnalysis.hasMeta++;
    if (data.resumo) report.fieldAnalysis.hasResumo++;
    if (data.pilares) report.fieldAnalysis.hasPilares++;
    if (data.indicadores) {
      report.fieldAnalysis.hasIndicadores++;
      const count = data.indicadores.length;
      report.indicadorCounts[count] = (report.indicadorCounts[count] || 0) + 1;
    }
    if (data.evolucao) report.fieldAnalysis.hasEvolucao++;
    if (data.plano_acao) report.fieldAnalysis.hasPlanoAcao++;
    if (data.materiais) report.fieldAnalysis.hasMateriais++;
    if (data.proximos_passos) report.fieldAnalysis.hasProximosPassos++;
    if (data.insights) report.fieldAnalysis.hasInsights++;
    if (data.narrativa) report.fieldAnalysis.hasNarrativa++;

    // Version tracking
    if (data.meta && data.meta.versao) {
      report.versionCounts[data.meta.versao] = (report.versionCounts[data.meta.versao] || 0) + 1;
    }

    // Categoria tracking
    if (data.resumo && data.resumo.categoria_geral) {
      report.categoriaGeral[data.resumo.categoria_geral] = (report.categoriaGeral[data.resumo.categoria_geral] || 0) + 1;
    }

    // Pilar scores tracking
    if (data.pilares) {
      ['oratoria', 'interpessoal', 'intrapessoal', 'repertorio'].forEach(pilar => {
        if (data.pilares[pilar]) {
          if (data.pilares[pilar].score === null) {
            report.pilarScores[pilar].withNull++;
          } else {
            report.pilarScores[pilar].withScore++;
          }
        }
      });
    }

    // Check critical issues
    if (data.meta === undefined) {
      report.issues.push({ file, issue: 'Missing meta field' });
    }
    if (data.resumo === undefined) {
      report.issues.push({ file, issue: 'Missing resumo field' });
    }
    if (data.pilares === undefined) {
      report.issues.push({ file, issue: 'Missing pilares field' });
    }
    if (data.indicadores === undefined || data.indicadores.length === 0) {
      report.issues.push({ file, issue: 'Missing or empty indicadores array' });
    }

  } catch (err) {
    report.issues.push({ file, issue: 'JSON parse error: ' + err.message });
  }
});

console.log(JSON.stringify(report, null, 2));
