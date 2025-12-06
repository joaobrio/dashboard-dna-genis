# Guia de Integração - Enhanced Zod Schema no Dashboard DNA Genis

## 🎯 Objetivo

Este guia demonstra como integrar o Enhanced Zod Schema no Dashboard DNA Genis existente, garantindo validação de dados em runtime e correção automática de inconsistências.

---

## 📋 Pré-requisitos

1. ✅ Schema implementado: `/src/lib/zod-student.ts`
2. ✅ Zod instalado: `npm install zod` ou `yarn add zod`
3. ✅ TypeScript configurado no projeto

---

## 🚀 Integração Step-by-Step

### Passo 1: Importar Schema e Utilities

```typescript
// Em qualquer arquivo que carrega dados de alunos
import {
  dnaGenisAnalysisSchema,
  validateStudent,
  checkCoreIndicators,
  checkPesoPilares,
  autoFixCategorias,
  gerarRelatorioValidacao,
  getIndicadoresFlexiveis,
  type DnaGenisAnalysis,
} from '@/lib/zod-student';
```

### Passo 2: Validar ao Carregar Dados JSON

#### 2.1 Validação Simples (Throw on Error)

```typescript
import fs from 'fs/promises';

async function loadStudentAnalysis(filePath: string): Promise<DnaGenisAnalysis> {
  // Carregar JSON
  const rawData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  // Validar com Zod (lança erro se inválido)
  const analysis = dnaGenisAnalysisSchema.parse(data);

  return analysis;
}

// Uso
try {
  const analise = await loadStudentAnalysis('./data/aluno_001.json');
  console.log('✓ Análise válida:', analise.meta.aluno_id);
} catch (error) {
  console.error('✗ Erro na validação:', error);
}
```

#### 2.2 Validação com SafeParse (Sem Throw)

```typescript
async function loadStudentAnalysisSafe(filePath: string) {
  const rawData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  // SafeParse não lança erro
  const result = dnaGenisAnalysisSchema.safeParse(data);

  if (!result.success) {
    console.error('Erro de validação:', result.error.format());
    return null;
  }

  return result.data;
}
```

#### 2.3 Validação com Auto-Fix (Recomendado)

```typescript
async function loadStudentAnalysisWithFix(filePath: string): Promise<DnaGenisAnalysis> {
  const rawData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  // Tentar corrigir categorias antes de validar
  const dataFixed = autoFixCategorias(data);

  // Validar dados corrigidos
  const result = dnaGenisAnalysisSchema.safeParse(dataFixed);

  if (!result.success) {
    // Se ainda houver erros após auto-fix, logar e lançar
    console.error('Erros após auto-fix:');
    console.error(result.error.format());
    throw new Error('Dados inválidos mesmo após auto-fix');
  }

  // Validar business rules adicionais
  const validation = validateStudent(result.data);

  if (!validation.valid) {
    console.warn('⚠️ Avisos de validação:');
    validation.errors.forEach(err => {
      console.warn(`  [${err.severity}] ${err.rule}: ${err.message}`);
    });
  }

  return result.data;
}
```

### Passo 3: Validar Batch de Alunos

```typescript
async function loadAllStudents(dirPath: string) {
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const results = await Promise.allSettled(
    jsonFiles.map(async (file) => {
      const filePath = path.join(dirPath, file);
      return loadStudentAnalysisWithFix(filePath);
    })
  );

  // Separar sucessos e falhas
  const success = results
    .filter((r): r is PromiseFulfilledResult<DnaGenisAnalysis> => r.status === 'fulfilled')
    .map(r => r.value);

  const failed = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => r.reason);

  console.log(`✓ Carregados: ${success.length}/${jsonFiles.length}`);
  if (failed.length > 0) {
    console.error(`✗ Falhas: ${failed.length}`);
  }

  return { success, failed };
}
```

### Passo 4: Auditoria de Qualidade

