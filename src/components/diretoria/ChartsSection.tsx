'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import type { ConsolidatedMetrics, StudentSummary } from '@/lib/load-all-students';
import { CATEGORIA_CONFIG } from '@/lib/categoria-utils';

interface ChartsSectionProps {
  students: StudentSummary[];
  metrics: ConsolidatedMetrics;
}

export function ChartsSection({ students, metrics }: ChartsSectionProps) {
  // Dados para o gráfico de distribuição de scores
  const scoreDistribution = (() => {
    const ranges = [
      { label: '0-20', min: 0, max: 20 },
      { label: '21-40', min: 21, max: 40 },
      { label: '41-60', min: 41, max: 60 },
      { label: '61-80', min: 61, max: 80 },
      { label: '81-100', min: 81, max: 100 },
    ];

    return ranges.map((range) => ({
      name: range.label,
      count: students.filter((s) => s.scoreGeral >= range.min && s.scoreGeral <= range.max).length,
    }));
  })();

  // Dados para o gráfico de pilares
  const pilaresData = [
    { name: 'Oratória', value: metrics.mediaPilares.oratoria, color: '#3B82F6' },
    { name: 'Interpessoal', value: metrics.mediaPilares.interpessoal, color: '#10B981' },
    { name: 'Intrapessoal', value: metrics.mediaPilares.intrapessoal, color: '#8B5CF6' },
    { name: 'Repertório', value: metrics.mediaPilares.repertorio, color: '#E8D21D' },
  ];

  // Dados para o gráfico de pizza de categorias
  const categoriasData = Object.entries(metrics.distribuicaoCategorias)
    .filter(([, count]) => count > 0)
    .map(([categoria, count]) => ({
      name: CATEGORIA_CONFIG[categoria]?.label || categoria,
      value: count,
      color: CATEGORIA_CONFIG[categoria]?.color || '#9CA3AF',
    }));

  // Top 10 alunos por score
  const topStudents = [...students]
    .sort((a, b) => b.scoreGeral - a.scoreGeral)
    .slice(0, 10)
    .map((s) => ({
      name: s.nome.split(' ').slice(0, 2).join(' '), // Pega apenas primeiros 2 nomes
      score: s.scoreGeral,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribuicao de Scores */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição de Scores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
            <Bar dataKey="count" fill="#E8D21D" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparativo dos Pilares */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Média dos Pilares</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pilaresData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis type="category" dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
              formatter={(value: number) => value.toFixed(1)}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {pilaresData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 10 Ranking */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Top 10 Alunos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topStudents} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis type="category" dataKey="name" stroke="#9CA3AF" style={{ fontSize: '11px' }} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
              formatter={(value: number) => value.toFixed(1)}
            />
            <Bar dataKey="score" fill="#10B981" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribuicao por Categoria (Pizza) */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoriasData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${entry.value}`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {categoriasData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
