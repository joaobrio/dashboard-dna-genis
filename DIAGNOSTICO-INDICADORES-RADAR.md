# DIAGNOSTICO COMPLETO: PROBLEMA DOS INDICADORES NO GRAFICO RADAR

**Data:** 02/12/2025
**Dashboard:** DNA Genis - Feedback Supremo
**Problema Reportado:** Grafico radar mostrando apenas 9 indicadores ao inves de 19

---

## 1. SUMARIO EXECUTIVO

### Problema Identificado
O grafico radar "Mapa de Competencias" esta exibindo apenas 9 indicadores porque **os dados JSON nao contem todos os 19 indicadores do framework DNA Genis 3.0**.

### Causa Raiz
**O PROBLEMA ESTA NOS DADOS, NAO NO CODIGO.**

- **Todos os 21 feedbacks** tem indicadores faltantes
- **Nenhum feedback** possui os 19 indicadores completos
- Media de indicadores por feedback: **10.9 de 19** (57% de completude)
- Indicadores mais ausentes: **Todo o pilar REPERTORIO (6 indicadores) + ESCUTATORIA**

### Impacto
- Dashboard funciona corretamente, mas mostra apenas os indicadores presentes nos JSONs
- Visualizacao incompleta do perfil do aluno
- Impossivel comparar todos os 19 indicadores entre alunos

---

## 2. FRAMEWORK DNA GENIS 3.0 - INDICADORES OFICIAIS

### Total: 19 Indicadores distribuidos em 4 Pilares

#### ORATORIA (7 indicadores)
1. FLUENCIA
2. LINGUAGEM_NAO_VERBAL
3. MODULACAO_VOZ
4. DICCAO
5. ASSERTIVIDADE
6. VOCABULARIO
7. GRAMATICA

#### INTERPESSOAL (5 indicadores)
8. ESCUTATORIA
9. PERSUASAO
10. MARKETING_PESSOAL
11. DIDATICA
12. ADAPTABILIDADE

#### INTRAPESSOAL (2 indicadores)
13. CRIATIVIDADE
14. LIDERANCA

#### REPERTORIO (5 indicadores)
15. VARIEDADE_CONHECIMENTO
16. CONEXAO_IDEIAS
17. ATUALIZACAO
18. CULTURA_GERAL
19. APLICACAO_REPERTORIO

---

## 3. ANALISE DOS DADOS - 21 ALUNOS

### Estatisticas Gerais

| Metrica | Valor |
|---------|-------|
| Total de feedbacks analisados | 21 |
| Media de indicadores por feedback | 10.9 |
| Minimo de indicadores | 5 |
| Maximo de indicadores | 13 |
| Feedbacks com todos os 19 indicadores | 0 |
| Feedbacks com menos de 19 indicadores | 21 |

### Contagem de Indicadores por Aluno

| Aluno | Total | Faltantes | Score Geral | Status |
|-------|-------|-----------|-------------|--------|
| enio-prado | 13 | 6 | 58.0 | Melhor grupo |
| guilherme-lorenzatto | 13 | 6 | 74.0 | Melhor grupo |
| guilherme | 13 | 6 | 54.0 | Melhor grupo |
| joao-eduardo | 13 | 6 | 62.0 | Melhor grupo |
| matheus-kobielski | 13 | 6 | 76.2 | Melhor grupo |
| mauricio-ramos-dutra | 13 | 6 | 68.5 | Melhor grupo |
| paulo-ricardo | 13 | 6 | 65.8 | Melhor grupo |
| pedro-werlang | 13 | 6 | 79.8 | Melhor grupo |
| ricardo-petri | 13 | 6 | 58.0 | Melhor grupo |
| theo-fogaca | 13 | 6 | 74.8 | Melhor grupo |
| victoria-clasen | 13 | 6 | 68.0 | Melhor grupo |
| vitor-sim | 13 | 6 | 62.0 | Melhor grupo |
| willian | 13 | 6 | 64.0 | Melhor grupo |
| marina-rocha | 10 | 11 | 72.8 | Grupo intermediario |
| bruno-monteiro | 8 | 11 | 52.3 | Grupo com gaps |
| elias-carvalho | 8 | 11 | 68.5 | Grupo com gaps |
| maite-balensiefer | 8 | 11 | 71.5 | Grupo com gaps |
| marco-birck | 8 | 15 | 69.8 | Critico |
| lucas-harth | 7 | 13 | 68.2 | Critico |
| gabriel-creator | 5 | 14 | 76.5 | Critico |
| gabriel-ferreira | 5 | 14 | 64.8 | Critico |

