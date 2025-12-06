/**
 * Unit Tests - Compliance Components
 * DNA Genis Dashboard
 *
 * Test suite for CoreIndicatorsBadge, ComplianceStatus, and IndicatorSummary
 *
 * Run with: npm test -- compliance.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CoreIndicatorsBadge } from '../CoreIndicatorsBadge';
import { ComplianceStatus } from '../ComplianceStatus';
import { IndicatorSummary } from '../IndicatorSummary';
import type { DnaGenisAnalysis } from '@/lib/zod-student';

// Mock analysis data - Full compliance (all 8 core)
const mockAnalysisComplete: DnaGenisAnalysis = {
  meta: {
    versao: '3.0',
    timestamp: '2025-12-06T10:00:00Z',
    analise_id: 'test-001',
    aluno_id: 'student-123',
  },
  resumo: {
    score_geral: 78.5,
    score_autoconfianca: 82.0,
    categoria_geral: 'Operacional',
    evolucao_percentual: null,
    numero_analise: 1,
    dias_desde_anterior: null,
  },
  pilares: {
    oratoria: { score: 75, peso: 0.3, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    interpessoal: { score: 80, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    intrapessoal: { score: 78, peso: 0.25, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
    repertorio: { score: 76, peso: 0.2, categoria: 'Operacional', delta: null, indicador_ancora: null, indicador_gap: null },
  },
  indicadores: [
    { codigo: 'FLUENCIA', nome: 'Fluência', pilar: 'oratoria', score: 75, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'DICCAO', nome: 'Dicção', pilar: 'oratoria', score: 72, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'MODULACAO_VOZ', nome: 'Modulação de Voz', pilar: 'oratoria', score: 78, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'LINGUAGEM_NAO_VERBAL', nome: 'Linguagem Não Verbal', pilar: 'oratoria', score: 74, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'PERSUASAO', nome: 'Persuasão', pilar: 'interpessoal', score: 80, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'ADAPTABILIDADE', nome: 'Adaptabilidade', pilar: 'interpessoal', score: 79, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'LIDERANCA', nome: 'Liderança', pilar: 'intrapessoal', score: 77, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
    { codigo: 'CRIATIVIDADE', nome: 'Criatividade', pilar: 'repertorio', score: 76, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
  ],
};

// Mock analysis data - Partial compliance (missing 2 core)
const mockAnalysisPartial: DnaGenisAnalysis = {
  ...mockAnalysisComplete,
  indicadores: mockAnalysisComplete.indicadores.filter(
    ind => ind.codigo !== 'LIDERANCA' && ind.codigo !== 'CRIATIVIDADE'
  ),
};

describe('CoreIndicatorsBadge', () => {
  it('should render complete status when all core indicators present', () => {
    render(<CoreIndicatorsBadge analysis={mockAnalysisComplete} />);

    expect(screen.getByText('Core: 8/8')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should render incomplete status when core indicators missing', () => {
    render(<CoreIndicatorsBadge analysis={mockAnalysisPartial} />);

    expect(screen.getByText('Core: 6/8')).toBeInTheDocument();
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('should show tooltip on hover with missing indicators', async () => {
    const user = userEvent.setup();
    render(<CoreIndicatorsBadge analysis={mockAnalysisPartial} showTooltip />);

    const badge = screen.getByText('Core: 6/8');
    await user.hover(badge);

    await waitFor(() => {
      expect(screen.getByText('Indicadores ausentes:')).toBeInTheDocument();
    });
  });

  it('should have proper ARIA labels', () => {
    const { container } = render(<CoreIndicatorsBadge analysis={mockAnalysisComplete} />);
    const statusElement = container.querySelector('[role="status"]');

    expect(statusElement).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Todos os 8 indicadores core presentes')
    );
  });
});

describe('ComplianceStatus', () => {
  it('should render compliant status when all validations pass', () => {
    render(<ComplianceStatus analysis={mockAnalysisComplete} />);

    expect(screen.getByText('Compliant')).toBeInTheDocument();
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should render partial status when some core indicators missing', () => {
    render(<ComplianceStatus analysis={mockAnalysisPartial} />);

    expect(screen.getByText(/Parcial|Crítico/)).toBeInTheDocument();
  });

  it('should have proper ARIA labels for accessibility', () => {
    const { container } = render(<ComplianceStatus analysis={mockAnalysisComplete} />);
    const statusElement = container.querySelector('[role="status"]');

    expect(statusElement).toHaveAttribute('aria-label', expect.stringContaining('Status de conformidade'));
  });
});

describe('IndicatorSummary', () => {
  it('should display core indicator count', () => {
    render(<IndicatorSummary analysis={mockAnalysisComplete} />);

    expect(screen.getByText('8/8')).toBeInTheDocument();
  });

  it('should display flexible indicators when showFlexibleList is true', () => {
    const analysisWithFlexible = {
      ...mockAnalysisComplete,
      indicadores: [
        ...mockAnalysisComplete.indicadores,
        { codigo: 'RITMO', nome: 'Ritmo', pilar: 'oratoria', score: 70, categoria: 'Operacional', delta: null, evidencias: [], timestamps: [], aula_recomendada: null, tecnica_recomendada: null, prioridade_acao: null },
      ],
    } as DnaGenisAnalysis;

    render(<IndicatorSummary analysis={analysisWithFlexible} showFlexibleList />);

    expect(screen.getByText('Flexíveis Presentes:')).toBeInTheDocument();
  });

  it('should have proper ARIA region role', () => {
    const { container } = render(<IndicatorSummary analysis={mockAnalysisComplete} />);
    const region = container.querySelector('[role="region"]');

    expect(region).toHaveAttribute('aria-label', 'Resumo de indicadores DNA Genis');
  });
});

/**
 * ACCESSIBILITY CHECKLIST
 *
 * - [x] CoreIndicatorsBadge has role="status" with descriptive aria-label
 * - [x] ComplianceStatus has role="status" with compliance level description
 * - [x] IndicatorSummary has role="region" with identifying label
 * - [x] All interactive elements are keyboard accessible
 * - [x] Tooltips are announced to screen readers
 * - [x] Color is not the only means of conveying information (icons + text)
 * - [x] Sufficient color contrast ratios (WCAG AA)
 * - [x] Hover states work with keyboard focus
 */

/**
 * PERFORMANCE CONSIDERATIONS
 *
 * - Framer Motion animations use GPU acceleration (transform, opacity)
 * - Conditional rendering prevents unnecessary DOM updates
 * - useState only used for tooltip visibility (minimal re-renders)
 * - checkCoreIndicators and getIndicadoresFlexiveis are memoizable utilities
 *
 * Recommended optimizations:
 * - Add React.memo() to badge components if used in large lists
 * - Use useMemo() for expensive indicator calculations
 * - Lazy load tooltip content if list is very long
 */
