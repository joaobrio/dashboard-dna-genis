'use client';

import { Card } from '@/components/shared/Card';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Quote,
  Target,
  Lightbulb,
} from 'lucide-react';

interface FeedbackItem {
  tipo: 'PONTO_FORTE' | 'GAP_CRITICO' | 'GAP_SECUNDARIO';
  indicador: string;
  score: number;
  categoria: string;
  evidencia: string;
  impacto: string;
  fundamento?: string;
  tecnica_recomendada?: string;
  timestamps?: string[];
}

interface PlanoAcao {
  semanas: string;
  foco: string;
  objetivo: string;
  criterios_sucesso: string[];
}

interface FeedbackSupremoProps {
  analise_id: string;
  data_analise: string;
  contexto: string;
  feedback_items: FeedbackItem[];
  mensagem_final: string;
  planos_acao: PlanoAcao[];
}

export function FeedbackSupremo({
  analise_id,
  data_analise,
  contexto,
  feedback_items,
  mensagem_final,
  planos_acao,
}: FeedbackSupremoProps) {
  // Separar feedback por tipo
  const pontos_fortes = feedback_items.filter((item) => item.tipo === 'PONTO_FORTE');
  const gaps_criticos = feedback_items.filter((item) => item.tipo === 'GAP_CRITICO');
  const gaps_secundarios = feedback_items.filter((item) => item.tipo === 'GAP_SECUNDARIO');

  return (
    <div className="space-y-8">
      {/* Hero: Contexto da Análise */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-purple-50 border-purple-200">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-purple-600" />
                <h2 className="text-2xl font-bold text-neutral-900">
                  Análise Detalhada por Pilar
                </h2>
              </div>
              <p className="text-sm text-neutral-500">
                {data_analise} • {analise_id}
              </p>
            </div>
            <CategoryBadge category="SUPREMO" size="lg" />
          </div>

          <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-purple-100">
            <p className="text-sm font-medium text-purple-900 leading-relaxed">
              {contexto}
            </p>
          </div>
        </div>
      </Card>

      {/* Seção 1: Pontos Fortes (Âncoras) */}
      {pontos_fortes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Pontos Fortes</h3>
                  <p className="text-sm text-neutral-500">
                    Suas âncoras de excelência - mantenha e capitalize
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {pontos_fortes.map((item, index) => (
                  <FeedbackItemCard
                    key={index}
                    item={item}
                    variant="strong"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Seção 2: Gaps Críticos (Prioridade Máxima) */}
      {gaps_criticos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-white">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-orange-100">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Gaps Críticos</h3>
                  <p className="text-sm text-neutral-600">
                    Prioridade máxima - foco imediato nos próximos 30 dias
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {gaps_criticos.map((item, index) => (
                  <FeedbackItemCard
                    key={index}
                    item={item}
                    variant="critical"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Seção 3: Gaps Secundários (Refinamento) */}
      {gaps_secundarios.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Oportunidades de Refinamento
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Desenvolvimentos complementares - abordar após gaps críticos
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {gaps_secundarios.map((item, index) => (
                  <FeedbackItemCard
                    key={index}
                    item={item}
                    variant="secondary"
                    index={index}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Seção 4: Plano de Ação Imediato */}
      {planos_acao.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 via-white to-white border-purple-200">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-purple-100">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Próximos Passos: Seu Plano Personalizado
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Ações específicas para maximizar seu desenvolvimento
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {planos_acao.map((plano, index) => (
                  <PlanoAcaoCard key={index} plano={plano} index={index} />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Seção 5: Mensagem Final (Inspiração) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6" />
              <h3 className="text-xl font-bold">Mensagem de Fechamento</h3>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-purple-50 leading-relaxed whitespace-pre-line">
                {mensagem_final}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-purple-500">
              <span className="text-sm text-purple-200">
                Continue evoluindo. O ecossistema Genis está com você.
              </span>
              <ArrowRight className="w-4 h-4 text-purple-300" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Componente de Item de Feedback Individual
function FeedbackItemCard({
  item,
  variant,
  index,
}: {
  item: FeedbackItem;
  variant: 'strong' | 'critical' | 'secondary';
  index: number;
}) {
  const variantStyles = {
    strong: {
      border: 'border-l-4 border-green-500',
      bg: 'bg-green-50/50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      scoreColor: 'text-green-600',
      icon: CheckCircle,
    },
    critical: {
      border: 'border-l-4 border-orange-500',
      bg: 'bg-orange-50/50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      scoreColor: 'text-orange-600',
      icon: AlertCircle,
    },
    secondary: {
      border: 'border-l-4 border-blue-500',
      bg: 'bg-blue-50/50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      scoreColor: 'text-blue-600',
      icon: Target,
    },
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-lg ${style.bg} ${style.border} p-6 space-y-4`}
    >
      {/* Header: Indicador + Score */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-4 h-4 ${style.iconColor}`} />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-neutral-900">{item.indicador}</h4>
            <CategoryBadge category={item.categoria} size="sm" />
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${style.scoreColor}`}>{item.score}</div>
          <div className="text-xs text-neutral-500 font-medium">Score</div>
        </div>
      </div>

      {/* Evidência */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Evidência
          </span>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed pl-3">
          {item.evidencia}
        </p>

        {/* Timestamps se existirem */}
        {item.timestamps && item.timestamps.length > 0 && (
          <div className="flex flex-wrap gap-2 pl-3 pt-2">
            {item.timestamps.map((timestamp, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-neutral-100 text-neutral-600"
              >
                {timestamp}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Impacto */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            Impacto
          </span>
        </div>
        <p className="text-sm text-neutral-700 leading-relaxed pl-3">{item.impacto}</p>
      </div>

      {/* Fundamento (se existir) */}
      {item.fundamento && (
        <div className="space-y-2 pt-2 border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-400"></div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Fundamento DNA Genis
            </span>
          </div>
          <p className="text-sm text-neutral-600 italic leading-relaxed pl-3">
            {item.fundamento}
          </p>
        </div>
      )}

      {/* Técnica Recomendada (se existir) */}
      {item.tecnica_recomendada && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Técnica Recomendada
            </span>
          </div>
          <p className="text-sm font-semibold text-neutral-900">
            {item.tecnica_recomendada}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Componente de Card de Plano de Ação
function PlanoAcaoCard({ plano, index }: { plano: PlanoAcao; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg p-5 border border-purple-100 space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              {plano.semanas}
            </span>
          </div>
          <h4 className="text-lg font-bold text-neutral-900">{plano.foco}</h4>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
          {index + 1}
        </div>
      </div>

      {/* Objetivo */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Objetivo
        </span>
        <p className="text-sm text-neutral-700 leading-relaxed">{plano.objetivo}</p>
      </div>

      {/* Critérios de Sucesso */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Critérios de Sucesso
        </span>
        <ul className="space-y-2">
          {plano.criterios_sucesso.map((criterio, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{criterio}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