```typescript
function auditStudentQuality(analyses: DnaGenisAnalysis[]) {
  const auditResults = analyses.map(analysis => {
    const coreCheck = checkCoreIndicators(analysis);
    const pesoCheck = checkPesoPilares(analysis);
    const validation = validateStudent(analysis);
    const flexCheck = getIndicadoresFlexiveis(analysis);

    return {
      aluno_id: analysis.meta.aluno_id,
      analise_id: analysis.meta.analise_id,

      // Checks
      core_valido: coreCheck.valid,
      core_ausentes: coreCheck.missing,
      peso_valido: pesoCheck.valid,
      peso_soma: pesoCheck.soma,
      geral_valido: validation.valid,

      // Métricas
      total_indicadores: analysis.indicadores.length,
      indicadores_core: coreCheck.present.length,
      indicadores_flexiveis: flexCheck.total,
      total_erros: validation.errors.length,

      // Detalhes
      erros: validation.errors,
    };
  });

  // Estatísticas gerais
  const stats = {
    total_alunos: analyses.length,
    com_core_completo: auditResults.filter(r => r.core_valido).length,
    com_peso_valido: auditResults.filter(r => r.peso_valido).length,
    sem_erros: auditResults.filter(r => r.geral_valido).length,
    media_indicadores: auditResults.reduce((sum, r) => sum + r.total_indicadores, 0) / analyses.length,
    media_flexiveis: auditResults.reduce((sum, r) => sum + r.indicadores_flexiveis, 0) / analyses.length,
  };

  return { auditResults, stats };
}

// Uso
const { success: allAnalyses } = await loadAllStudents('./data/alunos');
const audit = auditStudentQuality(allAnalyses);

console.log('=== ESTATÍSTICAS DE QUALIDADE ===');
console.log(`Total de alunos: ${audit.stats.total_alunos}`);
console.log(`Com indicadores core completos: ${audit.stats.com_core_completo} (${(audit.stats.com_core_completo / audit.stats.total_alunos * 100).toFixed(1)}%)`);
console.log(`Com pesos válidos: ${audit.stats.com_peso_valido} (${(audit.stats.com_peso_valido / audit.stats.total_alunos * 100).toFixed(1)}%)`);
console.log(`Sem erros: ${audit.stats.sem_erros} (${(audit.stats.sem_erros / audit.stats.total_alunos * 100).toFixed(1)}%)`);
console.log(`Média de indicadores: ${audit.stats.media_indicadores.toFixed(1)}`);
console.log(`Média de flexíveis: ${audit.stats.media_flexiveis.toFixed(1)}`);
```

### Passo 5: Logging de Validação

```typescript
import pino from 'pino'; // ou winston, bunyan, etc.

const logger = pino({ level: 'info' });

function logValidationResults(
  alunoId: string,
  validation: ReturnType<typeof validateStudent>
) {
  if (validation.valid) {
    logger.info({ aluno_id: alunoId }, 'Validação passou');
  } else {
    logger.warn(
      {
        aluno_id: alunoId,
        errors: validation.errors.map(e => ({
          rule: e.rule,
          message: e.message,
          severity: e.severity,
        }))
      },
      'Erros de validação encontrados'
    );
  }
}

// Uso
const analysis = await loadStudentAnalysisWithFix('./data/aluno_001.json');
const validation = validateStudent(analysis);
logValidationResults(analysis.meta.aluno_id, validation);
```

---

## 🎨 Integração com React Components

### Componente de Validação de Dados

