'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { motion, FadeUp, StaggerContainer, StaggerItem } from '@/components/motion';

interface PillarData {
  pilar: string;
  score: number;
  fullMark: number;
}

interface PillarRadarProps {
  data: PillarData[];
  title?: string;
}

// Pilar color mapping - Genis Design System
const pilarColors: Record<string, string> = {
  'Oratória': '#3B82F6',
  'Interpessoal': '#10B981',
  'Intrapessoal': '#8B5CF6',
  'Repertório': '#E8D21D', // Genis Yellow
};

// Genis Brand Colors
const GENIS_YELLOW = '#E8D21D';
const GENIS_GOLD = '#D4AF37';

const pilarGlowClasses: Record<string, string> = {
  'Oratória': 'glow-oratoria',
  'Interpessoal': 'glow-interpessoal',
  'Intrapessoal': 'glow-intrapessoal',
  'Repertório': 'glow-repertorio',
};

// Custom Tooltip Component with glassmorphism
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: PillarData }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = pilarColors[data.pilar] || '#3B82F6';

    return (
      <div className="glass-card px-4 py-3">
        <p className="font-semibold text-neutral-900">{data.pilar}</p>
        <p
          className="text-2xl font-bold"
          style={{ color }}
        >
          {data.score}
        </p>
      </div>
    );
  }
  return null;
}

export function PillarRadar({ data, title = 'Seus 4 Pilares' }: PillarRadarProps) {
  return (
    <FadeUp>
      <Card variant="glass" animate>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            className="h-[350px] w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="pilar"
                  tick={{ fill: '#374151', fontSize: 14, fontWeight: 500, dy: -4 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={45}
                  domain={[0, 100]}
                  tick={{ fill: '#9CA3AF', fontSize: 11 }}
                  tickCount={5}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={GENIS_YELLOW}
                  fill="url(#radarGradient)"
                  fillOpacity={0.5}
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: GENIS_YELLOW,
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 7,
                    fill: GENIS_GOLD,
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
                <defs>
                  <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={GENIS_YELLOW} stopOpacity={0.6} />
                    <stop offset="100%" stopColor={GENIS_GOLD} stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Legend with scores - Staggered animation */}
          <StaggerContainer className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-neutral-100">
            {data.map((item) => (
              <StaggerItem key={item.pilar}>
                <motion.div
                  className="flex items-center justify-between p-2 rounded-lg transition-all hover:bg-neutral-50"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: pilarColors[item.pilar] || '#3B82F6' }}
                    />
                    <span className="text-sm text-neutral-600">{item.pilar}</span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: pilarColors[item.pilar] || '#3B82F6' }}
                  >
                    {item.score}
                  </span>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </CardContent>
      </Card>
    </FadeUp>
  );
}
