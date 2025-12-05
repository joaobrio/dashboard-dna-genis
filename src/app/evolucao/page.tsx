import { loadEvolucaoAlunos } from '@/lib/evolucao-loader';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Evolução - Sensorial 041225',
  description: 'Comparativo de evolução dos alunos entre os vídeos 01 e 02.',
};

export default async function EvolucaoIndexPage() {
  const alunos = loadEvolucaoAlunos();

  return (
    <main className="min-h-screen bg-genis-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-genis-yellow">Evolução</p>
          <h1 className="text-3xl font-bold">Vídeo 01 → Vídeo 02</h1>
          <p className="text-gray-400">
            Resumo de evolução (Score Geral) dos alunos analisados nas sessões sensoriais.
          </p>
        </header>

        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Aluno</th>
                <th className="text-left px-4 py-3 font-semibold">Vídeo 01</th>
                <th className="text-left px-4 py-3 font-semibold">Vídeo 02</th>
                <th className="text-left px-4 py-3 font-semibold">Δ Score</th>
                <th className="text-left px-4 py-3 font-semibold">Detalhe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {alunos.map((a) => (
                <tr key={a.slug} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-semibold text-white">{a.nome}</td>
                  <td className="px-4 py-3 text-gray-200">
                    {a.video1.scoreGeral ?? '–'}
                    <span className="text-xs text-gray-500 block">{a.video1.date || ''}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-200">
                    {a.video2.scoreGeral ?? '–'}
                    <span className="text-xs text-gray-500 block">{a.video2.date || ''}</span>
                  </td>
                  <td className="px-4 py-3">
                    <TrendPill value={a.delta} />
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {a.slug === 'victoria'
                      ? <Link href="/evolucao/victoria" className="text-genis-yellow underline underline-offset-4">Abrir página</Link>
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function TrendPill({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-white/10 text-gray-400 bg-white/5">N/D</span>;
  }
  const trend = value > 0 ? 'up' : value < 0 ? 'down' : 'flat';
  const color =
    trend === 'up'
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
      : trend === 'down'
        ? 'bg-red-500/15 text-red-400 border-red-500/30'
        : 'bg-white/10 text-gray-300 border-white/10';
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
      <Icon className="w-3 h-3" />
      {value === 0 ? 'Estável' : `${value > 0 ? '+' : ''}${value}`}
    </span>
  );
}
