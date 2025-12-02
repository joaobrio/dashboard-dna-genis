'use client';

import { Download } from 'lucide-react';
import type { StudentSummary } from '@/lib/load-all-students';

interface ExportButtonProps {
  students: StudentSummary[];
}

export function ExportButton({ students }: ExportButtonProps) {
  const handleExport = () => {
    const csvHeaders = 'Nome,Score Geral,Autoconfianca,Oratoria,Interpessoal,Intrapessoal,Repertorio,Categoria\n';
    const csvData = students
      .map((s) =>
        [
          `"${s.nome}"`,
          s.scoreGeral.toFixed(1),
          s.scoreAutoconfianca.toFixed(1),
          s.oratoria?.toFixed(1) ?? '-',
          s.interpessoal?.toFixed(1) ?? '-',
          s.intrapessoal?.toFixed(1) ?? '-',
          s.repertorio?.toFixed(1) ?? '-',
          s.categoria,
        ].join(',')
      )
      .join('\n');

    const blob = new Blob([csvHeaders + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dna-genis-alunos-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-genis-yellow/10 hover:bg-genis-yellow/20 border border-genis-yellow/20 hover:border-genis-yellow/40 rounded-lg transition-all text-sm font-medium text-genis-yellow"
    >
      <Download className="w-4 h-4" />
      Exportar CSV
    </button>
  );
}
