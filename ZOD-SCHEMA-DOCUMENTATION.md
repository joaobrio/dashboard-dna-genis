# Enhanced Zod Schema - Dashboard DNA Genis

## Sumário Executivo

Schema híbrido de validação para análises DNA Genis com **8 indicadores core obrigatórios** + **5-8 indicadores flexíveis opcionais**, implementado com Zod e validações de business rules.

**Status**: ✅ Implementado
**Versão**: 2.0
**Data**: 2025-01-15
**Arquivo**: `/src/lib/zod-student.ts`

---

## 📋 Arquitetura do Schema

### Modelo Híbrido

```
┌─────────────────────────────────────────┐
│         ESTRUTURA HÍBRIDA               │
├─────────────────────────────────────────┤
│                                         │
│  ✅ CORE (8 obrigatórios)               │
│     - FLUENCIA                          │
│     - DICCAO                            │
│     - MODULACAO_VOZ                     │
│     - LINGUAGEM_NAO_VERBAL              │
│     - PERSUASAO                         │
│     - ADAPTABILIDADE                    │
│     - LIDERANCA                         │
│     - CRIATIVIDADE                      │
│                                         │
│  🔀 FLEXÍVEIS (0-8 opcionais)           │
│     - RITMO                             │
│     - DIDATICA                          │
│     - AUTOCONFIANCA                     │
│     - REPERTORIO_GERAL                  │
│     - STORYTELLING                      │
│     - ASSERTIVIDADE                     │
│     - MARKETING_PESSOAL                 │
│     - GRAMATICA                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Business Rules Validadas

### 1. Categoria vs Score Matching

| Categoria         | Range de Score | Validação                  |
|-------------------|----------------|----------------------------|
| Alta Performance  | ≥ 80           | `score >= 80`              |
| Operacional       | 60 - 79        | `60 <= score < 80`         |
| Essencial         | 40 - 59        | `40 <= score < 60`         |
| Crítico           | < 40           | `score < 40`               |

**Aplicado em:**
- `resumo.categoria_geral` vs `resumo.score_geral`
- `indicadores[].categoria` vs `indicadores[].score`
- `pilares[].categoria` vs `pilares[].score`

### 2. Soma de Pesos dos Pilares

```typescript
soma(pilares[].peso) == 1.0 ± 0.01
```

**Tolerância**: 0.01 (1%)
**Exemplo válido**: 0.25 + 0.25 + 0.25 + 0.25 = 1.00 ✅
**Exemplo inválido**: 0.3 + 0.3 + 0.3 + 0.3 = 1.20 ❌

### 3. Indicadores Core Obrigatórios

Todos os **8 indicadores core** devem estar presentes em `indicadores[]`.

### 4. Range Validation

- **Scores**: 0 ≤ score ≤ 100
- **Confiança**: 0 ≤ confianca ≤ 1 (se presente)
- **Pesos**: 0 ≤ peso ≤ 1

### 5. Enums Tipados

- **Categoria**: `'Alta Performance' | 'Operacional' | 'Essencial' | 'Crítico'`
- **Pilar**: `'oratoria' | 'interpessoal' | 'intrapessoal' | 'repertorio'`

---

## 🛠️ API Reference

### Schemas

#### `dnaGenisAnalysisSchema`

Schema principal com todas as validações integradas.

```typescript
import { dnaGenisAnalysisSchema } from './zod-student';

// Parse e validação
const analise = dnaGenisAnalysisSchema.parse(dados);

// Validação sem throw
const result = dnaGenisAnalysisSchema.safeParse(dados);
if (!result.success) {
  console.error(result.error);
}
```

### Constantes

```typescript
// Indicadores Core (8 obrigatórios)
INDICADORES_CORE: [
  'FLUENCIA',
  'DICCAO',
  'MODULACAO_VOZ',
  'LINGUAGEM_NAO_VERBAL',
  'PERSUASAO',
  'ADAPTABILIDADE',
  'LIDERANCA',
  'CRIATIVIDADE'
]

// Indicadores Flexíveis (opcionais)
INDICADORES_FLEXIVEIS: [
  'RITMO',
  'DIDATICA',
  'AUTOCONFIANCA',
  'REPERTORIO_GERAL',
  'STORYTELLING',
  'ASSERTIVIDADE',
  'MARKETING_PESSOAL',
  'GRAMATICA'
]

