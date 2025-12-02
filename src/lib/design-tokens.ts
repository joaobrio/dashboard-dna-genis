/**
 * Design Tokens - DNA Genis Dashboard
 * Baseado no planejamento oficial e escala DNA Genis 3.0
 */

// Cores da escala oficial DNA Genis 3.0
export const colors = {
  // Escala de Performance
  score: {
    altaPerformance: '#10B981', // Verde - 85-100%
    operacional: '#F59E0B',     // Amarelo - 70-84%
    essencial: '#F97316',       // Laranja - 50-69%
    critico: '#EF4444',         // Vermelho - 0-49%
  },

  // Backgrounds por categoria
  scoreBg: {
    altaPerformance: 'from-emerald-50 to-emerald-100',
    operacional: 'from-amber-50 to-amber-100',
    essencial: 'from-orange-50 to-orange-100',
    critico: 'from-red-50 to-red-100',
  },

  // Bordas por categoria
  scoreBorder: {
    altaPerformance: 'border-emerald-200',
    operacional: 'border-amber-200',
    essencial: 'border-orange-200',
    critico: 'border-red-200',
  },

  // Neutros
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Accent
  accent: {
    primary: '#8B5CF6',   // Roxo - CTA principal
    secondary: '#EC4899', // Rosa - Notificações
  },

  // Pilares
  pilares: {
    oratoria: '#3B82F6',      // Azul
    interpessoal: '#10B981',  // Verde
    intrapessoal: '#8B5CF6',  // Roxo
    repertorio: '#F59E0B',    // Amarelo
  },
} as const;

// Tipografia
export const typography = {
  fontFamily: {
    display: '"Space Grotesk", sans-serif',
    body: '"Inter", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  fontSize: {
    display: '72px',
    h1: '32px',
    h2: '24px',
    h3: '20px',
    body: '16px',
    small: '14px',
    caption: '12px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1,
    snug: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

// Spacing (8px grid)
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Helper types
export type ScoreCategory = 'altaPerformance' | 'operacional' | 'essencial' | 'critico';

// Helper function para categorizar score
export function getScoreCategory(score: number): ScoreCategory {
  if (score >= 85) return 'altaPerformance';
  if (score >= 70) return 'operacional';
  if (score >= 50) return 'essencial';
  return 'critico';
}

// Helper function para obter cor do score
export function getScoreColor(score: number): string {
  const category = getScoreCategory(score);
  return colors.score[category];
}

// Helper function para obter label da categoria
export function getCategoryLabel(category: ScoreCategory): string {
  const labels: Record<ScoreCategory, string> = {
    altaPerformance: 'Alta Performance',
    operacional: 'Operacional',
    essencial: 'Essencial',
    critico: 'Cr\u00edtico',
  };
  return labels[category];
}

// Helper function para obter label da categoria em portugues
export function getCategoryLabelPt(score: number): string {
  const category = getScoreCategory(score);
  const labels: Record<ScoreCategory, string> = {
    altaPerformance: 'ALTA PERFORMANCE',
    operacional: 'FORTE',
    essencial: 'EM DESENVOLVIMENTO',
    critico: 'CR\u00cdTICO',
  };
  return labels[category];
}
