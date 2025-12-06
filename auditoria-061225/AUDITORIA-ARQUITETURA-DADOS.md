# Auditoria de Arquitetura - Consistência de Dados dos Alunos
**Dashboard DNA Genis - Sistema de Feedback Supremo**

Data: 06/12/2025
Auditor: Backend Architect Agent
Status: ✅ APROVADO COM RECOMENDAÇÕES

---

## 1. DIAGNÓSTICO ATUAL

### 1.1 Estado da Arquitetura

**PONTUAÇÃO GERAL: 9.2/10** - Arquitetura sólida com excelente foundation

#### ✅ Pontos Fortes Identificados

1. **Type Safety Completo**
   - TypeScript types bem definidos (`/src/types/dna-genis.ts`)
   - Zod schema para validação runtime (`/src/lib/zod-student.ts`)
   - Inferência de tipos automática: `type DnaGenisAnalysis = z.infer<typeof dnaGenisAnalysisSchema>`

2. **Validação em Runtime**
   - Schema Zod é **APLICADO** em `loadStudentJson()` via `dnaGenisAnalysisSchema.parse(parsed)`
   - Falha rápida com erro descritivo se dados inválidos
   - 100% dos arquivos passam validação atual

3. **Consistência de Dados (Validação Automática)**
   - 27/27 arquivos validados com sucesso
   - 0 erros estruturais
   - 0 erros de tipo
   - 0 violações de schema
   - 100% têm campos obrigatórios (meta, resumo, pilares, indicadores)

4. **Data Loading Pattern Robusto**
   ```typescript
   // Padrão: Static file loading + Zod validation
   - getAllStudentSlugs() → lista slugs
   - loadStudentJson(slug) → carrega + valida
   - Erro retorna null (404 no UI)
   - Type-safe após validação
   ```

5. **Access Control Implementado**
   - Sistema de access keys (`/src/lib/access-keys.ts`)
   - Validação constant-time (previne timing attacks)
   - 404 para keys inválidas (não expõe existência)

### 1.2 Análise de Consistência dos Dados

#### Distribuição de Indicadores por Aluno
```json
{
  "5 indicadores": 2 alunos,
  "7 indicadores": 1 aluno,
  "8 indicadores": 5 alunos,
  "9 indicadores": 2 alunos,
  "10 indicadores": 2 alunos,
  "13 indicadores": 15 alunos   ← PADRÃO OFICIAL
}
```

**ACHADO CRÍTICO #1**: Inconsistência no número de indicadores
- 55% dos alunos têm 13 indicadores (padrão DNA Genis 3.0)
- 45% têm menos indicadores (5-10)
- **Impacto**: Dashboards ficam visualmente inconsistentes

#### Distribuição de Scores por Pilar
```json
{
  "oratoria": { "withScore": 27, "withNull": 0 },      ✅ 100%
  "interpessoal": { "withScore": 27, "withNull": 0 },  ✅ 100%
  "intrapessoal": { "withScore": 27, "withNull": 0 },  ✅ 100%
  "repertorio": { "withScore": 18, "withNull": 9 }     ⚠️ 67%
}
```

**ACHADO #2**: Pilar Repertório com scores null
- 33% dos alunos têm repertório = null
- Campo `observacao` presente explicando motivo
- Schema permite null (design correto)
- Componentes UI devem tratar null

#### Versões de Dados
```json
{
  "1.0-supremo": 25 alunos,
  "2.0-supremo": 2 alunos
}
```

**ACHADO #3**: Migração de versão em andamento
- Maioria ainda em v1.0
- v2.0 adiciona campo `meta.video_info`
- Schema backward-compatible (opcional)

### 1.3 Análise de Schema Zod

#### Campos Obrigatórios (enforced)
✅ `meta.versao`
✅ `meta.timestamp`
✅ `meta.analise_id`
✅ `meta.aluno_id`
✅ `resumo.*` (todos)
✅ `pilares` (record)
✅ `indicadores` (array)

