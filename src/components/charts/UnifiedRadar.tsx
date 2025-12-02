'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface UnifiedRadarProps {
  data: Array<{
    subject: string;
    score: number;
    fullMark: number;
  }>;
}

export function UnifiedRadar({ data }: UnifiedRadarProps) {
  return (
    <div className="glass-card p-8">
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart data={data}>
          <PolarGrid
            stroke="rgba(232, 210, 29, 0.2)"
            strokeWidth={1}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#F9FAFB',
              fontSize: 14,
              fontWeight: 600,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#E8D21D"
            fill="#E8D21D"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(26, 26, 26, 0.95)',
              border: '1px solid rgba(232, 210, 29, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              backdropFilter: 'blur(12px)',
            }}
            itemStyle={{ color: '#E8D21D', fontWeight: 600 }}
            labelStyle={{ color: '#F9FAFB', fontWeight: 700, marginBottom: '4px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
