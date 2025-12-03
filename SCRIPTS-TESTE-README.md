# Scripts de Teste - Feedbacks Supremos

Este diretório contém scripts automatizados para validação dos JSONs dos feedbacks supremos.

---

## Scripts Disponíveis

### 1. test-json-parsing.js
**Propósito:** Validação básica de parsing de JSONs.

**O que testa:**
- Presença das tags delimitadoras (`---DNA_GENIS_DASHBOARD_START---` e `---DNA_GENIS_DASHBOARD_END---`)
- Parse JSON válido
- Campos obrigatórios: `meta`, `resumo`, `pilares`, `indicadores`, `plano_acao`
- Estrutura dos 4 pilares (oratoria, interpessoal, intrapessoal, repertorio)

**Uso:**
```bash
node test-json-parsing.js
```

**Output esperado:**
```
================================================================================
TESTE DE PARSING - FEEDBACKS SUPREMOS
================================================================================

Total de arquivos: 21
✅ Sucesso: 21
❌ Falhas: 0
⚠️  Avisos: 0
```

---

### 2. test-zod-validation.js
**Propósito:** Validação de compatibilidade com schema Zod e campo "observacao".

**O que testa:**
- Tipos TypeScript esperados (string, number, null)
- Compatibilidade com schema Zod
- Presença do campo `observacao` em `pilares.repertorio`
- Validação de todos os campos obrigatórios
- Estatísticas do uso do campo `observacao`

**Uso:**
```bash
node test-zod-validation.js
```

**Output esperado:**
```
================================================================================
TESTE DE VALIDAÇÃO ZOD - FEEDBACKS SUPREMOS
================================================================================

Total: 21
✅ Sucesso: 21
❌ Falhas: 0

ESTATÍSTICAS DO CAMPO "observacao":
  Com observacao: 21
  Sem observacao: 0
```

---

### 3. extract-and-validate-jsons.js
**Propósito:** Extração de JSONs dos arquivos .md e conversão para arquivos individuais.

**O que faz:**
- Lê todos os arquivos .md em `data/feedbacks-supremos-011225/`
- Extrai o JSON entre as tags delimitadoras
- Valida o parse antes de salvar
- Formata o JSON com indentação
- Salva em `src/data/alunos/{aluno-id}.json`

**Uso:**
```bash
node extract-and-validate-jsons.js
```

**Output esperado:**
```
================================================================================
EXTRAÇÃO DE JSONs - FEEDBACKS SUPREMOS
================================================================================

Total: 21
✅ Sucesso: 21
❌ Falhas: 0

📁 Arquivos salvos em: src/data/alunos/
```

---

## Comandos npm

Para facilitar o uso, os scripts foram adicionados ao `package.json`:

### Executar todos os testes
```bash
npm run test:feedbacks
```

Executa:
1. `test-json-parsing.js`
2. `test-zod-validation.js`

### Extrair JSONs
```bash
npm run extract:feedbacks
```

Executa:
- `extract-and-validate-jsons.js`

---

## Workflow Recomendado

### Após atualizar feedbacks
```bash
# 1. Extrair novos JSONs
npm run extract:feedbacks

# 2. Validar todos os JSONs
npm run test:feedbacks

# 3. Build do projeto
npm run build

# 4. Deploy
npm run start
```

### Durante desenvolvimento
```bash
# Validar JSONs antes de commit
npm run test:feedbacks

# Se tudo passar, commitar
git add .
git commit -m "feat: atualiza feedbacks supremos"
```

---

## Estrutura de Diretórios

```
dashboard-dna-genis/
├── data/
│   └── feedbacks-supremos-011225/     # Arquivos .md originais
│       ├── bruno-monteiro_FEEDBACK-SUPREMO.md
│       ├── elias_FEEDBACK-SUPREMO.md
│       └── ...
├── src/
│   └── data/
│       └── alunos/                     # JSONs extraídos
│           ├── bruno-monteiro.json
│           ├── elias.json
│           └── ...
├── test-json-parsing.js
├── test-zod-validation.js
└── extract-and-validate-jsons.js
```

---

## Formato do JSON

### Tags Delimitadoras
```markdown
---DNA_GENIS_DASHBOARD_START---
{
  "meta": { ... },
  "resumo": { ... },
  "pilares": { ... },
  "indicadores": [ ... ],
  "plano_acao": { ... }
}
---DNA_GENIS_DASHBOARD_END---
```

### Campo "observacao" em Repertório
Quando o pilar repertório não é avaliável:

```json
"repertorio": {
  "score": null,
  "peso": 0.15,
  "categoria": "nao_avaliavel",
  "delta": null,
  "indicador_ancora": null,
  "indicador_gap": null,
  "observacao": "Nao avaliavel neste video - requer analise de conteudo mais extenso"
}
```

---

## Troubleshooting

### Erro: "Tags de JSON não encontradas"
- Verifique se o arquivo .md contém as tags `---DNA_GENIS_DASHBOARD_START---` e `---DNA_GENIS_DASHBOARD_END---`
- Certifique-se de que as tags estão exatamente como especificado (incluindo os hífens)

### Erro: "Erro ao fazer parse do JSON"
- Verifique se o JSON está válido usando um validador online
- Certifique-se de que não há vírgulas extras ou faltando
- Verifique se todos os valores string estão entre aspas

### Erro: "Campo obrigatório ausente"
- Verifique se todos os campos obrigatórios estão presentes
- Consulte o schema Zod em `src/lib/zod-student.ts` para a lista completa

### Aviso: "Campo observacao ausente no pilar repertorio"
- Adicione o campo `observacao` quando o pilar não for avaliável
- Exemplo: `"observacao": "Nao avaliavel neste video"`

---

## Adicionando Novos Feedbacks

1. **Crie o arquivo .md** em `data/feedbacks-supremos-011225/`
   - Nome: `{aluno-id}_FEEDBACK-SUPREMO.md`
   - Exemplo: `novo-aluno_FEEDBACK-SUPREMO.md`

2. **Adicione o JSON** entre as tags:
   ```markdown
   ---DNA_GENIS_DASHBOARD_START---
   {
     "meta": { ... },
     ...
   }
   ---DNA_GENIS_DASHBOARD_END---
   ```

3. **Extraia e valide:**
   ```bash
   npm run extract:feedbacks
   npm run test:feedbacks
   ```

4. **Build e teste:**
   ```bash
   npm run build
   npm run dev
   ```

---

## CI/CD Integration

### GitHub Actions (exemplo)
```yaml
name: Validate Feedbacks

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:feedbacks
      - run: npm run build
```

---

## Relatórios

- **Relatório Completo:** `TESTE-PARSING-FEEDBACKS-RELATORIO.md`
- **Sumário Executivo:** `SUMARIO-TESTES-FEEDBACKS.md`

---

Para dúvidas ou problemas, consulte a documentação completa em `TESTE-PARSING-FEEDBACKS-RELATORIO.md`.