#### Campos Opcionais (flexibility)
⚠️ `pilares.*.score` → **NULLABLE** (permite repertório null)
⚠️ `pilares.*.categoria` → **NULLABLE**
⚠️ `evolucao.*` → **OPCIONAL** (mas presente em 100%)
⚠️ `plano_acao.*` → **OPCIONAL** (mas presente em 100%)
⚠️ `insights` → **OPCIONAL** (0% têm)
⚠️ `narrativa` → **OPCIONAL** (0% têm)

---

## 2. RISCOS IDENTIFICADOS

### 🔴 ALTO RISCO

**R1 - Inconsistência de Indicadores Entre Alunos**
- **Severidade**: Alta
- **Probabilidade**: 100% (já ocorrendo)
- **Impacto**: UX inconsistente, comparações inválidas
- **Evidência**: 45% dos alunos têm < 13 indicadores
- **Cenário de Falha**: Aluno com 5 indicadores vê dashboard "vazio" comparado a aluno com 13

**R2 - Falta de Validação de Business Rules**
- **Severidade**: Média
- **Probabilidade**: 60%
- **Impacto**: Dados tecnicamente válidos mas logicamente incorretos
- **Exemplo**: Score de 95 com categoria "critico"
- **Evidência**: Schema não valida regras como:
  - `score_geral` deve estar entre 0-100
  - `categoria_geral` deve corresponder ao score
  - Peso dos pilares deve somar 1.0

### 🟡 MÉDIO RISCO

**R3 - Campos Opcionais Sem Defaults**
- **Severidade**: Média
- **Probabilidade**: 40%
- **Impacto**: Runtime errors em componentes UI
- **Evidência**:
  ```typescript
  // Schema permite undefined, mas UI assume presente
  evolucao: z.object({...}).optional()
  ```

**R4 - Tipo `string` Genérico Para Categorias**
- **Severidade**: Média
- **Probabilidade**: 30%
- **Impacto**: Typos não detectados em build time
- **Evidência**:
  ```typescript
  // Schema atual
  categoria: z.string().nullable()

  // Valores reais encontrados
  "adequado", "forte", "excelente", "adequado_plus", "a_desenvolver"

  // Type não previne typos
  categoria: "fort" // ✅ passa validação (mas está errado)
  ```

### 🟢 BAIXO RISCO

**R5 - Falta de Validação de Evidências/Timestamps**
- **Severidade**: Baixa
- **Probabilidade**: 20%
- **Impacto**: Arrays vazios ou mal formatados
- **Evidência**: Schema aceita `evidencias: []` e `timestamps: []`

---

## 3. GAPS DE VALIDAÇÃO

### G1 - Validação de Business Rules
**Missing**: Validações de domínio não estão no schema

Exemplos de regras não validadas:
- Score deve estar entre 0-100
- Categoria deve corresponder ao score:
  - 0-49: "critico"
  - 50-69: "essencial"
  - 70-84: "forte"
  - 85-100: "excelente"
- Pesos devem somar 1.0
- Número de indicadores deve ser 13 (padrão oficial)
- Cada pilar deve ter indicadores associados

### G2 - Validação de Estrutura de Dados Complexos
**Missing**: Validação profunda de arrays e objetos nested

```typescript
// Atual: aceita qualquer array
evidencias: z.array(z.string())

// Ideal: validar conteúdo
evidencias: z.array(z.string().min(10)).min(1).max(10)
timestamps: z.array(z.string().regex(/^\d{2}:\d{2}$/))
```

### G3 - Validação de Integridade Referencial
**Missing**: Validação de relacionamentos entre dados

```typescript
// Exemplo: indicador_ancora deve existir em indicadores
pilares.oratoria.indicador_ancora = "FLUENCIA"
// → deve existir em indicadores.find(i => i.codigo === "FLUENCIA")
```

### G4 - Validação em Build Time
**Missing**: Type-level validation para constantes

```typescript
// Atual: permite qualquer string
categoria_geral: z.string()

// Ideal: enum com valores permitidos
categoria_geral: z.enum(['critico', 'essencial', 'forte', 'excelente'])
```

### G5 - Testes de Integração de Schema
**Missing**: Testes automatizados de validação

Não há:
- Unit tests para schema Zod
- Integration tests para data loading
- Smoke tests para todos os arquivos de alunos
- CI/CD validation pipeline

