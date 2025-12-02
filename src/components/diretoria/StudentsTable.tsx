'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import type { StudentSummary } from '@/lib/load-all-students';
import { getCategoriaConfig } from '@/lib/categoria-utils';

interface StudentsTableProps {
  students: StudentSummary[];
}

type SortField = 'nome' | 'scoreGeral' | 'scoreAutoconfianca' | 'oratoria' | 'interpessoal' | 'intrapessoal' | 'repertorio' | 'categoria';
type SortDirection = 'asc' | 'desc';

export function StudentsTable({ students }: StudentsTableProps) {
  const [sortField, setSortField] = useState<SortField>('scoreGeral');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null values - push to end
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return 1;
      if (bValue === null) return -1;

      // For categoria, use ordem predefinida
      if (sortField === 'categoria') {
        const ordem: Record<string, number> = {
          critico: 0,
          a_desenvolver: 1,
          adequado: 2,
          forte: 3,
          excelente: 4,
        };
        aValue = ordem[a.categoria] ?? 2;
        bValue = ordem[b.categoria] ?? 2;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue, 'pt-BR')
          : bValue.localeCompare(aValue, 'pt-BR');
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [students, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-genis-yellow transition-colors group"
    >
      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-genis-yellow' : 'text-gray-500 group-hover:text-genis-yellow'}`} />
    </button>
  );

  const formatScore = (score: number | null) => {
    if (score === null) return '-';
    return score.toFixed(1);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">
                <SortButton field="nome">Nome</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="scoreGeral">Score Geral</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="scoreAutoconfianca">Autoconfiança</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="oratoria">Oratória</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="interpessoal">Interpessoal</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="intrapessoal">Intrapessoal</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="repertorio">Repertório</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                <SortButton field="categoria">Categoria</SortButton>
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => {
              const categoriaConfig = getCategoriaConfig(student.categoria);
              return (
                <tr
                  key={student.slug}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    index % 2 === 0 ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium">{student.nome}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-lg font-bold">{formatScore(student.scoreGeral)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-purple-400">{formatScore(student.scoreAutoconfianca)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-blue-400">{formatScore(student.oratoria)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-green-400">{formatScore(student.interpessoal)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-purple-400">{formatScore(student.intrapessoal)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-yellow-400">{formatScore(student.repertorio)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoriaConfig.bgColor} ${categoriaConfig.textColor} border ${categoriaConfig.borderColor}`}>
                      {categoriaConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/${student.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-genis-yellow hover:text-genis-gold transition-colors"
                    >
                      Ver Dashboard
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
