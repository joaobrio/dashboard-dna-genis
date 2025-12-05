import { loadEvolucaoAlunos } from '@/lib/evolucao-loader';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Evolução - Sensorial 041225',
  description: 'Comparativo de evolução dos alunos entre os vídeos 01 e 02.',
};

export default async function EvolucaoIndexPage() {
  const alunos = loadEvolucaoAlunos();

  // Separate complete and incomplete
  const completos = alunos.filter(a => a.video1.scoreGeral !== null && a.video2.scoreGeral !== null);
  const incompletos = alunos.filter(a => a.video1.scoreGeral === null || a.video2.scoreGeral === null);

  // Stats
  const totalEvolucao = completos.reduce((acc, a) => acc + (a.delta || 0), 0);
  const mediaEvolucao = completos.length > 0 ? totalEvolucao / completos.length : 0;
  const evoluiram = completos.filter(a => (a.delta ?? 0) > 0).length;

  return (
    <main className="min-h-screen bg-genis-black text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-genis-yellow">Evolução</p>
          <h1 className="text-2xl sm:text-3xl font-bold">Vídeo 01 → Vídeo 02</h1>
          <p className="text-gray-400">
            Resumo de evolução dos alunos analisados nas sessões sensoriais.
          </p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Analisados" value={alunos.length.toString()} />
          <StatCard label="Com Evolução" value={completos.length.toString()} />
          <StatCard
            label="Evoluíram"
            value={`${evoluiram}/${completos.length}`}
            highlight={evoluiram === completos.length}
          />
          <StatCard
            label="Média Δ"
            value={mediaEvolucao > 0 ? `+${mediaEvolucao.toFixed(1)}` : mediaEvolucao.toFixed(1)}
            highlight={mediaEvolucao > 0}
          />
        </section>

        {/* Main Table */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 text-gray-300">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Aluno</th>
                  <th className="text-center px-4 py-3 font-semibold">Vídeo 01</th>
                  <th className="text-center px-4 py-3 font-semibold">Vídeo 02</th>
                  <th className="text-center px-4 py-3 font-semibold">Δ Score</th>
                  <th className="text-center px-4 py-3 font-semibold">Detalhe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {completos.map((a) => (
                  <tr key={a.slug} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/evolucao/${a.slug}`} className="font-semibold text-white hover:text-genis-yellow transition-colors">
                        {a.nome}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-300">{a.video1.scoreGeral ?? '–'}</span>
                      <span className="text-xs text-gray-500 block">{a.video1.date || ''}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white font-semibold">{a.video2.scoreGeral ?? '–'}</span>
                      <span className="text-xs text-gray-500 block">{a.video2.date || ''}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TrendPill value={a.delta} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/evolucao/${a.slug}`}
                        className="inline-flex items-center gap-1 text-genis-yellow hover:text-genis-gold transition-colors text-xs font-medium"
                      >
                        Ver evolução
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incomplete Section */}
        {incompletos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-400">Dados Incompletos</h2>
            <div className="glass-card rounded-2xl border border-white/10 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {incompletos.map((a) => (
                  <div key={a.slug} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300">{a.nome}</span>
                    <span className="text-xs text-gray-500">
                      {a.video1.scoreGeral === null ? 'Sem V1' : 'Sem V2'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Visual Cards Grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Destaques</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completos.slice(0, 6).map((a) => (
              <Link
                key={a.slug}
                href={`/evolucao/${a.slug}`}
                className="glass-card rounded-xl border border-white/10 p-4 hover:border-genis-yellow/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white group-hover:text-genis-yellow transition-colors">
                      {a.nome}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.video1.date} → {a.video2.date}
                    </p>
                  </div>
                  <TrendPill value={a.delta} />
                </div>

                <div className="flex items-end gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-400">{a.video1.scoreGeral}</p>
                    <p className="text-xs text-gray-500">V1</p>
                  </div>
                  <div className="text-genis-yellow pb-2">→</div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{a.video2.scoreGeral}</p>
                    <p className="text-xs text-gray-500">V2</p>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (a.delta ?? 0) > 0 ? 'bg-emerald-500/50' : (a.delta ?? 0) < 0 ? 'bg-red-500/50' : 'bg-gray-500/50'
                    }`}
                    style={{ width: `${Math.min(100, Math.abs(a.delta ?? 0) * 5)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="glass-card rounded-xl border border-white/10 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
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
