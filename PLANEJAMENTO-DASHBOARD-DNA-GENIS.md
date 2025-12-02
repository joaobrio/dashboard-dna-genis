# 🎯 Planejamento Dashboard DNA Genis

**Autor:** Designer BRIO (Agente Especialista em Design Systems)
**Data:** 01/12/2025
**Versão:** 1.0
**Metodologia Base:** Storytelling com Dados (Cole Nussbaumer Knaflic) + DNA Genis 3.0

---

## 📋 Sumário Executivo

Este documento apresenta o planejamento completo para construção de um dashboard que visualiza os resultados do **Feedback Supremo DNA Genis** - um sistema de análise profunda de comunicação que avalia **19 indicadores** distribuídos em 4 pilares, mais 2 métricas transversais (Autoconfiança e Comprometimento).

> ⚠️ **Nota de Auditoria (01/12/2025):** Documento revisado e alinhado com `DNA-GENIS.md` oficial e `database-genisai`.

### A Grande Ideia (Framework SCD)

> **"O Dashboard DNA Genis transforma dados complexos de análise comunicacional em uma jornada visual clara, permitindo que cada aluno compreenda seu estado atual, celebre suas forças e execute um plano de ação personalizado para evolução."**

---

## 📊 Framework DNA Genis 3.0 - Estrutura Completa

### Os 4 Pilares e 19 Indicadores

| Pilar | Peso | Indicadores | Foco |
|-------|------|-------------|------|
| **ORATÓRIA** | 40% | 7 indicadores | EXPRESSÃO |
| **INTERPESSOAL** | 20% | 5 indicadores | CONEXÃO |
| **INTRAPESSOAL** | 25% | 2 indicadores | INTENÇÃO |
| **REPERTÓRIO** | 15% | 5 indicadores | CONHECIMENTO |

### Detalhamento por Pilar

**PILAR 1 - ORATÓRIA (7 indicadores)**
1. Fluência - Ritmo da fala, ausência de vícios
2. Linguagem Não Verbal - Gestos, postura, expressão facial
3. Modulação de Voz - Entonação, volume, velocidade
4. Dicção - Clareza na pronúncia
5. Assertividade - Clareza, objetividade, estrutura
6. Vocabulário - Variedade e adequação
7. Gramática - Correção gramatical

**PILAR 2 - INTERPESSOAL (5 indicadores)**
8. Escutatória* - Qualidade da escuta ativa (*só em contexto dialogado)
9. Persuasão - Uso de gatilhos, storytelling, argumentação
10. Marketing Pessoal - Comunicação de diferenciais
11. Didática - Capacidade de explicar complexo de forma simples
12. Adaptabilidade - Gestão de pressão e objeções

**PILAR 3 - INTRAPESSOAL (2 indicadores)**
13. Criatividade - Raciocínio rápido, improviso
14. Liderança/Posicionamento - Postura de dono, gestão de conflitos

**PILAR 4 - REPERTÓRIO (5 indicadores)**
15. Variedade de Conhecimento - Áreas que transita
16. Conexão de Ideias - Pontes, metáforas, analogias
17. Atualização Contínua - Consumo de novos conteúdos
18. Cultura Geral - Interesse por temas diversos
19. Aplicação do Repertório - Uso em persuasão, didática, criatividade

### Métricas Transversais

**AUTOCONFIANÇA** (Composta)
```
Autoconfiança = 
  40% Oratória (Técnica) +
  25% Intrapessoal (Emocional) +
  20% Interpessoal (Relacional) +
  15% Repertório (Intelectual)
```

**COMPROMETIMENTO** (Comportamental)
- % execução dos planos de ação
- Frequência de check-ins
- Conclusão de trilhas recomendadas

---

## 🎯 Lição 1: Entenda o Contexto

### Quem é o Público?

| Persona | Características | Necessidades |
|---------|-----------------|--------------|
| **Aluno Primário** | Pessoa em desenvolvimento comunicacional | Ver progresso, entender gaps, saber o que fazer |
| **Aluno Recorrente** | Múltiplas análises no sistema | Comparar evolução temporal, ver tendências |
| **Professor/Mentor** | Acompanha múltiplos alunos | Visão macro, identificar padrões |
| **Gestor (In Company)** | Responsável por equipe | Relatórios agregados, ROI do treinamento |

### O que Precisam Fazer? (Ações Específicas)

1. **Compreender** - Entender o estado atual de comunicação
2. **Celebrar** - Reconhecer pontos fortes
3. **Priorizar** - Saber onde focar energia
4. **Agir** - Executar plano de ação com exercícios específicos
5. **Acompanhar** - Ver evolução ao longo do tempo

### Mecanismo de Comunicação

| Formato | Contexto | Características |
|---------|----------|-----------------|
| **Dashboard Web** | Pós-análise de vídeo | Interativo, responsivo, sempre disponível |
| **Relatório PDF** | Compartilhamento | Estático, completo, imprimível |
| **Email de Notificação** | Alerta de nova análise | Resumo com link para dashboard |

### História de 3 Minutos (Elevator Pitch)

> "Você enviou um vídeo e nossa IA analisou sua comunicação em 19 dimensões distribuídas em 4 pilares. Seu score geral é **79.8** - você está na categoria **Operacional** (70-84%). Seu maior trunfo é a **Persuasão (88)** - Alta Performance! Mas identificamos que a **Fluência (72)** pode te travar em momentos de improviso. A boa notícia? Temos um plano de 4 semanas focado exatamente nisso. A Aula 3 do Tríade vai te dar a técnica da Pausa Estratégica. Em 30 dias, projetamos que você chegue a **83**."

---

## 📊 Lição 2: Escolha Visuais Apropriados

### Inventário de Dados do JSON

