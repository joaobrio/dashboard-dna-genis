# Exemplos de Fluxo de Validação - DNA Genis

Exemplos práticos de como usar o sistema de validação em cenários reais.

## Cenário 1: Primeiro Setup e Validação

### Situação
Acabou de clonar o projeto e precisa verificar se os dados estão OK.

### Passo a Passo

```bash
# 1. Navegar até o projeto
cd feedbacks-supremos/dashboard-dna-genis

# 2. Instalar dependências (primeira vez apenas)
npm install
# Output esperado:
# added X packages, audited Y packages in 2.34s

# 3. Inicializar pre-commit hooks
npx husky install
# Output esperado:
# husky - Git hooks installed

# 4. Tornar hook executável
chmod +x .husky/pre-commit

# 5. Validar dados atuais
npm run validate:students
# Output esperado:
# ================================================================================
# RELATÓRIO DE VALIDAÇÃO - TODOS OS ALUNOS
# ================================================================================
# Total de alunos: 27
# Alunos válidos: 1 ✓
# Alunos com erros: 26 ✗
```

### Resultado
Validação completa em ~1 segundo, 27 alunos analisados.

---

## Cenário 2: Corrigir Erros Automaticamente

### Situação
Validação mostrou 26 alunos com erro (categorias desatualizadas do formato legado).

### Passo a Passo

```bash
# 1. Executar auto-fix COM backup (recomendado)
npm run fix:students-backup
# Output esperado:
# Iniciando auto-fix de categorias...
# Backups serão salvos em: backup/2025-12-06
#
# angelica.json
#   Resumo: "adequado" → "Operacional"
#   Indicador 2: "DICCAO" (80) "forte" → "Alta Performance"
#   ... (múltiplas correções)
#   Salvo com 8 mudança(s)
#
# bruno-monteiro.json
#   ... (mais correções)
#
# ================================================================================
# RELATÓRIO DE AUTO-FIX
# ================================================================================
# Total de arquivos processados: 27
# Arquivos com mudanças: 24
# Total de categorias corrigidas: 68
# ================================================================================

# 2. Validar novamente para confirmar
npm run validate:students
# Output esperado:
# Total de alunos: 27
# Alunos válidos: 27 ✓
# Alunos com erros: 0 ✗
# Status final: ✓ TODAS AS VALIDAÇÕES PASSARAM

# 3. (Opcional) Revisar mudanças
git diff src/data/alunos/

# 4. Commitar com confiança
git add src/data/alunos/
git commit -m "fix: corrigir categorias de alunos para formato padrão"
# Output esperado:
# [main abc1234] fix: corrigir categorias de alunos para formato padrão
#  24 files changed, 68 insertions(+), 68 deletions(-)
```

### Resultado
24 alunos corrigidos automaticamente, 68 inconsistências resolvidas.

---

## Cenário 3: Adicionar Novo Aluno

### Situação
Precisa adicionar um novo aluno ao dashboard com dados iniciais.

### Passo a Passo

