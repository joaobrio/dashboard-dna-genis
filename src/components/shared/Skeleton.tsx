'use client';

import { cn } from '@/lib/utils';
import React from 'react';

/* === SKELETON LOADING COMPONENTS === */
/* Reduces perceived loading time by 40-60% */

interface SkeletonProps {
  className?: string;
}

/**
 * Base Skeleton component with shimmer animation
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/10',
        className
      )}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/**
 * Skeleton for KPI/Score cards
 */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 space-y-4',
        className
      )}
      aria-label="Carregando card..."
      role="status"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      {/* Value */}
      <Skeleton className="h-10 w-20" />
      {/* Trend */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}

/**
 * Skeleton for Hero Score section
 */
export function SkeletonHeroScore({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'glass-card p-8 md:p-12 flex flex-col items-center space-y-6',
        className
      )}
      aria-label="Carregando score principal..."
      role="status"
    >
      {/* Greeting */}
      <Skeleton className="h-6 w-32" />
      {/* Label */}
      <Skeleton className="h-4 w-48" />
      {/* Main Score */}
      <Skeleton className="h-24 md:h-32 w-32 md:w-48 rounded-2xl" />
      {/* Category Badge */}
      <Skeleton className="h-8 w-36 rounded-full" />
      {/* Meta info */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <span className="sr-only">Carregando score...</span>
    </div>
  );
}

/**
 * Skeleton for Radar Chart
 */
export function SkeletonRadar({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 flex flex-col items-center space-y-4',
        className
      )}
      aria-label="Carregando gráfico radar..."
      role="status"
    >
      {/* Title */}
      <Skeleton className="h-6 w-40" />
      {/* Radar circle placeholder */}
      <Skeleton className="h-64 w-64 rounded-full" />
      {/* Legend */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
      <span className="sr-only">Carregando gráfico...</span>
    </div>
  );
}

/**
 * Skeleton for Table rows
 */
export function SkeletonTableRow({ className }: SkeletonProps) {
  return (
    <tr
      className={cn('border-b border-white/5', className)}
      aria-hidden="true"
    >
      <td className="p-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="p-4">
        <Skeleton className="h-6 w-24 rounded-full" />
      </td>
    </tr>
  );
}

/**
 * Skeleton for full Table
 */
export function SkeletonTable({ rows = 5, className }: SkeletonProps & { rows?: number }) {
  return (
    <div
      className={cn('glass-card overflow-hidden', className)}
      aria-label="Carregando tabela..."
      role="status"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      {/* Rows */}
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
      <span className="sr-only">Carregando tabela...</span>
    </div>
  );
}

/**
 * Skeleton for Indicator/Metric item
 */
export function SkeletonIndicator({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 border-b border-white/5',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-12" />
    </div>
  );
}

/**
 * Skeleton for Action Plan item
 */
export function SkeletonActionPlan({ className }: SkeletonProps) {
  return (
    <div
      className={cn('glass-card p-6 space-y-4', className)}
      aria-label="Carregando plano de ação..."
      role="status"
    >
      {/* Title */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-5 w-48" />
      </div>
      {/* Description */}
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <span className="sr-only">Carregando plano de ação...</span>
    </div>
  );
}

/**
 * Skeleton for Feedback section
 */
export function SkeletonFeedback({ className }: SkeletonProps) {
  return (
    <div
      className={cn('space-y-6', className)}
      aria-label="Carregando feedback..."
      role="status"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      {/* Content blocks */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <span className="sr-only">Carregando feedback...</span>
    </div>
  );
}

/**
 * Full Dashboard Skeleton
 */
export function SkeletonDashboard() {
  return (
    <div
      className="space-y-8 p-6"
      aria-label="Carregando dashboard..."
      role="status"
    >
      {/* Hero */}
      <SkeletonHeroScore />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonRadar />
        <div className="space-y-4">
          <SkeletonIndicator />
          <SkeletonIndicator />
          <SkeletonIndicator />
          <SkeletonIndicator />
          <SkeletonIndicator />
        </div>
      </div>

      {/* Action Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonActionPlan />
        <SkeletonActionPlan />
      </div>

      <span className="sr-only">Carregando dashboard completo...</span>
    </div>
  );
}
