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
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';

interface PillarData {
  pilar: string;
  score: number;
  fullMark: number;
}

interface PillarRadarProps {
  data: PillarData[];
  title?: string;
}

// Custom Tooltip Component
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: PillarData }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-neutral-200">
        <p className="font-semibold text-neutral-900">{data.pilar}</p>
        <p className="text-2xl font-bold text-blue-600">{data.score}</p>
      </div>
    );
  }
  return null;
}

export function PillarRadar({ data, title = 'Seus 4 Pilares' }: PillarRadarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid
                  stroke="#E5E7EB"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis
                  dataKey="pilar"
                  tick={{ fill: '#374151', fontSize: 14, fontWeight: 500 }}
                  tickLine={false}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickCount={5}
                  axisLine={false}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.25}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    fill: '#3B82F6',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: '#3B82F6',
                    stroke: '#fff',
                    strokeWidth: 2,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with scores */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-neutral-100">
            {data.map((item) => (
              <div key={item.pilar} className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">{item.pilar}</span>
                <span className="text-sm font-semibold text-neutral-900">{item.score}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