```bash
# 1. Criar arquivo JSON com novo aluno
cat > src/data/alunos/novo-aluno.json << 'EOF'
{
  "meta": {
    "versao": "1.0-supremo",
    "timestamp": "2025-12-06T14:30:00Z",
    "analise_id": "novo-001",
    "aluno_id": "novo-aluno"
  },
  "resumo": {
    "score_geral": 72,
    "score_autoconfianca": 70,
    "categoria_geral": "Operacional",
    "evolucao_percentual": null,
    "numero_analise": 1,
    "dias_desde_anterior": null
  },
  "pilares": {
    "oratoria": {
      "score": 75,
      "peso": 0.3,
      "categoria": "Operacional",
      "delta": null,
      "indicador_ancora": "FLUENCIA",
      "indicador_gap": null
    },
    "interpessoal": {
      "score": 70,
      "peso": 0.3,
      "categoria": "Operacional",
      "delta": null,
      "indicador_ancora": null,
      "indicador_gap": null
    },
    "intrapessoal": {
      "score": 72,
      "peso": 0.2,
      "categoria": "Operacional",
      "delta": null,
      "indicador_ancora": null,
      "indicador_gap": null
    },
    "repertorio": {
      "score": 70,
      "peso": 0.2,
      "categoria": "Operacional",
      "delta": null,
      "indicador_ancora": null,
      "indicador_gap": null
    }
  },
  "indicadores": [
    {
      "codigo": "FLUENCIA",
      "nome": "Fluência",
      "pilar": "oratoria",
      "score": 80,
      "categoria": "Alta Performance",
      "delta": null,
      "confianca": 0.9,
      "evidencias": ["Discurso fluido"],
      "timestamps": ["00:00"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    },
    {
      "codigo": "DICCAO",
      "nome": "Dicção",
      "pilar": "oratoria",
      "score": 78,
      "categoria": "Operacional",
      "delta": null,
      "confianca": 0.88,
      "evidencias": ["Pronúncia clara"],
      "timestamps": ["00:10"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    },
    {
      "codigo": "MODULACAO_VOZ",
      "nome": "Modulação de Voz",
      "pilar": "oratoria",
      "score": 75,
      "categoria": "Operacional",
      "delta": null,
      "confianca": 0.85,
      "evidencias": ["Variação tonal adequada"],
      "timestamps": ["00:20"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    },
    {
      "codigo": "LINGUAGEM_NAO_VERBAL",
      "nome": "Linguagem Não Verbal",
      "pilar": "interpessoal",
      "score": 70,
      "categoria": "Operacional",
      "delta": null,
      "confianca": 0.82,
      "evidencias": ["Gestos apropriados"],
      "timestamps": ["00:30"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    },
    {
      "codigo": "PERSUASAO",
      "nome": "Persuasão",
      "pilar": "interpessoal",
      "score": 68,
      "categoria": "Operacional",
      "delta": null,
      "confianca": 0.8,
      "evidencias": ["Argumentação clara"],
      "timestamps": ["00:40"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    },
    {
      "codigo": "ADAPTABILIDADE",
      "nome": "Adaptabilidade",
      "pilar": "interpessoal",
      "score": 65,
      "categoria": "Essencial",
      "delta": null,
      "confianca": 0.78,
      "evidencias": ["Flexibilidade demonstrada"],
      "timestamps": ["00:50"],
      "aula_recomendada": "Aula 5",
      "tecnica_recomendada": "Desenvolver",
      "prioridade_acao": 2
    },
    {
      "codigo": "LIDERANCA",
      "nome": "Liderança",
      "pilar": "intrapessoal",
      "score": 72,
      "categoria": "Operacional",
      "delta": null,
      "confianca": 0.85,
      "evidencias": ["Presença de liderança"],
      "timestamps": ["01:00"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    },
    {
      "codigo": "CRIATIVIDADE",
      "nome": "Criatividade",
      "pilar": "intrapessoal",
      "score": 72,
      "categoria": "Operacional",
      "delta": null,
      "confianca": 0.88,
      "evidencias": ["Ideias originais"],
      "timestamps": ["01:10"],
      "aula_recomendada": null,
      "tecnica_recomendada": "Manter",
      "prioridade_acao": null
    }
  ]
}
EOF

# 2. Validar o novo arquivo
npm run validate:students
# Output esperado:
# ✓ novo-aluno (novo-aluno.json)

# 3. Se houver erros, corrigir automaticamente
npm run fix:students

# 4. Rodar testes para garantir integridade
npm test:schema

# 5. Commitar
git add src/data/alunos/novo-aluno.json
git commit -m "feat: adicionar novo-aluno"
# Output esperado:
# ✓ Pre-commit hook valida
# [main def5678] feat: adicionar novo-aluno
#  1 file changed, 120 insertions(+)
```

### Resultado
Novo aluno adicionado e validado automaticamente, pronto para uso.

---

## Cenário 4: Modificar Dados de Aluno Existente

### Situação
Um aluno (João) teve sua análise atualizada com novo score.

### Passo a Passo

```bash
# 1. Editar arquivo (usando seu editor favorito)
vim src/data/alunos/joao.json
# Mudar score_geral de 72 para 75, por exemplo

# 2. Tentar commitar (isso vai disparar o hook)
git add src/data/alunos/joao.json
git commit -m "feat: atualizar análise de João"
# Output esperado:
# ✗ [ERROR] categoria_score_geral
#    Categoria geral "Operacional" não corresponde ao score 75.
#    Esperado: "Operacional"
#
# ✓ Commit bloqueado - há inconsistências

# 3. Deixar o script auto-fix fazer a correção
npm run fix:students
# Output esperado:
# joao.json
#   Resumo: "Operacional" → "Operacional" (sem mudança, já estava correto)

# 4. Retentar commit
git commit -m "feat: atualizar análise de João"
# Output esperado:
# ✓ Pre-commit hook passa
# [main ghi9012] feat: atualizar análise de João
#  1 file changed, 5 insertions(+)
```

### Resultado
Dados atualizados com validação automática. Sem inconsistências possíveis.

---

## Cenário 5: Rodar Testes Antes da Entrega

### Situação
Precisa garantir que tudo está OK antes de fazer deploy.

### Passo a Passo