### Indicadores Mais Ausentes (Top 10)

| Indicador | Presente em | Ausente em | % Ausencia |
|-----------|-------------|------------|------------|
| ESCUTATORIA | 0/21 | 21 | 100% |
| VARIEDADE_CONHECIMENTO | 0/21 | 21 | 100% |
| CONEXAO_IDEIAS | 0/21 | 21 | 100% |
| ATUALIZACAO | 0/21 | 21 | 100% |
| CULTURA_GERAL | 0/21 | 21 | 100% |
| APLICACAO_REPERTORIO | 0/21 | 21 | 100% |
| VOCABULARIO | 14/21 | 7 | 33% |
| GRAMATICA | 14/21 | 7 | 33% |
| DICCAO | 15/21 | 6 | 29% |
| PERSUASAO | 15/21 | 6 | 29% |

---

## 4. ANALISE DO CODIGO

### Componente do Grafico Radar

**Arquivo:** `/src/components/dashboard/DashboardShell.tsx`

**Linhas 17-22:**
```typescript
const radarData = data.indicadores.map((ind) => ({
  subject: ind.nome,
  score: ind.score,
  fullMark: 100,
}));
```

**Analise:**
- O codigo esta CORRETO
- Ele mapeia TODOS os indicadores presentes no array `data.indicadores`
- Nao ha filtro ou limitacao no codigo
- Se o JSON tiver 5 indicadores, o radar mostra 5
- Se o JSON tiver 19 indicadores, o radar mostrara 19

**Conclusao:** O componente funciona perfeitamente. O problema esta nos dados de entrada.

---

## 5. PADROES IDENTIFICADOS

### Padrao 1: Pilar REPERTORIO Completamente Ausente
- **TODOS os 21 feedbacks** nao possuem NENHUM dos 5 indicadores do pilar REPERTORIO
- Motivo provavel: Videos curtos (25s a 4min) nao permitem avaliacao de repertorio cultural

### Padrao 2: ESCUTATORIA Sempre Ausente
- **TODOS os 21 feedbacks** sao monologo/apresentacao pessoal
- ESCUTATORIA requer contexto de dialogo/conversa
- Impossivel avaliar em formato de apresentacao unilateral

### Padrao 3: Variacoes no Pilar ORATORIA
- 13 alunos tem os 7 indicadores de ORATORIA completos
- 8 alunos tem gaps em VOCABULARIO, GRAMATICA ou DICCAO
- Parece depender da profundidade da analise individual

### Padrao 4: Variacoes no Pilar INTERPESSOAL
- Maioria tem PERSUASAO, MARKETING_PESSOAL, DIDATICA, ADAPTABILIDADE
- ESCUTATORIA sempre ausente (contexto nao permite)
- Gap de 1 indicador em geral

---

## 6. DETALHAMENTO: INDICADORES FALTANTES POR ALUNO

### Grupo 1: Feedbacks "Completos" (13 indicadores - faltam 6)

**Padrao:** ESCUTATORIA + todo o pilar REPERTORIO (6 indicadores)

**Alunos:**
- enio-prado
- guilherme-lorenzatto
- guilherme
- joao-eduardo
- matheus-kobielski
- mauricio-ramos-dutra
- paulo-ricardo
- pedro-werlang
- ricardo-petri
- theo-fogaca
- victoria-clasen
- vitor-sim
- willian

