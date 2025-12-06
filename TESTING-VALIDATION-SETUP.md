# Configuração de Validação Automatizada - Dashboard DNA Genis

Documentação completa da validação automatizada para garantir a integridade dos dados de 27 alunos com Schema Zod Enhanced.

## Visão Geral

Este projeto implementa validação em 4 níveis:

1. **Pre-commit Hooks** - Bloqueia commits com dados inválidos
2. **Scripts de Validação** - Validação em batch de todos os alunos
3. **Test Suite Automatizada** - Cobertura de 80%+ com Jest
4. **Schema Validation** - TypeScript compile-time checks

## Arquitetura de Validação

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Pre-commit Hook (husky + lint-staged)                 │
│  ├─ Valida JSONs contra schema                         │
│  └─ Bloqueia commit se inválido                        │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  npm run validate:students                             │
│  └─ Script Node: validate-all-students.js              │
│     ├─ Carrega 27 arquivos JSON                        │
│     ├─ Valida cada indicador                           │
│     ├─ Exibe relatório consolidado                     │
│     └─ Exit code 1 se houver erros                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  npm test:schema                                       │
│  └─ Jest Test Suite: zod-student.test.ts              │
│     ├─ Testa todas as business rules                   │
│     ├─ Testa utility functions                         │
│     └─ Coverage mínimo 80%                             │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  npm run validate:schema                               │
│  └─ TypeScript compiler checks                         │
│     └─ Valida tipos em tempo de compilação             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 1. Instalação das Dependências

```bash
# Instalar dependências de teste e validação
npm install --save-dev \
  jest \
  ts-jest \
  @types/jest \
  @testing-library/jest-dom \
  @testing-library/react \
  jest-environment-jsdom \
  husky \
  lint-staged \
  zod

# Inicializar husky
npx husky install
```

## 2. Scripts npm Disponíveis

### Validação

```bash
# Validar todos os 27 alunos
npm run validate:students

# Validar schema TypeScript
npm run validate:schema

# Executar ambas as validações
npm run validate

# Com debug verbose
DEBUG=1 npm run validate:students
```

### Testes

```bash
# Rodar todos os testes
npm test

# Rodar apenas testes de schema
npm test:schema

# Watch mode (rerun on changes)
npm test:watch

# Coverage report
npm test:coverage
```

### Build

```bash
# Build com validação prévia
npm run validate && npm run build
```

## 3. Pre-commit Hook

### Como Funciona

1. Quando você tenta fazer `git commit`, o hook é disparado
2. Valida todos os arquivos JSON em `src/data/alunos/`
3. Se há erros, o commit é bloqueado
4. Se está tudo ok, o commit prossegue

### Ativar Hook

```bash
# Inicializar husky (já feito durante npm install)
npx husky install

# Tornar pre-commit executável
chmod +x .husky/pre-commit
```

### Contornar Hook (Não Recomendado)

```bash
# Force commit mesmo com erros
git commit --no-verify

# Ou
git commit -n
```

## 4. Script de Validação em Batch

### Arquivo: `scripts/validate-all-students.js`

Carrega todos os 27 alunos e valida contra as seguintes regras:

#### Validação 1: Core Indicators Obrigatórios

Verifica se todos os 8 indicadores CORE estão presentes:
- FLUENCIA
- DICCAO
- MODULACAO_VOZ
- LINGUAGEM_NAO_VERBAL
- PERSUASAO
- ADAPTABILIDADE
- LIDERANCA
- CRIATIVIDADE

**Status**: ERRO se faltarem

#### Validação 2: Soma dos Pesos

Valida que a soma dos pesos dos pilares = 1.0 (tolerância: 0.01)

```
oratoria.peso + interpessoal.peso + intrapessoal.peso + repertorio.peso = 1.0
```

**Status**: ERRO se não somar 1.0 ± 0.01

#### Validação 3: Categoria vs Score

Cada indicador, pilar e resumo deve ter categoria consistente com score:

| Categoria | Score Range |
|-----------|-------------|
| Alta Performance | 80-100 |
| Operacional | 60-79 |
| Essencial | 40-59 |
| Crítico | 0-39 |

**Status**: ERRO se inconsistência

#### Validação 4: Range de Confiança

Se presente, confiança deve estar entre 0-1

**Status**: ERRO se fora do range

### Uso

