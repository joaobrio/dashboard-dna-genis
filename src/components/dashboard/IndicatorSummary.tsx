'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  checkCoreIndicators,
  getIndicadoresFlexiveis,
  type DnaGenisAnalysis,
  INDICADORES_CORE,
  INDICADORES_FLEXIVEIS,
} from '@/lib/zod-student';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';

interface IndicatorSummaryProps {
  analysis: DnaGenisAnalysis;
  className?: string;
  showFlexibleList?: boolean;
}

/**
 * IndicatorSummary Component
 *
 * Comprehensive summary card showing:
 * - Core indicators count: X/8
 * - Flexible indicators count: Y (optional list)
 * - Overall status with icon
 *
 * Features:
 * - Collapsible flexible indicators list
 * - Premium glassmorphism design
 * - Hover animations with GPU acceleration
 * - Accessible with ARIA labels
 * - Mobile-first responsive layout
 *
 * @example
 * ```tsx
 * <IndicatorSummary
 *   analysis={dnaAnalysis}
 *   showFlexibleList
 * />
 * ```
 */
export function IndicatorSummary({
  analysis,
  className,
  showFlexibleList = false,
}: IndicatorSummaryProps) {
  const { valid: coreValid, present: corePresent } = checkCoreIndicators(analysis);
  const { presentes: flexPresent, total: flexTotal } = getIndicadoresFlexiveis(analysis);

  // Format indicator names for display
  const formatIndicatorName = (code: string): string => {
    return code
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Card
      variant="glass"
      animate
      hoverLift
      glow
      glowColor={coreValid ? 'emerald' : 'amber'}
      className={cn('', className)}
      ariaLabel="Resumo de indicadores DNA Genis"
      role="region"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{coreValid ? '✓' : '⚠'}</span>
          Resumo de Indicadores
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Core Indicators Summary */}
        <motion.div
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="flex flex-col">
            <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
              Indicadores Core
            </span>
            <span className="text-2xl font-bold text-emerald-900 font-mono">
              {corePresent.length}/{INDICADORES_CORE.length}
            </span>
          </div>
          <div className="text-3xl">
            {coreValid ? '✓' : '⚠'}
          </div>
        </motion.div>

        {/* Flexible Indicators Summary */}
        <motion.div
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <div className="flex flex-col">
            <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">
              Indicadores Flexíveis
            </span>
            <span className="text-2xl font-bold text-purple-900 font-mono">
              {flexTotal}/{INDICADORES_FLEXIVEIS.length}
            </span>
          </div>
          <div className="text-2xl text-purple-600">
            ★
          </div>
        </motion.div>

        {/* Optional: List of flexible indicators */}
        {showFlexibleList && flexPresent.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="pt-2 border-t border-neutral-200"
          >
            <div className="text-xs font-semibold text-neutral-600 mb-2 uppercase tracking-wide">
              Flexíveis Presentes:
            </div>
            <div className="flex flex-wrap gap-2">
              {flexPresent.map((indicator) => (
                <motion.span
                  key={indicator}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {formatIndicatorName(indicator)}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Overall Status */}
        <div className="pt-3 border-t border-neutral-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 font-medium">
              Status Geral:
            </span>
            <span
              className={cn(
                'font-semibold',
                coreValid ? 'text-emerald-700' : 'text-amber-700'
              )}
            >
              {coreValid ? 'Completo' : 'Incompleto'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
