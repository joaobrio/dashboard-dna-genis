'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { TrendPill } from './TrendPill';
import type { DeltaIndicador } from '@/lib/evolucao-loader';

interface IndicatorRankingCardProps {
  title: string;
  subtitle?: string;
  indicadores: DeltaIndicador[];
  type: 'up' | 'down';
}

export function IndicatorRankingCard({ title, subtitle, indicadores, type }: IndicatorRankingCardProps) {
  const Icon = type === 'up' ? TrendingUp : TrendingDown;
  const iconColor = type === 'up' ? 'text-emerald-400' : 'text-red-400';
  const borderColor = type === 'up' ? 'border-emerald-500/20' : 'border-red-500/20';
  const bgGradient = type === 'up'
    ? 'from-emerald-500/5 to-transparent'
    : 'from-red-500/5 to-transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: type === 'up' ? 0.3 : 0.35 }}
      className={`glass-card rounded-2xl border border-white/10 ${borderColor} p-6 bg-gradient-to-br ${bgGradient}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="space-y-3">
        {indicadores.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum indicador nesta categoria</p>
        ) : (
          indicadores.map((ind, idx) => (
            <motion.div
              key={ind.nome}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  type === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <p className="text-sm text-white font-medium">{ind.nome}</p>
                  <p className="text-xs text-gray-500">
                    {ind.v1 ?? '–'} → {ind.v2 ?? '–'}
                  </p>
                </div>
              </div>
              <TrendPill value={ind.delta} size="sm" />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