// Todos os indicadores possíveis
TODOS_INDICADORES: [...INDICADORES_CORE, ...INDICADORES_FLEXIVEIS]
```

### Utility Functions

#### `validateStudent(analysis)`

Valida todas as business rules de uma análise.

```typescript
import { validateStudent } from './zod-student';

const validation = validateStudent(analise);

console.log(validation.valid); // true | false
console.log(validation.errors); // Array de erros detalhados
```

**Retorno:**
```typescript
{
  valid: boolean;
  errors: Array<{
    rule: string;          // Nome da regra violada
    message: string;       // Mensagem descritiva
    severity: 'error' | 'warning';
  }>;
}
```

#### `checkCoreIndicators(analysis)`

Verifica se todos os 8 indicadores core estão presentes.

```typescript
import { checkCoreIndicators } from './zod-student';

const coreCheck = checkCoreIndicators(analise);

console.log(coreCheck.valid);    // true | false
console.log(coreCheck.present);  // ['FLUENCIA', 'DICCAO', ...]
console.log(coreCheck.missing);  // ['CRIATIVIDADE', ...]
```

#### `checkPesoPilares(analysis, tolerancia?)`

Valida se a soma dos pesos dos pilares é 1.0.

```typescript
import { checkPesoPilares } from './zod-student';

const pesoCheck = checkPesoPilares(analise, 0.01);

console.log(pesoCheck.valid);      // true | false
console.log(pesoCheck.soma);       // 1.0 (exemplo)
console.log(pesoCheck.diferenca);  // 0.0 (exemplo)
console.log(pesoCheck.detalhes);   // { oratoria: 0.25, ... }
```

#### `getCategoriaByScore(score)`

Retorna a categoria correta baseada no score.

```typescript
import { getCategoriaByScore } from './zod-student';

getCategoriaByScore(85);  // 'Alta Performance'
getCategoriaByScore(75);  // 'Operacional'
getCategoriaByScore(55);  // 'Essencial'
getCategoriaByScore(35);  // 'Crítico'
```

#### `autoFixCategorias(analysis)`

Corrige automaticamente todas as categorias baseadas nos scores.

```typescript
import { autoFixCategorias } from './zod-student';

const analiseCorrigida = autoFixCategorias(analiseComCategoriaErrada);

// Não mutante - retorna nova cópia corrigida
```

#### `gerarRelatorioValidacao(analysis)`

Gera relatório de validação formatado para console.

```typescript
import { gerarRelatorioValidacao } from './zod-student';

const relatorio = gerarRelatorioValidacao(analise);
console.log(relatorio);
```

**Output:**
```
================================================================================
RELATÓRIO DE VALIDAÇÃO - aluno_123
================================================================================

Versão: 2.0
Análise ID: analise_001
Timestamp: 2025-01-15T10:00:00Z

--- INDICADORES CORE ---
Status: ✓ VÁLIDO
Presentes: 8/8

--- PESOS DOS PILARES ---
Status: ✓ VÁLIDO
Soma: 1.0000 (esperado: 1.0000)
Diferença: 0.0000
Detalhes:
  oratoria: 0.2500
  interpessoal: 0.2500
  intrapessoal: 0.2500
  repertorio: 0.2500

--- VALIDAÇÃO GERAL ---
Status: ✓ TODOS OS TESTES PASSARAM
Total de erros: 0

================================================================================
```

#### `getIndicadoresFlexiveis(analysis)`

Identifica quais indicadores flexíveis estão presentes.

```typescript
import { getIndicadoresFlexiveis } from './zod-student';

const flexCheck = getIndicadoresFlexiveis(analise);

console.log(flexCheck.total);       // 3
console.log(flexCheck.presentes);   // ['AUTOCONFIANCA', 'STORYTELLING', 'DIDATICA']
console.log(flexCheck.ausentes);    // ['RITMO', 'REPERTORIO_GERAL', ...]
```

#### `enrichIndicador(indicador)`

Adiciona flags `isCore` e `isFlexivel` a um indicador.

```typescript
import { enrichIndicador } from './zod-student';

const indicadorEnriquecido = enrichIndicador(indicador);

console.log(indicadorEnriquecido.isCore);     // true | false
console.log(indicadorEnriquecido.isFlexivel); // true | false
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Validação Básica

