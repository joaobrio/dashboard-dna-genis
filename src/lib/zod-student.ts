import { z } from 'zod';

// ============================================================================
// ENUMS E CONSTANTES
// ============================================================================

/**
 * Categorias de performance possíveis para indicadores e pilares
 */
export const CategoriaPerformance = z.enum([
  'Alta Performance',
  'Operacional',
  'Essencial',
  'Crítico'
]);
export type CategoriaPerformance = z.infer<typeof CategoriaPerformance>;

/**
 * Pilares de avaliação do DNA Genis
 */
export const Pilar = z.enum([
  'oratoria',
  'interpessoal',
  'intrapessoal',
  'repertorio'
]);
export type Pilar = z.infer<typeof Pilar>;

/**
 * Indicadores CORE obrigatórios - devem estar presentes em TODOS os alunos
 */
export const INDICADORES_CORE = [
  'FLUENCIA',
  'DICCAO',
  'MODULACAO_VOZ',
  'LINGUAGEM_NAO_VERBAL',
  'PERSUASAO',
  'ADAPTABILIDADE',
  'LIDERANCA',
  'CRIATIVIDADE'
] as const;

/**
 * Indicadores FLEXÍVEIS opcionais - podem ou não estar presentes
 */
export const INDICADORES_FLEXIVEIS = [
  'RITMO',
  'DIDATICA',
  'AUTOCONFIANCA',
  'REPERTORIO_GERAL',
  'STORYTELLING',
  'ASSERTIVIDADE',
  'MARKETING_PESSOAL',
  'GRAMATICA'
] as const;

/**
 * Todos os indicadores possíveis (Core + Flexíveis)
 */
export const TODOS_INDICADORES = [...INDICADORES_CORE, ...INDICADORES_FLEXIVEIS] as const;

export type IndicadorCore = typeof INDICADORES_CORE[number];
export type IndicadorFlexivel = typeof INDICADORES_FLEXIVEIS[number];
export type IndicadorCodigo = typeof TODOS_INDICADORES[number];

// ============================================================================
// BUSINESS RULES VALIDATORS
// ============================================================================

/**
 * Valida se a categoria corresponde ao score
 * - Alta Performance: score >= 80
 * - Operacional: 60 <= score < 80
 * - Essencial: 40 <= score < 60
 * - Crítico: score < 40
 */
export function validarCategoriaVsScore(categoria: string, score: number): boolean {
  if (categoria === 'Alta Performance') return score >= 80;
  if (categoria === 'Operacional') return score >= 60 && score < 80;
  if (categoria === 'Essencial') return score >= 40 && score < 60;
  if (categoria === 'Crítico') return score < 40;
  return false;
}

/**
 * Retorna a categoria correta baseada no score
 */
export function getCategoriaByScore(score: number): CategoriaPerformance {
  if (score >= 80) return 'Alta Performance';
  if (score >= 60) return 'Operacional';
  if (score >= 40) return 'Essencial';
  return 'Crítico';
}

/**
 * Valida se a confiança está no range válido (0-1)
 */
export function validarConfianca(confianca?: number): boolean {
  if (confianca === undefined) return true;
  return confianca >= 0 && confianca <= 1;
}

// ============================================================================
// SCHEMAS BASE
// ============================================================================

/**
 * Schema para indicadores individuais com validações de business rules
 */
const indicadorSchema = z.object({
  codigo: z.string(),
  nome: z.string(),
  pilar: Pilar,
  score: z.number().min(0).max(100),
  categoria: CategoriaPerformance,
  delta: z.number().nullable(),
  confianca: z.number().min(0).max(1).optional(),
  evidencias: z.array(z.string()),
  timestamps: z.array(z.string()),
  aula_recomendada: z.string().nullable(),
  tecnica_recomendada: z.string().nullable(),
  prioridade_acao: z.number().nullable(),
  aplicavel: z.boolean().optional(),
}).refine(
  (data) => validarCategoriaVsScore(data.categoria, data.score),
  {
    message: 'Categoria não corresponde ao score. Use getCategoriaByScore() para correção.',
    path: ['categoria']
  }
);

