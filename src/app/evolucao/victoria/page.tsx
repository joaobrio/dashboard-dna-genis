import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface VideoSnapshot {
  label: string;
  data: string;
  scoreGeral: number;
  pilares: Record<string, number>;
  fortalezas: { nome: string; score: number }[];
  gaps: { nome: string; score: number }[];
}

const video1: VideoSnapshot = {
  label: 'Vídeo 01',
  data: '22/05/2024',
  scoreGeral: 62,
  pilares: {
    Oratória: 58,
    Interpessoal: 70,
    Intrapessoal: 60,
  },
  fortalezas: [
    { nome: 'Gramática', score: 90 },
    { nome: 'Dicção', score: 85 },
    { nome: 'Marketing Pessoal', score: 85 },
  ],
  gaps: [
    { nome: 'Linguagem Não-Verbal', score: 45 },
    { nome: 'Assertividade', score: 50 },
    { nome: 'Liderança (Postura)', score: 60 },
  ],
};

const video2: VideoSnapshot = {
  label: 'Vídeo 02',
  data: '04/12/2025',
  scoreGeral: 74,
  pilares: {
    Oratória: 73,
    Interpessoal: 78,
    Intrapessoal: 72,
  },
  fortalezas: [
    { nome: 'Dicção', score: 85 },
    { nome: 'Didática', score: 85 },
    { nome: 'Persuasão', score: 80 },
  ],
  gaps: [
    { nome: 'Linguagem Não-Verbal', score: 65 },
    { nome: 'Gramática', score: 60 },
    { nome: 'Encerramento', score: 70 },
  ],
};

const delta = (a: number, b: number): { value: number; trend: 'up' | 'down' | 'flat' } => {
  const diff = b - a;
  return {
    value: diff,
    trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat',
  };
};

export const metadata = {
  title: 'Evolução Victória - DNA Genis',
  description: 'Comparativo de performance entre Vídeo 01 e Vídeo 02',
};

export default function EvolucaoVictoriaPage() {
  const scoreDelta = delta(video1.scoreGeral, video2.scoreGeral);

  return (
    <main className="min-h-screen bg-genis-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-genis-yellow">Evolução</p>
          <h1 className="text-3xl font-bold">Victória — Vídeo 01 → Vídeo 02</h1>
          <p className="text-gray-400">
            Análise comparativa das apresentações (22/05/2024 vs 04/12/2025) para evidenciar progresso e prioridades.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ComparisonCard title="Score Geral" before={video1.scoreGeral} after={video2.scoreGeral} />
          <ComparisonCard title="Oratória" before={video1.pilares.Oratória} after={video2.pilares.Oratória} />
          <ComparisonCard title="Interpessoal" before={video1.pilares.Interpessoal} after={video2.pilares.Interpessoal} />
          <ComparisonCard title="Intrapessoal" before={video1.pilares.Intrapessoal} after={video2.pilares.Intrapessoal} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HighlightsCard title="Fortalezas" before={video1.fortalezas} after={video2.fortalezas} />
          <HighlightsCard title="Gaps Prioritários" before={video1.gaps} after={video2.gaps} invert />
        </section>

        <section className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-genis-yellow">Resumo</p>
              <h2 className="text-xl font-semibold">O que melhorou e o que manter no foco</h2>
            </div>
            <TrendPill trend={scoreDelta.trend} value={scoreDelta.value} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
            <div className="space-y-2">
              <p className="text-white font-semibold">Melhorias nítidas</p>
              <ul className="space-y-1 list-disc list-inside text-gray-300">
                <li>Score geral +12 pontos (62 → 74), puxado por Oratória (+15) e Intrapessoal (+12).</li>
                <li>Postura: saiu de proteção (A1/A6) para maior abertura; linguagem não-verbal subiu 20 pts (45 → 65).</li>
                <li>Narrativa: introdução Shakespeare + metáfora da mochila elevam Didática e Persuasão.</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-white font-semibold">Próximo ciclo</p>
              <ul className="space-y-1 list-disc list-inside text-gray-300">
                <li>Fechamento: evitar quebra de persona no final; roteirizar frase de impacto.</li>
                <li>Gramática caiu (90 → 60) por coloquialismos; revisar concordância e registro.</li>
                <li>Consistência de mãos: manter zona de poder e plantar pés para eliminar resquícios de A1/A3.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
          <SnapshotCard snapshot={video1} />
          <SnapshotCard snapshot={video2} highlight />
        </section>
      </div>
    </main>
  );
}

function ComparisonCard({ title, before, after }: { title: string; before: number; after: number }) {
  const diff = after - before;
  const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
  return (
    <div className="glass-card rounded-2xl border border-white/10 p-5">
      <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-4xl font-bold text-white">{after}</p>
          <p className="text-sm text-gray-500">Vídeo 02</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-200">{before}</p>
          <p className="text-xs text-gray-500">Vídeo 01</p>
        </div>
      </div>
      <div className="mt-3">
        <TrendPill trend={trend} value={diff} />
      </div>
    </div>
  );
}

function HighlightsCard({
  title,
  before,
  after,
  invert = false,
}: {
  title: string;
  before: { nome: string; score: number }[];
  after: { nome: string; score: number }[];
  invert?: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-genis-yellow">{title}</p>
          <h3 className="text-lg font-semibold text-white">Top 3 (01 → 02)</h3>
        </div>
      </div>
      <div className="space-y-3">
        {after.map((item, idx) => {
          const beforeMatch = before.find((b) => b.nome.toLowerCase() === item.nome.toLowerCase());
          const diff = beforeMatch ? item.score - beforeMatch.score : null;
          const trend = diff === null ? 'up' : diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
          const displayScore = invert ? 100 - item.score : item.score;
          return (
            <div key={item.nome} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm text-gray-300">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-white font-medium">{item.nome}</p>
                  <p className="text-xs text-gray-500">
                    {beforeMatch ? `${beforeMatch.score} → ${item.score}` : `Novo: ${item.score}`}
                  </p>
                </div>
              </div>
              <TrendPill trend={trend} value={diff ?? 0} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrendPill({ trend, value }: { trend: 'up' | 'down' | 'flat'; value: number }) {
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
      {value === 0 ? 'Estável' : `${value > 0 ? '+' : ''}${value.toFixed(1)}`}
    </span>
  );
}

function SnapshotCard({ snapshot, highlight = false }: { snapshot: VideoSnapshot; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? 'border-genis-yellow/40 bg-genis-yellow/5' : 'border-white/10 bg-white/5'}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">{snapshot.label}</p>
          <h4 className="text-lg font-semibold text-white">{snapshot.data}</h4>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{snapshot.scoreGeral}</p>
          <p className="text-xs text-gray-400">Score Geral</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        {Object.entries(snapshot.pilares).map(([p, v]) => (
          <div key={p} className="bg-white/5 rounded-lg px-3 py-2 border border-white/5">
            <p className="text-[11px] uppercase tracking-wide text-gray-400">{p}</p>
            <p className="text-white font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-400 mb-1">Fortalezas</p>
          <ul className="space-y-1 text-gray-200">
            {snapshot.fortalezas.map((f) => (
              <li key={f.nome} className="flex justify-between">
                <span>{f.nome}</span>
                <span className="text-white font-semibold">{f.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Gaps</p>
          <ul className="space-y-1 text-gray-200">
            {snapshot.gaps.map((g) => (
              <li key={g.nome} className="flex justify-between">
                <span>{g.nome}</span>
                <span className="text-white font-semibold">{g.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