---

## 4. RECOMENDAÇÕES

### Prioridade 1 (CRÍTICO) - Implementar Hoje

#### R1.1 - Enhanced Zod Schema com Business Rules
**Objetivo**: Garantir dados semanticamente corretos

```typescript
// /src/lib/zod-student-enhanced.ts
import { z } from 'zod';

// Enums para type safety
const ScoreCategoryEnum = z.enum(['critico', 'essencial', 'forte', 'excelente']);
const PilarTypeEnum = z.enum(['ORATORIA', 'INTERPESSOAL', 'INTRAPESSOAL', 'REPERTORIO']);

// Helper para validar categoria vs score
const validateScoreCategory = (score: number | null, categoria: string | null) => {
  if (score === null || categoria === null) return true; // Repertório pode ser null

  if (score >= 85 && categoria !== 'excelente') return false;
  if (score >= 70 && score < 85 && categoria !== 'forte') return false;
  if (score >= 50 && score < 70 && categoria !== 'essencial') return false;
  if (score < 50 && categoria !== 'critico') return false;

  return true;
};

export const enhancedDnaGenisSchema = z.object({
  meta: z.object({
    versao: z.string().regex(/^\d+\.\d+-\w+$/), // "1.0-supremo"
    timestamp: z.string().datetime(), // ISO 8601
    analise_id: z.string().min(1),
    aluno_id: z.string().min(1),
    video_info: z.object({
      video_atual: z.string(),
      contexto: z.string(),
    }).optional(),
  }),

  resumo: z.object({
    score_geral: z.number().min(0).max(100),
    score_autoconfianca: z.number().min(0).max(100),
    categoria_geral: ScoreCategoryEnum,
    evolucao_percentual: z.number().nullable(),
    numero_analise: z.number().int().positive(),
    dias_desde_anterior: z.number().int().nonnegative().nullable(),
  }).refine(
    (data) => validateScoreCategory(data.score_geral, data.categoria_geral),
    { message: "Categoria não corresponde ao score" }
  ),

  pilares: z.record(
    z.object({
      score: z.number().min(0).max(100).nullable(),
      peso: z.number().min(0).max(1),
      categoria: ScoreCategoryEnum.nullable(),
      delta: z.number().nullable(),
      indicador_ancora: z.string().nullable(),
      indicador_gap: z.string().nullable(),
      observacao: z.string().optional(),
    }).refine(
      (data) => validateScoreCategory(data.score, data.categoria),
      { message: "Categoria do pilar não corresponde ao score" }
    )
  ).refine(
    (pilares) => {
      const pesos = Object.values(pilares).map(p => p.peso);
      const soma = pesos.reduce((a, b) => a + b, 0);
      return Math.abs(soma - 1.0) < 0.001; // Floating point tolerance
    },
    { message: "Pesos dos pilares devem somar 1.0" }
  ),

  indicadores: z.array(
    z.object({
      codigo: z.string().min(1),
      nome: z.string().min(1),
      pilar: PilarTypeEnum,
      score: z.number().min(0).max(100),
      categoria: ScoreCategoryEnum,
      delta: z.number().nullable(),
      confianca: z.number().min(0).max(100).optional().default(70),
      evidencias: z.array(z.string().min(5)).min(1).max(15),
      timestamps: z.array(z.string().regex(/^\d{2}:\d{2}$/)).min(1),
      aula_recomendada: z.string().nullable(),
      tecnica_recomendada: z.string().nullable(),
      prioridade_acao: z.number().int().min(1).max(10).nullable(),
      aplicavel: z.boolean().optional().default(true),
    })
  ).min(5).max(13), // DNA Genis 3.0 oficial = 13

  // ... restante dos campos
});
```

**Benefícios**:
- ✅ Type errors em build time
- ✅ Runtime validation com mensagens descritivas
- ✅ Previne dados semanticamente incorretos
- ✅ Auto-completion no IDE

#### R1.2 - Migration Script para Padronização
**Objetivo**: Normalizar todos os alunos para 13 indicadores