/**
 * Schema para pilares com validações de score range e pesos
 */
const pilarSchema = z.object({
  score: z.number().min(0).max(100).nullable(),
  peso: z.number().min(0).max(1),
  categoria: CategoriaPerformance.nullable(),
  delta: z.number().nullable(),
  indicador_ancora: z.string().nullable(),
  indicador_gap: z.string().nullable(),
  observacao: z.string().optional(), // Campo para pilar repertorio quando nao avaliavel
}).refine(
  (data) => {
    // Se score existe e categoria existe, valida matching
    if (data.score !== null && data.categoria !== null) {
      return validarCategoriaVsScore(data.categoria, data.score);
    }
    return true; // Permite null em ambos (caso repertório não aplicável)
  },
  {
    message: 'Categoria do pilar não corresponde ao score',
    path: ['categoria']
  }
);

export const dnaGenisAnalysisSchema = z.object({
  meta: z.object({
    versao: z.string(),
    timestamp: z.string(),
    analise_id: z.string(),
    aluno_id: z.string(),
  }),
  resumo: z.object({
    score_geral: z.number().min(0).max(100),
    score_autoconfianca: z.number().min(0).max(100),
    categoria_geral: CategoriaPerformance,
    evolucao_percentual: z.number().nullable(),
    numero_analise: z.number(),
    dias_desde_anterior: z.number().nullable(),
  }).refine(
    (data) => validarCategoriaVsScore(data.categoria_geral, data.score_geral),
    {
      message: 'Categoria geral não corresponde ao score geral',
      path: ['categoria_geral']
    }
  ),
  pilares: z.record(Pilar, pilarSchema),
  indicadores: z.array(indicadorSchema),
  // Campos adicionais para evolucao e plano de acao
  evolucao: z.object({
    historico: z.array(z.object({
      data: z.string(),
      score_geral: z.number(),
      destaque: z.string(),
    })).optional(),
    tendencia: z.string().nullable().optional(),
    projecao_30_dias: z.number().optional(),
    projecao_90_dias: z.number().optional(),
  }).optional(),

  plano_acao: z.object({
    duracao_semanas: z.number().optional(),
    indicadores_priorizados: z.array(z.string()).optional(),
    trilhas: z.array(z.object({
      semanas: z.string(),
      foco: z.string(),
      objetivo: z.string(),
      aula_id: z.number().optional(),
      aula_nome: z.string().optional(),
      exercicios: z.array(z.object({
        nome: z.string(),
        frequencia: z.string(),
        duracao_minutos: z.number(),
      })).optional(),
      criterios_sucesso: z.array(z.string()).optional(),
    })).optional(),
    desafio_mes: z.object({
      nome: z.string(),
      descricao: z.string(),
    }).optional(),
  }).optional(),

  materiais: z.array(z.object({
    tipo: z.string(),
    nome: z.string(),
    indicador_relacionado: z.string(),
    prioridade: z.string(),
    link: z.string().nullable(),
  })).optional(),

  proximos_passos: z.object({
    imediatos: z.array(z.string()).optional(),
    curto_prazo: z.array(z.string()).optional(),
    proxima_avaliacao: z.string().optional(),
    meta_score_30_dias: z.number().optional(),
    meta_score_90_dias: z.number().optional(),
  }).optional(),

  // Campos para dados narrativos do AnalysisDigest (formato legado)
  narrativa: z.object({
    meta: z.object({
      data: z.string(),
      analise: z.string(),
      contexto: z.string(),
      duracao: z.string(),
    }),
    sumario: z.object({
      visaoGeral: z.string(),
      sintese: z.string(),
    }),
    numeros: z.array(z.object({
      rotulo: z.string(),
      valor: z.string(),
      detalhe: z.string(),
    })),
    destaques: z.array(z.object({
      titulo: z.string(),
      texto: z.string(),
      cor: z.string(),
    })),
    plano30dias: z.object({
      focoPrincipal: z.string(),
      focoSecundario: z.string(),
      manutencao: z.string(),
      trilha12: z.array(z.string()),
      trilha34: z.array(z.string()),
    }),
    projecao: z.object({
      atual: z.string(),
      dias30: z.string(),
      dias90: z.string(),
    }),
  proximosPassos: z.array(z.string()),
  }).optional(),
  insights: z.object({
    highlights: z.object({
      strengths: z.array(z.object({
        indicator: z.string(),
        label: z.string(),
        score: z.number(),
        severity: z.enum(['low', 'medium', 'high']),
        description: z.string().optional(),
      })),
      gaps: z.array(z.object({
        indicator: z.string(),
        label: z.string(),
        score: z.number(),
        severity: z.enum(['low', 'medium', 'high']),
        description: z.string().optional(),
      })),
    }),
    timeline: z.array(z.object({
      time: z.number(),
      label: z.string(),
      indicator: z.string().optional(),
      severity: z.enum(['low', 'medium', 'high']),
      category: z.string().optional(),
    })),
    confidence: z.array(z.object({
      indicator: z.string(),
      confidence: z.number(),
      severity: z.enum(['low', 'medium', 'high']),
    })),
  }).optional(),
}).refine(
  (data) => {
    // Validação 1: Soma dos pesos dos pilares deve ser aproximadamente 1.0 (tolerância de 0.01)
    const somaPesos = Object.values(data.pilares).reduce((sum, pilar) => sum + pilar.peso, 0);
    const pesoValido = Math.abs(somaPesos - 1.0) < 0.01;

    if (!pesoValido) {
      console.warn(`[VALIDAÇÃO] Soma dos pesos dos pilares = ${somaPesos.toFixed(3)} (esperado: 1.0)`);
    }

    return pesoValido;
  },
  {
    message: 'A soma dos pesos dos pilares deve ser 1.0 (encontrado diferente). Verifique os pesos.',
    path: ['pilares']
  }
).refine(
  (data) => {
    // Validação 2: Indicadores CORE obrigatórios devem estar presentes
    const codigosPresentes = new Set(data.indicadores.map(ind => ind.codigo));
    const coreAusentes = INDICADORES_CORE.filter(core => !codigosPresentes.has(core));

    if (coreAusentes.length > 0) {
      console.warn(`[VALIDAÇÃO] Indicadores CORE ausentes: ${coreAusentes.join(', ')}`);
    }

    return coreAusentes.length === 0;
  },
  {
    message: 'Indicadores CORE obrigatórios ausentes. Todos os 8 indicadores core devem estar presentes.',
    path: ['indicadores']
  }
);

