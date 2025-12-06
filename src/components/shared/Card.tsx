'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { motion, HoverLift, HoverGlow } from '@/components/motion';

type CardVariant = 'solid' | 'glass' | 'glass-hover' | 'gradient-border';
type GlowColor = 'purple' | 'amber' | 'emerald' | 'orange' | 'red';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
  hoverLift?: boolean;
  glow?: boolean;
  glowColor?: GlowColor;
  animate?: boolean;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** ARIA role for semantic meaning */
  role?: 'region' | 'article' | 'group' | 'listitem';
}

const variantStyles: Record<CardVariant, string> = {
  solid: 'bg-white rounded-2xl border border-neutral-200 shadow-sm',
  glass: 'glass-card',
  'glass-hover': 'glass-card-hover',
  'gradient-border': 'card-gradient-border glass-card',
};

export function Card({
  children,
  className,
  variant = 'solid',
  hover = false,
  hoverLift = false,
  glow = false,
  glowColor = 'purple',
  animate = false,
  ariaLabel,
  role,
}: CardProps) {
  // Common ARIA props
  const ariaProps = {
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(role && { role }),
  };
  const baseClassName = cn(
    variantStyles[variant],
    'p-6',
    hover && variant === 'solid' && 'transition-all duration-200 hover:shadow-md hover:-translate-y-1',
    className
  );

  // Animated + Glow + Lift
  if (animate && glow && hoverLift) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <HoverGlow glowColor={glowColor}>
          <HoverLift className={baseClassName}>
            {children}
          </HoverLift>
        </HoverGlow>
      </motion.div>
    );
  }

  // Animated + Lift
  if (animate && hoverLift) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <HoverLift className={baseClassName}>
          {children}
        </HoverLift>
      </motion.div>
    );
  }

  // Animated + Glow
  if (animate && glow) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <HoverGlow glowColor={glowColor} className={baseClassName}>
          {children}
        </HoverGlow>
      </motion.div>
    );
  }

  // Animated only
  if (animate) {
    return (
      <motion.div
        className={baseClassName}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  }

  // Glow + Lift
  if (glow && hoverLift) {
    return (
      <HoverGlow glowColor={glowColor}>
        <HoverLift className={baseClassName}>
          {children}
        </HoverLift>
      </HoverGlow>
    );
  }

  // Lift only
  if (hoverLift) {
    return (
      <HoverLift className={baseClassName}>
        {children}
      </HoverLift>
    );
  }

  // Glow only
  if (glow) {
    return (
      <HoverGlow glowColor={glowColor} className={baseClassName}>
        {children}
      </HoverGlow>
    );
  }

  // Default
  return (
    <div className={baseClassName} {...ariaProps}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-neutral-900 headline-premium', className)}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}
