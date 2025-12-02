'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { getScoreCategory, getCategoryLabelPt, type ScoreCategory } from '@/lib/design-tokens';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { motion, AnimatedOrb, ScoreReveal } from '@/components/motion';

const heroVariants = cva(
  'relative flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl transition-all overflow-hidden',
  {
    variants: {
      category: {
        altaPerformance: 'glass-card border-emerald-200/50',
        operacional: 'glass-card border-amber-200/50',
        essencial: 'glass-card border-orange-200/50',
        critico: 'glass-card border-red-200/50',
      },
    },
    defaultVariants: {
      category: 'operacional',
    },
  }
);

const scoreGradientVariants: Record<ScoreCategory, string> = {
  altaPerformance: 'gradient-text-alta-performance',
  operacional: 'gradient-text-operacional',
  essencial: 'gradient-text-essencial',
  critico: 'gradient-text-critico',
};

const scoreGlowVariants: Record<ScoreCategory, string> = {
  altaPerformance: 'glow-alta-performance',
  operacional: 'glow-operacional',
  essencial: 'glow-essencial',
  critico: 'glow-critico',
};

const orbColorMap: Record<ScoreCategory, 'emerald' | 'amber' | 'purple' | 'blue'> = {
  altaPerformance: 'emerald',
  operacional: 'amber',
  essencial: 'amber',
  critico: 'purple',
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
      {/* Animated Background Orbs */}
      <AnimatedOrb
        size="lg"
        color={orbColorMap[category]}
        position="top-left"
        delay={0}
      />
      <AnimatedOrb
        size="md"
        color="purple"
        position="bottom-right"
        delay={2}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Greeting */}
        <motion.span
          className="text-neutral-600 text-lg md:text-xl mb-2 subheadline-premium"
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

        {/* Main Score - Premium Display */}
        <ScoreReveal className="flex flex-col items-center my-6">
          <motion.div
            className={cn(
              'relative p-4 rounded-2xl',
              scoreGlowVariants[category]
            )}
            whileHover={{
              scale: 1.02,
              transition: { type: 'spring', stiffness: 300 }
            }}
          >
            <span
              className={cn(
                'text-7xl md:text-9xl score-display',
                scoreGradientVariants[category]
              )}
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              {score.toFixed(1)}
            </span>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <CategoryBadge
              label={categoryLabel}
              category={category === 'operacional' ? 'forte' : category}
              size="lg"
            />
          </motion.div>
        </ScoreReveal>

        {/* Autoconfianca Score */}
        {autoconfianca !== undefined && (
          <motion.div
            className="flex items-center gap-2 text-neutral-500 text-sm glass px-4 py-2 rounded-full"
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
          <span className="font-medium text-purple-600">DNA Genis</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