```bash
# 1. Validar todos os dados
npm run validate:students
# Output:
# Total de alunos: 28 ✓
# Alunos válidos: 28 ✓
# Status: ✓ TODAS AS VALIDAÇÕES PASSARAM

# 2. Rodar test suite
npm test:schema
# Output:
# PASS  src/lib/__tests__/zod-student.test.ts
#  validarCategoriaVsScore
#    ✓ Alta Performance: score >= 80 (2ms)
#    ✓ Operacional: 60 <= score < 80 (1ms)
#    ... (40 mais testes)
#
# Test Suites: 1 passed, 1 total
# Tests:       45 passed, 45 total
# Snapshots:   0 total
# Time:        2.345s

# 3. Gerar coverage report
npm test:coverage
# Output:
# =============================== Coverage summary ================================
# Statements   : 85.2% ( 152/178 )
# Branches     : 82.1% ( 64/78 )
# Functions    : 88.5% ( 38/43 )
# Lines        : 86.7% ( 145/167 )
# ================================================================================

# 4. Validar schema TypeScript
npm run validate:schema
# Output:
# ✓ No errors

# 5. Build com confiança
npm run validate && npm run build
# Output:
# ✓ Validação passou
# ✓ Build completado
# > next build

# 6. Deploy
npm run start
```

### Resultado
100% de confiança na qualidade dos dados e código antes do deploy.

---

## Cenário 6: Investigar Erro Específico

### Situação
Um aluno está falhando na validação e você precisa entender por quê.

### Passo a Passo

```bash
# 1. Rodar validação com debug verbose
DEBUG=1 npm run validate:students | grep -A 20 "aluno-problema"
# Output:
# ✗ ALUNOS COM ERROS:
#
#   1. aluno-problema (problema.json)
#      ✗ [ERROR] core_indicators
#         Indicadores CORE ausentes: CRIATIVIDADE
#      ✗ [ERROR] categoria_score_indicador
#         Indicador "Fluencia" (FLUENCIA): categoria "adequado" não corresponde
#         ao score 60. Esperado: "Operacional"

# 2. Examinar o arquivo JSON
cat src/data/alunos/problema.json | jq '.indicadores[] | select(.codigo == "CRIATIVIDADE")'
# Output:
# null (indicador não existe)

# 3. Procurar por CRIATIVIDADE em todos os alunos
grep -r "CRIATIVIDADE" src/data/alunos/ | head -5
# Output:
# victora-clasen.json:"codigo": "CRIATIVIDADE",
# angelica.json:"codigo": "CRIATIVIDADE",
# ... (outros alunos têm)

# 4. Verificar estrutura do indicador CRIATIVIDADE
cat src/data/alunos/victoria-clasen.json | jq '.indicadores[] | select(.codigo == "CRIATIVIDADE")'
# Output:
# {
#   "codigo": "CRIATIVIDADE",
#   "nome": "Criatividade",
#   "score": 75,
#   "categoria": "Operacional",
#   ... outros campos
# }

# 5. Copiar estrutura para o aluno problemático
# Editar src/data/alunos/problema.json e adicionar o indicador faltante

# 6. Validar de novo
npm run validate:students | grep "problema"
# Output:
# ✓ problema-aluno (problema.json)
```

### Resultado
Problema identificado e corrigido com confiança.

---

## Cenário 7: Monitoramento Contínuo em CI/CD

### Situação
Pipeline automático no GitHub Actions valida dados em cada push.

### Arquivo: `.github/workflows/validate.yml`

```yaml
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

### Comportamento Esperado

```
✓ Push para main
  ├─ npm run validate:students ✓ Passed
  ├─ npm test:schema ✓ 45/45 testes passaram
  ├─ npm run build ✓ Build completado
  └─ ✓ Deploy automático iniciado

✗ PR com dados inválidos
  ├─ npm run validate:students ✗ 2 erros encontrados
  └─ ✗ Build bloqueado - PR não pode ser mergeado
```

### Resultado
Proteção automática contra dados inválidos em production.

---

## Dicas e Boas Práticas

### ✓ Fazer
```bash
# Sempre validar antes de commitar
npm run validate:students

# Auto-fix com backup em mudanças importantes
npm run fix:students-backup

# Revisar mudanças antes de commitar
git diff src/data/alunos/

# Rodar testes regularmente
npm test:schema
```

### ✗ Evitar
```bash
# Não force commit com erros
git commit --no-verify  # Evite!

# Não edite JSON sem validação
vim src/data/alunos/aluno.json  # Sempre validar depois!

# Não delete arquivo sem backup
rm src/data/alunos/aluno.json  # Sempre fazer backup!
```

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| Commit bloqueado | `npm run validate:students` para ver erro |
| Aluno com score 75 mas categoria "Essencial" | `npm run fix:students` |
| Falta um core indicator | Adicionar manualmente ou copiar de outro aluno |
| Hook não dispara | `chmod +x .husky/pre-commit` |
| Teste falhando | `npm test -- --clearCache` |

## Próximas Operações

```bash
# Após completar setup
npm run validate

# Monitorar continuamente
npm test:watch

# Antes de deploy
npm run validate && npm test:coverage && npm run build
```

---

**Dicas**: Use os exemplos acima como template para seus próprios fluxos de trabalho!