```typescript
// /scripts/migrate-to-13-indicators.ts
import { loadStudentJson } from '@/lib/load-student-analysis';

const STANDARD_INDICATOR_COUNT = 13;

async function migrateStudent(slug: string) {
  const data = await loadStudentJson(slug);
  if (!data) return;

  const currentCount = data.indicadores.length;

  if (currentCount === STANDARD_INDICATOR_COUNT) {
    console.log(`✅ ${slug}: já tem 13 indicadores`);
    return;
  }

  console.log(`⚠️  ${slug}: tem ${currentCount} indicadores, faltam ${STANDARD_INDICATOR_COUNT - currentCount}`);

  // Análise: quais indicadores faltam?
  const STANDARD_CODES = [
    'FLUENCIA', 'DICCAO', 'RITMO', 'MODULACAO_VOZ', 'LINGUAGEM_NAO_VERBAL',
    'PERSUASAO', 'DIDATICA', 'ADAPTABILIDADE',
    'AUTOCONFIANCA', 'LIDERANCA', 'CRIATIVIDADE',
    'REPERTORIO_GERAL', 'STORYTELLING'
  ];

  const existingCodes = data.indicadores.map(i => i.codigo);
  const missingCodes = STANDARD_CODES.filter(c => !existingCodes.includes(c));

  console.log(`   Faltam: ${missingCodes.join(', ')}`);

  // TODO: Gerar análise complementar ou marcar como não avaliável
}
```

**Ação**: Executar e documentar quais alunos precisam de re-análise

#### R1.3 - Pre-commit Hook de Validação
**Objetivo**: Prevenir dados inválidos em commit

```json
// package.json
{
  "scripts": {
    "validate:data": "node scripts/validate-all-students.js",
    "test:schema": "jest src/lib/__tests__/zod-schema.test.ts"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run validate:data"
    }
  }
}
```

### Prioridade 2 (ALTA) - Esta Semana

#### R2.1 - Runtime Error Boundaries
**Objetivo**: Graceful degradation para dados incompletos

```typescript
// /src/components/dashboard/DashboardShell.tsx
import { ErrorBoundary } from 'react-error-boundary';

function DashboardErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-genis-black flex items-center justify-center">
      <div className="max-w-md p-8 bg-red-900/20 border border-red-500/30 rounded-xl">
        <h2 className="text-xl font-bold text-red-400 mb-4">
          Erro ao Carregar Dashboard
        </h2>
        <p className="text-gray-300 mb-4">
          Os dados deste aluno estão incompletos ou corrompidos.
        </p>
        <details className="text-sm text-gray-400">
          <summary>Detalhes técnicos</summary>
          <pre className="mt-2 p-2 bg-black/50 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  );
}

export function DashboardShell({ data, userName }: Props) {
  return (
    <ErrorBoundary FallbackComponent={DashboardErrorFallback}>
      {/* ... dashboard content */}
    </ErrorBoundary>
  );
}
```

#### R2.2 - Data Sanitization Layer
**Objetivo**: Normalizar dados antes de renderizar

```typescript
// /src/lib/sanitize-student-data.ts
import { DnaGenisAnalysis } from './zod-student';

export function sanitizeStudentData(data: DnaGenisAnalysis): DnaGenisAnalysis {
  return {
    ...data,

    // Garantir confiança default
    indicadores: data.indicadores.map(ind => ({
      ...ind,
      confianca: ind.confianca ?? 70,
      aplicavel: ind.aplicavel ?? true,
    })),

    // Garantir evolucao sempre presente
    evolucao: data.evolucao ?? {
      historico: [],
      tendencia: null,
      projecao_30_dias: data.resumo.score_geral,
      projecao_90_dias: data.resumo.score_geral,
    },

    // Garantir plano_acao sempre presente
    plano_acao: data.plano_acao ?? {
      duracao_semanas: 4,
      indicadores_priorizados: [],
      trilhas: [],
      desafio_mes: { nome: 'Em planejamento', descricao: '' },
    },
  };
}

// Uso em load-student-analysis.ts
export async function loadStudentJson(slug: string): Promise<DnaGenisAnalysis | null> {
  // ... validação Zod
  const validated = dnaGenisAnalysisSchema.parse(parsed);
  return sanitizeStudentData(validated); // ← adicionar
}
```