```typescript
// components/StudentDataValidator.tsx
import { useState, useEffect } from 'react';
import {
  validateStudent,
  checkCoreIndicators,
  checkPesoPilares,
  type DnaGenisAnalysis,
} from '@/lib/zod-student';

interface Props {
  analysis: DnaGenisAnalysis;
}

export function StudentDataValidator({ analysis }: Props) {
  const [validation, setValidation] = useState<ReturnType<typeof validateStudent>>();
  const [coreCheck, setCoreCheck] = useState<ReturnType<typeof checkCoreIndicators>>();
  const [pesoCheck, setPesoCheck] = useState<ReturnType<typeof checkPesoPilares>>();

  useEffect(() => {
    setValidation(validateStudent(analysis));
    setCoreCheck(checkCoreIndicators(analysis));
    setPesoCheck(checkPesoPilares(analysis));
  }, [analysis]);

  if (!validation) return null;

  return (
    <div className="validation-panel">
      <h3>Status de Validação</h3>

      {/* Status Geral */}
      <div className={`status ${validation.valid ? 'valid' : 'invalid'}`}>
        {validation.valid ? '✓ Todos os testes passaram' : '✗ Erros encontrados'}
      </div>

      {/* Indicadores Core */}
      <div className="check-section">
        <h4>Indicadores Core</h4>
        <div className={coreCheck?.valid ? 'valid' : 'invalid'}>
          {coreCheck?.valid
            ? `✓ Todos os 8 core presentes`
            : `✗ Faltam: ${coreCheck?.missing.join(', ')}`
          }
        </div>
      </div>

      {/* Pesos */}
      <div className="check-section">
        <h4>Pesos dos Pilares</h4>
        <div className={pesoCheck?.valid ? 'valid' : 'invalid'}>
          {pesoCheck?.valid
            ? `✓ Soma = ${pesoCheck.soma.toFixed(4)}`
            : `✗ Soma = ${pesoCheck?.soma.toFixed(4)} (esperado: 1.0)`
          }
        </div>
      </div>

      {/* Erros Detalhados */}
      {!validation.valid && (
        <div className="errors">
          <h4>Erros ({validation.errors.length})</h4>
          <ul>
            {validation.errors.map((err, idx) => (
              <li key={idx} className={err.severity}>
                <strong>[{err.severity}]</strong> {err.rule}: {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Hook Customizado

```typescript
// hooks/useStudentValidation.ts
import { useMemo } from 'react';
import {
  validateStudent,
  checkCoreIndicators,
  checkPesoPilares,
  getIndicadoresFlexiveis,
  type DnaGenisAnalysis,
} from '@/lib/zod-student';

export function useStudentValidation(analysis: DnaGenisAnalysis | null) {
  return useMemo(() => {
    if (!analysis) {
      return {
        validation: null,
        coreCheck: null,
        pesoCheck: null,
        flexCheck: null,
        isValid: false,
      };
    }

    const validation = validateStudent(analysis);
    const coreCheck = checkCoreIndicators(analysis);
    const pesoCheck = checkPesoPilares(analysis);
    const flexCheck = getIndicadoresFlexiveis(analysis);

    return {
      validation,
      coreCheck,
      pesoCheck,
      flexCheck,
      isValid: validation.valid && coreCheck.valid && pesoCheck.valid,
    };
  }, [analysis]);
}