```typescript
import { dnaGenisAnalysisSchema } from './zod-student';

const dados = {
  meta: {
    versao: '2.0',
    timestamp: '2025-01-15T10:00:00Z',
    analise_id: 'analise_001',
    aluno_id: 'aluno_teste',
  },
  resumo: {
    score_geral: 75,
    score_autoconfianca: 70,
    categoria_geral: 'Operacional',
    evolucao_percentual: null,
    numero_analise: 1,
    dias_desde_anterior: null,
  },
  pilares: {
    oratoria: { score: 75, peso: 0.25, categoria: 'Operacional', ... },
    interpessoal: { score: 75, peso: 0.25, categoria: 'Operacional', ... },
    intrapessoal: { score: 75, peso: 0.25, categoria: 'Operacional', ... },
    repertorio: { score: 75, peso: 0.25, categoria: 'Operacional', ... },
  },
  indicadores: [
    // 8 CORE obrigatórios
    { codigo: 'FLUENCIA', nome: 'Fluência', pilar: 'oratoria', score: 75, ... },
    { codigo: 'DICCAO', nome: 'Dicção', pilar: 'oratoria', score: 75, ... },
    // ... (mais 6 core)

    // Flexíveis opcionais
    { codigo: 'AUTOCONFIANCA', nome: 'Autoconfiança', pilar: 'intrapessoal', score: 70, ... },
  ],
};

try {
  const analiseValidada = dnaGenisAnalysisSchema.parse(dados);
  console.log('✓ Análise validada com sucesso!');
} catch (error) {
  console.error('✗ Erro na validação:', error);
}
```

### Exemplo 2: Validação Completa com Relatório

```typescript
import { validateStudent, gerarRelatorioValidacao } from './zod-student';

const validation = validateStudent(analise);

if (validation.valid) {
  console.log('✓ Todos os testes passaram');
} else {
  console.log('✗ Erros encontrados:');
  validation.errors.forEach(err => {
    console.log(`  [${err.severity}] ${err.rule}: ${err.message}`);
  });
}

// Relatório detalhado
console.log(gerarRelatorioValidacao(analise));
```

### Exemplo 3: Auto-Fix de Categorias

```typescript
import { autoFixCategorias, validateStudent } from './zod-student';

// Dados com categorias incorretas
const dadosComErro = {
  resumo: {
    score_geral: 85,        // Score de "Alta Performance"
    categoria_geral: 'Operacional',  // CATEGORIA ERRADA!
    ...
  },
  ...
};

// Corrigir automaticamente
const dadosCorrigidos = autoFixCategorias(dadosComErro);

console.log(dadosCorrigidos.resumo.categoria_geral); // 'Alta Performance' ✓

// Validar após correção
const validation = validateStudent(dadosCorrigidos);
console.log(validation.valid); // true ✓
```

### Exemplo 4: Verificação de Indicadores

```typescript
import {
  checkCoreIndicators,
  getIndicadoresFlexiveis
} from './zod-student';

// Verificar indicadores core
const coreCheck = checkCoreIndicators(analise);
if (!coreCheck.valid) {
  console.warn(`Faltam indicadores core: ${coreCheck.missing.join(', ')}`);
}

// Verificar indicadores flexíveis
const flexCheck = getIndicadoresFlexiveis(analise);
console.log(`Indicadores flexíveis presentes: ${flexCheck.total}/8`);
console.log(`Detalhes: ${flexCheck.presentes.join(', ')}`);
```

---

## 🔍 Casos de Teste

### ✅ Caso Válido: Todos os Requisitos Atendidos

```typescript
{
  resumo: {
    score_geral: 75,
    categoria_geral: 'Operacional',  // ✓ Corresponde ao score (60-79)
  },
  pilares: {
    oratoria: { peso: 0.25, ... },
    interpessoal: { peso: 0.25, ... },
    intrapessoal: { peso: 0.25, ... },
    repertorio: { peso: 0.25, ... },  // ✓ Soma = 1.0
  },
  indicadores: [
    // ✓ Todos os 8 CORE presentes
    { codigo: 'FLUENCIA', ... },
    { codigo: 'DICCAO', ... },
    { codigo: 'MODULACAO_VOZ', ... },
    { codigo: 'LINGUAGEM_NAO_VERBAL', ... },
    { codigo: 'PERSUASAO', ... },
    { codigo: 'ADAPTABILIDADE', ... },
    { codigo: 'LIDERANCA', ... },
    { codigo: 'CRIATIVIDADE', ... },

    // ✓ 2 flexíveis opcionais
    { codigo: 'AUTOCONFIANCA', ... },
    { codigo: 'STORYTELLING', ... },
  ]
}
```

