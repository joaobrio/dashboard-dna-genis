'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  checkCoreIndicators,
  validarCategoriaVsScore,
  type DnaGenisAnalysis,
  INDICADORES_CORE,
} from '@/lib/zod-student';

const statusVariants = cva(
  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200',
  {
    variants: {
      level: {
        compliant: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        partial: 'bg-amber-50 text-amber-800 border-amber-200',
        critical: 'bg-red-50 text-red-800 border-red-200',
      },
    },
    defaultVariants: {
      level: 'compliant',
    },
  }
);

const indicatorVariants = cva('w-2 h-2 rounded-full', {
  variants: {
    level: {
      compliant: 'bg-emerald-500',
      partial: 'bg-amber-500',
      critical: 'bg-red-500',
    },
  },
});

interface ComplianceStatusProps extends VariantProps<typeof statusVariants> {
  analysis: DnaGenisAnalysis;
  className?: string;
}

/**
 * ComplianceStatus Component
 *
 * Visual badge with 3 compliance states:
 * - Green (compliant): 100% compliant (all core + correct category)
 * - Yellow (partial): Partially compliant (some missing core indicators)
 * - Red (critical): Critical issues (many missing core or severe errors)
 *
 * Validation criteria:
 * - All 8 CORE indicators must be present
 * - Category must match score range
 * - Score must be within valid bounds (0-100)
 *
 * Features:
 * - Animated pulse effect for critical status
 * - ARIA labels for screen readers
 * - Hover state with subtle scale animation
 *
 * @example
 * ```tsx
 * <ComplianceStatus analysis={dnaAnalysis} />
 * ```
 */
export function ComplianceStatus({ analysis, className }: ComplianceStatusProps) {
  // Check core indicators
  const { valid: coreValid, missing } = checkCoreIndicators(analysis);

  // Check category vs score alignment
  const categoryValid = validarCategoriaVsScore(
    analysis.resumo.categoria_geral,
    analysis.resumo.score_geral
  );

  // Determine compliance level
  const getComplianceLevel = (): 'compliant' | 'partial' | 'critical' => {
    if (coreValid && categoryValid) {
      return 'compliant';
    }

    // Critical if missing more than 3 core indicators or category severely misaligned
    if (missing.length > 3 || !categoryValid) {
      return 'critical';
    }

    return 'partial';
  };

  const level = getComplianceLevel();

  const statusLabels = {
    compliant: 'Compliant',
    partial: 'Parcial',
    critical: 'Crítico',
  };

  const statusIcons = {
    compliant: '✓',
    partial: '⚠',
    critical: '✗',
  };

  const getAriaLabel = (): string => {
    if (level === 'compliant') {
      return `Status de conformidade: Completo. Todos os ${INDICADORES_CORE.length} indicadores core presentes e categoria correta.`;
    }
    if (level === 'partial') {
      return `Status de conformidade: Parcial. ${missing.length} indicadores ausentes.`;
    }
    return `Status de conformidade: Crítico. ${missing.length} indicadores ausentes ou categoria incorreta.`;
  };

  return (
    <motion.div
      className={cn(statusVariants({ level }), className)}
      whileHover={{ scale: 1.05 }}
      animate={level === 'critical' ? { opacity: [1, 0.8, 1] } : {}}
      transition={
        level === 'critical'
          ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 400, damping: 20 }
      }
      role="status"
      aria-label={getAriaLabel()}
    >
      {/* Status indicator dot */}
      <motion.span
        className={indicatorVariants({ level })}
        animate={level === 'critical' ? { scale: [1, 1.3, 1] } : {}}
        transition={
          level === 'critical'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      />

      {/* Status label */}
      <span className="font-semibold">
        {statusLabels[level]}
      </span>

      {/* Status icon */}
      <span className="text-base">
        {statusIcons[level]}
      </span>
    </motion.div>
  );
}
