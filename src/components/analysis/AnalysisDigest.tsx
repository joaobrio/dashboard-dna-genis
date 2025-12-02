'use client';

import { motion } from 'framer-motion';
import { pedroWerlangAnalysis } from '@/data/pedro-werlang-analysis';
import { CheckCircle, Target, TrendingUp } from 'lucide-react';

const badgeByColor: Record<'green' | 'orange', string> = {
  green: 'text-green-300 bg-green-500/10 border-green-500/30',
  orange: 'text-orange-300 bg-orange-500/10 border-orange-500/30',
};

export function AnalysisDigest() {
  const a = pedroWerlangAnalysis;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Análise Narrativa — Feedback Supremo</h2>
          <p className="text-sm text-gray-400">
            Base documental para os dados do dashboard (pitch Demo Day — Master Training)
          </p>
        </div>
        <div className="text-sm text-gray-400 flex gap-3 flex-wrap">
          <span>Data: {a.meta.data}</span>
          <span>•</span>
          <span>Análise: {a.meta.analise}</span>
          <span>•</span>
          <span>{a.meta.contexto}</span>
          <span>•</span>
          <span>Duração: {a.meta.duracao}</span>
        </div>
      </div>

      {/* Sumário + Números */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Sumário Executivo</h3>
          <p className="text-gray-200 leading-relaxed mb-3">{a.sumario.visaoGeral}</p>
          <p className="text-gray-200 leading-relaxed">{a.sumario.sintese}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Números-Chave</h3>
          <div className="space-y-3">
            {a.numeros.map((item) => (
              <div key={item.rotulo} className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-400">{item.rotulo}</p>
                  <p className="text-xs text-gray-500">{item.detalhe}</p>
                </div>
                <span className="text-lg font-semibold text-white">{item.valor}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Forças e Gaps */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-genis-yellow" />
          <h3 className="text-lg font-semibold text-white">Forças e Gaps</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {a.destaques.map((item) => {
            const badge = badgeByColor[item.cor as keyof typeof badgeByColor] || badgeByColor.green;
            return (
              <div
                key={item.titulo}
                className={`rounded-xl border p-4 ${badge} bg-white/5`}
              >
                <p className="font-semibold text-white mb-1">{item.titulo}</p>
                <p className="text-sm text-gray-200 leading-relaxed">{item.texto}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plano 30 dias */}
      <div className="glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-genis-yellow" />
          <h3 className="text-lg font-semibold text-white">Plano de Ação — Próximos 30 dias</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-gray-400">Foco principal</p>
            <p className="text-white font-semibold">{a.plano30dias.focoPrincipal}</p>
            <p className="text-sm text-gray-400 mt-3">Foco secundário</p>
            <p className="text-white font-semibold">{a.plano30dias.focoSecundario}</p>
            <p className="text-sm text-gray-400 mt-3">Manutenção</p>
            <p className="text-white font-semibold">{a.plano30dias.manutencao}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white mb-2">Semana 1-2 — Fluência</p>
            <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
              {a.plano30dias.trilha12.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white mb-2">Semana 3-4 — Modulação</p>
            <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
              {a.plano30dias.trilha34.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Projeção e próximos passos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl border border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white mb-3">Projeção</h4>
          <div className="space-y-2 text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gray-300" />
              <span>{a.projecao.atual}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>{a.projecao.dias30}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-genis-yellow" />
              <span>{a.projecao.dias90}</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/10 p-4 md:col-span-2">
          <h4 className="text-sm font-semibold text-white mb-3">Próximos Passos</h4>
          <ul className="space-y-2 text-sm text-gray-200 list-disc list-inside">
            {a.proximosPassos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
