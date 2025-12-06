# Plano de Ação - Garantir 100% de Consistência de Dados

**Projeto**: Dashboard DNA Genis
**Data**: 06/12/2025
**Responsável**: Time de Dados + Análise

---

## Situação Atual

### Números
- **Total de alunos**: 27
- **✅ Compliant (13 indicadores)**: 15 alunos (55.6%)
- **⚠️ Needs re-analysis**: 12 alunos (44.4%)

### Indicadores Mais Faltantes
1. **AUTOCONFIANCA**: falta em 11 alunos (92%)
2. **REPERTORIO_GERAL**: falta em 11 alunos (92%)
3. **STORYTELLING**: falta em 11 alunos (92%)
4. **RITMO**: falta em 10 alunos (83%)
5. **CRIATIVIDADE**: falta em 7 alunos (58%)

### Indicadores "Extras" (não-padrão)
- ASSERTIVIDADE (8 alunos)
- MARKETING_PESSOAL (7 alunos)
- GRAMATICA (4 alunos)
- PRESENCA_FISICA (3 alunos)
- VOCABULARIO (2 alunos)

---

## Decisões Arquiteturais

### Opção 1: Manter Flexibilidade (RECOMENDADO)
**Abordagem**: Aceitar que alguns alunos têm análises customizadas

**Prós**:
- ✅ Reflete realidade (alguns vídeos não permitem avaliar todos os 13)
- ✅ Indicadores extras podem ser insights valiosos
- ✅ Menos trabalho de re-análise

**Cons**:
- ⚠️ Dashboards visualmente diferentes
- ⚠️ Métricas consolidadas mais complexas

**Implementação**:
1. Atualizar schema para aceitar 5-13 indicadores
2. UI adapta-se dinamicamente ao número de indicadores
3. Métricas consolidadas usam apenas indicadores comuns
4. Badge no dashboard: "10/13 indicadores" ou "Análise Customizada"

### Opção 2: Forçar Padronização Total
**Abordagem**: Re-analisar todos para ter exatos 13 indicadores

**Prós**:
- ✅ 100% consistente
- ✅ Comparações diretas entre alunos
- ✅ UI simplificada

**Cons**:
- ❌ Muito trabalho de re-análise (12 alunos × 30-45 min = 6-9 horas)
- ❌ Pode forçar avaliações sem evidência suficiente
- ❌ Perde indicadores extras valiosos

**Implementação**:
1. Re-analisar 12 alunos
2. Remover indicadores extras
3. Adicionar indicadores faltantes
4. Validar com schema strict

### Opção 3: Híbrida (NOSSA RECOMENDAÇÃO)
**Abordagem**: Core de 8 indicadores obrigatórios + 5 flexíveis

**Core Obrigatórios** (presente em 90%+ dos alunos):
1. FLUENCIA
2. DICCAO
3. MODULACAO_VOZ
4. LINGUAGEM_NAO_VERBAL
5. PERSUASAO
6. ADAPTABILIDADE
7. LIDERANCA
8. CRIATIVIDADE

**Flexíveis** (5 de 8 opcionais):
- RITMO
- DIDATICA
- AUTOCONFIANCA
- REPERTORIO_GERAL
- STORYTELLING
- ASSERTIVIDADE (extra)
- MARKETING_PESSOAL (extra)
- GRAMATICA (extra)

**Prós**:
- ✅ Balança consistência + flexibilidade
- ✅ Trabalho moderado de ajuste
- ✅ UI pode ter seção "Core" + "Extras"

**Implementação**:
1. Garantir 8 core em todos
2. Permitir variação nos 5 flexíveis
3. UI mostra "Core: 8/8 ✅" + "Adicionais: 5"

---

## Plano de Ação (Opção 3 - Híbrida)

### Fase 1: Schema Update (1-2 horas)
🤖 **Agent**: `backend-development:backend-architect`
```
Prompt sugerido:
"Implementar Enhanced Zod Schema híbrido para Dashboard DNA Genis com:
- 8 indicadores core obrigatórios
- 5-8 indicadores flexíveis opcionais
- Business rules: categoria vs score matching, pesos somam 1.0
- Range validation: scores 0-100
Projeto: /Users/joaorovere/github-local/segundo-cerebro-brio/feedbacks-supremos/dashboard-dna-genis
Arquivo principal: /src/lib/zod-student.ts"
```