export type DnaGenisAnalysis = z.infer<typeof dnaGenisAnalysisSchema>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Valida se um estudante tem todos os indicadores core obrigatórios
 */
export function checkCoreIndicators(analysis: DnaGenisAnalysis): {
  valid: boolean;
  missing: string[];
  present: string[];
} {
  const codigosPresentes = new Set(analysis.indicadores.map(ind => ind.codigo));
  const missing = INDICADORES_CORE.filter(core => !codigosPresentes.has(core));
  const present = INDICADORES_CORE.filter(core => codigosPresentes.has(core));

  return {
    valid: missing.length === 0,
    missing: [...missing],
    present: [...present]
  };
}

/**
 * Valida se a soma dos pesos dos pilares é 1.0 (com tolerância)
 */
export function checkPesoPilares(analysis: DnaGenisAnalysis, tolerancia = 0.01): {
  valid: boolean;
  soma: number;
  diferenca: number;
  detalhes: Record<string, number>;
} {
  const detalhes = Object.fromEntries(
    Object.entries(analysis.pilares).map(([key, pilar]) => [key, pilar.peso])
  );

  const soma = Object.values(analysis.pilares).reduce((sum, pilar) => sum + pilar.peso, 0);
  const diferenca = Math.abs(soma - 1.0);

  return {
    valid: diferenca < tolerancia,
    soma,
    diferenca,
    detalhes
  };
}

