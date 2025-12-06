# Referência Rápida - Comandos de Validação

Cheat sheet com todos os comandos disponíveis e o que fazem.

## Validação

```bash
# Validar 27 alunos
npm run validate:students

# Com debug verbose
DEBUG=1 npm run validate:students

# Validar schema TypeScript
npm run validate:schema

# Ambas as validações
npm run validate
```

### Output Esperado

```
✓ Válido (verde)
  Total de alunos: 27
  Alunos válidos: 27 ✓
  Alunos com erros: 0 ✗
  Status: ✓ TODAS AS VALIDAÇÕES PASSARAM

✗ Inválido (vermelho)
  Total de alunos: 27
  Alunos válidos: 26 ✓
  Alunos com erros: 1 ✗
  Status: ✗ EXISTEM ERROS
```

## Correção Automática

```bash
# Corrigir sem backup (rápido)
npm run fix:students

# Corrigir com backup (seguro)
npm run fix:students-backup
```

### O que é corrigido

- ✓ Categorias desatualizadas (formato legado → novo)
- ✓ Categoria geral que não corresponde ao score
- ✓ Categorias de indicadores inconsistentes
- ✓ Categorias de pilares inconsistentes

### O que NÃO é corrigido

- ✗ Core indicators ausentes (adicionar manualmente)
- ✗ Soma de pesos diferente de 1.0 (ajustar manualmente)
- ✗ Scores fora do range 0-100 (revisar manualmente)

## Testes

```bash
# Rodar todos os testes
npm test

# Apenas testes de schema
npm test:schema

# Watch mode (rerun on save)
npm test:watch

# Coverage report
npm test:coverage

# Testes específicos
npm test -- zod-student.test.ts
npm test -- --testNamePattern="validarCategoriaVsScore"
```

### Test Statistics

- Total de testes: 45+
- Coverage: 80%+
- Tempo: ~2-3 segundos
- Grupos: 12+ describe blocks

## Fluxo de Trabalho

### Diário
```bash
# 1. Validar
npm run validate:students

# 2. Se erros, corrigir
npm run fix:students

# 3. Commitar
git add src/data/alunos/
git commit -m "feat: atualizar alunos"
```

### Desenvolvimento
```bash
# 1. Testes em watch mode
npm test:watch

# 2. Editar schema
vim src/lib/zod-student.ts

# 3. Validar tipos
npm run validate:schema

# 4. Validar dados
npm run validate:students

# 5. Build
npm run build
```

### Pre-commit (Automático)
```bash
# Executado automaticamente
# - Valida JSON de alunos
# - Valida TypeScript
# - Bloqueia commit se falhar
```

## Estrutura de Dados

### Indicador Core Obrigatório
```json
{
  "codigo": "FLUENCIA",
  "nome": "Fluência",
  "pilar": "oratoria",
  "score": 75,
  "categoria": "Operacional",
  "confianca": 0.85,
  "evidencias": ["..."],
  "timestamps": ["00:00"],
  "aula_recomendada": "Aula 3",
  "tecnica_recomendada": "Pausa Estratégica",
  "prioridade_acao": 1
}
```

### Validações por Campo

| Campo | Validação | Exemplo |
|-------|-----------|---------|
| score | 0-100 | `"score": 75` |
| categoria | 4 opções | `"categoria": "Operacional"` |
| confianca | 0-1 (opcional) | `"confianca": 0.85` |
| peso (pilar) | 0-1 | `"peso": 0.3` |
| soma pesos | = 1.0 ± 0.01 | 0.3 + 0.3 + 0.2 + 0.2 = 1.0 |

### Categorias Válidas

| Categoria | Score | Exemplos |
|-----------|-------|----------|
| Alta Performance | 80-100 | 80, 95, 100 |
| Operacional | 60-79 | 60, 70, 79 |
| Essencial | 40-59 | 40, 50, 59 |
| Crítico | 0-39 | 0, 20, 39 |

## Troubleshooting

### Erro: "Core Indicators Ausentes"
```bash
# Problema: Aluno não tem todos os 8 core indicators
# Solução: Adicionar indicador faltante ao JSON
# Verificar: npm test -- --testNamePattern="checkCoreIndicators"
```