```bash
# Validação padrão
npm run validate:students

# Com output detalhado
DEBUG=1 npm run validate:students

# Resultado esperado para 27 alunos válidos:
# ✓ ALUNOS VÁLIDOS: 27
# ✗ ALUNOS COM ERROS: 0
# Status final: ✓ TODAS AS VALIDAÇÕES PASSARAM
```

### Exemplo de Output

```
================================================================================
RELATÓRIO DE VALIDAÇÃO - TODOS OS ALUNOS
================================================================================

Data: 06/12/2025 14:30:45

Total de alunos: 27
Alunos válidos: 27 ✓
Alunos com erros: 0 ✗

--- SUMÁRIO POR STATUS ---

✓ ALUNOS VÁLIDOS:
  • aluno-001 (aluno-001.json)
  • aluno-002 (aluno-002.json)
  ... (25 mais)

================================================================================
Status final: ✓ TODAS AS VALIDAÇÕES PASSARAM
================================================================================
```

## 5. Test Suite com Jest

### Arquivo: `src/lib/__tests__/zod-student.test.ts`

Coverage mínimo: 80%

### Testes por Categoria

#### Business Rules (20 tests)

- `validarCategoriaVsScore` - 6 tests
  - Cada faixa de categoria
  - Limites de score
  - Categorias inválidas

- `getCategoriaByScore` - 4 tests
  - Cada faixa de score

- `validarConfianca` - 3 tests
  - Range válido (0-1)
  - Fora do range
  - Undefined (optional)

#### Utility Functions (25 tests)

- `checkCoreIndicators` - 3 tests
- `checkPesoPilares` - 4 tests
- `validateStudent` - 7 tests
- `autoFixCategorias` - 4 tests
- `gerarRelatorioValidacao` - 4 tests
- `getIndicadoresFlexiveis` - 2 tests
- `enrichIndicador` - 2 tests

#### Schema Validation (5 tests)

- `dnaGenisAnalysisSchema.safeParse()` - 5 tests
  - Dados válidos
  - Falta de core indicators
  - Peso incorreto
  - Score fora do range
  - Confiança inválida

#### Integration Tests (3 tests)

- Fluxo completo: validação → fix → re-validação
- Aluno com todos os indicadores flexíveis
- Múltiplos erros simultâneos

### Executar Testes

```bash
# Todos os testes
npm test

# Apenas schema tests
npm test:schema

# Watch mode
npm test:watch

# Coverage report
npm test:coverage

# Específico com verbose
npm test -- zod-student.test.ts --verbose
```

### Exemplo de Output

```
 PASS  src/lib/__tests__/zod-student.test.ts
  validarCategoriaVsScore
    ✓ Alta Performance: score >= 80 (5 ms)
    ✓ Operacional: 60 <= score < 80 (1 ms)
    ✓ Essencial: 40 <= score < 60 (1 ms)
    ✓ Crítico: score < 40 (1 ms)
    ✓ Categorias inválidas retornam false (1 ms)

  getCategoriaByScore
    ✓ Retorna categoria correta para scores Alta Performance (1 ms)
    ✓ Retorna categoria correta para scores Operacional (1 ms)
    ✓ Retorna categoria correta para scores Essencial (1 ms)
    ✓ Retorna categoria correta para scores Crítico (1 ms)

  ... (37 mais testes)

Test Suites: 1 passed, 1 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        2.345s
```

## 6. Configuração Jest

### Arquivo: `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/lib/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/'],
};
```

### Arquivo: `jest.setup.js`

```javascript
import '@testing-library/jest-dom';
```

## 7. Fluxo de Trabalho Recomendado

### Desenvolvimento Diário

```bash
# 1. Verificar se há mudanças pendentes
git status

# 2. Rodar validação antes de commitar
npm run validate:students

# 3. Rodar testes
npm test:schema

# 4. Se tudo está ok, commit é automático
git add src/data/alunos/
git commit -m "feat: atualizar dados de alunos"
# → Pre-commit hook roda validação
# → Se falhar, commit é bloqueado
# → Se ok, commit prossegue

# 5. Build com validação
npm run validate && npm run build

# 6. Deploy
npm run start
```

### Adição de Novo Aluno

```bash
# 1. Criar novo arquivo JSON em src/data/alunos/novo-aluno.json
# 2. Rodar validação
npm run validate:students
# → Se erros, fix-los antes de commitar

# 3. Rodar testes
npm test

