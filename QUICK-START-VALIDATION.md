# Quick Start - Validação DNA Genis

Guia rápido para começar com validação automatizada.

## 1. Instalação (5 minutos)

```bash
# Clonar/navegar até o projeto
cd feedbacks-supremos/dashboard-dna-genis

# Instalar dependências
npm install

# Inicializar husky
npx husky install
chmod +x .husky/pre-commit
```

## 2. Validar Dados Atuais (1 minuto)

```bash
# Validar todos os 27 alunos
npm run validate:students

# Esperado: Relatório com status de cada aluno
# Resultado: 27 alunos válidos OU X erros encontrados
```

## 3. Corrigir Erros Automaticamente (2 minutos)

Se houver erros detectados, corrigir automaticamente:

```bash
# Sem backup (rápido)
npm run fix:students

# Com backup (seguro)
npm run fix:students-backup

# Depois, validar novamente
npm run validate:students
```

## 4. Rodar Testes (3 minutos)

```bash
# Todos os testes
npm test

# Apenas testes de schema
npm test:schema

# Com coverage
npm test:coverage
```

## 5. Commitar Mudanças (1 minuto)

```bash
# O pre-commit hook roda automaticamente
git add src/data/alunos/
git commit -m "feat: dados de alunos atualizados"

# Hook valida automaticamente:
# ✓ Se válido → commit prossegue
# ✗ Se inválido → commit bloqueado
```

## Scripts Disponíveis

| Script | O que faz |
|--------|-----------|
| `npm run validate:students` | Valida 27 alunos |
| `npm run validate:schema` | Valida TypeScript |
| `npm run validate` | Ambas as validações |
| `npm run fix:students` | Auto-corrige categorias |
| `npm run fix:students-backup` | Auto-corrige com backup |
| `npm test` | Rodar testes |
| `npm test:schema` | Testes de schema |
| `npm test:coverage` | Coverage report |
| `npm test:watch` | Testes em watch mode |

## Fluxo Recomendado Diário

```bash
# 1. Validar
npm run validate:students

# 2. Se erros, corrigir
npm run fix:students

# 3. Rodar testes
npm test:schema

# 4. Commitar
git commit -am "feat: atualizar alunos"

# 5. Build + Deploy
npm run validate && npm run build && npm run start
```

## Entendendo os Erros

### Erro: "Core Indicators Ausentes"

Significa que faltam alguns dos 8 indicadores obrigatórios:
- FLUENCIA, DICCAO, MODULACAO_VOZ, LINGUAGEM_NAO_VERBAL
- PERSUASAO, ADAPTABILIDADE, LIDERANCA, CRIATIVIDADE

**Fix**: Adicionar indicadores faltantes ao arquivo JSON

### Erro: "Categoria não corresponde ao Score"

Score e categoria devem estar alinhados:
- Score 80-100 → "Alta Performance"
- Score 60-79 → "Operacional"
- Score 40-59 → "Essencial"
- Score 0-39 → "Crítico"

**Fix**: Rodar `npm run fix:students`

### Erro: "Soma de Pesos = X.XXX"

A soma dos pesos dos 4 pilares deve ser 1.0 (tolerância: ±0.01)

**Fix**: Ajustar valores dos pesos manualmente no JSON

### Erro: "Confiança fora do range"

Confiança deve estar entre 0-1 (pode ser omitido)

**Fix**: Corrigir valor ou remover campo

## Estrutura de Arquivos Criados

```
feedbacks-supremos/dashboard-dna-genis/
├── .husky/
│   └── pre-commit                          # Hook para validar antes de commit
├── scripts/
│   ├── validate-all-students.js            # Valida 27 alunos
│   └── auto-fix-students.js                # Corrige automaticamente
├── src/lib/
│   ├── zod-student.ts                      # Schema Zod (original)
│   └── __tests__/
│       └── zod-student.test.ts             # Test suite (45+ testes)
├── jest.config.js                          # Config Jest
├── jest.setup.js                           # Setup testes
├── .lintstagedrc.json                      # Config lint-staged
├── package.json                            # Scripts npm (atualizado)
├── TESTING-VALIDATION-SETUP.md             # Documentação completa
└── QUICK-START-VALIDATION.md               # Este arquivo
```

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Hook não roda | `chmod +x .husky/pre-commit` |
| Testes não rodam | `npm test -- --clearCache` |
| Zod import error | `npm install --save-dev zod` |
| Aluno específico falha | `DEBUG=1 npm run validate:students` |

## Próximos Passos

1. ✓ Validação instalada
2. ✓ Testes configurados
3. ✓ Pre-commit hooks ativados
4. ⏭ Integrar com CI/CD (GitHub Actions)
5. ⏭ Monitorar em produção

## Recursos

- Documentação Completa: `TESTING-VALIDATION-SETUP.md`
- Schema Zod: `src/lib/zod-student.ts`
- Testes: `src/lib/__tests__/zod-student.test.ts`
- Validação: `scripts/validate-all-students.js`
- Auto-fix: `scripts/auto-fix-students.js`

## Suporte

Dúvidas? Consulte:
- `TESTING-VALIDATION-SETUP.md` - Guia completo
- `npm test:schema` - Exemplos de teste
- `DEBUG=1 npm run validate:students` - Output detalhado

---

**Tempo estimado de setup: 10 minutos**
**Tempo estimado por validação: 1 segundo**