### Grupo 2: Feedbacks com Gaps Adicionais

**marina-rocha (10 indicadores - faltam 11):**
- ORATORIA: DICCAO, ASSERTIVIDADE, VOCABULARIO, GRAMATICA
- INTERPESSOAL: ESCUTATORIA
- INTRAPESSOAL: CRIATIVIDADE
- REPERTORIO: Todos (5)

**bruno-monteiro (8 indicadores - faltam 11):**
- ORATORIA: VOCABULARIO, GRAMATICA
- INTERPESSOAL: ESCUTATORIA, PERSUASAO, MARKETING_PESSOAL, DIDATICA
- REPERTORIO: Todos (5)

**elias-carvalho (8 indicadores - faltam 11):**
- ORATORIA: MODULACAO_VOZ, ASSERTIVIDADE, VOCABULARIO
- INTERPESSOAL: ESCUTATORIA, MARKETING_PESSOAL, ADAPTABILIDADE
- REPERTORIO: Todos (5)

**maite-balensiefer (8 indicadores - faltam 11):**
- ORATORIA: MODULACAO_VOZ, DICCAO, VOCABULARIO, GRAMATICA
- INTERPESSOAL: ESCUTATORIA, PERSUASAO
- REPERTORIO: Todos (5)

**marco-birck (8 indicadores - faltam 15):**
- ORATORIA: MODULACAO_VOZ, DICCAO, VOCABULARIO, GRAMATICA
- INTERPESSOAL: ESCUTATORIA, PERSUASAO, DIDATICA, ADAPTABILIDADE
- INTRAPESSOAL: CRIATIVIDADE, LIDERANCA
- REPERTORIO: Todos (5)

**lucas-harth (7 indicadores - faltam 13):**
- ORATORIA: MODULACAO_VOZ, DICCAO, ASSERTIVIDADE, GRAMATICA
- INTERPESSOAL: ESCUTATORIA, PERSUASAO, ADAPTABILIDADE
- INTRAPESSOAL: CRIATIVIDADE
- REPERTORIO: Todos (5)

**gabriel-creator (5 indicadores - faltam 14):**
- ORATORIA: LINGUAGEM_NAO_VERBAL, DICCAO, ASSERTIVIDADE, VOCABULARIO, GRAMATICA
- INTERPESSOAL: ESCUTATORIA, PERSUASAO, ADAPTABILIDADE
- INTRAPESSOAL: CRIATIVIDADE
- REPERTORIO: Todos (5)

**gabriel-ferreira (5 indicadores - faltam 14):**
- ORATORIA: FLUENCIA, MODULACAO_VOZ, DICCAO, VOCABULARIO, GRAMATICA
- INTERPESSOAL: ESCUTATORIA, PERSUASAO, DIDATICA
- INTRAPESSOAL: CRIATIVIDADE
- REPERTORIO: Todos (5)

---

## 7. RECOMENDACOES

### Opcao A: Completar os JSONs com Indicadores Faltantes (RECOMENDADO)

**Acao:** Adicionar scores estimados/padrao para indicadores faltantes

**Indicadores Universais a Adicionar:**
1. **ESCUTATORIA**: Score = null, categoria = "nao_avaliavel", observacao = "Nao aplicavel em contexto de monologo"
2. **VARIEDADE_CONHECIMENTO**: Score estimado baseado em contexto
3. **CONEXAO_IDEIAS**: Score estimado baseado em raciocinio demonstrado
4. **ATUALIZACAO**: Score estimado ou null
5. **CULTURA_GERAL**: Score estimado ou null
6. **APLICACAO_REPERTORIO**: Score estimado ou null

**Beneficios:**
- Dashboard mostrara todos os 19 indicadores
- Visualizacao completa e comparavel entre alunos
- Mantem consistencia com o framework

**Trabalho Estimado:**
- Script automatizado para adicionar indicadores faltantes
- Revisao manual para ajustar scores estimados
- Tempo: 2-3 horas