### ❌ Caso Inválido: Indicadores Core Ausentes

```typescript
{
  indicadores: [
    // ❌ Faltam 3 core: MODULACAO_VOZ, ADAPTABILIDADE, CRIATIVIDADE
    { codigo: 'FLUENCIA', ... },
    { codigo: 'DICCAO', ... },
    { codigo: 'LINGUAGEM_NAO_VERBAL', ... },
    { codigo: 'PERSUASAO', ... },
    { codigo: 'LIDERANCA', ... },
  ]
}

// Error: Indicadores CORE obrigatórios ausentes
```

### ❌ Caso Inválido: Soma de Pesos Incorreta

```typescript
{
  pilares: {
    oratoria: { peso: 0.3, ... },
    interpessoal: { peso: 0.3, ... },
    intrapessoal: { peso: 0.3, ... },
    repertorio: { peso: 0.3, ... },  // ❌ Soma = 1.2
  }
}

// Error: A soma dos pesos dos pilares deve ser 1.0
```

### ❌ Caso Inválido: Categoria vs Score Mismatch

```typescript
{
  resumo: {
    score_geral: 85,               // Score de "Alta Performance"
    categoria_geral: 'Operacional', // ❌ Categoria incorreta
  }
}

// Error: Categoria geral não corresponde ao score geral
```

---

## 🧪 Testes

Arquivo de exemplos completo disponível em:
**`/src/lib/zod-student.examples.ts`**

Executar todos os exemplos:
```typescript
import { runAllExamples } from './zod-student.examples';

runAllExamples();
```

Exemplos incluídos:
1. ✅ Validação básica (caso válido)
2. ❌ Indicadores core ausentes (deve falhar)
3. ❌ Soma de pesos inválida (deve falhar)
4. 🛠️ Uso de utility functions
5. 🔧 Auto-fix de categorias
6. 📊 Demonstração de ranges de categoria

---

## 🎨 Type Safety

### Tipos Exportados

```typescript
// Tipo principal
export type DnaGenisAnalysis = z.infer<typeof dnaGenisAnalysisSchema>;

// Enums
export type CategoriaPerformance = 'Alta Performance' | 'Operacional' | 'Essencial' | 'Crítico';
export type Pilar = 'oratoria' | 'interpessoal' | 'intrapessoal' | 'repertorio';

// Indicadores
export type IndicadorCore = 'FLUENCIA' | 'DICCAO' | ... (8 total);
export type IndicadorFlexivel = 'RITMO' | 'DIDATICA' | ... (8 total);
export type IndicadorCodigo = IndicadorCore | IndicadorFlexivel;

// Validação
export type ValidationResult = {
  valid: boolean;
  errors: Array<{
    rule: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
};

// Enriquecido
export type IndicadorEnriquecido = {
  // ... todos os campos do indicador
  isCore: boolean;
  isFlexivel: boolean;
};
```

---

## 📊 Estatísticas de Validação

### Regras Implementadas

| Regra                          | Tipo       | Nível      | Validação                  |
|--------------------------------|------------|------------|----------------------------|
| Categoria vs Score             | Business   | Campo      | Refine individual          |
| Soma de Pesos = 1.0            | Business   | Schema     | Refine global              |
| Indicadores Core Obrigatórios  | Business   | Schema     | Refine global              |
| Score Range (0-100)            | Constraint | Campo      | `.min(0).max(100)`         |
| Confiança Range (0-1)          | Constraint | Campo      | `.min(0).max(1)`           |
| Peso Range (0-1)               | Constraint | Campo      | `.min(0).max(1)`           |
| Enums Tipados                  | Type       | Campo      | `z.enum([...])`            |

### Cobertura de Validação

- ✅ **Resumo Geral**: categoria_geral vs score_geral
- ✅ **Pilares (4x)**: categoria vs score, soma de pesos
- ✅ **Indicadores (8-16x)**: categoria vs score, confiança
- ✅ **Meta**: presença de campos obrigatórios
- ✅ **Indicadores Core**: presença dos 8 obrigatórios

**Total**: ~25-35 validações por análise (dependendo do número de indicadores)

---

## 🚀 Próximos Passos

### Roadmap de Melhorias