```yaml
dados_disponíveis:
  resumo:
    - score_geral: 79.8 (número único, alto impacto)
    - score_autoconfianca: 79.5 (número único)
    - categoria_geral: "forte" (texto + cor)
    - numero_analise: 1 (contexto)
  
  pilares: # 4 itens
    - nome, score, peso, categoria, delta, ancora, gap
  
  indicadores: # 19 itens (7 Oratória + 5 Interpessoal + 2 Intrapessoal + 5 Repertório)
    - codigo, nome, pilar, score, categoria, delta
    - confianca, evidencias[], timestamps[]
    - aula_recomendada, tecnica_recomendada, prioridade_acao
    - aplicavel: boolean # Escutatória só aplicável em contexto dialogado
  
  transversais:
    - autoconfianca: # Composta: 40% Oratória + 25% Intrapessoal + 20% Interpessoal + 15% Repertório
    - comprometimento: # % execução dos planos de ação
  
  evolucao:
    - historico[] (timeline de análises)
    - tendencia (texto)
    - projecao_30_dias, projecao_90_dias
  
  plano_acao:
    - trilhas[] com exercicios[]
    - desafio_mes
    - criterios_sucesso[]
```

### Matriz de Decisão Visual

| Dado | Tipo de Comparação | Visual Escolhido | Justificativa SCD |
|------|-------------------|------------------|-------------------|
| **Score Geral** | Número único de impacto | **Texto Grande** + Gauge | "Quando o número É a mensagem" |
| **4 Pilares** | Parte do todo + comparação | **Radar Chart** | Mostra equilíbrio/desequilíbrio |
| **19 Indicadores** | Ranking por score | **Barras Horizontais** | Ordenação clara de prioridades |
| **Autoconfiança** | Composição 4 sub-pilares | **Gauge + Breakdown** | Mostra composição técnica/emocional/relacional/intelectual |
| **Comprometimento** | Progresso longitudinal | **Progress Bar** | % execução dos planos |
| **Indicador vs Meta** | Comparação | **Bullet Chart** | Mostra atual vs target |
| **Evolução Temporal** | Tendência | **Gráfico de Linhas** | Progressão no tempo |
| **Projeção** | Antes/Depois | **Slopegraph** | Mostra direção da mudança |
| **Plano de Ação** | Checklist/Timeline | **Cards + Progress** | Acionável e trackeável |

### Componentes Visuais Principais

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO SECTION - Score Geral                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │           79.8                                           │   │
│  │         FORTE                                            │   │
│  │     ━━━━━━━━━●━━━━━━━━━                                  │   │
│  │     0        80       100                                │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  RADAR DOS PILARES                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Oratória (78)                                 │   │
│  │               ╱╲                                         │   │
│  │              ╱  ╲                                        │   │
│  │  Repertório ╱    ╲ Interpessoal                         │   │
│  │     (77)   ╱      ╲   (82)                              │   │
│  │            ╲      ╱                                      │   │
│  │             ╲    ╱                                       │   │
│  │              ╲  ╱                                        │   │
│  │           Intrapessoal                                   │   │
│  │              (80)                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  RANKING DE INDICADORES (Barras Horizontais)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Persuasão          ████████████████████████████ 88     │   │
│  │  Assertividade      ████████████████████████████ 85     │   │
│  │  Liderança          ████████████████████████████ 85     │   │
│  │  Didática           ████████████████████████████ 85     │   │
│  │  ...                                                     │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │  Fluência           ████████████████████ 72 ← FOCO     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧹 Lição 3: Elimine a Saturação

### Princípios de Dessaturação a Aplicar

| Elemento | Remover/Simplificar | Manter |
|----------|---------------------|--------|
| **Grades** | Linhas de grade densas | Apenas referências sutis |
| **Bordas** | Bordas de gráficos | Espaço em branco como moldura |
| **Legendas** | Legendas separadas | Rótulos diretos nos dados |
| **Cores** | Rainbow de cores | Cinza base + 1-2 cores de destaque |
| **Decimais** | 79.8234 | 79.8 ou 80 |
| **Texto** | Parágrafos longos | Frases curtas, bullets |

### Antes vs Depois (Exemplo Indicadores)

```
ANTES (Saturado):
┌───────────────────────────────────────────────────────────────┐
│ INDICADORES DE COMUNICAÇÃO - ANÁLISE DETALHADA                │
│ Fonte: Sistema DNA Genis | Versão 3.0 | Confiança: 0.85      │
├───────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐  │
│ │ ■ Fluência       │ 72  │ Forte    │ ↑ +0  │ Oratória │  │
│ │ ■ LNV            │ 80  │ Forte    │ ↑ +0  │ Oratória │  │
│ │ ■ Modulação      │ 75  │ Forte    │ ↑ +0  │ Oratória │  │
│ └─────────────────────────────────────────────────────────┘  │
│ ▪ Fluência ▪ LNV ▪ Modulação ▪ Dicção ▪ Assertividade       │
└───────────────────────────────────────────────────────────────┘

DEPOIS (Dessaturado):
┌─────────────────────────────────────────────────────────────────┐
│  Seus Indicadores                                               │
│                                                                 │
│  Persuasão              ████████████████████████████████ 88    │
│  Assertividade          ██████████████████████████████ 85      │
│  Liderança              ██████████████████████████████ 85      │
│  Didática               ██████████████████████████████ 85      │
│  Adaptabilidade         ████████████████████████████ 82        │
│  Vocabulário            ████████████████████████████ 82        │
│  Marketing Pessoal      ██████████████████████████ 80          │
│  Linguagem Não Verbal   ██████████████████████████ 80          │
│  Gramática              ████████████████████████ 78            │
│  Criatividade           ████████████████████████ 78            │
│  Dicção                 ██████████████████████ 75              │
│  Modulação de Voz       ██████████████████████ 75              │
│  Fluência               ████████████████████ 72  ← Seu foco   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Regra dos 3 Segundos

O usuário deve conseguir responder em 3 segundos:
1. **"Qual meu score?"** → Número grande no topo
2. **"Estou bem ou mal?"** → Cor e categoria (FORTE = verde)
3. **"O que devo fazer?"** → CTA claro para plano de ação

---

## 👁️ Lição 4: Focalize a Atenção

### Hierarquia de Informação (3 Níveis)

```
NÍVEL 1 - PRIMÁRIO (Olhar primeiro):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Score Geral (79.8)
• Categoria (FORTE)
• Indicador Âncora (Persuasão 88)
• Indicador Gap (Fluência 72)
→ DESTAQUE: Cor, tamanho grande, posição topo

