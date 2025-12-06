'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
  {
    variants: {
      category: {
        altaPerformance: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
        operacional: 'bg-amber-100 text-amber-800 border border-amber-200',
        essencial: 'bg-orange-100 text-orange-800 border border-orange-200',
        critico: 'bg-red-100 text-red-800 border border-red-200',
        forte: 'bg-amber-100 text-amber-800 border border-amber-200',
        excelente: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5',
      },
    },
    defaultVariants: {
      category: 'operacional',
      size: 'md',
    },
  }
);

interface CategoryBadgeProps extends VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function CategoryBadge({ label, category, size, className }: CategoryBadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ category, size }), className)}
      role="status"
      aria-label={`Categoria: ${label}`}
    >
      {label}
    </span>
  );
}
