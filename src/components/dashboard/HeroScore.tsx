'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getScoreCategory, getCategoryLabelPt, type ScoreCategory } from '@/lib/design-tokens';
import { CategoryBadge } from '@/components/shared/CategoryBadge';

const heroVariants = cva(
  'flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl border-2 transition-all',
  {
    variants: {
      category: {
        altaPerformance: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
        operacional: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
        essencial: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
        critico: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
      },
    },
    defaultVariants: {
      category: 'operacional',
    },
  }
);

const scoreColorVariants: Record<ScoreCategory, string> = {
  altaPerformance: 'text-emerald-600',
  operacional: 'text-amber-600',
  essencial: 'text-orange-600',
  critico: 'text-red-600',
};

interface HeroScoreProps extends VariantProps<typeof heroVariants> {
  score: number;
  userName: string;
  analysisNumber: number;
  autoconfianca?: number;
  analysisDate?: string;
}

export function HeroScore({
  score,
  userName,
  analysisNumber,
  autoconfianca,
  analysisDate,
}: HeroScoreProps) {
  const category = getScoreCategory(score);
  const categoryLabel = getCategoryLabelPt(score);

  return (
    <motion.div
      className={cn(heroVariants({ category }))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Greeting */}
      <motion.span
        className="text-neutral-600 text-lg md:text-xl mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Olá, {userName}!
      </motion.span>

      {/* Score Label */}
      <motion.span
        className="text-neutral-500 text-sm md:text-base mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Sua comunicação está na categoria
      </motion.span>

      {/* Main Score */}
      <motion.div
        className="flex flex-col items-center my-6"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
      >
        <span
          className={cn(
            'text-6xl md:text-8xl font-extrabold tracking-tight',
            scoreColorVariants[category]
          )}
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          {score.toFixed(1)}
        </span>

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <CategoryBadge
            label={categoryLabel}
            category={category === 'operacional' ? 'forte' : category}
            size="lg"
          />
        </motion.div>
      </motion.div>

      {/* Autoconfianca Score */}
      {autoconfianca !== undefined && (
        <motion.div
          className="flex items-center gap-2 text-neutral-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span>Autoconfiança:</span>
          <span className="font-semibold text-neutral-700">{autoconfianca.toFixed(1)}</span>
        </motion.div>
      )}

      {/* Analysis Info */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-2 mt-6 text-neutral-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span>Análise #{analysisNumber}</span>
        {analysisDate && (
          <>
            <span className="hidden md:inline">•</span>
            <span>{analysisDate}</span>
          </>
        )}
        <span className="hidden md:inline">•</span>
        <span>DNA Genis</span>
      </motion.div>
    </motion.div>
  );
}