// Uso no componente
function StudentDashboard({ alunoId }: { alunoId: string }) {
  const { data: analysis } = useStudentAnalysis(alunoId);
  const { validation, isValid, coreCheck, flexCheck } = useStudentValidation(analysis);

  if (!isValid) {
    return <StudentDataValidator analysis={analysis} />;
  }

  return (
    <div>
      <h2>{analysis.meta.aluno_id}</h2>
      <p>Score Geral: {analysis.resumo.score_geral}</p>
      <p>Indicadores Core: {coreCheck.present.length}/8</p>
      <p>Indicadores Flexíveis: {flexCheck.total}/8</p>
    </div>
  );
}
```

---

## 🛠️ Utilitários Avançados

### 1. Comparação de Análises (Validação de Evolução)

```typescript
function compareAnalyses(
  anterior: DnaGenisAnalysis,
  atual: DnaGenisAnalysis
) {
  // Validar ambas
  const validationAnterior = validateStudent(anterior);
  const validationAtual = validateStudent(atual);

  // Comparar indicadores
  const indicadoresAnterior = new Set(anterior.indicadores.map(i => i.codigo));
  const indicadoresAtual = new Set(atual.indicadores.map(i => i.codigo));

  const novos = [...indicadoresAtual].filter(c => !indicadoresAnterior.has(c));
  const removidos = [...indicadoresAnterior].filter(c => !indicadoresAtual.has(c));

  // Comparar scores
  const deltaScore = atual.resumo.score_geral - anterior.resumo.score_geral;

  return {
    validacao_anterior: validationAnterior.valid,
    validacao_atual: validationAtual.valid,
    indicadores_novos: novos,
    indicadores_removidos: removidos,
    delta_score: deltaScore,
    evolucao: deltaScore > 0 ? 'positiva' : deltaScore < 0 ? 'negativa' : 'estável',
  };
}
```

### 2. Exportar Relatório de Validação para JSON

```typescript
async function exportValidationReport(
  analyses: DnaGenisAnalysis[],
  outputPath: string
) {
  const report = analyses.map(analysis => {
    const validation = validateStudent(analysis);
    const coreCheck = checkCoreIndicators(analysis);
    const pesoCheck = checkPesoPilares(analysis);
    const flexCheck = getIndicadoresFlexiveis(analysis);

    return {
      aluno_id: analysis.meta.aluno_id,
      analise_id: analysis.meta.analise_id,
      timestamp: analysis.meta.timestamp,

      validacao: {
        valido: validation.valid,
        total_erros: validation.errors.length,
        erros: validation.errors,
      },

      indicadores: {
        total: analysis.indicadores.length,
        core_presentes: coreCheck.present.length,
        core_ausentes: coreCheck.missing.length,
        flexiveis_presentes: flexCheck.total,
        lista_core_ausentes: coreCheck.missing,
        lista_flexiveis_presentes: flexCheck.presentes,
      },

      pilares: {
        soma_pesos: pesoCheck.soma,
        pesos_validos: pesoCheck.valid,
        detalhes_pesos: pesoCheck.detalhes,
      },

      scores: {
        geral: analysis.resumo.score_geral,
        categoria_geral: analysis.resumo.categoria_geral,
        autoconfianca: analysis.resumo.score_autoconfianca,
      },
    };
  });

  const summary = {
    total_alunos: analyses.length,
    alunos_validos: report.filter(r => r.validacao.valido).length,
    alunos_com_core_completo: report.filter(r => r.indicadores.core_ausentes === 0).length,
    media_indicadores: report.reduce((sum, r) => sum + r.indicadores.total, 0) / analyses.length,
    timestamp_relatorio: new Date().toISOString(),
  };

  const fullReport = { summary, detalhes: report };

  await fs.writeFile(outputPath, JSON.stringify(fullReport, null, 2));
  console.log(`Relatório exportado: ${outputPath}`);
}
```

### 3. Middleware de Validação para API

```typescript
// middleware/validateStudentData.ts
import { Request, Response, NextFunction } from 'express';
import { dnaGenisAnalysisSchema } from '@/lib/zod-student';

export function validateStudentData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Validar body da request
    const validatedData = dnaGenisAnalysisSchema.parse(req.body);

    // Substituir body pelo dado validado
    req.body = validatedData;

    next();
  } catch (error) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: error.errors || error.message,
    });
  }
}

// Uso em rota Express
app.post('/api/students/analysis', validateStudentData, async (req, res) => {
  // req.body já é validado e tipado como DnaGenisAnalysis
  const analysis = req.body;

  // Salvar no banco, processar, etc.
  await saveAnalysis(analysis);

  res.json({ success: true });
});
```

---

## 📊 Dashboard de Qualidade

### Página de Diagnóstico

```typescript
// pages/diagnostico.tsx
import { useState, useEffect } from 'react';
import { auditStudentQuality, loadAllStudents } from '@/lib/student-loader';