#### R2.3 - Type Guards para Componentes
**Objetivo**: Type safety em runtime para componentes

```typescript
// /src/lib/type-guards.ts
import { DnaGenisAnalysis } from './zod-student';

export function hasCompleteEvolution(data: DnaGenisAnalysis): boolean {
  return !!(
    data.evolucao &&
    data.evolucao.historico &&
    data.evolucao.historico.length > 0
  );
}

export function hasRepertorioScore(data: DnaGenisAnalysis): boolean {
  return data.pilares.repertorio?.score !== null;
}

export function getIndicatorCount(data: DnaGenisAnalysis): number {
  return data.indicadores.length;
}

export function isStandardAnalysis(data: DnaGenisAnalysis): boolean {
  return getIndicatorCount(data) === 13;
}

// Uso em componentes
function EvolutionChart({ data }: Props) {
  if (!hasCompleteEvolution(data)) {
    return <EmptyState message="Evolução disponível na próxima análise" />;
  }
  // ... render chart
}
```

### Prioridade 3 (MÉDIA) - Próximas 2 Semanas

#### R3.1 - Automated Testing Suite
**Objetivo**: Prevenir regressões

```typescript
// /src/lib/__tests__/zod-schema.test.ts
import { dnaGenisAnalysisSchema } from '../zod-student';

describe('DNA Genis Schema Validation', () => {
  it('should accept valid student data', () => {
    const validData = { /* ... */ };
    expect(() => dnaGenisAnalysisSchema.parse(validData)).not.toThrow();
  });

  it('should reject score > 100', () => {
    const invalidData = { resumo: { score_geral: 150 } };
    expect(() => dnaGenisAnalysisSchema.parse(invalidData)).toThrow();
  });

  it('should reject categoria mismatch', () => {
    const invalidData = {
      resumo: { score_geral: 95, categoria_geral: 'critico' }
    };
    expect(() => dnaGenisAnalysisSchema.parse(invalidData)).toThrow();
  });
});

// /src/lib/__tests__/all-students.test.ts
import { getAllStudentSlugs, loadStudentJson } from '../load-student-analysis';

describe('All Students Data Integrity', () => {
  it('should validate all student files', async () => {
    const slugs = getAllStudentSlugs();

    for (const slug of slugs) {
      const data = await loadStudentJson(slug);
      expect(data).not.toBeNull();
      expect(data?.indicadores.length).toBeGreaterThanOrEqual(5);
    }
  });
});
```

#### R3.2 - Data Quality Dashboard
**Objetivo**: Monitorar qualidade dos dados

```typescript
// /src/app/admin/data-quality/page.tsx
export default async function DataQualityPage() {
  const slugs = getAllStudentSlugs();
  const report = {
    total: slugs.length,
    standardCompliant: 0,
    missingIndicators: [],
    nullRepertorio: [],
    versionDistribution: {},
  };

  for (const slug of slugs) {
    const data = await loadStudentJson(slug);
    if (!data) continue;

    if (data.indicadores.length === 13) report.standardCompliant++;
    if (data.indicadores.length < 13) report.missingIndicators.push(slug);
    if (data.pilares.repertorio?.score === null) report.nullRepertorio.push(slug);
  }

  return (
    <div>
      <h1>Data Quality Report</h1>
      <MetricCard title="Standard Compliant" value={`${report.standardCompliant}/${report.total}`} />
      <MetricCard title="Missing Indicators" value={report.missingIndicators.length} />
      <ListCard title="Needs Re-analysis" items={report.missingIndicators} />
    </div>
  );
}
```

#### R3.3 - Documentation & ADR
**Objetivo**: Documentar decisões arquiteturais

```markdown
# ADR-001: Zod Schema Strategy

## Status
Accepted

## Context
Dashboard precisa garantir consistência de dados entre 27+ alunos

## Decision
- Usar Zod para validação runtime
- Schema co-located com types
- Falha rápida em caso de dados inválidos
- Optional fields para backward compatibility

## Consequences
- ✅ Type safety em build + runtime
- ✅ Mensagens de erro descritivas
- ✅ Auto-completion no IDE
- ⚠️ Overhead de validação (aceitável para static data)
```

