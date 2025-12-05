'use client';

import { motion } from 'framer-motion';
import { TrendPill } from './TrendPill';

interface PilarData {
  oratoria: number | null;
  interpessoal: number | null;
  intrapessoal: number | null;
  repertorio: number | null;
}

interface PillarEvolutionProps {
  video1: PilarData;
  video2: PilarData;
  deltas: PilarData;
}

const PILARES_CONFIG = [
  { key: 'oratoria' as const, nome: 'Oratória', color: 'from-blue-500/20 to-blue-600/10', borderColor: 'border-blue-500/30' },
  { key: 'interpessoal' as const, nome: 'Interpessoal', color: 'from-emerald-500/20 to-emerald-600/10', borderColor: 'border-emerald-500/30' },
  { key: 'intrapessoal' as const, nome: 'Intrapessoal', color: 'from-purple-500/20 to-purple-600/10', borderColor: 'border-purple-500/30' },
  { key: 'repertorio' as const, nome: 'Repertório', color: 'from-genis-yellow/20 to-genis-gold/10', borderColor: 'border-genis-yellow/30' },
];

export function PillarEvolution({ video1, video2, deltas }: PillarEvolutionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-2xl border border-white/10 p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-genis-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-xs uppercase tracking-[0.15em] text-gray-400">Pilares DNA Genis</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PILARES_CONFIG.map((pilar, idx) => {
          const v1 = video1[pilar.key];
          const v2 = video2[pilar.key];
          const delta = deltas[pilar.key];

          return (
            <motion.div
              key={pilar.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className={`relative overflow-hidden rounded-xl border ${pilar.borderColor} bg-gradient-to-br ${pilar.color} p-4`}
            >
              <p className="text-xs text-gray-400 mb-2">{pilar.nome}</p>

              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{v2 ?? '–'}</span>
                    {v1 !== null && (
                      <span className="text-sm text-gray-500">← {v1}</span>
                    )}
                  </div>
                </div>

                {delta !== null && (
                  <TrendPill value={delta} size="sm" />
                )}
              </div>

              {/* Progress bar */}
              {v2 !== null && (
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v2}%` }}
                    transition={{ delay: 0.3 + idx * 0.05, duration: 0.5 }}
                    className="h-full bg-white/30 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