### Opcao B: Documentar Limitacao nos Dados

**Acao:** Adicionar nota no dashboard explicando que alguns indicadores nao sao avaliados

**Exemplo de texto:**
> "Este feedback analisa [X] de 19 indicadores do DNA Genis. Indicadores como REPERTORIO e ESCUTATORIA requerem contextos mais amplos de avaliacao."

**Beneficios:**
- Sem necessidade de alterar JSONs
- Transparencia para o usuario
- Expectativa alinhada

**Desvantagens:**
- Visualizacao incompleta permanece
- Comparacoes entre alunos ficam comprometidas

### Opcao C: Criar Versoes Contextuais do Framework

**Acao:** Definir subsets do framework para diferentes contextos

**Exemplo:**
- **Apresentacao Curta (< 1min)**: 8 indicadores core de ORATORIA + INTRAPESSOAL
- **Apresentacao Media (1-5min)**: 13 indicadores (ORATORIA + INTERPESSOAL + INTRAPESSOAL)
- **Palestra/Aula (5min+)**: 19 indicadores completos

**Beneficios:**
- Framework adaptavel ao contexto
- Expectativas claras
- Scores mais justos

**Desvantagens:**
- Complexidade adicional
- Comparacoes cross-contexto limitadas

---

## 8. PLANO DE ACAO RECOMENDADO

### Fase 1: Curto Prazo (Esta Semana)

1. **Decisao Estrategica:** Escolher entre Opcao A, B ou C
2. **Script de Completude:** Se Opcao A, criar script para adicionar indicadores faltantes
3. **Documentacao:** Atualizar README explicando quais indicadores sao avaliados em cada contexto

### Fase 2: Medio Prazo (Proximas 2 Semanas)

1. **Revisao de Criterios:** Definir quando cada indicador e avaliavel
2. **Padronizacao:** Criar template JSON com todos os 19 indicadores
3. **Validacao:** Implementar validacao Zod que alerta quando indicadores faltam

### Fase 3: Longo Prazo (Proximo Mes)

1. **Evolucao do Framework:** Adicionar metadado `contexto_avaliacao` ao JSON
2. **Dashboard Adaptativo:** Mostrar apenas indicadores relevantes ao contexto
3. **Comparacao Inteligente:** Permitir comparacao apenas entre indicadores comuns

---

## 9. ARQUIVOS RELEVANTES

### Dados
- **Diretorio:** `/data/feedbacks-supremos-011225/`
- **Total de arquivos:** 21 arquivos `.md`
- **Todos contem JSON embarcado** entre marcadores `---DNA_GENIS_DASHBOARD_START---` e `---DNA_GENIS_DASHBOARD_END---`

### Codigo
- **DashboardShell.tsx** (linhas 17-22): Preparacao dos dados do radar - CODIGO CORRETO
- **UnifiedRadar.tsx**: Componente do grafico - CODIGO CORRETO
- **zod-student.ts**: Schema de validacao (pode ser aprimorado)

### Scripts de Analise
- **analyze-indicators.js**: Script criado para diagnostico (executado em 02/12/2025)

---

## 10. CONCLUSAO

**O grafico radar esta funcionando perfeitamente.** Ele exibe exatamente os indicadores presentes nos JSONs de entrada.

**O problema raiz e a incompletude dos dados:** nenhum dos 21 feedbacks possui todos os 19 indicadores do framework DNA Genis 3.0.

**Proximos passos:**
1. Decidir a estrategia (completar JSONs vs. documentar limitacao vs. framework contextual)
2. Implementar a solucao escolhida
3. Validar que todos os feedbacks ficam consistentes
4. Atualizar documentacao

**Diagnostico concluido.**

---

**Arquivo gerado em:** 02/12/2025
**Script de analise:** `/analyze-indicators.js`
**Total de feedbacks analisados:** 21
**Tempo de diagnostico:** ~30 minutos
