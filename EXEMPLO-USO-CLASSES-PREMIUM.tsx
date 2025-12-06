/**
 * EXEMPLOS DE USO - Classes CSS Premium
 * Dashboard DNA Genis
 *
 * Este arquivo demonstra como usar as novas classes CSS implementadas.
 * Copie e adapte os exemplos para seus componentes.
 */

import React from 'react';

// ============================================================================
// EXEMPLO 1: Score Card com GPU Glow
// ============================================================================

export function ScoreCardPremium({ score, category }: { score: number; category: string }) {
  // Determina a classe de glow baseada no score
  const getGlowClass = (score: number) => {
    if (score >= 85) return 'glow-gpu-alta-performance';
    if (score >= 70) return 'glow-gpu-operacional';
    if (score >= 50) return 'glow-gpu-essencial';
    return 'glow-gpu-critico';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#10B981]'; // Alta Performance
    if (score >= 70) return 'text-[#E8D21D]'; // Operacional
    if (score >= 50) return 'text-[#F97316]'; // Essencial
    return 'text-[#EF4444]'; // Crítico
  };

  return (
    <div className={`glass-card-hover ${getGlowClass(score)} p-6 rounded-2xl`}>
      <h3 className="text-white/70 text-sm font-medium mb-2">{category}</h3>
      <div className={`score-display-premium score-display-pulse ${getScoreColor(score)} text-6xl`}>
        {score}
      </div>
      <p className="text-white/50 text-xs mt-2">DNA Genis Score</p>
    </div>
  );
}

// Uso:
// <ScoreCardPremium score={87} category="Oratória" />

// ============================================================================
// EXEMPLO 2: Hero Section com Enhanced Glow
// ============================================================================

export function HeroSection() {
  return (
    <section className="bg-hero-glow-enhanced min-h-[60vh] flex items-center justify-center relative">
      <div className="glass-card texture-noise p-12 max-w-4xl mx-auto">
        <h1 className="font-display text-6xl font-bold text-white mb-4 headline-premium">
          Dashboard DNA Genis
        </h1>
        <p className="text-white/70 text-xl subheadline-premium">
          Análise de performance de comunicação baseada em 19 indicadores
        </p>
      </div>
    </section>
  );
}

// ============================================================================
// EXEMPLO 3: Card com Gradient Border
// ============================================================================

export function PremiumCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-gradient-border">
      <div className="glass-card texture-noise p-8">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Uso:
// <PremiumCard title="Evolução Mensal">
//   <p>Conteúdo aqui...</p>
// </PremiumCard>

// ============================================================================
// EXEMPLO 4: Score Display com todas as variações
// ============================================================================

export function ScoreVariants() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Alta Performance */}
      <div className="glass-card-hover glow-gpu-alta-performance p-6">
        <div className="score-display-premium text-[#10B981] text-5xl">
          92
        </div>
        <p className="text-white/60 mt-2 text-sm">Alta Performance</p>
      </div>

      {/* Operacional */}
      <div className="glass-card-hover glow-gpu-operacional p-6">
        <div className="score-display-premium score-display-pulse text-[#E8D21D] text-5xl">
          78
        </div>
        <p className="text-white/60 mt-2 text-sm">Operacional</p>
      </div>

      {/* Essencial */}
      <div className="glass-card-hover glow-gpu-essencial p-6">
        <div className="score-display-premium text-[#F97316] text-5xl">
          64
        </div>
        <p className="text-white/60 mt-2 text-sm">Essencial</p>
      </div>

      {/* Crítico */}
      <div className="glass-card-hover glow-gpu-critico p-6">
        <div className="score-display-premium text-[#EF4444] text-5xl">
          42
        </div>
        <p className="text-white/60 mt-2 text-sm">Crítico</p>
      </div>
    </div>
  );
}

// ============================================================================
// EXEMPLO 5: Dashboard Grid com múltiplos efeitos
// ============================================================================

export function DashboardGrid() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      {/* Hero com enhanced glow */}
      <div className="bg-hero-glow-enhanced pb-12">
        <div className="glass-card texture-noise p-8 mb-8">
          <h1 className="text-4xl font-bold text-white">Análise DNA Genis</h1>
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Card 1: Com GPU Glow */}
        <div className="glass-card-hover glow-gpu-operacional p-6">
          <h3 className="text-white text-lg mb-4">Score Geral</h3>
          <div className="score-display-premium text-[#E8D21D] text-6xl">
            85
          </div>
        </div>

        {/* Card 2: Com Gradient Border */}
        <div className="card-gradient-border">
          <div className="glass-card p-6">
            <h3 className="text-white text-lg mb-4">Evolução</h3>
            <p className="text-white/70">+12% este mês</p>
          </div>
        </div>

        {/* Card 3: Com Noise Texture */}
        <div className="glass-card-hover texture-noise p-6">
          <h3 className="text-white text-lg mb-4">Próximo Objetivo</h3>
          <p className="text-white/70">Melhorar Oratória</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// EXEMPLO 6: Hover States e Interatividade