### Erro: "Categoria não corresponde ao Score"
```bash
# Problema: Score 75 mas categoria "Crítico"
# Solução: npm run fix:students
# Ou editar manualmente: categoria deve ser "Operacional"
```

### Erro: "Soma de Pesos Incorreta"
```bash
# Problema: 0.3 + 0.3 + 0.2 + 0.1 = 0.9 (esperado 1.0)
# Solução: Ajustar valores manualmente
# Exemplo: mudar último peso de 0.1 para 0.2
```

### Erro: "Confiança fora do range"
```bash
# Problema: confianca: 1.5 (maior que 1)
# Solução:
# - Remover campo (se opcional)
# - Ou corrigir para valor entre 0-1
```

### Hook não dispara
```bash
# Problema: Pre-commit não valida
# Solução:
npx husky install
chmod +x .husky/pre-commit
git config core.hooksPath
# Deve mostrar: .husky
```

## Arquivos Principais

| Arquivo | Propósito | Editar? |
|---------|-----------|---------|
| `package.json` | Scripts npm | Não (já atualizado) |
| `jest.config.js` | Config Jest | Não (pronto) |
| `.husky/pre-commit` | Hook git | Não (pronto) |
| `scripts/validate-all-students.js` | Validação batch | Não (pronto) |
| `scripts/auto-fix-students.js` | Auto-fix | Não (pronto) |
| `src/lib/zod-student.ts` | Schema (original) | Sim, se precisar |
| `src/lib/__tests__/zod-student.test.ts` | Tests | Sim, expandir |
| `src/data/alunos/*.json` | Dados alunos | Sim, regularmente |

## Documentação

| Arquivo | Tipo | Tamanho |
|---------|------|--------|
| `TESTING-VALIDATION-SETUP.md` | Completo | 3500+ palavras |
| `QUICK-START-VALIDATION.md` | Rápido | 500 palavras |
| `VALIDATION-SETUP-SUMMARY.md` | Sumário | 1000 palavras |
| `EXAMPLES-VALIDATION-WORKFLOW.md` | Exemplos | 2000 palavras |
| `REFERENCE-VALIDATION-COMMANDS.md` | Este arquivo | 500 palavras |

## Scripts Bash Úteis

### Validar e corrigir tudo
```bash
npm run validate:students && npm run fix:students && npm run validate:students
```

### Compilar tudo
```bash
npm run validate && npm test && npm run build
```

### Revisar mudanças antes de commitar
```bash
git diff src/data/alunos/
```

### Ver alunos com erro
```bash
DEBUG=1 npm run validate:students | grep "✗"
```

### Backup de todos os dados
```bash
cp -r src/data/alunos backup/alunos-$(date +%Y-%m-%d)
```

### Listar todos os core indicators usados
```bash
grep -h '"codigo"' src/data/alunos/*.json | sort | uniq -c
```

## Exit Codes

```bash
# Sucesso (0)
npm run validate:students
echo $?  # → 0

# Erro (1)
npm run validate:students  # com problemas
echo $?  # → 1

# Útil para CI/CD
npm run validate:students || exit 1
```

## Performance

| Operação | Tempo | Alunos |
|----------|-------|--------|
| Validação | ~1s | 27 |
| Auto-fix | ~2s | 27 |
| Testes | ~3s | 45+ |
| Build | ~5s | - |

## Dicas Finais

### ✓ Recomendado
- Sempre validar antes de commitar
- Usar `fix:students-backup` em mudanças importantes
- Rodar testes antes de deploy
- Revisar `git diff` antes de commitar

### ✗ Evitar
- `git commit --no-verify` (pula validação)
- Editar JSON manualmente sem validar
- Deixar hooks desativados
- Ignorar erros de validação

## Contact & Support

Se houver dúvidas:
1. Ler `TESTING-VALIDATION-SETUP.md`
2. Consultar exemplos em `EXAMPLES-VALIDATION-WORKFLOW.md`
3. Rodar testes para entender a lógica
4. Verificar output com `DEBUG=1`

---

**Versão**: 1.0
**Última atualização**: 2025-12-06
**Status**: Pronto para uso