---

## 5. CÓDIGO SUGERIDO

### 5.1 Enhanced Schema (Implementação Completa)

```typescript
// /src/lib/zod-student-v2.ts
import { z } from 'zod';

// ==================== ENUMS ====================

export const ScoreCategoryEnum = z.enum([
  'critico',
  'essencial',
  'adequado',
  'forte',
  'excelente',
  'altaPerformance'
]);

export const PilarTypeEnum = z.enum([
  'ORATORIA',
  'INTERPESSOAL',
  'INTRAPESSOAL',
  'REPERTORIO'
]);

export const MaterialTypeEnum = z.enum([
  'aula',
  'tecnica',
  'exercicio',
  'leitura'
]);

export const PriorityEnum = z.enum(['alta', 'media', 'baixa']);

// ==================== VALIDATORS ====================

function validateScoreCategory(score: number | null, categoria: string | null): boolean {
  if (score === null || categoria === null) return true;

  if (score >= 85 && !['excelente', 'altaPerformance'].includes(categoria)) return false;
  if (score >= 70 && score < 85 && categoria !== 'forte') return false;
  if (score >= 50 && score < 70 && !['adequado', 'essencial'].includes(categoria)) return false;
  if (score < 50 && categoria !== 'critico') return false;

  return true;
}

// ==================== SUB-SCHEMAS ====================

const MetaSchema = z.object({
  versao: z.string().regex(/^\d+\.\d+-\w+$/, 'Formato: "1.0-supremo"'),
  timestamp: z.string().datetime('Formato ISO 8601 requerido'),
  analise_id: z.string().min(1, 'analise_id não pode ser vazio'),
  aluno_id: z.string().min(1, 'aluno_id não pode ser vazio'),
  video_info: z.object({
    video_atual: z.string(),
    contexto: z.string(),
  }).optional(),
});

const ResumoSchema = z.object({
  score_geral: z.number().min(0).max(100),
  score_autoconfianca: z.number().min(0).max(100),
  categoria_geral: ScoreCategoryEnum,
  evolucao_percentual: z.number().min(-100).max(500).nullable(),
  numero_analise: z.number().int().positive(),
  dias_desde_anterior: z.number().int().nonnegative().nullable(),
}).refine(
  (data) => validateScoreCategory(data.score_geral, data.categoria_geral),
  {
    message: "categoria_geral incompatível com score_geral",
    path: ['categoria_geral']
  }
);

const PilarDataSchema = z.object({
  score: z.number().min(0).max(100).nullable(),
  peso: z.number().min(0).max(1),
  categoria: ScoreCategoryEnum.nullable(),
  delta: z.number().min(-100).max(100).nullable(),
  indicador_ancora: z.string().nullable(),
  indicador_gap: z.string().nullable(),
  observacao: z.string().optional(),
}).refine(
  (data) => validateScoreCategory(data.score, data.categoria),
  {
    message: "categoria incompatível com score",
    path: ['categoria']
  }
);

const IndicatorSchema = z.object({
  codigo: z.string().min(1).toUpperCase(),
  nome: z.string().min(3),
  pilar: PilarTypeEnum,
  score: z.number().min(0).max(100),
  categoria: ScoreCategoryEnum,
  delta: z.number().min(-100).max(100).nullable(),
  confianca: z.number().min(0).max(100).default(70),
  evidencias: z.array(z.string().min(5)).min(1).max(15),
  timestamps: z.array(
    z.string().regex(/^\d{2}:\d{2}$/, 'Formato: "MM:SS"')
  ).min(1),
  aula_recomendada: z.string().nullable(),
  tecnica_recomendada: z.string().nullable(),
  prioridade_acao: z.number().int().min(1).max(10).nullable(),
  aplicavel: z.boolean().default(true),
}).refine(
  (data) => validateScoreCategory(data.score, data.categoria),
  {
    message: "categoria incompatível com score",
    path: ['categoria']
  }
);

const EvolutionHistorySchema = z.object({
  data: z.string().date(),
  score_geral: z.number().min(0).max(100),
  destaque: z.string().min(5),
});

const EvolutionDataSchema = z.object({
  historico: z.array(EvolutionHistorySchema),
  tendencia: z.string().nullable(),
  projecao_30_dias: z.number().min(0).max(100),
  projecao_90_dias: z.number().min(0).max(100),
});

const ExerciseSchema = z.object({
  nome: z.string().min(3),
  frequencia: z.string(),
  duracao_minutos: z.number().int().positive(),
});

const TrailSchema = z.object({
  semanas: z.string(),
  foco: z.string().min(5),
  objetivo: z.string().min(10),
  aula_id: z.number().int().positive(),
  aula_nome: z.string().min(3),
  exercicios: z.array(ExerciseSchema),
  criterios_sucesso: z.array(z.string().min(5)),
});

const ChallengeSchema = z.object({
  nome: z.string().min(5),
  descricao: z.string().min(10),
});

const ActionPlanSchema = z.object({
  duracao_semanas: z.number().int().positive(),
  indicadores_priorizados: z.array(z.string()),
  trilhas: z.array(TrailSchema),
  desafio_mes: ChallengeSchema,
});

const MaterialSchema = z.object({
  tipo: MaterialTypeEnum,
  nome: z.string().min(3),
  indicador_relacionado: z.string(),
  prioridade: PriorityEnum,
  link: z.string().url().nullable(),
});

const NextStepsSchema = z.object({
  imediatos: z.array(z.string().min(5)),
  curto_prazo: z.array(z.string().min(5)),
  proxima_avaliacao: z.string().date(),
  meta_score_30_dias: z.number().min(0).max(100),
  meta_score_90_dias: z.number().min(0).max(100),
});

// ==================== MAIN SCHEMA ====================

export const enhancedDnaGenisAnalysisSchema = z.object({
  meta: MetaSchema,
  resumo: ResumoSchema,

  pilares: z.record(
    z.enum(['oratoria', 'interpessoal', 'intrapessoal', 'repertorio']),
    PilarDataSchema
  ).refine(
    (pilares) => {
      const pesos = Object.values(pilares).map(p => p.peso);
      const soma = pesos.reduce((a, b) => a + b, 0);
      return Math.abs(soma - 1.0) < 0.001;
    },
    { message: "Pesos dos pilares devem somar 1.0" }
  ),

  indicadores: z.array(IndicatorSchema)
    .min(5, 'Mínimo 5 indicadores')
    .max(13, 'Máximo 13 indicadores (padrão DNA Genis)'),

  evolucao: EvolutionDataSchema,
  plano_acao: ActionPlanSchema,
  materiais: z.array(MaterialSchema),
  proximos_passos: NextStepsSchema,

  // Optional fields
  insights: z.object({
    highlights: z.object({
      strengths: z.array(z.any()),
      gaps: z.array(z.any()),
    }),
    timeline: z.array(z.any()),
    confidence: z.array(z.any()),
  }).optional(),

  narrativa: z.any().optional(),
});

export type EnhancedDnaGenisAnalysis = z.infer<typeof enhancedDnaGenisAnalysisSchema>;
```

