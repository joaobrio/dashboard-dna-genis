/**
 * Tipos TypeScript - DNA Genis Dashboard
 * Baseado no framework DNA Genis 3.0 (19 indicadores, 4 pilares)
 */

// Tipos de Pilares
export type PilarType = 'ORATORIA' | 'INTERPESSOAL' | 'INTRAPESSOAL' | 'REPERTORIO';

// Tipos de Categoria de Score (escala oficial)
export type ScoreCategoryType = 'critico' | 'essencial' | 'forte' | 'excelente';

// Meta informações da análise
export interface AnalysisMeta {
  versao: string;
  timestamp: string;
  analise_id: string;
  aluno_id: string;
}

// Resumo da análise
export interface AnalysisSummary {
  score_geral: number;
  score_autoconfianca: number;
  categoria_geral: ScoreCategoryType;
  evolucao_percentual: number | null;
  numero_analise: number;
  dias_desde_anterior: number | null;
}

// Dados de um Pilar
export interface PillarData {
  score: number;
  peso: number;
  categoria: ScoreCategoryType;
  delta: number | null;
  indicador_ancora: string | null;
  indicador_gap: string | null;
  observacao?: string; // Campo para pilar repertorio quando nao avaliavel
}

// Dados de um Indicador
export interface Indicator {
  codigo: string;
  nome: string;
  pilar: PilarType;
  score: number;
  categoria: ScoreCategoryType;
  delta: number | null;
  confianca: number;
  evidencias: string[];
  timestamps: string[];
  aula_recomendada: string | null;
  tecnica_recomendada: string | null;
  prioridade_acao: number | null;
  aplicavel?: boolean;
}

// Dados de Evolução
export interface EvolutionHistory {
  data: string;
  score_geral: number;
  destaque: string;
}

export interface EvolutionData {
  historico: EvolutionHistory[];
  tendencia: string | null;
  projecao_30_dias: number;
  projecao_90_dias: number;
}

// Exercício do Plano de Ação
export interface Exercise {
  nome: string;
  frequencia: string;
  duracao_minutos: number;
}

// Trilha de Desenvolvimento
export interface Trail {
  semanas: string;
  foco: string;
  objetivo: string;
  aula_id: number;
  aula_nome: string;
  exercicios: Exercise[];
  criterios_sucesso: string[];
}

// Desafio do Mês
export interface Challenge {
  nome: string;
  descricao: string;
}

// Plano de Ação
export interface ActionPlan {
  duracao_semanas: number;
  indicadores_priorizados: string[];
  trilhas: Trail[];
  desafio_mes: Challenge;
}

// Material Complementar
export interface Material {
  tipo: 'aula' | 'tecnica' | 'exercicio' | 'leitura';
  nome: string;
  indicador_relacionado: string;
  prioridade: 'alta' | 'media' | 'baixa';
  link: string | null;
}

// Próximos Passos
export interface NextSteps {
  imediatos: string[];
  curto_prazo: string[];
  proxima_avaliacao: string;
  meta_score_30_dias: number;
  meta_score_90_dias: number;
}

// Estrutura completa da análise DNA Genis
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

// Dados formatados para o Radar Chart
export interface RadarChartData {
  pilar: string;
  score: number;
  fullMark: number;
}

// Dados formatados para as barras de indicadores
export interface IndicatorBarData {
  codigo: string;
  nome: string;
  score: number;
  pilar: PilarType;
  categoria: ScoreCategoryType;
  prioridade_acao: number | null;
}

// Props para componentes
export interface HeroScoreProps {
  score: number;
  categoryLabel: string;
  userName: string;
  analysisNumber: number;
  autoconfianca?: number;
}

export interface PillarRadarProps {
  data: RadarChartData[];
  highlightPilar?: string;
}

export interface IndicatorRankingProps {
  indicators: Indicator[];
  groupByPilar?: boolean;
}

// Helper type para pilares em português
export const PILAR_LABELS: Record<PilarType, string> = {
  ORATORIA: 'Oratória',
  INTERPESSOAL: 'Interpessoal',
  INTRAPESSOAL: 'Intrapessoal',
  REPERTORIO: 'Repertório',
};

// Pesos dos pilares
export const PILAR_PESOS: Record<PilarType, number> = {
  ORATORIA: 0.40,
  INTERPESSOAL: 0.20,
  INTRAPESSOAL: 0.25,
  REPERTORIO: 0.15,
};

// Cores dos pilares - Genis Design System
export const PILAR_COLORS: Record<PilarType, string> = {
  ORATORIA: '#3B82F6',
  INTERPESSOAL: '#10B981',
  INTRAPESSOAL: '#8B5CF6',
  REPERTORIO: '#E8D21D', // Genis Yellow
};

// Genis Brand Colors
export const GENIS_COLORS = {
  yellow: '#E8D21D',
  gold: '#D4AF37',
  black: '#0A0A0A',
  dark: '#1A1A1A',
} as const;
