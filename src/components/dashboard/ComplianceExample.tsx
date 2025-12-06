'use client';

import React from 'react';
import { HeroScore } from './HeroScore';
import { IndicatorSummary } from './IndicatorSummary';
import type { DnaGenisAnalysis } from '@/lib/zod-student';

interface ComplianceExampleProps {
  analysis: DnaGenisAnalysis;
}

/**
 * ComplianceExample Component
 *
 * Example usage of all compliance components together.
 * Demonstrates the recommended layout and integration patterns.
 *
 * Usage:
 * ```tsx
 * import { ComplianceExample } from '@/components/dashboard/ComplianceExample';
 *
 * function Dashboard() {
 *   return <ComplianceExample analysis={dnaAnalysis} />;
 * }
 * ```
 *
 * Components used:
 * - HeroScore: Main score display with embedded compliance badges
 * - IndicatorSummary: Detailed breakdown card
 */
export function ComplianceExample({ analysis }: ComplianceExampleProps) {
  return (
    <div className="space-y-8">
      {/* Hero Score with integrated compliance badges */}
      <HeroScore
        score={analysis.resumo.score_geral}
        userName="Aluno"
        analysisNumber={analysis.resumo.numero_analise}
        autoconfianca={analysis.resumo.score_autoconfianca}
        analysisDate={new Date(analysis.meta.timestamp).toLocaleDateString('pt-BR')}
        analysis={analysis}
        showComplianceBadges
      />

      {/* Grid layout for additional compliance cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Indicator Summary Card */}
        <IndicatorSummary
          analysis={analysis}
          showFlexibleList
        />

        {/* Add other cards here as needed */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">
            Próximos Passos
          </h3>
          <p className="text-neutral-600 text-sm">
            Placeholder para ações recomendadas baseadas no compliance.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example with custom compliance detection logic
 */
export function ComplianceExampleWithLogic({ analysis }: ComplianceExampleProps) {
  // You can add custom business logic here
  const hasAllCore = analysis.indicadores.length >= 8;
  const hasFlexible = analysis.indicadores.length > 8;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Status de Compliance
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Indicadores Core:</span>
            <span className={hasAllCore ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>
              {hasAllCore ? 'Completo ✓' : 'Incompleto ⚠'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Indicadores Flexíveis:</span>
            <span className="text-purple-600 font-semibold">
              {hasFlexible ? 'Presente ★' : 'Ausente'}
            </span>
          </div>
        </div>
      </div>

      {/* Full components */}
      <HeroScore
        score={analysis.resumo.score_geral}
        userName="Aluno"
        analysisNumber={analysis.resumo.numero_analise}
        analysis={analysis}
      />
    </div>
  );
}
