const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data/alunos');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

const report = {
  totalFiles: files.length,
  structuralIssues: [],
  typeIssues: [],
  missingOptionalFields: [],
  inconsistentIndicadores: [],
  schemaViolations: []
};

// Expected schema structure
const EXPECTED_SCHEMA = {
  meta: ['versao', 'timestamp', 'analise_id', 'aluno_id'],
  resumo: ['score_geral', 'score_autoconfianca', 'categoria_geral', 'evolucao_percentual', 'numero_analise', 'dias_desde_anterior'],
  pilares: {
    required: ['oratoria', 'interpessoal', 'intrapessoal', 'repertorio'],
    fields: ['score', 'peso', 'categoria', 'delta', 'indicador_ancora', 'indicador_gap']
  },
  indicador: ['codigo', 'nome', 'pilar', 'score', 'categoria', 'delta', 'confianca', 'evidencias', 'timestamps', 'aula_recomendada', 'tecnica_recomendada', 'prioridade_acao']
};

files.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    const data = JSON.parse(content);
    const slug = file.replace('.json', '');

    // Check meta fields
    if (data.meta) {
      EXPECTED_SCHEMA.meta.forEach(field => {
        if (!(field in data.meta)) {
          report.structuralIssues.push({ file, section: 'meta', missing: field });
        }
      });
    }

    // Check resumo fields
    if (data.resumo) {
      EXPECTED_SCHEMA.resumo.forEach(field => {
        if (!(field in data.resumo)) {
          report.structuralIssues.push({ file, section: 'resumo', missing: field });
        }
      });

      // Type checks
      if (typeof data.resumo.score_geral !== 'number') {
        report.typeIssues.push({ file, field: 'resumo.score_geral', expected: 'number', got: typeof data.resumo.score_geral });
      }
      if (typeof data.resumo.score_autoconfianca !== 'number') {
        report.typeIssues.push({ file, field: 'resumo.score_autoconfianca', expected: 'number', got: typeof data.resumo.score_autoconfianca });
      }
    }

    // Check pilares structure
    if (data.pilares) {
      EXPECTED_SCHEMA.pilares.required.forEach(pilar => {
        if (!(pilar in data.pilares)) {
          report.structuralIssues.push({ file, section: 'pilares', missing: pilar });
        } else {
          const pilarData = data.pilares[pilar];
          EXPECTED_SCHEMA.pilares.fields.forEach(field => {
            if (!(field in pilarData)) {
              report.structuralIssues.push({ file, section: `pilares.${pilar}`, missing: field });
            }
          });

          // Check peso consistency
          if (pilarData.peso !== undefined) {
            const expectedPesos = { oratoria: 0.4, interpessoal: 0.2, intrapessoal: 0.25, repertorio: 0.15 };
            if (pilarData.peso !== expectedPesos[pilar]) {
              report.schemaViolations.push({
                file,
                issue: `Peso incorreto em ${pilar}`,
                expected: expectedPesos[pilar],
                got: pilarData.peso
              });
            }
          }
        }
      });
    }

    // Check indicadores structure
    if (data.indicadores && Array.isArray(data.indicadores)) {
      data.indicadores.forEach((ind, idx) => {
        EXPECTED_SCHEMA.indicador.forEach(field => {
          if (!(field in ind)) {
            // Some fields are optional
            if (!['confianca', 'aplicavel'].includes(field)) {
              report.structuralIssues.push({
                file,
                section: `indicadores[${idx}]`,
                missing: field,
                codigo: ind.codigo || 'UNKNOWN'
              });
            }
          }
        });

        // Type checks for indicador
        if (typeof ind.score !== 'number') {
          report.typeIssues.push({
            file,
            field: `indicadores[${idx}].score`,
            codigo: ind.codigo,
            expected: 'number',
            got: typeof ind.score
          });
        }

        if (!Array.isArray(ind.evidencias)) {
          report.typeIssues.push({
            file,
            field: `indicadores[${idx}].evidencias`,
            codigo: ind.codigo,
            expected: 'array',
            got: typeof ind.evidencias
          });
        }

        if (!Array.isArray(ind.timestamps)) {
          report.typeIssues.push({
            file,
            field: `indicadores[${idx}].timestamps`,
            codigo: ind.codigo,
            expected: 'array',
            got: typeof ind.timestamps
          });
        }
      });
    }

    // Check optional but important fields
    if (!data.evolucao) {
      report.missingOptionalFields.push({ file, field: 'evolucao' });
    }
    if (!data.plano_acao) {
      report.missingOptionalFields.push({ file, field: 'plano_acao' });
    }
    if (!data.materiais) {
      report.missingOptionalFields.push({ file, field: 'materiais' });
    }
    if (!data.proximos_passos) {
      report.missingOptionalFields.push({ file, field: 'proximos_passos' });
    }

  } catch (err) {
    report.structuralIssues.push({ file, issue: 'Parse error: ' + err.message });
  }
});

// Summary
const summary = {
  totalFiles: report.totalFiles,
  structuralIssues: report.structuralIssues.length,
  typeIssues: report.typeIssues.length,
  missingOptionalFields: report.missingOptionalFields.length,
  schemaViolations: report.schemaViolations.length,
  allClear: report.structuralIssues.length === 0 && report.typeIssues.length === 0 && report.schemaViolations.length === 0
};

console.log('=== SUMMARY ===');
console.log(JSON.stringify(summary, null, 2));
console.log('\n=== DETAILS ===');
console.log(JSON.stringify(report, null, 2));