NÍVEL 2 - SECUNDÁRIO (Explorar em seguida):
──────────────────────────────────────
• Radar dos 4 Pilares
• Ranking de Indicadores
• Próximos Passos (3 itens)
→ NEUTRO: Tamanho médio, cores suaves

NÍVEL 3 - TERCIÁRIO (Detalhes sob demanda):
..........................................
• Evidências com timestamps
• Confiança dos scores
• Histórico completo
• Configurações
→ SUTIL: Tamanho pequeno, cinza, expandível
```

### Atributos Pré-Atentivos Aplicados

| Atributo | Aplicação no Dashboard |
|----------|------------------------|
| **Cor (destaque)** | Azul para scores altos, Laranja para gaps prioritários |
| **Cor (semântica)** | Verde = positivo/excelente, Vermelho = crítico, Cinza = neutro |
| **Tamanho** | Score geral em 72px, indicadores em 16px |
| **Posição** | Informação crítica no topo-esquerda (padrão F de leitura) |
| **Intensidade** | Barras com gradiente de saturação por score |
| **Inclusão** | Cards com bordas sutis agrupando informações relacionadas |

### Escala Oficial de Scores (DNA Genis 3.0)

| Score | Categoria | Cor | Interpretação |
|-------|-----------|-----|---------------|
| **85-100%** | 🟢 Alta Performance | Verde | Domínio sobre o indicador |
| **70-84%** | 🟡 Operacional | Amarelo | Funciona bem, pode evoluir |
| **50-69%** | 🟠 Essencial | Laranja | Atenção e foco de desenvolvimento |
| **0-49%** | 🔴 Crítico | Vermelho | Desenvolvimento urgente |

### Paleta de Cores Semântica

```css
/* Cores do DNA Genis - Escala Oficial */
--dna-alta-performance: #10B981; /* Verde - Score 85-100% */
--dna-operacional:      #F59E0B; /* Amarelo - Score 70-84% */
--dna-essencial:        #F97316; /* Laranja - Score 50-69% */
--dna-critico:          #EF4444; /* Vermelho - Score 0-49% */

/* Neutros */
--neutral-50:        #F9FAFB;
--neutral-100:       #F3F4F6;
--neutral-300:       #D1D5DB;
--neutral-500:       #6B7280;
--neutral-700:       #374151;
--neutral-900:       #111827;