```typescript
// /src/lib/zod-student-v2.ts
const CORE_INDICATORS = [
  'FLUENCIA', 'DICCAO', 'MODULACAO_VOZ', 'LINGUAGEM_NAO_VERBAL',
  'PERSUASAO', 'ADAPTABILIDADE', 'LIDERANCA', 'CRIATIVIDADE'
];

const OPTIONAL_INDICATORS = [
  'RITMO', 'DIDATICA', 'AUTOCONFIANCA',
  'REPERTORIO_GERAL', 'STORYTELLING',
  'ASSERTIVIDADE', 'MARKETING_PESSOAL', 'GRAMATICA'
];

export const hybridSchema = z.object({
  // ... other fields
  indicadores: z.array(IndicatorSchema)
    .min(8)  // Core mínimo
    .max(16)  // Core + flexíveis
    .refine(
      (indicators) => {
        const codes = indicators.map(i => i.codigo);
        const hasCoreCount = CORE_INDICATORS.filter(c => codes.includes(c)).length;
        return hasCoreCount >= 8;
      },
      { message: "Deve ter pelo menos os 8 indicadores core" }
    )
});
```

### Fase 2: Re-análise Focada (2-4 horas)
📋 **Tarefa Manual** - Requer análise humana dos vídeos
⚠️ Não há agent para esta fase - trabalho de analista

**Prioridade Alta (faltam core)**:
- gabriel-creator (falta 4 core)
- gabriel-ferreira (falta 5 core)
- lucas-appel (falta 4 core)
- marco-birck (falta 4 core)

**Prioridade Média (faltam 1-2 core)**:
- bruno-monteiro
- elias
- maite-balensiefer

**Prioridade Baixa (têm core, faltam opcionais)**:
- Resto dos alunos → manter como está

### Fase 3: UI Adaptation (2-3 horas)
🤖 **Agent**: `nextjs-vercel-pro:frontend-developer`
```
Prompt sugerido:
"Criar componentes UI para Dashboard DNA Genis:
1. IndicatorBadge - exibe 'Core: 8/8 ✅' + 'Total: 13 indicadores'
2. ComplianceStatus - badge visual verde/amarelo/vermelho
3. Adaptar dashboard para exibir indicadores core separados dos extras
Projeto: /Users/joaorovere/github-local/segundo-cerebro-brio/feedbacks-supremos/dashboard-dna-genis"
```

```typescript
// /src/components/dashboard/IndicatorBadge.tsx
export function IndicatorBadge({ indicadores }: Props) {
  const coreCount = indicadores.filter(i =>
    CORE_INDICATORS.includes(i.codigo)
  ).length;

  const totalCount = indicadores.length;

  return (
    <div className="flex gap-2">
      <Badge variant={coreCount === 8 ? 'success' : 'warning'}>
        Core: {coreCount}/8
      </Badge>
      <Badge variant="neutral">
        Total: {totalCount} indicadores
      </Badge>
    </div>
  );
}
```

### Fase 4: Documentação + Testes (2 horas)
🤖 **Agent**: `codebase-cleanup:test-automator`
```
Prompt sugerido:
"Configurar validação automatizada para Dashboard DNA Genis:
1. Pre-commit hook que valida dados de alunos
2. Test suite para schema validation
3. CI/CD básico com GitHub Actions
Projeto: /Users/joaorovere/github-local/segundo-cerebro-brio/feedbacks-supremos/dashboard-dna-genis"
```

🤖 **Agent** (opcional): `comprehensive-review:architect-review`
```
Prompt sugerido:
"Criar ADR (Architecture Decision Record) documentando:
- Decisão de usar abordagem híbrida (8 core + 5 flex)
- Trade-offs considerados
- Implicações para UI e métricas
Projeto: /Users/joaorovere/github-local/segundo-cerebro-brio/feedbacks-supremos/dashboard-dna-genis"
```

Atualizar:
- Schema documentation
- ADR explaining the hybrid approach
- Data quality standards
- Re-analysis guidelines

---

## Timeline com Agents

### Semana 1 (Esta Semana)
**Dia 1-2**:
- [ ] Decidir entre Opção 1, 2 ou 3 (reunião 30 min)
- [ ] 🤖 `backend-development:backend-architect` → Schema update (1-2h)
- [ ] 🤖 `codebase-cleanup:test-automator` → Validation script (1h)

**Dia 3-4**:
- [ ] 📋 **Manual** → Re-analisar alunos prioridade alta (2-4h)
- [ ] Validar novos dados (30 min)
- [ ] Push para produção (1h)

**Dia 5**:
- [ ] 🤖 `nextjs-vercel-pro:frontend-developer` → Adaptar UI para badges (2-3h)
- [ ] Testes em staging (1h)
- [ ] Deploy para produção (30 min)

