'use client';

import { motion } from 'framer-motion';
import { TrendPill } from './TrendPill';

interface EvolutionHeroProps {
  nome: string;
  scoreV1: number | null;
  scoreV2: number | null;
  delta: number | null;
  autoconfiancaV1: number | null;
  autoconfiancaV2: number | null;
  deltaAutoconfianca: number | null;
  dateV1?: string;
  dateV2?: string;
}

export function EvolutionHero({
  nome,
  scoreV1,
  scoreV2,
  delta,
  autoconfiancaV1,
  autoconfiancaV2,
  deltaAutoconfianca,
  dateV1 = '22/05/2024',
  dateV2 = '04/12/2025',
}: EvolutionHeroProps) {
  const categoria = delta !== null
    ? delta >= 15 ? 'Excelente' : delta >= 10 ? 'Forte' : delta >= 0 ? 'Adequado' : 'Atenção'
    : 'N/D';

  const categoriaColor = {
    'Excelente': 'text-emerald-400',
    'Forte': 'text-genis-yellow',
    'Adequado': 'text-orange-400',
    'Atenção': 'text-red-400',
    'N/D': 'text-gray-400',
  }[categoria];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-genis-yellow mb-1">Score Geral</p>
          <p className="text-sm text-gray-400">{dateV1} → {dateV2}</p>
        </div>
        {delta !== null && (
          <TrendPill value={delta} size="lg" />
        )}
      </div>

      <div className="flex items-end gap-4 mb-6">
        {/* V1 Score */}
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-400">{scoreV1 ?? '–'}</p>
          <p className="text-xs text-gray-500">Vídeo 01</p>
        </div>

        {/* Arrow */}
        <div className="flex items-center pb-3">
          <svg className="w-8 h-8 text-genis-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>

        {/* V2 Score */}
        <div className="text-center">
          <motion.p
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl font-bold text-white"
          >
            {scoreV2 ?? '–'}
          </motion.p>
          <p className="text-xs text-gray-500">Vídeo 02</p>
        </div>

        {/* Delta Badge */}
        {delta !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="ml-4"
          >
            <div className={`text-3xl font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {delta > 0 ? '+' : ''}{delta}
            </div>
            <p className="text-xs text-gray-500">pontos</p>
          </motion.div>
        )}
      </div>

      {/* Categoria */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Evolução</p>
          <p className={`text-sm font-semibold ${categoriaColor}`}>{categoria}</p>
        </div>

        {/* Autoconfiança */}
        {autoconfiancaV2 !== null && (
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Autoconfiança</p>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">{autoconfiancaV1?.toFixed(1) ?? '–'}%</span>
              <span className="text-gray-500">→</span>
              <span className="text-white font-semibold">{autoconfiancaV2.toFixed(1)}%</span>
              {deltaAutoconfianca !== null && (
                <TrendPill value={Number(deltaAutoconfianca.toFixed(1))} size="sm" />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
