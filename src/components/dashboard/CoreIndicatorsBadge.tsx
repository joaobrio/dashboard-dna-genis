'use client';

import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { checkCoreIndicators, type DnaGenisAnalysis, INDICADORES_CORE } from '@/lib/zod-student';

const badgeVariants = cva(
  'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-help',
  {
    variants: {
      status: {
        complete: 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100',
        incomplete: 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100',
      },
    },
    defaultVariants: {
      status: 'complete',
    },
  }
);

const iconVariants = cva('text-base', {
  variants: {
    status: {
      complete: 'text-emerald-600',
      incomplete: 'text-amber-600',
    },
  },
});

interface CoreIndicatorsBadgeProps extends VariantProps<typeof badgeVariants> {
  analysis: DnaGenisAnalysis;
  className?: string;
  showTooltip?: boolean;
}

/**
 * CoreIndicatorsBadge Component
 *
 * Displays compliance status of the 8 mandatory CORE indicators.
 * Shows "Core: 8/8 ✓" when complete (green) or "Core: 6/8 ⚠" when incomplete (yellow).
 *
 * Features:
 * - Hover tooltip with list of missing indicators (if any)
 * - Smooth animations on hover
 * - ARIA labels for accessibility
 * - Mobile-first responsive design
 *
 * @example
 * ```tsx
 * <CoreIndicatorsBadge analysis={dnaAnalysis} showTooltip />
 * ```
 */
export function CoreIndicatorsBadge({
  analysis,
  className,
  showTooltip = true,
}: CoreIndicatorsBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { valid, missing, present } = checkCoreIndicators(analysis);

  const status = valid ? 'complete' : 'incomplete';
  const icon = valid ? '✓' : '⚠';
  const label = `Core: ${present.length}/${INDICADORES_CORE.length}`;

  // Helper to format indicator names
  const formatIndicatorName = (code: string): string => {
    return code
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn(badgeVariants({ status }), className)}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        role="status"
        aria-label={
          valid
            ? `Todos os ${INDICADORES_CORE.length} indicadores core presentes`
            : `${missing.length} indicadores core ausentes: ${missing.join(', ')}`
        }
      >
        <span className="font-mono">{label}</span>
        <span className={iconVariants({ status })}>{icon}</span>
      </motion.div>

      {/* Tooltip with missing indicators */}
      {showTooltip && !valid && (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
              role="tooltip"
            >
              <div className="glass-card px-4 py-3 rounded-xl border border-amber-200/50 min-w-[200px] shadow-lg">
                <div className="text-xs font-semibold text-neutral-700 mb-2">
                  Indicadores ausentes:
                </div>
                <ul className="space-y-1">
                  {missing.map((indicator) => (
                    <li
                      key={indicator}
                      className="text-xs text-amber-700 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {formatIndicatorName(indicator)}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-white/80 border-r border-b border-amber-200/50 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
