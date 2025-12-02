# Handoff: Design Premium Dashboard DNA Genis

**Data:** 01/12/2025
**Autor:** Landing Page Builder Agent
**Referência:** LP Live Genis (lp-live-genis)
**Status:** Pronto para Implementação

---

## Sumário Executivo

O Dashboard DNA Genis atual está funcional, mas utiliza um design system básico. Para atingir o padrão visual premium do ecossistema Genis (exemplificado na LP do evento Nova Era), precisamos implementar uma série de otimizações que transformarão a experiência de "dashboard funcional" para "dashboard premium que impressiona".

**Objetivo:** Criar uma experiência visual que transmita a mesma sofisticação e exclusividade da marca Genis, fazendo o aluno sentir que está usando uma ferramenta de alto valor.

---

## 1. Análise do Gap Visual

### Estado Atual vs. Padrão Genis

| Aspecto | Dashboard Atual | Padrão LP Genis | Gap |
|---------|-----------------|-----------------|-----|
| **Cards** | Sólidos, brancos, bordas cinza | Glassmorphism, blur, transparência | Alto |
| **Animações** | Inline, básicas | Sistema de motion reutilizável | Médio |
| **Profundidade** | Flat, sem layers | Gradient orbs, glows, shadows | Alto |
| **Score Display** | Texto colorido simples | Gradient text + glow effect | Alto |
| **Background** | Cor sólida neutra | Animado com orbs flutuantes | Alto |
| **Botões** | Utilitários básicos | Premium com glow + spring | Médio |
| **Tipografia** | Padrão Tailwind | Premium tracking, custom leading | Baixo |
| **Interações** | Hover básico | Hover lift, scale, glow intensify | Médio |

### Impacto Visual Estimado

```
ANTES: Dashboard funcional, clean, mas "genérico"
       Percepção: "Ferramenta útil"

DEPOIS: Dashboard premium, sofisticado, impactante
        Percepção: "Ferramenta de elite"
```

---

## 2. Especificações Técnicas

### 2.1 Sistema de Cores Expandido

**Arquivo:** `tailwind.config.ts`

```typescript
const config = {
  theme: {
    extend: {
      colors: {
        // DNA Genis Brand
        dna: {
          purple: '#8B5CF6',
          'purple-light': '#A78BFA',
          'purple-dark': '#7C3AED',
        },
        // Score Categories
        score: {
          'alta-performance': '#10B981',
          'operacional': '#F59E0B',
          'essencial': '#F97316',
          'critico': '#EF4444',
        },
        // Pilares
        pilar: {
          oratoria: '#3B82F6',
          interpessoal: '#10B981',
          intrapessoal: '#8B5CF6',
          repertorio: '#F59E0B',
        },
        // Glass backgrounds
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          'white-hover': 'rgba(255, 255, 255, 0.10)',
        },
      },
    },
  },
}
```

### 2.2 CSS Variables (globals.css)

```css
@layer base {
  :root {
    /* Semantic Colors (HSL for theming) */
    --background: 220 14% 96%;
    --foreground: 224 71% 4%;
    --card: 0 0% 100%;
    --card-foreground: 224 71% 4%;
    --primary: 263 70% 50%;
    --primary-foreground: 0 0% 100%;

    /* Score Glows */
    --glow-alta-performance: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2);
    --glow-operacional: 0 0 20px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2);
    --glow-essencial: 0 0 20px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2);
    --glow-critico: 0 0 20px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.2);

    /* Premium Shadows */
    --shadow-soft-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
    --shadow-soft-md: 0 8px 30px rgba(0, 0, 0, 0.08);
    --shadow-soft-lg: 0 20px 50px rgba(0, 0, 0, 0.12);

    /* Border Radius */
    --radius: 1rem;
  }
}
```

### 2.3 Glassmorphism Classes

```css
@layer components {
  .glass {
    @apply bg-white/5 backdrop-blur-xl border border-white/10;
  }

  .glass-card {
    @apply bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl;
  }

  .glass-card-dark {
    @apply bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl;
  }

  .glass-card-hover {
    @apply glass-card transition-all duration-300;
    @apply hover:bg-white/90 hover:border-white/30 hover:shadow-soft-lg;
  }
}
```

### 2.4 Glow Effects por Categoria

```css
@layer utilities {
  /* Score Glows */
  .glow-alta-performance {
    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4),
                0 0 60px rgba(16, 185, 129, 0.2);
  }

  .glow-operacional {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.4),
                0 0 60px rgba(245, 158, 11, 0.2);
  }

  .glow-essencial {
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.4),
                0 0 60px rgba(249, 115, 22, 0.2);
  }

  .glow-critico {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4),
                0 0 60px rgba(239, 68, 68, 0.2);
  }

  /* Intense variants for hover/focus */
  .glow-alta-performance-intense {
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.6),
                0 0 80px rgba(16, 185, 129, 0.4),
                0 0 120px rgba(16, 185, 129, 0.2);
  }

  .glow-operacional-intense {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.6),
                0 0 80px rgba(245, 158, 11, 0.4),
                0 0 120px rgba(245, 158, 11, 0.2);
  }

  /* Pilar Glows */
  .glow-oratoria {
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
  }

  .glow-interpessoal {
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
  }

  .glow-intrapessoal {
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
  }

  .glow-repertorio {
    box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
  }
}
```