1. **Validação de Evolução Temporal**
   - Delta consistente com análises anteriores
   - Tendência de evolução realista

2. **Validação de Evidências**
   - Timestamps dentro do range da análise
   - Quantidade mínima de evidências por categoria

3. **Validação de Plano de Ação**
   - Trilhas alinhadas com indicadores gap
   - Duração de semanas realista

4. **Validação de Materiais**
   - Links válidos
   - Prioridade consistente com indicadores

5. **Performance Metrics**
   - Benchmark de validação
   - Cache de validações repetidas

---

## 🔗 Integração com Dashboard

### Uso Recomendado

```typescript
// 1. Ao carregar dados do JSON
import { dnaGenisAnalysisSchema, validateStudent, gerarRelatorioValidacao } from './zod-student';

async function loadStudentData(filePath: string) {
  const rawData = await fs.readFile(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  try {
    // Validação com Zod
    const analise = dnaGenisAnalysisSchema.parse(data);

    // Validação adicional de business rules
    const validation = validateStudent(analise);

    if (!validation.valid) {
      console.warn('⚠️ Avisos de validação:');
      console.warn(gerarRelatorioValidacao(analise));
    }

    return analise;
  } catch (error) {
    console.error('❌ Erro ao validar dados:', error);
    throw error;
  }
}

// 2. Ao processar múltiplos alunos
import { checkCoreIndicators, checkPesoPilares } from './zod-student';

function auditarTodosAlunos(analises: DnaGenisAnalysis[]) {
  const relatorio = analises.map(analise => {
    const coreCheck = checkCoreIndicators(analise);
    const pesoCheck = checkPesoPilares(analise);
    const validation = validateStudent(analise);

    return {
      aluno_id: analise.meta.aluno_id,
      core_valido: coreCheck.valid,
      peso_valido: pesoCheck.valid,
      geral_valido: validation.valid,
      total_erros: validation.errors.length,
    };
  });

  return relatorio;
}
```

---

## 📚 Referências

### Documentação Relacionada

- **Auditoria de Qualidade**: `/feedbacks-supremos/AUDITORIA-QUALIDADE-FEEDBACKS-SDR.md`
- **Handoff Técnico**: `/feedbacks-supremos/HANDOFF-AUDITORIA-FEEDBACKS.md`
- **Schema Original**: `/src/lib/zod-student.ts` (antes da v2.0)

### Bibliotecas Utilizadas

- **Zod**: v3.x - Schema validation com TypeScript
- **TypeScript**: v5.x - Type safety

### Padrões Aplicados

- **Business Rules Validation**: Validação de regras de negócio via `.refine()`
- **Hybrid Schema**: Core obrigatório + Flexível opcional
- **Type-Safe Enums**: Uso de `z.enum()` para type safety
- **Utility First**: Functions helpers para validações complexas
- **Non-Mutating**: Auto-fix não mutante (retorna nova cópia)

---

## ✅ Checklist de Implementação

- [x] Enums tipados (CategoriaPerformance, Pilar)
- [x] Constantes de indicadores (CORE, FLEXIVEIS, TODOS)
- [x] Validação de categoria vs score
- [x] Validação de soma de pesos
- [x] Validação de indicadores core obrigatórios
- [x] Validação de ranges (scores, confiança, pesos)
- [x] Utility function: `validateStudent()`
- [x] Utility function: `checkCoreIndicators()`
- [x] Utility function: `checkPesoPilares()`
- [x] Utility function: `getCategoriaByScore()`
- [x] Utility function: `autoFixCategorias()`
- [x] Utility function: `gerarRelatorioValidacao()`
- [x] Utility function: `getIndicadoresFlexiveis()`
- [x] Utility function: `enrichIndicador()`
- [x] Helper types exportados
- [x] Comentários explicativos
- [x] Arquivo de exemplos de uso
- [x] Documentação completa (este arquivo)

---

## 📞 Suporte

Para dúvidas ou problemas com o schema:

1. Consultar os exemplos em `/src/lib/zod-student.examples.ts`
2. Executar `gerarRelatorioValidacao()` para diagnóstico
3. Verificar logs de console (validações emitem warnings)
4. Consultar esta documentação

---

**Última Atualização**: 2025-01-15
**Versão do Schema**: 2.0
**Retrocompatibilidade**: ✅ Mantida com v1.x (apenas adicionadas validações)