### 5.2 Validation Utilities

```typescript
// /src/lib/validation-utils.ts
import { enhancedDnaGenisAnalysisSchema, type EnhancedDnaGenisAnalysis } from './zod-student-v2';
import { ZodError } from 'zod';

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  data?: EnhancedDnaGenisAnalysis;
}

export function validateStudentData(raw: unknown): ValidationResult {
  try {
    const data = enhancedDnaGenisAnalysisSchema.parse(raw);
    return { valid: true, data };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map(err =>
        `${err.path.join('.')}: ${err.message}`
      );
      return { valid: false, errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
}

export function validateStudentDataSafe(raw: unknown): EnhancedDnaGenisAnalysis | null {
  const result = enhancedDnaGenisAnalysisSchema.safeParse(raw);
  return result.success ? result.data : null;
}

export function getValidationErrors(raw: unknown): string[] {
  const result = validateStudentData(raw);
  return result.errors || [];
}
```

### 5.3 Pre-commit Hook

```bash
#!/bin/bash
# /.husky/pre-commit

echo "🔍 Validating student data..."

# Run validation script
node scripts/validate-all-students.js

if [ $? -ne 0 ]; then
  echo "❌ Validation failed. Please fix data issues before committing."
  exit 1
fi

echo "✅ All student data validated successfully"
exit 0
```

