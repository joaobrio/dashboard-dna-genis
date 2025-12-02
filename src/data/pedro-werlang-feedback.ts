/**
 * Feedback Supremo - Pedro Werlang
 * Análise detalhada baseada no relatório DNA Genis
 * Data: 01/12/2025
 */

export const pedroWerlangFeedback = {
  analise_id: 'pedro-werlang-001',
  data_analise: '01/12/2025',
  contexto:
    'Pitch de altíssimo nível técnico apresentado no Demo Day da Nova Era. Performance demonstra domínio completo do conteúdo, estrutura narrativa profissional e presença de palco consolidada. Os pontos de desenvolvimento estão concentrados em refinamentos de fluência vocal durante improvisação (Q&A) e controle de ritmo em momentos de densidade informacional.',

  feedback_items: [
    // PONTOS FORTES (Âncoras)
    {
      tipo: 'PONTO_FORTE' as const,
      indicador: 'PERSUASÃO',
      score: 88,
      categoria: 'excelente',
      evidencia:
        'Abertura impactante com dados de obesidade (5M mortes/ano) e saúde mental (1B pessoas com transtornos). Estrutura problema→solução→tração→ask perfeita. Fechamento humanizado transferindo holofote para propósito maior: "Não é sobre nós, é sobre eles, os protagonistas dessa história".',
      impacto:
        'A banca é puxada emocionalmente antes de receber o pitch do produto. CTA final humaniza o pedido e transfere holofote para propósito maior, gerando conexão profunda com avaliadores.',
      fundamento:
        'Persuasão eficaz combina Ethos (credibilidade), Pathos (emoção) e Logos (lógica). Pedro entrega os três: dados de tração (logos), história de impacto (pathos), e domínio técnico nas respostas (ethos).',
      timestamps: ['00:36', '00:57', '03:28', '03:45'],
    },
    {
      tipo: 'PONTO_FORTE' as const,
      indicador: 'DIDÁTICA',
      score: 85,
      categoria: 'excelente',
      evidencia:
        'Estrutura do pitch segue progressão lógica: (1) Problema global, (2) Agente (personal trainer), (3) Solução (Master Training), (4) Demo, (5) Projeção TAM/SAM/SOM, (6) Modelo B2B2C + métricas, (7) Diferencial vs concorrentes, (8) Equipe, (9) Ask + propósito. Cada bloco prepara o próximo sem saltos de raciocínio.',
      impacto:
        'Audiência consegue acompanhar perfeitamente o raciocínio. Uso de apontamento para slides ancora visualmente o que está sendo dito verbalmente - técnica didática clássica que aumenta retenção.',
      fundamento:
        'Framework GIVE (Gancho, Informação, Validação, Encerramento) aplicado naturalmente. Pedro já domina estrutura de raciocínio persuasivo sem forçar.',
      timestamps: ['00:36', '03:45'],
    },
    {
      tipo: 'PONTO_FORTE' as const,
      indicador: 'ASSERTIVIDADE',
      score: 85,
      categoria: 'excelente',
      evidencia:
        'Durante Q&A completo (3:54-6:55), respostas com propriedade absoluta. Quando perguntado sobre preço: números exatos sem hesitação. Quando questionado sobre diferencial técnico: explica modelo kanban, presets, IA - tudo com clareza e segurança. Não usa "eu acho", "talvez" ou linguagem hesitante.',
      impacto:
        'Transmite credibilidade de founder que conhece cada aspecto do negócio. A banca percebe que não há "ponto cego" no conhecimento do produto, aumentando confiança no potencial de execução.',
      fundamento:
        'Assertividade é a capacidade de ir direto ao ponto com segurança. Pedro não usa linguagem hedging quando afirma características do produto.',
      timestamps: ['04:29', '05:03', '05:51', '06:45'],
    },
    {
      tipo: 'PONTO_FORTE' as const,
      indicador: 'LIDERANÇA',
      score: 85,
      categoria: 'excelente',
      evidencia:
        'Presença de palco forte: anda de um lado para o outro (ocupação intencional do espaço, não nervosismo). Inclina tronco para frente ao ouvir perguntas (interesse genuíno). Referencia equipe: "Rafael nosso desenvolvedor tá ali no cantinho" (mostra que não é one-man show).',
      impacto:
        'A banca percebe alguém que já age como CEO - não como candidato pedindo aprovação. Isso gera confiança inconsciente no potencial de execução.',
      fundamento:
        'Liderança comunicacional é "liderar pela fala sem cargo" - transmitir autoridade através da presença, tom e escolha de palavras, independente de hierarquia formal.',
      timestamps: ['03:54', '04:51', '05:03', '06:05'],
    },

    // GAPS CRÍTICOS
    {
      tipo: 'GAP_CRITICO' as const,
      indicador: 'FLUÊNCIA',
      score: 72,
      categoria: 'forte',
      evidencia:
        'Pitch principal (0:36-3:28) bem controlado. Porém, no Q&A, vícios frequentes: "Ah, pro treinador pagar pra nós..." [4:29], "O que fez o Master Training surgir... Rafael nosso desenvolvedor..." [5:03], "Ah... tem várias funcionalidades..." [5:51], "Alimenta um gráfico, aham..." [6:45].',
      impacto:
        'No pitch ensaiado, fluência é boa. Mas no Q&A (improvisação), vícios aparecem. Em contexto de banca avaliadora, cada "ah..." pode ser inconscientemente associado a insegurança sobre o negócio. O cérebro usa preenchimentos vocais como "buffer" enquanto processa pergunta + formula resposta.',
      fundamento:
        '"Vícios de linguagem são as ervas daninhas da comunicação" (Aula 3: Fluência Magnética). Eles poluem a mensagem mesmo quando o conteúdo é excelente.',
      tecnica_recomendada:
        'Pausa Estratégica - substituir vícios por 1-2 segundos de silêncio intencional antes de responder',
      timestamps: ['04:29', '05:03', '05:51', '06:45'],
    },

    // GAPS SECUNDÁRIOS
    {
      tipo: 'GAP_SECUNDARIO' as const,
      indicador: 'MODULAÇÃO DE VOZ',
      score: 75,
      categoria: 'forte',
      evidencia:
        'Entre 1:05-1:45 e 2:40-3:10, velocidade acelera significativamente. Dados importantes como "280 pagantes ativos" e "1200 exercícios" passam rápido demais para "pousar" na cabeça da banca.',
      impacto:
        'Números são diferencial competitivo forte. Quando passam em alta velocidade, perdem impacto persuasivo. A audiência não tem tempo de processar a magnitude dos dados.',
      fundamento:
        'A modulação de voz depende da INTENÇÃO que você quer transmitir. É necessário pensar antes de falar para manter coerência entre intenção e execução.',
      tecnica_recomendada:
        'Modulação de Ritmo - desacelerar intencionalmente antes de números importantes',
      timestamps: ['01:05', '01:45', '02:40', '03:10'],
    },
    {
      tipo: 'GAP_SECUNDARIO' as const,
      indicador: 'CRIATIVIDADE',
      score: 78,
      categoria: 'forte',
      evidencia:
        'Abertura criativa: dados de mortalidade por obesidade como gancho para app de personal trainer eleva produto de "ferramenta de produtividade" para "instrumento de saúde pública". Fechamento: inversão do foco tradicional (de "eu" para "equipe/impacto"). Porém, durante Q&A, respostas são diretas e factuais sem uso de analogias ou metáforas.',
      impacto:
        'Abertura e fechamento demonstram criatividade narrativa. No Q&A, poderia usar analogias para simplificar conceitos técnicos para audiência leiga, mas isso é adequado para contexto de banca técnica.',
      fundamento:
        'Criatividade comunicacional é encontrar conexões não-óbvias que tornam mensagem memorável. Pedro demonstra isso na abertura (obesidade → app fitness) mas poderia expandir para outros momentos.',
      timestamps: ['00:36', '03:28'],
    },
  ],

  planos_acao: [
    {
      semanas: 'Semanas 1-2',
      foco: 'Eliminação de Vícios no Q&A',
      objetivo:
        'Reduzir em 50% as pausas preenchidas ("ah...", "é...", "hum...") durante respostas improvisadas.',
      criterios_sucesso: [
        'Gravação de baseline tem mais de 5 vícios em 2 minutos',
        'Gravação final tem menos de 3 vícios em 2 minutos',
        'Consegue responder perguntas sem começar com "Ah" ou "É"',
        'Sente conforto (não desconforto) durante pausas de 1-2 segundos',
      ],
    },
    {
      semanas: 'Semanas 3-4',
      foco: 'Modulação de Ritmo para Dados',
      objetivo:
        'Criar "micro-pausas de impacto" antes e depois de números/métricas importantes para aumentar retenção da audiência.',
      criterios_sucesso: [
        'Consegue listar de memória quais são seus dados-chave',
        'Sente diferença de ritmo ao falar números vs. resto do pitch',
        'Feedback de audiência confirma que lembram dos números',
        'Gravação mostra pausas visíveis antes/depois de dados',
      ],
    },
  ],

  mensagem_final: `Pedro, este relatório documenta o que foi captado no vídeo do Demo Day: um pitch de nível profissional que recebeu reconhecimento espontâneo da plateia ("foi o melhor que eu vi aí cara").

O Master Training tem um founder que sabe comunicar. A estrutura do pitch é exemplar - abertura com impacto emocional, progressão lógica impecável, fechamento humanizado. A assertividade durante o Q&A demonstra domínio completo do negócio.

Os pontos de desenvolvimento que identificamos - vícios no Q&A, velocidade em dados técnicos - são refinamentos de alto nível. São a diferença entre "muito bom" e "memorável". Entre top 3 e primeiro lugar.

O plano de ação está desenhado para ser executável em paralelo com as demandas do dia a dia de startup. São 15-20 minutos diários de prática intencional. Em 30 dias, a mudança será perceptível.

O ecossistema Genis está aqui para apoiar essa jornada. As aulas do Tríade 5.0 aprofundam os conceitos. Os exercícios documentados transformam teoria em habilidade. E as próximas análises vão medir a evolução.

O Master Training está salvando vidas através do exercício físico. E a comunicação é a ponte entre essa missão e os recursos necessários para escalar. Cada pitch, cada reunião de investidor, cada apresentação é uma oportunidade de avançar essa causa.

Manda ver.`,
};
