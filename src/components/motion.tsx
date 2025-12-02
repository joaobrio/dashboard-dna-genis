'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// === ANIMATION VARIANTS ===

export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    }
  }
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

export const scaleUpVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    }
  }
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

export const scoreRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
      delay: 0.3,
    }
  }
}

// === MOTION COMPONENTS ===

interface MotionDivProps extends HTMLMotionProps<'div'> {
  children: ReactNode
}

export function FadeUp({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={fadeUpVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleUp({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      variants={scaleUpVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={staggerContainerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverLift({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface HoverGlowProps extends MotionDivProps {
  glowColor?: 'purple' | 'amber' | 'emerald' | 'orange' | 'red'
}

export function HoverGlow({
  children,
  className,
  glowColor = 'purple',
  ...props
}: HoverGlowProps) {
  const glowColors = {
    purple: '0 0 30px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)',
    amber: '0 0 30px rgba(245, 158, 11, 0.5), 0 0 80px rgba(245, 158, 11, 0.3)',
    emerald: '0 0 30px rgba(16, 185, 129, 0.5), 0 0 80px rgba(16, 185, 129, 0.3)',
    orange: '0 0 30px rgba(249, 115, 22, 0.5), 0 0 80px rgba(249, 115, 22, 0.3)',
    red: '0 0 30px rgba(239, 68, 68, 0.5), 0 0 80px rgba(239, 68, 68, 0.3)',
  }

  return (
    <motion.div
      whileHover={{
        boxShadow: glowColors[glowColor],
        transition: { duration: 0.3 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScoreReveal({ children, className, ...props }: MotionDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scoreRevealVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// === ANIMATED BACKGROUND ORB ===

interface OrbProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'amber' | 'blue' | 'emerald'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  delay?: number
}

export function AnimatedOrb({
  size = 'md',
  color = 'purple',
  position = 'top-left',
  delay = 0,
}: OrbProps) {
  const sizes = {
    sm: 'w-48 h-48',
    md: 'w-80 h-80',
    lg: 'w-96 h-96',
  }

  const colors = {
    purple: 'bg-purple-500/10',
    amber: 'bg-amber-500/10',
    blue: 'bg-blue-500/10',
    emerald: 'bg-emerald-500/10',
  }

  const positions = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`absolute ${sizes[size]} ${colors[color]} ${positions[position]} rounded-full blur-[100px] pointer-events-none`}
    />
  )
}

// Re-export motion for direct use
export { motion }