### Semana 2
- [ ] 📋 **Manual** → Re-analisar prioridade média (opcional)
- [ ] 🤖 `codebase-cleanup:test-automator` → Test suite completa (4h)
- [ ] Monitorar feedback de usuários
- [ ] Ajustes finos

---

## Ordem de Execução dos Agents

```
┌─────────────────────────────────────────────────────────────────┐
│  SEQUÊNCIA DE AGENTS - IMPLEMENTAÇÃO HÍBRIDA                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ backend-development:backend-architect                      │
│     └── Enhanced Zod Schema (1-2h)                             │
│         ↓                                                       │
│  2️⃣ codebase-cleanup:test-automator                            │
│     └── Pre-commit hook + validação (1h)                       │
│         ↓                                                       │
│  📋 MANUAL: Re-análise de vídeos (2-4h)                        │
│         ↓                                                       │
│  3️⃣ nextjs-vercel-pro:frontend-developer                       │
│     └── UI Badges + Adaptation (2-3h)                          │
│         ↓                                                       │
│  4️⃣ codebase-cleanup:test-automator                            │
│     └── Test suite completa + CI/CD (4h)                       │
│         ↓                                                       │
│  5️⃣ comprehensive-review:architect-review (opcional)           │
│     └── ADRs e documentação (2h)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Lista de Re-análise

### 🔴 Prioridade Alta (4 alunos)
Ação: Re-análise completa necessária

1. **gabriel-creator**
   - Tem: 5 indicadores
   - Faltam core: DICCAO, LINGUAGEM_NAO_VERBAL, PERSUASAO, ADAPTABILIDADE, CRIATIVIDADE
   - Tempo estimado: 45 min

2. **gabriel-ferreira**
   - Tem: 5 indicadores
   - Faltam core: FLUENCIA, DICCAO, MODULACAO_VOZ, PERSUASAO, CRIATIVIDADE
   - Tempo estimado: 45 min

3. **lucas-appel**
   - Tem: 7 indicadores
   - Faltam core: DICCAO, MODULACAO_VOZ, PERSUASAO, ADAPTABILIDADE, CRIATIVIDADE
   - Tempo estimado: 30 min

4. **marco-birck**
   - Tem: 8 indicadores (mas muitos extras não-padrão)
   - Faltam core: DICCAO, MODULACAO_VOZ, PERSUASAO, ADAPTABILIDADE, LIDERANCA, CRIATIVIDADE
   - Tempo estimado: 45 min

**Total Prioridade Alta**: 2h 45min

### 🟡 Prioridade Média (3 alunos)
Ação: Análise complementar

1. **bruno-monteiro** - falta PERSUASAO
2. **elias** - falta MODULACAO_VOZ, ADAPTABILIDADE
3. **maite-balensiefer** - falta DICCAO, MODULACAO_VOZ, PERSUASAO

**Total Prioridade Média**: 1h 30min

### 🟢 Prioridade Baixa (5 alunos)
Ação: Manter como está (têm core completo ou quase)

1. angelica
2. jefferson
3. joao
4. kobi
5. marina-rocha

---

## Métricas de Sucesso

### Antes
- Core compliance: ~60%
- Indicadores por aluno: 5-13 (range: 8)
- Dashboards inconsistentes: 44%

### Depois (Meta)
- Core compliance: 100%
- Indicadores por aluno: 8-16 (range: 8, mas todos têm base)
- Dashboards consistentes: 100% (mesmo que com diferentes "extras")

---

## Scripts de Apoio

### Validar Core Indicators
```bash
npm run validate:core
```

### Gerar Lista de Re-análise
```bash
npm run report:reanalysis-needed
```

### Verificar Compliance
```bash
npm run check:compliance
```

---

## Decisão Final

**Data da decisão**: _________
**Opção escolhida**: [ ] 1 - Flexibilidade  [ ] 2 - Padronização  [ ] 3 - Híbrida

**Justificativa**:
_______________________________________________________________
_______________________________________________________________

**Aprovado por**:
- [ ] Product Owner
- [ ] Tech Lead
- [ ] Data Quality Lead

---

## Anexos

- `/reports/indicator-consistency-report.json` - Relatório completo
- `/AUDITORIA-ARQUITETURA-DADOS.md` - Análise técnica detalhada
- `/RESUMO-AUDITORIA.md` - Resumo executivo

**Versão**: 1.0
**Última atualização**: 06/12/2025