### 2.5 Premium Typography

```css
@layer utilities {
  .headline-premium {
    @apply font-bold leading-[1.1];
    letter-spacing: -0.03em;
  }

  .subheadline-premium {
    @apply font-medium leading-relaxed;
    letter-spacing: -0.02em;
  }

  .text-balance {
    text-wrap: balance;
  }

  .score-display {
    @apply font-extrabold leading-none;
    letter-spacing: -0.04em;
    font-feature-settings: "tnum" 1;
  }
}
```

### 2.6 Animated Background

```css
@layer utilities {
  .bg-gradient-radial {
    background: radial-gradient(var(--tw-gradient-stops));
  }

  .bg-hero-glow {
    background: radial-gradient(
      ellipse 80% 50% at 50% -20%,
      rgba(139, 92, 246, 0.15) 0%,
      transparent 50%
    );
  }
}
```

### 2.7 Custom Selection

```css
::selection {
  background: #8B5CF6;
  color: #FFFFFF;
}

::-moz-selection {
  background: #8B5CF6;
  color: #FFFFFF;
}
```

### 2.8 Premium Scrollbar

```css
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #A78BFA 0%, #8B5CF6 100%);
}
```

---

## 3. Componentes de Motion

### 3.1 Arquivo: `src/components/motion.tsx`

```typescript
'use client'

import { motion, HTMLMotionProps, Variants } from 'framer-motion'
import { ReactNode } from 'react'

// === VARIANTS ===

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

export function HoverGlow({
  children,
  className,
  glowColor = 'purple',
  ...props
}: MotionDivProps & { glowColor?: 'purple' | 'amber' | 'emerald' | 'orange' | 'red' }) {
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
  color?: 'purple' | 'amber' | 'blue'
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
  }

  const positions = {
    'top-left': 'top-1/4 left-1/4',
    'top-right': 'top-1/4 right-1/4',
    'bottom-left': 'bottom-1/4 left-1/4',
    'bottom-right': 'bottom-1/4 right-1/4',
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
      className={`absolute ${sizes[size]} ${colors[color]} ${positions[position]} rounded-full blur-[100px]`}
    />
  )
}

// Re-export motion for direct use
export { motion }
```

---

## 4. Componentes Atualizados

### 4.1 HeroScore Premium

**Arquivo:** `src/components/dashboard/HeroScore.tsx`

**Mudanças necessárias:**

1. Adicionar background orbs animados
2. Usar gradient text no score
3. Adicionar glow effect baseado na categoria
4. Usar ScoreReveal para animação de entrada
5. Glassmorphism no container

```tsx
// Exemplo de estrutura atualizada
<div className="relative overflow-hidden">
  {/* Background Orbs */}
  <AnimatedOrb size="lg" color="purple" position="top-left" />
  <AnimatedOrb size="md" color="amber" position="bottom-right" delay={2} />

  {/* Glass Container */}
  <div className="relative glass-card p-8 md:p-12">
    {/* Score com Glow */}
    <ScoreReveal>
      <span className={cn(
        'score-display text-7xl md:text-9xl',
        'bg-gradient-to-r bg-clip-text text-transparent',
        getCategoryGradient(score),
        getCategoryGlow(score)
      )}>
        {score.toFixed(1)}
      </span>
    </ScoreReveal>
  </div>
</div>
```

### 4.2 Card Premium

**Arquivo:** `src/components/shared/Card.tsx`

**Mudanças necessárias:**

1. Adicionar variante `glass`
2. Adicionar variante `glow`
3. Implementar `GradientBorderCard`
4. Usar HoverLift para interação

```tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'solid' | 'glass' | 'gradient-border'
  hover?: boolean
  glow?: boolean
  glowColor?: 'purple' | 'amber' | 'emerald'
}
```

### 4.3 PillarRadar Premium

**Arquivo:** `src/components/charts/PillarRadar.tsx`

**Mudanças necessárias:**

1. Container com glass effect
2. Glow sutil no gráfico
3. Animação de entrada com FadeUp
4. Tooltips com glassmorphism

### 4.4 IndicatorRanking Premium

**Arquivo:** `src/components/dashboard/IndicatorRanking.tsx`

**Mudanças necessárias:**

1. StaggerContainer para animação sequencial
2. Barras de progresso com gradient
3. Glow effect no indicador prioritário
4. Hover states com lift effect

---

## 5. Animações Tailwind Config

**Arquivo:** `tailwind.config.ts`

