'use client';

import { ArrowUpRight, ArrowDownRight, Minus, Sparkles, X } from 'lucide-react';

type TrendType = 'up' | 'down' | 'flat' | 'new' | 'removed';

interface TrendPillProps {
  value: number | null;
  trend?: TrendType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function TrendPill({ value, trend: propTrend, size = 'md', showLabel = false }: TrendPillProps) {
  // Calculate trend from value if not provided
  const trend: TrendType = propTrend ?? (
    value === null ? 'flat' :
    value > 0 ? 'up' :
    value < 0 ? 'down' : 'flat'
  );

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-0.5',
    md: 'px-3 py-1 text-xs gap-1',
    lg: 'px-4 py-1.5 text-sm gap-1.5',
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colorClasses: Record<TrendType, string> = {
    up: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    down: 'bg-red-500/15 text-red-400 border-red-500/30',
    flat: 'bg-white/10 text-gray-300 border-white/10',
    new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    removed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  };

  const Icon = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    flat: Minus,
    new: Sparkles,
    removed: X,
  }[trend];

  const labels: Record<TrendType, string> = {
    up: 'Evoluiu',
    down: 'Regrediu',
    flat: 'Estável',
    new: 'Novo',
    removed: 'Removido',
  };

  const formatValue = () => {
    if (value === null) return labels[trend];
    if (value === 0) return 'Estável';
    return `${value > 0 ? '+' : ''}${value}`;
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${sizeClasses[size]} ${colorClasses[trend]}`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel ? labels[trend] : formatValue()}
    </span>
  );
}