// ============================================================================

export function InteractiveCard() {
  return (
    <button className="glass-card-hover glow-gpu-operacional p-6 w-full text-left transition-all">
      {/* Focus state é automaticamente aplicado via :focus-within */}
      <h3 className="text-white text-xl font-bold mb-2">Card Interativo</h3>
      <p className="text-white/70">
        Hover para ver o efeito de elevação e glow intensificado.
        Tab para ver o focus state com outline amarelo Genis.
      </p>
    </button>
  );
}

// ============================================================================
// EXEMPLO 7: Combinando múltiplas classes
// ============================================================================

export function UltraPremiumCard({ score }: { score: number }) {
  return (
    <div className="card-gradient-border">
      {/* Gradient border exterior */}
      <div className="glass-card-hover glow-gpu-alta-performance texture-noise p-8">
        {/* Glass effect + GPU glow + noise texture */}
        <div className="score-display-premium score-display-pulse text-[#10B981] text-7xl mb-4">
          {/* Score com glow multi-layer + pulse animation */}
          {score}
        </div>
        <p className="text-white/60">Performance DNA Genis</p>
      </div>
    </div>
  );
}

// Uso:
// <UltraPremiumCard score={94} />

// ============================================================================
// CLASSES CSS DISPONÍVEIS (Reference)
// ============================================================================

/**
 * GLASSMORPHISM:
 * - .glass - Base glass effect
 * - .glass-card - Premium glass card (ENHANCED)
 * - .glass-card-dark - Dark variant
 * - .glass-card-hover - Interactive hover (ENHANCED)
 *
 * GPU-OPTIMIZED GLOWS:
 * - .glow-gpu-alta-performance - Green glow
 * - .glow-gpu-operacional - Yellow glow (Genis)
 * - .glow-gpu-essencial - Orange glow
 * - .glow-gpu-critico - Red glow
 *
 * SCORE DISPLAY:
 * - .score-display - Base score typography
 * - .score-display-premium - Multi-layer glow (NEW)
 * - .score-display-pulse - Subtle pulse animation (NEW)
 *
 * BACKGROUNDS:
 * - .bg-hero-glow - Original hero glow
 * - .bg-hero-glow-enhanced - Multi-layer depth (NEW)
 * - .bg-genis-gradient - Brand gradient
 *
 * PREMIUM EFFECTS:
 * - .card-gradient-border - Animated gradient border (NEW)
 * - .texture-noise - Subtle grain texture (NEW)
 *
 * TYPOGRAPHY:
 * - .headline-premium - Premium headline style
 * - .subheadline-premium - Premium subheadline
 * - .font-display - Space Grotesk font
 * - .font-mono - JetBrains Mono
 */

// ============================================================================
// COLOR PALETTE (DNA Genis)
// ============================================================================

/**
 * CORE COLORS:
 * - Alta Performance: #10B981 (green-500)
 * - Operacional: #E8D21D (genis-yellow)
 * - Essencial: #F97316 (orange-500)
 * - Crítico: #EF4444 (red-500)
 *
 * BRAND:
 * - Genis Yellow: #E8D21D
 * - Genis Gold: #D4AF37
 * - Genis Black: #0A0A0A
 * - Genis Dark: #1A1A1A
 *
 * PILARES:
 * - Oratória: #3B82F6 (blue-500)
 * - Interpessoal: #10B981 (green-500)
 * - Intrapessoal: #8B5CF6 (violet-500)
 * - Repertório: #E8D21D (yellow-custom)
 */

// ============================================================================
// PERFORMANCE TIPS
// ============================================================================

/**
 * 1. GPU GLOWS são mais performáticos que box-shadow tradicionais
 *    Use .glow-gpu-* quando possível
 *
 * 2. TEXTURE NOISE é sutil (opacity: 0.02)
 *    Adicione apenas em cards grandes para evitar overhead
 *
 * 3. SCORE PULSE usa CSS animation
 *    Limite a poucos elementos por página (max 3-4)
 *
 * 4. GLASS CARDS já têm blur otimizado (12px)
 *    Não adicione blur extra via Tailwind
 *
 * 5. FOCUS STATES são automáticos
 *    .glass-card-hover:focus-within já está implementado
 */

export default {
  ScoreCardPremium,
  HeroSection,
  PremiumCard,
  ScoreVariants,
  DashboardGrid,
  InteractiveCard,
  UltraPremiumCard,
};