# 4. Commitar quando tudo passar
git add src/data/alunos/novo-aluno.json
git commit -m "feat: adicionar novo aluno"
```

### Refatoração de Schema

```bash
# 1. Editar src/lib/zod-student.ts
# 2. Rodar validação de tipos
npm run validate:schema

# 3. Rodar testes
npm test:schema

# 4. Rodar validação de dados
npm run validate:students

# 5. Commitar
git add src/lib/zod-student.ts
git commit -m "refactor: atualizar schema zod"
```

## 8. Troubleshooting

### Problema: Pre-commit Hook Não Funciona

```bash
# Solução 1: Reinstalar husky
npm install -D husky
npx husky install

# Solução 2: Tornar script executável
chmod +x .husky/pre-commit

# Solução 3: Verificar se git hooks estão ativados
git config core.hooksPath
# Deve retornar: .husky
```

### Problema: Testes Não Encontram Imports

```bash
# Solução: Limpar cache Jest
npm test -- --clearCache
```

### Problema: Zod Import Faz Erro

```bash
# Solução: Adicionar zod às devDependencies
npm install --save-dev zod
```

### Problema: Validação Falha em um Aluno

```bash
# 1. Executar com debug
DEBUG=1 npm run validate:students

# 2. Procurar pelo aluno com erro
# 3. Revisar arquivo JSON manualmente
# 4. Usar auto-fix se possível
node -e "
const data = require('./src/data/alunos/aluno.json');
const { autoFixCategorias } = require('./src/lib/zod-student.ts');
const fixed = autoFixCategorias(data);
console.log(JSON.stringify(fixed, null, 2));
"
```

## 9. Integração com CI/CD

### GitHub Actions

```yaml
# .github/workflows/validate.yml
name: Validação e Testes

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run validate:students
      - run: npm test:schema
      - run: npm run build
```

### Pre-push Hook (Opcional)

```bash
# Criar arquivo .husky/pre-push
#!/bin/sh
npm test && npm run validate
```

## 10. Métricas e Monitoramento

### Dashboard de Validação

```bash
# Executar validação e gerar estatísticas
npm run validate:students > validation-report.txt

# Análise de histórico
git log --oneline -10 | grep -i "validate\|fix"
```

### Coverage Report

```bash
# Gerar coverage report detalhado
npm test:coverage

# Arquivo HTML: coverage/index.html
open coverage/index.html
```

## 11. Referência de Arquivos

| Arquivo | Propósito |
|---------|-----------|
| `package.json` | Scripts npm e dependências |
| `jest.config.js` | Configuração Jest |
| `jest.setup.js` | Setup de testes |
| `.husky/pre-commit` | Pre-commit hook |
| `.lintstagedrc.json` | Configuração lint-staged |
| `scripts/validate-all-students.js` | Script de validação em batch |
| `src/lib/zod-student.ts` | Schema Zod e utility functions |
| `src/lib/__tests__/zod-student.test.ts` | Test suite completa |
| `src/data/alunos/*.json` | Dados dos 27 alunos |

## 12. Sumário de Validação

### Business Rules Implementadas

✓ **8 Indicadores CORE Obrigatórios**
- FLUENCIA, DICCAO, MODULACAO_VOZ, LINGUAGEM_NAO_VERBAL
- PERSUASAO, ADAPTABILIDADE, LIDERANCA, CRIATIVIDADE

✓ **Categoria Consistente com Score**
- Alta Performance: 80-100
- Operacional: 60-79
- Essencial: 40-59
- Crítico: 0-39

✓ **Soma de Pesos = 1.0**
- Tolerância: ±0.01

✓ **Range Validation**
- Scores: 0-100
- Confiança: 0-1 (optional)

### Cobertura de Testes

- 45+ testes automáticos
- Coverage mínimo: 80%
- Integração com Jest + TypeScript

### Validação em Batch

- 27 alunos validados simultaneamente
- Relatório consolidado em JSON ou texto
- Exit code baseado em resultado

## 13. Próximos Passos

1. Executar `npm install` para instalar dependências
2. Executar `npm run validate` para validar dados atuais
3. Executar `npm test` para rodar testes
4. Adicionar pre-commit hook com `npx husky install`
5. Integrar com CI/CD pipeline

## Suporte

Para dúvidas sobre validação, consulte:
- `src/lib/zod-student.ts` - Lógica de validação
- `scripts/validate-all-students.js` - Script de batch
- `src/lib/__tests__/zod-student.test.ts` - Exemplos de teste
