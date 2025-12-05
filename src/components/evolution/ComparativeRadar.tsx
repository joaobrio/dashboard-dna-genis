'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { DeltaIndicador } from '@/lib/evolucao-loader';

interface ComparativeRadarProps {
  indicadores: DeltaIndicador[];
  title?: string;
}

export function ComparativeRadar({ indicadores, title = 'Mapa de Competências' }: ComparativeRadarProps) {
  // Filter indicadores that have at least one value
  const validIndicadores = indicadores.filter(i => i.v1 !== null || i.v2 !== null);

  // Transform data for Recharts
  const radarData = validIndicadores.map(ind => ({
    subject: ind.nome.length > 15 ? ind.nome.substring(0, 12) + '...' : ind.nome,
    fullName: ind.nome,
    v1: ind.v1 ?? 0,
    v2: ind.v2 ?? 0,
    delta: ind.delta,
    fullMark: 100,
  }));

  if (radarData.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <p className="text-gray-400 text-center">Sem dados de indicadores para comparação</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-2xl border border-white/10 p-6"
    >
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.15em] text-genis-yellow">{title}</p>
        <p className="text-sm text-gray-400 mt-1">Comparativo de indicadores V1 vs V2</p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <PolarGrid
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickCount={5}
              axisLine={false}
            />
            <Radar
              name="Vídeo 01"
              dataKey="v1"
              stroke="#E8D21D"
              fill="#E8D21D"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Vídeo 02"
              dataKey="v2"
              stroke="#D4AF37"
              fill="#D4AF37"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              formatter={(value) => <span className="text-gray-300 text-sm">{value}</span>}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
              }}
              labelStyle={{ color: '#E8D21D', fontWeight: 'bold', marginBottom: '8px' }}
              itemStyle={{ color: '#fff', fontSize: '12px' }}
              formatter={(value, name, props) => {
                const payload = props?.payload as { fullName?: string; delta?: number | null } | undefined;
                const delta = payload?.delta;
                const deltaStr = delta !== null && delta !== undefined ? ` (${delta > 0 ? '+' : ''}${delta})` : '';
                return [`${value}${name === 'Vídeo 02' ? deltaStr : ''}`, name];
              }}
              labelFormatter={(label, payload) => {
                const first = payload?.[0]?.payload as { fullName?: string } | undefined;
                return first?.fullName || String(label);
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend explanation */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-genis-yellow/50 border border-genis-yellow" />
          <span>Vídeo 01 (22/05/24)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-genis-gold/50 border border-genis-gold" />
          <span>Vídeo 02 (04/12/25)</span>
        </div>
      </div>
    </motion.div>
  );
}