/* Destaque de Ação */
--accent-primary:    #8B5CF6; /* Roxo - CTA principal */
--accent-secondary:  #EC4899; /* Rosa - Notificações */
```

---

## 🎨 Lição 5: Pense Como um Designer

### Princípios da Gestalt Aplicados

| Princípio | Aplicação |
|-----------|-----------|
| **Proximidade** | Indicadores do mesmo pilar agrupados fisicamente |
| **Similaridade** | Mesma cor = mesma categoria de score |
| **Inclusão** | Cards com backgrounds sutis para seções |
| **Continuidade** | Fluxo vertical: Score → Pilares → Indicadores → Ação |
| **Fechamento** | Grades implícitas, não todas as bordas |
| **Conexão** | Linhas conectando indicador → aula recomendada |

### Sistema Tipográfico

```typescript
// Design Tokens - Typography
const typography = {
  display: {
    // Score Geral
    fontSize: '72px',
    fontWeight: 800,
    lineHeight: 1,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  h1: {
    // Títulos de Seção
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
    fontFamily: 'Space Grotesk, sans-serif'
  },
  h2: {
    // Subtítulos
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.3,
    fontFamily: 'Inter, sans-serif'
  },
  body: {
    // Texto principal
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    fontFamily: 'Inter, sans-serif'
  },
  caption: {
    // Labels, notas
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.4,
    fontFamily: 'Inter, sans-serif'
  },
  mono: {
    // Números, scores
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'JetBrains Mono, monospace'
  }
} as const;
```

### Layout Grid System

```
Desktop (1440px):
┌────────────────────────────────────────────────────────────────┐
│ Margin: 64px                                                    │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │                        HEADER                             │   │
│ │  Logo    Dashboard DNA Genis    Pedro Werlang    Avatar  │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌────────────────────────┐  ┌────────────────────────────────┐ │
│ │                        │  │                                │ │
│ │    SCORE GERAL         │  │     RADAR DOS PILARES          │ │
│ │       79.8             │  │                                │ │
│ │      FORTE             │  │                                │ │
│ │                        │  │                                │ │
│ └────────────────────────┘  └────────────────────────────────┘ │
│      4 colunas                      8 colunas                   │
│                                                                 │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │                                                          │   │
│ │              RANKING DE INDICADORES                       │   │
│ │                  (12 colunas)                             │   │
│ │                                                          │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌────────┐ │
│ │  PLANO DE AÇÃO       │  │  EVOLUÇÃO            │  │ METAS  │ │
│ │    (6 colunas)       │  │    (4 colunas)       │  │ (2col) │ │
│ └──────────────────────┘  └──────────────────────┘  └────────┘ │
└────────────────────────────────────────────────────────────────┘

Mobile (375px):
┌─────────────────────────┐
│ Margin: 16px            │
│ ┌─────────────────────┐ │
│ │      SCORE          │ │
│ │       79.8          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │   RESUMO PILARES    │ │
│ │   (cards swipe)     │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │   TOP 3 + BOTTOM 3  │ │
│ │   (indicadores)     │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │   PRÓXIMO PASSO     │ │
│ │   (CTA principal)   │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Acessibilidade (WCAG 2.1 AA)

| Critério | Implementação |
|----------|---------------|
| **Contraste** | Mínimo 4.5:1 para texto, 3:1 para UI |
| **Daltonismo** | Não depender apenas de cor; usar ícones/padrões |
| **Teclado** | Navegação completa por Tab |
| **Screen Reader** | ARIA labels em todos gráficos |
| **Zoom** | Funcional até 200% |
| **Touch Target** | Mínimo 44x44px em mobile |

---

## 📖 Lição 6: Conte Uma História (Estrutura de 3 Atos)

### Narrativa do Dashboard

```
ATO 1 - SETUP: "Onde Estou?" (Hero Section)
═══════════════════════════════════════════
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│     Olá, Pedro! 👋                                          │
│                                                             │
│     Sua comunicação está na categoria                       │
│                                                             │
│              79.8                                           │
│             FORTE                                           │
│                                                             │
│     Você está no top 25% dos comunicadores                  │
│     analisados pelo sistema DNA Genis                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Objetivo: Estabelecer baseline, gerar reconhecimento
Emoção: Validação, curiosidade para saber mais


ATO 2 - CONFLITO: "O que me impede?" (Análise)
═══════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────┐
│  Sua maior força: PERSUASÃO (88)                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━                                 │
│  Você domina a arte de convencer. Sua abertura com          │
│  impacto emocional e estrutura lógica são excelentes.       │
│                                                             │
│  Seu ponto de desenvolvimento: FLUÊNCIA (72)                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                   │
│  Identificamos pausas preenchidas ("ah...", "é...") no      │
│  Q&A. Em momentos de improviso, a fluência cai.             │
│                                                             │
│  📍 Evidências: [4:29] [5:03] [5:51] [6:45]                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Objetivo: Criar tensão construtiva, mostrar gap específico
Emoção: Reconhecimento do desafio, desejo de melhorar


ATO 3 - RESOLUÇÃO: "O que fazer?" (Plano de Ação)
═══════════════════════════════════════════════════
┌─────────────────────────────────────────────────────────────┐
│  Seu Plano de 30 Dias                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━                                     │
│                                                             │
│  SEMANA 1-2: Eliminar Vícios no Q&A                        │
│  ┌─────────────────────────────────────┐                   │
│  │ 📺 Assistir: Aula 3 - Fluência      │                   │
│  │ 🎯 Técnica: Pausa Estratégica       │                   │
│  │ ⏱️ 15 min/dia de prática            │                   │
│  │                                      │                   │
│  │        [ Começar Trilha ]           │                   │
│  └─────────────────────────────────────┘                   │
│                                                             │
│  Meta em 30 dias: Score 83 (+3.2 pontos)                   │
│  ━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━                           │
│         79.8                83                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Objetivo: Dar direção clara, inspirar ação
Emoção: Empoderamento, confiança no processo
```

### Fluxo Narrativo do Dashboard

```
JORNADA DO USUÁRIO:

1. CHEGADA (0-3 segundos)
   └── "Qual meu score?" → Número grande
   
2. CONTEXTO (3-10 segundos)
   └── "Estou bem?" → Categoria + comparativo
   
3. EXPLORAÇÃO (10-60 segundos)
   └── "Onde sou forte/fraco?" → Radar + Ranking
   
4. APROFUNDAMENTO (1-5 minutos)
   └── "Por que esse score?" → Evidências + Timestamps
   
5. AÇÃO (Decisão)
   └── "O que fazer agora?" → Plano claro + CTA

TRANSIÇÕES:
- Score → "Mas o que compõe esse número?"
- Pilares → "E quais indicadores específicos?"
- Gap → "Identificamos isso no minuto X:XX do vídeo"
- Evidência → "E aqui está como melhorar"
- Plano → "Começar agora"
```

---

## 🧩 Arquitetura de Componentes

### Estrutura de Componentes React/TypeScript

```typescript
// Estrutura de Diretórios
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── HeroScore.tsx           // Score grande + categoria
│   │   ├── PillarRadar.tsx         // Gráfico radar 4 pilares
│   │   ├── IndicatorRanking.tsx    // Barras horizontais
│   │   ├── IndicatorCard.tsx       // Detalhes de 1 indicador
│   │   ├── EvolutionChart.tsx      // Linha temporal
│   │   ├── ActionPlan.tsx          // Plano de ação
│   │   └── ProgressTracker.tsx     // Checklist de exercícios
│   ├── shared/
│   │   ├── ScoreGauge.tsx          // Gauge semicircular
│   │   ├── CategoryBadge.tsx       // Badge colorido
│   │   ├── ProgressBar.tsx         // Barra de progresso
│   │   ├── Tooltip.tsx             // Tooltips informativos
│   │   └── Card.tsx                // Card container
│   └── charts/
│       ├── RadarChart.tsx          // Radar customizado
│       ├── HorizontalBar.tsx       // Barra horizontal
│       ├── LineChart.tsx           // Gráfico de linha
│       └── BulletChart.tsx         // Bullet chart
├── hooks/
│   ├── useDNAGenisData.ts          // Fetch/parse JSON
│   ├── useAnimation.ts             // Animações de entrada
│   └── useAccessibility.ts         // A11y helpers
├── design-tokens/
│   ├── colors.ts
│   ├── typography.ts
│   ├── spacing.ts
│   └── shadows.ts
└── utils/
    ├── scoreToCategory.ts          // Score → Categoria
    ├── formatters.ts               // Formatação de dados
    └── chartHelpers.ts             // Helpers para gráficos
```

### Componente Principal: HeroScore

```typescript
// components/dashboard/HeroScore.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Escala oficial DNA Genis 3.0
const heroVariants = cva(
  'flex flex-col items-center justify-center p-8 rounded-2xl',
  {
    variants: {
      category: {
        alta_performance: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200', // 85-100%
        operacional: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',           // 70-84%
        essencial: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',          // 50-69%
        critico: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',                     // 0-49%
      }
    },
    defaultVariants: {
      category: 'operacional'
    }
  }
);

interface HeroScoreProps extends VariantProps<typeof heroVariants> {
  score: number;
  categoryLabel: string;
  userName: string;
  analysisNumber: number;
}

export const HeroScore: React.FC<HeroScoreProps> = ({
  score,
  category,
  categoryLabel,
  userName,
  analysisNumber
}) => {
  return (
    <motion.div 
      className={heroVariants({ category })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-neutral-600 text-lg mb-2">
        Olá, {userName}! 👋
      </span>
      
      <motion.span 
        className="text-7xl font-extrabold text-neutral-900"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        {score.toFixed(1)}
      </motion.span>
      
      <span className={`text-2xl font-bold mt-2 ${getCategoryColor(category)}`}>
        {categoryLabel.toUpperCase()}
      </span>
      
      <span className="text-neutral-500 text-sm mt-4">
        Análise #{analysisNumber} • DNA Genis
      </span>
    </motion.div>
  );
};
```

### Componente: PillarRadar

```typescript
// components/charts/RadarChart.tsx
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface PillarData {
  pilar: string;
  score: number;
  fullMark: 100;
}

interface PillarRadarProps {
  data: PillarData[];
  highlightPilar?: string;
}

export const PillarRadar: React.FC<PillarRadarProps> = ({ data, highlightPilar }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart data={data}>
        <PolarGrid 
          stroke="#E5E7EB" 
          strokeDasharray="3 3"
        />
        <PolarAngleAxis 
          dataKey="pilar" 
          tick={{ fill: '#374151', fontSize: 14 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 100]} 
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#3B82F6"
          fill="#3B82F6"
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip 
          content={<CustomTooltip />}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
```

---

## 📱 Responsividade e Breakpoints

```typescript
// design-tokens/breakpoints.ts
export const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop small
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Desktop large
} as const;

// Adaptações por breakpoint
const responsiveAdaptations = {
  mobile: {
    heroScore: {
      fontSize: '48px',    // Menor que desktop
      padding: '16px'
    },
    radar: 'hidden',       // Substituir por lista
    indicators: {
      show: 6,             // Top 3 + Bottom 3
      expandable: true
    },
    actionPlan: {
      layout: 'stack',     // Vertical
      showOnlyNext: true   // Só próximo passo
    }
  },
  tablet: {
    heroScore: {
      fontSize: '56px',
      padding: '24px'
    },
    radar: {
      size: '300px'
    },
    indicators: {
      show: 10,
      columns: 1
    }
  },
  desktop: {
    heroScore: {
      fontSize: '72px',
      padding: '32px'
    },
    radar: {
      size: '400px'
    },
    indicators: {
      show: 'all',
      columns: 1
    },
    layout: '2-column'     // Score + Radar lado a lado
  }
};
```

---

## 🎬 Animações e Micro-Interações

### Princípios de Motion

```typescript
// Princípios baseados em Storytelling
const motionPrinciples = {
  // 1. Revelação Progressiva (como contar história)
  staggeredReveal: {
    container: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }
  },
  
  // 2. Ênfase em Dados Importantes
  scoreReveal: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { 
      type: 'spring', 
      stiffness: 200,
      damping: 20 
    }
  },
  
  // 3. Feedback de Interação
  hoverLift: {
    whileHover: { 
      y: -4, 
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)' 
    },
    transition: { duration: 0.2 }
  },
  
  // 4. Progresso Animado (barras)
  progressBar: {
    initial: { width: 0 },
    animate: { width: 'var(--progress)' },
    transition: { duration: 1, ease: 'easeOut', delay: 0.5 }
  }
};
```

### Animações Chave

| Elemento | Animação | Timing | Propósito |
|----------|----------|--------|-----------|
| Score Geral | Scale + Fade | 0.5s, spring | Impacto inicial |
| Categoria Badge | Slide up + Fade | 0.3s, ease-out | Complementar score |
| Radar | Draw path | 1s, ease-in-out | Revelar equilíbrio |
| Barras | Width growth | 0.8s, stagger 0.1s | Ranking dramático |
| Cards | Stagger fade | 0.3s cada | Fluxo narrativo |
| CTA | Pulse | Loop 2s | Chamar atenção |

---

## 📋 Wireframes Detalhados

### Tela Principal - Desktop

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  🧬 DNA Genis    Dashboard    Evolução    Biblioteca    👤 Pedro   │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐   │
│  │                         │  │                                      │   │
│  │    Olá, Pedro! 👋       │  │        RADAR DOS PILARES            │   │
│  │                         │  │                                      │   │
│  │        79.8             │  │           Oratória (78)             │   │
│  │       ━━━━━━━━━━━━━━━   │  │              ╱╲                      │   │
│  │       FORTE             │  │             ╱  ╲                     │   │
│  │                         │  │ Repertório ╱    ╲ Interpessoal      │   │
│  │    Análise #1           │  │    (77)   ╱      ╲   (82)           │   │
│  │    01/12/2025           │  │           ╲      ╱                   │   │
│  │                         │  │            ╲    ╱                    │   │
│  │  [ Ver Relatório ]      │  │         Intrapessoal (80)           │   │
│  │                         │  │                                      │   │
│  └─────────────────────────┘  └──────────────────────────────────────┘   │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  📊 Seus 19 Indicadores                            [Por Pilar ▼] │   │
│  │                                                                     │   │
│  │  ORATÓRIA (7)                                           Média: 78  │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │  Assertividade          ██████████████████████████████████ 85 🟢   │   │
│  │  Vocabulário            ████████████████████████████████ 82 🟡     │   │
│  │  LNV                    ██████████████████████████████ 80 🟡       │   │
│  │  Gramática              ████████████████████████████ 78 🟡         │   │
│  │  Modulação              ██████████████████████████ 75 🟡           │   │
│  │  Dicção                 ██████████████████████████ 75 🟡           │   │
│  │  Fluência               ████████████████████████ 72 🟡 ← Foco     │   │
│  │                                                                     │   │
│  │  INTERPESSOAL (5)                                       Média: 82  │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │  Persuasão              ████████████████████████████████████ 88 🟢 │   │
│  │  Didática               ██████████████████████████████████ 85 🟢   │   │
│  │  Adaptabilidade         ████████████████████████████████ 82 🟡     │   │
│  │  Marketing Pessoal      ██████████████████████████████ 80 🟡       │   │
│  │  Escutatória            ─────────────────────── N/A (monólogo)    │   │
│  │                                                                     │   │
│  │  INTRAPESSOAL (2)                                       Média: 80  │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │  Liderança              ██████████████████████████████████ 85 🟢   │   │
│  │  Criatividade           ████████████████████████████ 78 🟡         │   │
│  │                                                                     │   │
│  │  REPERTÓRIO (5)                                         Média: 77  │   │
│  │  ────────────────────────────────────────────────────────────────  │   │
│  │  ℹ️ Avaliação inferida a partir da análise de conteúdo            │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │  🎯 Plano de Ação          │  │  📈 Projeção                       │  │
│  │                            │  │                                    │  │
│  │  Semana 1-2                │  │  Hoje         30 dias    90 dias   │  │
│  │  ┌────────────────────┐   │  │                                    │  │
│  │  │ Eliminar Vícios    │   │  │   79.8 ─────● 83 ─────● 87        │  │
│  │  │                    │   │  │                                    │  │
│  │  │ 📺 Aula 3: Fluência│   │  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  │
│  │  │ ⏱️ 15 min/dia      │   │  │    FORTE       FORTE+     ALTA    │  │
│  │  │                    │   │  │                                    │  │
│  │  │ [ Começar ] ▶      │   │  │  "Se mantiver o ritmo atual,      │  │
│  │  └────────────────────┘   │  │   você alcança Alta Performance   │  │
│  │                            │  │   em 90 dias"                      │  │
│  │  Semana 3-4                │  │                                    │  │
│  │  ○ Modulação de Ritmo      │  └────────────────────────────────────┘  │
│  │                            │                                          │
│  └────────────────────────────┘                                          │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  ⚡ Ação Imediata                                                   │   │
│  │                                                                     │   │
│  │  Seu próximo passo: Assistir Aula 3 - Fluência Magnética           │   │
│  │                                                                     │   │
│  │              [ Assistir Agora ] [ Depois ]                         │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

### Tela de Indicador Expandido

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ← Voltar ao Dashboard                                                     │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  FLUÊNCIA                                          72              │   │
│  │  Pilar: Oratória                                  FORTE            │   │
│  │                                                                     │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │   │
│  │  0              40              72                            100   │   │
│  │                                 ↑                                   │   │
│  │                            Você está aqui                           │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐  │
│  │  📝 O que é Fluência?        │  │  🎬 Evidências do seu vídeo      │  │
│  │                              │  │                                  │  │
│  │  Ritmo da fala sem travas,   │  │  [4:29] "Ah, pro treinador..."   │  │
│  │  repetições excessivas ou    │  │         ▶ Assistir trecho        │  │
│  │  pausas sem função.          │  │                                  │  │
│  │                              │  │  [5:03] "O que fez o Master..."  │  │
│  │  • Ausência de vícios        │  │         ▶ Assistir trecho        │  │
│  │  • Pausas intencionais       │  │                                  │  │
│  │  • Fala contínua e natural   │  │  [5:51] "Ah... tem várias..."    │  │
│  │                              │  │         ▶ Assistir trecho        │  │
│  │                              │  │                                  │  │
│  └──────────────────────────────┘  └──────────────────────────────────┘  │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │  🎓 Seu Plano de Desenvolvimento                                    │   │
│  │                                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   ASSISTIR   │  │   PRATICAR   │  │    META      │              │   │
│  │  │              │  │              │  │              │              │   │
│  │  │  📺 Aula 3   │  │  🎯 Pausa    │  │  📈 Score    │              │   │
│  │  │  Fluência    │  │  Estratégica │  │     80       │              │   │
│  │  │  Magnética   │  │              │  │  em 30 dias  │              │   │
│  │  │              │  │  15 min/dia  │  │              │              │   │
│  │  │ [ Iniciar ]  │  │ [ Iniciar ]  │  │              │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │                                                                     │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Especificações Técnicas

### Stack Recomendada

```yaml
frontend:
  framework: Next.js 14+ (App Router)
  linguagem: TypeScript 5.x
  estilização: Tailwind CSS + CVA (class-variance-authority)
  componentes: Radix UI (headless, acessível)
  gráficos: Recharts ou Nivo (React + D3)
  animações: Framer Motion
  estado: Zustand ou TanStack Query
  testes: Vitest + Testing Library

design_system:
  tokens: CSS Custom Properties
  documentação: Storybook 8
  icons: Lucide Icons
  fontes:
    - Space Grotesk (títulos)
    - Inter (corpo)
    - JetBrains Mono (números)

acessibilidade:
  padrão: WCAG 2.1 AA
  ferramentas: axe-core, pa11y
  
performance:
  lighthouse_target: 90+ todas métricas
  bundle: < 200KB initial JS
  lcp: < 2.5s
```

### Estrutura de Dados (TypeScript)

```typescript
// types/dna-genis.ts

export interface DNAGenisAnalysis {
  meta: AnalysisMeta;
  resumo: AnalysisSummary;
  pilares: Record<string, PillarData>;
  indicadores: Indicator[];
  evolucao: EvolutionData;
  plano_acao: ActionPlan;
  materiais: Material[];
  proximos_passos: NextSteps;
}

export interface AnalysisSummary {
  score_geral: number;
  score_autoconfianca: number;
  categoria_geral: ScoreCategory;
  evolucao_percentual: number | null;
  numero_analise: number;
  dias_desde_anterior: number | null;
}

// Escala oficial DNA Genis 3.0
export type ScoreCategory = 
  | 'critico'           // 0-49%
  | 'essencial'         // 50-69%
  | 'operacional'       // 70-84%
  | 'alta_performance'; // 85-100%

// Helper para categorizar score
export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 85) return 'alta_performance';
  if (score >= 70) return 'operacional';
  if (score >= 50) return 'essencial';
  return 'critico';
}

export interface Indicator {
  codigo: string;
  nome: string;
  pilar: 'ORATORIA' | 'INTERPESSOAL' | 'INTRAPESSOAL' | 'REPERTORIO';
  score: number;
  categoria: ScoreCategory;
  delta: number | null;
  confianca: number;
  evidencias: string[];
  timestamps: string[];
  aula_recomendada: string | null;
  aula_id: number | null;
  tecnica_recomendada: string | null;
  prioridade_acao: number | null;
  aplicavel: boolean; // false para Escutatória em contexto não-dialogado
}

// Métricas Transversais
export interface Autoconfianca {
  score: number;
  categoria: ScoreCategory;
  composicao: {
    oratoria: number;      // 40%
    intrapessoal: number;  // 25%
    interpessoal: number;  // 20%
    repertorio: number;    // 15%
  };
}

export interface Comprometimento {
  percentual_execucao: number;
  trilhas_concluidas: number;
  trilhas_totais: number;
  checkins_realizados: number;
  ultima_atividade: string; // ISO date
}

export interface ActionPlan {
  duracao_semanas: number;
  indicadores_priorizados: string[];
  trilhas: Trail[];
  desafio_mes: Challenge;
}

export interface Trail {
  semanas: string;
  foco: string;
  objetivo: string;
  aula_id: number;
  aula_nome: string;
  exercicios: Exercise[];
  criterios_sucesso: string[];
}
```

---

## 📅 Roadmap de Implementação

### Fase 1: Foundation (Semana 1-2)

```
□ Setup do projeto (Next.js + TypeScript)
□ Design tokens definidos
□ Componentes base (Card, Button, Badge)
□ Integração com fonte de dados (JSON)
□ Layout responsivo base
□ Acessibilidade base (navegação por teclado)
```

### Fase 2: Core Components (Semana 3-4)

```
□ HeroScore component
□ PillarRadar chart
□ IndicatorRanking (barras horizontais)
□ IndicatorCard com expansão
□ Animações de entrada
□ Testes unitários
```

### Fase 3: Features Avançadas (Semana 5-6)

```
□ EvolutionChart (histórico)
□ ActionPlan interativo
□ ProgressTracker
□ Navegação por evidências (timestamps)
□ Export PDF
□ Testes de integração
```

### Fase 4: Polish (Semana 7-8)

```
□ Micro-interações refinadas
□ Otimização de performance
□ Auditoria de acessibilidade completa
□ Documentação Storybook
□ Testes E2E
□ Deploy e monitoramento
```

---

## ✅ Checklist de Validação (Storytelling com Dados)

### Contexto
- [ ] Público-alvo claramente definido
- [ ] Ações esperadas documentadas
- [ ] Grande Ideia formulada em 1 frase
- [ ] História de 3 minutos pronta

### Visualização
- [ ] Tipo de gráfico apropriado para cada dado
- [ ] Evitados gráficos de pizza e 3D
- [ ] Eixos começam em zero (quando apropriado)
- [ ] Ordenação lógica dos dados

### Dessaturação
- [ ] Removidas bordas desnecessárias
- [ ] Grades minimizadas
- [ ] Legendas substituídas por rótulos diretos
- [ ] Paleta simplificada (cinza + destaque)
- [ ] Elementos alinhados

### Atenção
- [ ] UMA mensagem principal identificada
- [ ] Cor usada apenas para destacar
- [ ] Hierarquia visual clara (3 níveis)
- [ ] Teste de 3 segundos validado

### Design
- [ ] Máximo 2 famílias de fontes
- [ ] Espaço em branco estratégico
- [ ] Consistência total
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Contraste 4.5:1 validado

### Narrativa
- [ ] Estrutura de 3 atos aplicada
- [ ] Gancho inicial cativante
- [ ] Tensão/urgência construída
- [ ] Solução clara proposta
- [ ] Call-to-action específico

---

## 🎯 Métricas de Sucesso

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Compreensão** | 90% entendem score em < 3s | User testing |
| **Engajamento** | 70% clicam no plano de ação | Analytics |
| **Completude** | 50% completam 1 trilha | Tracking |
| **NPS** | > 50 | Survey pós-uso |
| **Acessibilidade** | 100% WCAG AA | Lighthouse |
| **Performance** | LCP < 2.5s | Core Web Vitals |

---

## 🔗 Integração com Database GenisAI

### Tabelas Principais para Conexão

| Tabela | Uso no Dashboard | Query Exemplo |
|--------|------------------|---------------|
| `aulas` (19) | Aula recomendada por indicador | `SELECT * FROM aulas WHERE id = indicador.aula_id` |
| `tecnicas` | Técnica específica para gap | `JOIN tecnicas ON aulas.id = tecnicas.aulaId` |
| `exercicios` | Exercícios práticos | `SELECT * FROM exercicios WHERE aulaId = ?` |
| `frameworks` | GIVE, 5 Níveis de Escuta | `SELECT * FROM frameworks WHERE aulaId = ?` |
| `citacoes` | Frases motivacionais | `SELECT texto, autor FROM citacoes ORDER BY RANDOM() LIMIT 1` |
| `content_chunks` | Sistema RAG | `SELECT * FROM content_chunks WHERE embedding <-> query_embedding` |

### Mapeamento Indicador → Aula Tríade 5.0

| Indicador | Aula Recomendada | Módulo |
|-----------|------------------|--------|
| Fluência | Aula 3: Fluência Magnética | Oratória |
| Linguagem Não Verbal | Aula 2: Postura de Domínio | Oratória |
| Modulação de Voz | Aula 3: Fluência Magnética | Oratória |
| Dicção | Aula 3: Fluência Magnética | Oratória |
| Assertividade | Aula 4: Estrutura de Raciocínio | Oratória |
| Vocabulário | Aula 6: Repertório Criativo | Oratória |
| Gramática | Aula 4: Estrutura de Raciocínio | Oratória |
| Escutatória | Aula 11: Escutatória | Interpessoal |
| Persuasão | Aula 15: Timing e Fechamento | Interpessoal |
| Marketing Pessoal | Aula 10: Personal Branding | Interpessoal |
| Didática | Aula 7: Recursos Didáticos | Interpessoal |
| Adaptabilidade | Aula 5: Autoconfiança | Interpessoal |
| Criatividade | Aula 6: Repertório Criativo | Intrapessoal |
| Liderança | Aula 16: Líder Comunicador | Intrapessoal |

---

## 📝 Componentes de Feedback (DNA Genis)

### 7 Componentes Obrigatórios

| # | Componente | Status | Descrição |
|---|------------|--------|-----------|
| 1 | **Visão Geral** | ✅ Hero + Radar | Mapa do DNA Genis com 4 pilares |
| 2 | **Análise por Pilar** | ✅ Cards expandíveis | Média + indicadores + destaques |
| 3 | **Análise Transversais** | ✅ Autoconfiança + Comprometimento | Métricas compostas |
| 4 | **Texto Interpretativo** | 🆕 Novo | Leitura personalizada como mentor |
| 5 | **Plano de Ação** | ✅ Trilhas semanais | Indicadores priorizados |
| 6 | **Trilhas de Desenvolvimento** | ✅ Progress tracker | Exercícios + aulas |
| 7 | **Feedback Humanizado** | 📌 Futuro | Vídeo/áudio opcional |

### Componente 4: Texto Interpretativo

```
┌─────────────────────────────────────────────────────────────────┐
│  📖 Leitura do seu DNA Comunicacional                          │
│                                                                 │
│  "Sua comunicação mostra um ótimo domínio técnico,             │
│  especialmente na fluência e linguagem não verbal.              │
│                                                                 │
│  No entanto, é visível que há espaço para evoluir na           │
│  assertividade e modulação de voz, pontos que impactam          │
│  diretamente sua presença em apresentações.                     │
│                                                                 │
│  Na dimensão interpessoal, sua persuasão é forte, mas          │
│  precisa investir mais na adaptabilidade, especialmente         │
│  em situações de pressão ou improviso..."                       │
│                                                                 │
│  — Sistema DNA Genis                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Tratamento Especial: Indicador Escutatória

O indicador **Escutatória** requer tratamento especial no dashboard:

```typescript
// Lógica de exibição
if (contexto === 'pitch' || contexto === 'monólogo') {
  escutatoria.status = 'NAO_APLICAVEL';
  escutatoria.mensagem = 'Indicador avaliável apenas em contexto dialogado';
  escutatoria.visualizar = 'badge-cinza';
} else {
  // Avaliação normal
  escutatoria.status = 'AVALIADO';
}
```

**Visual:**
```
┌────────────────────────────────────────┐
│  Escutatória          N/A              │
│  ─────────────────────────────────── │
│  ℹ️ Avaliável apenas em contexto       │
│     dialogado (reuniões, entrevistas)  │
└────────────────────────────────────────┘
```

---

## 📚 Referências

1. **Storytelling com Dados** - Cole Nussbaumer Knaflic
2. **Framework DNA Genis 3.0** - GenisHub
3. **WCAG 2.1 Guidelines** - W3C
4. **Design Tokens** - Design Systems
5. **React Component Patterns** - React TypeScript Cheatsheet
6. **DNA-GENIS.md** - Documento oficial do framework
7. **Database GenisAI** - Schema Prisma e estrutura de dados

---

## 📋 Changelog

### v1.1 (01/12/2025) - Auditoria e Correções
- ✅ Corrigido número de indicadores: 14 → 19
- ✅ Adicionado Framework DNA Genis 3.0 completo
- ✅ Atualizada escala de scores para oficial (0-49/50-69/70-84/85-100)
- ✅ Adicionados 5 indicadores do Pilar Repertório
- ✅ Adicionadas métricas transversais (Autoconfiança, Comprometimento)
- ✅ Incluído tratamento especial para Escutatória
- ✅ Adicionada integração com database GenisAI
- ✅ Incluído componente "Texto Interpretativo"
- ✅ Documentado mapeamento Indicador → Aula

### v1.0 (01/12/2025) - Versão Inicial
- Planejamento inicial baseado em Storytelling com Dados

---

*Documento gerado pelo Designer BRIO | Dezembro 2025*
*Metodologia: Storytelling com Dados aplicado a UI/UX de Dashboard*
*Auditoria: Alinhado com DNA-GENIS.md e database-genisai*