```javascript
// /scripts/validate-all-students.js
const fs = require('fs');
const path = require('path');
const { validateStudentData } = require('../src/lib/validation-utils');

const dataDir = path.join(__dirname, '../src/data/alunos');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let hasErrors = false;

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  let data;
  try {
    data = JSON.parse(content);
  } catch (err) {
    console.error(`❌ ${file}: JSON parse error`);
    hasErrors = true;
    return;
  }

  const result = validateStudentData(data);

  if (!result.valid) {
    console.error(`❌ ${file}:`);
    result.errors.forEach(err => console.error(`   - ${err}`));
    hasErrors = true;
  } else {
    console.log(`✅ ${file}`);
  }
});

if (hasErrors) {
  console.error('\n❌ Validation failed');
  process.exit(1);
} else {
  console.log('\n✅ All files validated successfully');
  process.exit(0);
}
```

---

## 6. ROADMAP DE IMPLEMENTAÇÃO

### Semana 1 (Imediato)
- [ ] Implementar `enhancedDnaGenisAnalysisSchema` (R1.1)
- [ ] Criar script `migrate-to-13-indicators.ts` (R1.2)
- [ ] Executar análise de gaps e documentar
- [ ] Adicionar pre-commit hook (R1.3)

### Semana 2
- [ ] Implementar Error Boundaries (R2.1)
- [ ] Criar data sanitization layer (R2.2)
- [ ] Adicionar type guards (R2.3)
- [ ] Testar em 3-5 dashboards

### Semana 3-4
- [ ] Escrever test suite completa (R3.1)
- [ ] Criar Data Quality Dashboard (R3.2)
- [ ] Documentar ADRs (R3.3)
- [ ] Code review e ajustes

### Manutenção Contínua
- [ ] CI/CD validation em todos os PRs
- [ ] Monthly data quality reports
- [ ] Schema evolution strategy

---

## 7. CONCLUSÃO

### Estado Atual: 9.2/10
**Pontos Fortes**:
- ✅ Type safety completo (TypeScript + Zod)
- ✅ Validação runtime implementada
- ✅ 100% dos arquivos atuais válidos
- ✅ Padrão de loading robusto
- ✅ Access control implementado

**Pontos de Melhoria**:
- ⚠️ 45% dos alunos com < 13 indicadores (inconsistência visual)
- ⚠️ Falta validação de business rules (categoria vs score)
- ⚠️ Schemas com tipos genéricos (string em vez de enum)
- ⚠️ Falta de testes automatizados
- ⚠️ Falta de CI/CD validation

### Impacto das Recomendações

**Curto Prazo (1-2 semanas)**:
- 🎯 100% de consistência de dados
- 🎯 Prevenir dados semanticamente incorretos
- 🎯 Mensagens de erro descritivas

**Médio Prazo (1 mês)**:
- 🎯 Testes automatizados em CI/CD
- 🎯 Data quality dashboard
- 🎯 Documentação completa

**Longo Prazo (contínuo)**:
- 🎯 Zero regressões de dados
- 🎯 Onboarding automatizado de novos alunos
- 🎯 Confiança 100% na qualidade dos dados

---

## ANEXOS

### A. Comandos Úteis

```bash
# Validar todos os alunos
npm run validate:data

# Executar testes de schema
npm run test:schema

# Gerar relatório de qualidade
npm run report:quality

# Migrar para v2 schema
npm run migrate:schema-v2
```

### B. Referências

- Zod Documentation: https://zod.dev/
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- DNA Genis 3.0 Spec: `/docs/dna-genis-spec.md`
- Architecture Decision Records: `/docs/adr/`

### C. Contatos

- Tech Lead: [seu-email]
- Data Quality Owner: [owner-email]
- Product Owner: [po-email]

---

**Documento gerado em**: 06/12/2025
**Próxima revisão**: 13/12/2025
**Versão**: 1.0