/**
 * Valida todas as business rules de uma análise
 */
export function validateStudent(analysis: DnaGenisAnalysis): {
  valid: boolean;
  errors: Array<{ rule: string; message: string; severity: 'error' | 'warning' }>;
} {
  const errors: Array<{ rule: string; message: string; severity: 'error' | 'warning' }> = [];

  // 1. Validar indicadores core
  const coreCheck = checkCoreIndicators(analysis);
  if (!coreCheck.valid) {
    errors.push({
      rule: 'core_indicators',
      message: `Indicadores CORE ausentes: ${coreCheck.missing.join(', ')}`,
      severity: 'error'
    });
  }

  // 2. Validar soma de pesos
  const pesoCheck = checkPesoPilares(analysis);
  if (!pesoCheck.valid) {
    errors.push({
      rule: 'peso_pilares',
      message: `Soma dos pesos = ${pesoCheck.soma.toFixed(3)} (esperado: 1.0, diferença: ${pesoCheck.diferenca.toFixed(3)})`,
      severity: 'error'
    });
  }

  // 3. Validar categoria geral vs score geral
  if (!validarCategoriaVsScore(analysis.resumo.categoria_geral, analysis.resumo.score_geral)) {
    errors.push({
      rule: 'categoria_score_geral',
      message: `Categoria geral "${analysis.resumo.categoria_geral}" não corresponde ao score ${analysis.resumo.score_geral}. Esperado: "${getCategoriaByScore(analysis.resumo.score_geral)}"`,
      severity: 'error'
    });
  }

  // 4. Validar categoria vs score de cada indicador
  analysis.indicadores.forEach((ind, idx) => {
    if (!validarCategoriaVsScore(ind.categoria, ind.score)) {
      errors.push({
        rule: 'categoria_score_indicador',
        message: `Indicador "${ind.nome}" (${ind.codigo}): categoria "${ind.categoria}" não corresponde ao score ${ind.score}. Esperado: "${getCategoriaByScore(ind.score)}"`,
        severity: 'error'
      });
    }

    // Validar confiança se presente
    if (ind.confianca !== undefined && !validarConfianca(ind.confianca)) {
      errors.push({
        rule: 'confianca_range',
        message: `Indicador "${ind.nome}" (${ind.codigo}): confiança ${ind.confianca} fora do range 0-1`,
        severity: 'error'
      });
    }
  });

  // 5. Validar categoria vs score de cada pilar
  Object.entries(analysis.pilares).forEach(([pilarKey, pilar]) => {
    if (pilar.score !== null && pilar.categoria !== null) {
      if (!validarCategoriaVsScore(pilar.categoria, pilar.score)) {
        errors.push({
          rule: 'categoria_score_pilar',
          message: `Pilar "${pilarKey}": categoria "${pilar.categoria}" não corresponde ao score ${pilar.score}. Esperado: "${getCategoriaByScore(pilar.score)}"`,
          severity: 'error'
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Corrige automaticamente categorias baseadas em scores
 */
export function autoFixCategorias(analysis: DnaGenisAnalysis): DnaGenisAnalysis {
  // Clonar para não mutar o original
  const fixed = JSON.parse(JSON.stringify(analysis)) as DnaGenisAnalysis;

  // Corrigir categoria geral
  fixed.resumo.categoria_geral = getCategoriaByScore(fixed.resumo.score_geral);

  // Corrigir categorias dos indicadores
  fixed.indicadores = fixed.indicadores.map(ind => ({
    ...ind,
    categoria: getCategoriaByScore(ind.score)
  }));

  // Corrigir categorias dos pilares
  Object.keys(fixed.pilares).forEach(key => {
    const pilar = fixed.pilares[key as Pilar];
    if (pilar.score !== null) {
      pilar.categoria = getCategoriaByScore(pilar.score);
    }
  });

  return fixed;
}

/**
 * Gera um relatório de validação formatado para console
 */
export function gerarRelatorioValidacao(analysis: DnaGenisAnalysis): string {
  const validation = validateStudent(analysis);
  const coreCheck = checkCoreIndicators(analysis);
  const pesoCheck = checkPesoPilares(analysis);

  const lines = [
    '=' .repeat(80),
    `RELATÓRIO DE VALIDAÇÃO - ${analysis.meta.aluno_id}`,
    '='.repeat(80),
    '',
    `Versão: ${analysis.meta.versao}`,
    `Análise ID: ${analysis.meta.analise_id}`,
    `Timestamp: ${analysis.meta.timestamp}`,
    '',
    '--- INDICADORES CORE ---',
    `Status: ${coreCheck.valid ? '✓ VÁLIDO' : '✗ INVÁLIDO'}`,
    `Presentes: ${coreCheck.present.length}/8`,
    coreCheck.missing.length > 0 ? `Ausentes: ${coreCheck.missing.join(', ')}` : '',
    '',
    '--- PESOS DOS PILARES ---',
    `Status: ${pesoCheck.valid ? '✓ VÁLIDO' : '✗ INVÁLIDO'}`,
    `Soma: ${pesoCheck.soma.toFixed(4)} (esperado: 1.0000)`,
    `Diferença: ${pesoCheck.diferenca.toFixed(4)}`,
    'Detalhes:',
    ...Object.entries(pesoCheck.detalhes).map(([k, v]) => `  ${k}: ${v.toFixed(4)}`),
    '',
    '--- VALIDAÇÃO GERAL ---',
    `Status: ${validation.valid ? '✓ TODOS OS TESTES PASSARAM' : '✗ ERROS ENCONTRADOS'}`,
    `Total de erros: ${validation.errors.length}`,
    '',
  ];

  if (validation.errors.length > 0) {
    lines.push('--- ERROS DETALHADOS ---');
    validation.errors.forEach((err, idx) => {
      lines.push(`${idx + 1}. [${err.severity.toUpperCase()}] ${err.rule}`);
      lines.push(`   ${err.message}`);
      lines.push('');
    });
  }

  lines.push('='.repeat(80));

  return lines.filter(l => l !== undefined).join('\n');
}

/**
 * Identifica indicadores flexíveis presentes em uma análise
 */
export function getIndicadoresFlexiveis(analysis: DnaGenisAnalysis): {
  presentes: string[];
  ausentes: string[];
  total: number;
} {
  const codigosPresentes = new Set(analysis.indicadores.map(ind => ind.codigo));
  const presentes = INDICADORES_FLEXIVEIS.filter(flex => codigosPresentes.has(flex));
  const ausentes = INDICADORES_FLEXIVEIS.filter(flex => !codigosPresentes.has(flex));

  return {
    presentes: [...presentes],
    ausentes: [...ausentes],
    total: presentes.length
  };
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Tipo para resultado de validação individual
 */
export type ValidationResult = {
  valid: boolean;
  errors: Array<{
    rule: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
};

/**
 * Tipo para indicador com informações adicionais
 */
export type IndicadorEnriquecido = z.infer<typeof indicadorSchema> & {
  isCore: boolean;
  isFlexivel: boolean;
};

/**
 * Converte um indicador em IndicadorEnriquecido
 */
export function enrichIndicador(indicador: z.infer<typeof indicadorSchema>): IndicadorEnriquecido {
  return {
    ...indicador,
    isCore: INDICADORES_CORE.includes(indicador.codigo as IndicadorCore),
    isFlexivel: INDICADORES_FLEXIVEIS.includes(indicador.codigo as IndicadorFlexivel)
  };
}
