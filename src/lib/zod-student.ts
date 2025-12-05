import { z } from 'zod';

export const dnaGenisAnalysisSchema = z.object({
  meta: z.object({
    versao: z.string(),
    timestamp: z.string(),
    analise_id: z.string(),
    aluno_id: z.string(),
  }),
  resumo: z.object({
    score_geral: z.number(),
    score_autoconfianca: z.number(),
    categoria_geral: z.string(),
    evolucao_percentual: z.number().nullable(),
    numero_analise: z.number(),
    dias_desde_anterior: z.number().nullable(),
  }),
  pilares: z.record(z.string(),
    z.object({
      score: z.number().nullable(),
      peso: z.number(),
      categoria: z.string().nullable(),
      delta: z.number().nullable(),
      indicador_ancora: z.string().nullable(),
      indicador_gap: z.string().nullable(),
      observacao: z.string().optional(), // Campo para pilar repertorio quando nao avaliavel
    })
  ),
  indicadores: z.array(
    z.object({
      codigo: z.string(),
      nome: z.string(),
      pilar: z.string(),
      score: z.number(),
      categoria: z.string(),
      delta: z.number().nullable(),
      confianca: z.number().optional(),
      evidencias: z.array(z.string()),
      timestamps: z.array(z.string()),
      aula_recomendada: z.string().nullable(),
      tecnica_recomendada: z.string().nullable(),
      prioridade_acao: z.number().nullable(),
      aplicavel: z.boolean().optional(),
    })
  ),
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
});

export type DnaGenisAnalysis = z.infer<typeof dnaGenisAnalysisSchema>;