```typescript
animation: {
  'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  'fade-up': 'fade-up 0.6s ease-out',
  'fade-in': 'fade-in 0.4s ease-out',
  'slide-up': 'slide-up 0.5s ease-out',
  'score-reveal': 'score-reveal 0.8s ease-out',
  'gradient-shift': 'gradient-shift 8s ease infinite',
  'float': 'float 6s ease-in-out infinite',
},
keyframes: {
  'pulse-glow': {
    '0%, 100%': {
      transform: 'scale(1)',
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
    },
    '50%': {
      transform: 'scale(1.02)',
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)',
    },
  },
  'fade-up': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  'score-reveal': {
    '0%': {
      opacity: '0',
      transform: 'scale(0.5)',
      filter: 'blur(10px)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)',
      filter: 'blur(0px)',
    },
  },
  'float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
},
```

---

## 6. Checklist de Implementação

### Fase 1: Foundation (Estimativa: 2h)

- [ ] Atualizar `globals.css` com novas classes utilitárias
- [ ] Criar arquivo `src/components/motion.tsx`
- [ ] Atualizar `tailwind.config.ts` com cores e animations
- [ ] Adicionar premium scrollbar e selection styles
- [ ] Testar se build passa

### Fase 2: HeroScore Premium (Estimativa: 2h)

- [ ] Adicionar AnimatedOrbs ao background
- [ ] Implementar gradient text no score
- [ ] Adicionar glow effect por categoria
- [ ] Usar ScoreReveal para animação
- [ ] Converter container para glass-card
- [ ] Testar responsividade

### Fase 3: Cards & Components (Estimativa: 3h)

- [ ] Atualizar Card.tsx com variantes glass/glow
- [ ] Criar GradientBorderCard
- [ ] Atualizar PillarRadar com glass container
- [ ] Atualizar IndicatorRanking com StaggerContainer
- [ ] Adicionar HoverLift em cards interativos
- [ ] Testar acessibilidade (contraste, focus states)

### Fase 4: Polish & Details (Estimativa: 2h)

- [ ] Adicionar premium typography classes
- [ ] Refinar espaçamentos
- [ ] Ajustar intensidade de glows
- [ ] Testar performance (LCP, CLS)
- [ ] Validar em mobile
- [ ] Code review e cleanup

### Fase 5: Documentação (Estimativa: 1h)

- [ ] Atualizar README com design system
- [ ] Documentar novas classes utilitárias
- [ ] Criar exemplos de uso
- [ ] Commit e push

---

## 7. Métricas de Sucesso

### Visual

| Critério | Meta |
|----------|------|
| Primeiro impacto | "Wow, isso é premium" |
| Consistência visual | 100% alinhado com LP Genis |
| Micro-interações | Hover, focus, scroll-triggered |
| Depth perception | 3+ camadas visuais |

### Técnico

| Critério | Meta |
|----------|------|
| Lighthouse Performance | > 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Acessibilidade | WCAG 2.1 AA |
| Bundle size increase | < 10KB |

### UX

| Critério | Meta |
|----------|------|
| Time to understand score | < 3s |
| Visual hierarchy | Claro em 1 olhada |
| Mobile experience | Igual ao desktop |
| Delight factor | Animações suaves |

---

## 8. Referências Visuais

### LP Genis (lp-live-genis)

**O que copiar:**
- Glassmorphism cards (`bg-white/5 backdrop-blur-xl`)
- Glow effects em CTAs
- Background animated orbs
- Typography premium (letter-spacing tight)
- Hover lift effects
- Gradient text em headlines

**O que adaptar:**
- Cores: trocar amarelo Genis por roxo DNA Genis
- Tema: dark → light (mas manter sofisticação)
- Contexto: evento → dashboard pessoal

### Arquivos de Referência

```
/tmp/lp-genis-ref/lp-live-genis/
├── src/app/globals.css         # Classes utilitárias
├── tailwind.config.ts          # Cores, shadows, animations
├── src/components/motion.tsx   # Sistema de animações
├── src/components/ui/card.tsx  # Card premium patterns
├── src/components/ui/button.tsx # Button com glow
└── src/components/sections/hero.tsx # Background orbs
```

---

## 9. Notas Finais

### Prioridade de Implementação

1. **Must Have:** Glows no score, glassmorphism cards, motion system
2. **Should Have:** Background orbs, gradient text, stagger animations
3. **Nice to Have:** Premium scrollbar, selection colors, float animations

### Trade-offs

- **Performance vs. Visual:** Backdrop-blur pode impactar performance em devices antigos. Usar `@supports (backdrop-filter: blur(1px))` para fallback.
- **Complexidade vs. Manutenção:** Motion components adicionam abstração mas facilitam consistência.
- **Dark vs. Light:** Manter tema light mas usar elementos de design premium do dark (glows, transparências).

### Dependências

Nenhuma nova dependência necessária. Framer Motion já está instalado.

---

**Documento preparado para handoff de implementação.**

*Landing Page Builder Agent | 01/12/2025*
