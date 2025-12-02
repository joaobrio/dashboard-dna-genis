export interface CategoriaConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

export const CATEGORIA_CONFIG: Record<string, CategoriaConfig> = {
  critico: {
    label: 'Crítico',
    color: '#EF4444',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/20',
  },
  a_desenvolver: {
    label: 'A Desenvolver',
    color: '#F97316',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/20',
  },
  adequado: {
    label: 'Adequado',
    color: '#E8D21D',
    bgColor: 'bg-yellow-400/10',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-400/20',
  },
  forte: {
    label: 'Forte',
    color: '#4ADE80',
    bgColor: 'bg-green-400/10',
    textColor: 'text-green-400',
    borderColor: 'border-green-400/20',
  },
  excelente: {
    label: 'Excelente',
    color: '#10B981',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/20',
  },
};

export function getCategoriaConfig(categoria: string): CategoriaConfig {
  return CATEGORIA_CONFIG[categoria] || CATEGORIA_CONFIG.adequado;
}