export default function DiagnosticoPage() {
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { success } = await loadAllStudents('./data/alunos');
      const auditResults = auditStudentQuality(success);
      setAudit(auditResults);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!audit) return <div>Erro ao carregar dados</div>;

  return (
    <div className="diagnostico-page">
      <h1>Diagnóstico de Qualidade - Dashboard DNA Genis</h1>

      {/* Estatísticas Gerais */}
      <section className="stats">
        <h2>Estatísticas Gerais</h2>
        <div className="stat-cards">
          <StatCard
            title="Total de Alunos"
            value={audit.stats.total_alunos}
            icon="👥"
          />
          <StatCard
            title="Com Core Completo"
            value={audit.stats.com_core_completo}
            percentage={(audit.stats.com_core_completo / audit.stats.total_alunos * 100).toFixed(1)}
            icon="✓"
          />
          <StatCard
            title="Média de Indicadores"
            value={audit.stats.media_indicadores.toFixed(1)}
            icon="📊"
          />
          <StatCard
            title="Média de Flexíveis"
            value={audit.stats.media_flexiveis.toFixed(1)}
            icon="🔀"
          />
        </div>
      </section>

      {/* Tabela de Alunos */}
      <section className="student-table">
        <h2>Detalhes por Aluno</h2>
        <table>
          <thead>
            <tr>
              <th>Aluno ID</th>
              <th>Core Completo</th>
              <th>Pesos Válidos</th>
              <th>Total Indicadores</th>
              <th>Flexíveis</th>
              <th>Erros</th>
            </tr>
          </thead>
          <tbody>
            {audit.auditResults.map(result => (
              <tr key={result.aluno_id}>
                <td>{result.aluno_id}</td>
                <td className={result.core_valido ? 'valid' : 'invalid'}>
                  {result.core_valido ? '✓' : '✗'}
                  {!result.core_valido && ` (${result.core_ausentes.join(', ')})`}
                </td>
                <td className={result.peso_valido ? 'valid' : 'invalid'}>
                  {result.peso_valido ? '✓' : '✗'}
                  {!result.peso_valido && ` (${result.peso_soma.toFixed(3)})`}
                </td>
                <td>{result.total_indicadores}</td>
                <td>{result.indicadores_flexiveis}</td>
                <td>{result.total_erros}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
```

---

## 🔍 Debugging e Troubleshooting

### 1. Habilitar Logs de Validação

```typescript
// lib/student-loader.ts
const DEBUG = process.env.DEBUG === 'true';

function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DEBUG] ${message}`, data || '');
  }
}

async function loadStudentAnalysisDebug(filePath: string) {
  debugLog('Carregando arquivo:', filePath);

  const rawData = await fs.readFile(filePath, 'utf-8');
  debugLog('Arquivo lido, tamanho:', rawData.length);

  const data = JSON.parse(rawData);
  debugLog('JSON parseado, indicadores:', data.indicadores?.length);

  const result = dnaGenisAnalysisSchema.safeParse(data);
  debugLog('Validação Zod:', result.success ? 'SUCESSO' : 'FALHA');

  if (!result.success) {
    debugLog('Erros de validação:', result.error.format());
  }

  return result.data;
}
```

### 2. Console Warnings para Avisos

```typescript
function warnIfIssues(analysis: DnaGenisAnalysis) {
  const validation = validateStudent(analysis);

  if (!validation.valid) {
    console.warn(`⚠️ [${analysis.meta.aluno_id}] Problemas de validação:`);
    validation.errors.forEach(err => {
      console.warn(`  [${err.severity}] ${err.rule}: ${err.message}`);
    });
  }
}
```

---

## ✅ Checklist de Integração

- [ ] Importar schema e utilities nos módulos de carregamento de dados
- [ ] Implementar `loadStudentAnalysisWithFix()` com auto-fix
- [ ] Adicionar validação em `loadAllStudents()` para batch
- [ ] Criar função `auditStudentQuality()` para estatísticas
- [ ] Implementar logging de validação (pino, winston, etc.)
- [ ] Adicionar componente `StudentDataValidator` no dashboard
- [ ] Criar hook `useStudentValidation()` para React
- [ ] Implementar página de diagnóstico `/diagnostico`
- [ ] Adicionar middleware de validação em APIs (se aplicável)
- [ ] Configurar exports de relatórios em JSON/CSV
- [ ] Habilitar debug logs em desenvolvimento
- [ ] Testar com dados reais de produção
- [ ] Documentar erros comuns e soluções

---

## 🎯 Próximos Passos

1. **Implementar carregamento com validação** em `loadStudentAnalysis()`
2. **Adicionar dashboard de diagnóstico** para visualizar qualidade
3. **Configurar logs** para monitorar validações em produção
4. **Criar testes automatizados** com dados de exemplo
5. **Documentar padrões** de uso para o time

---

**Última Atualização**: 2025-01-15
**Versão**: 2.0
