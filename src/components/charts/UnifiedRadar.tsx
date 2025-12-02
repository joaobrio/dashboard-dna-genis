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
    <div className="glass-card p-8 bg-white text-gray-900">
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart
          data={data}
          margin={{ top: 12, right: 12, bottom: 12, left: 12 }}
        >
          <PolarGrid
            stroke="rgba(232, 210, 29, 0.35)"
            strokeWidth={1.5}
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: '#111827',
              fontSize: 13,
              fontWeight: 600,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: '#4B5563',
              fontSize: 11,
              fontWeight: 500,
            }}
            tickLine={false}
            axisLine={false}
            stroke="#E5E7EB"
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#E8D21D"
            fill="#E8D21D"
            fillOpacity={0.18}
            strokeWidth={3}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0A0A0A',
              color: '#F9FAFB',
              border: '1px solid rgba(232, 210, 29, 0.35)',
              borderRadius: '12px',
              padding: '12px 14px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
            }}
            itemStyle={{ color: '#E8D21D', fontWeight: 700 }}
            labelStyle={{ color: '#F9FAFB', fontWeight: 700, marginBottom: '6px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
