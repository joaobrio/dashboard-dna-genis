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
});

export type DnaGenisAnalysis = z.infer<typeof dnaGenisAnalysisSchema>;
