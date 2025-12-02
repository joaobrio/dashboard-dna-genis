'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { ActionPlan as ActionPlanType, NextSteps } from '@/types/dna-genis';
import {
  PlayCircle,
  Clock,
  CheckCircle,
  Target,
  Calendar,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionPlanProps {
  actionPlan: ActionPlanType;
  nextSteps: NextSteps;
  currentScore: number;
}

export function ActionPlanSection({ actionPlan, nextSteps, currentScore }: ActionPlanProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Plano de Ação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              <CardTitle>Plano de Ação ({actionPlan.duracao_semanas} semanas)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionPlan.trilhas.map((trilha, index) => (
                <motion.div
                  key={trilha.foco}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    index === 0
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-neutral-50 border-neutral-200'
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {/* Semana */}
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-600">
                      Semana {trilha.semanas}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full ml-auto">
                        Atual
                      </span>
                    )}
                  </div>

                  {/* Objetivo */}
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    {trilha.objetivo}
                  </h4>

                  {/* Aula */}
                  <div className="flex items-center gap-2 mb-3 text-sm text-neutral-600">
                    <PlayCircle className="w-4 h-4 text-purple-600" />
                    <span>{trilha.aula_nome}</span>
                  </div>

                  {/* Exercícios */}
                  <div className="space-y-2 mb-3">
                    {trilha.exercicios.slice(0, 2).map((exercicio) => (
                      <div
                        key={exercicio.nome}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-neutral-600">{exercicio.nome}</span>
                        <div className="flex items-center gap-1 text-neutral-400">
                          <Clock className="w-3 h-3" />
                          <span>{exercicio.duracao_minutos}min</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA para primeira trilha */}
                  {index === 0 && (
                    <button className="w-full mt-2 py-2 px-4 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Começar Trilha
                    </button>
                  )}
                </motion.div>
              ))}

              {/* Desafio do Mês */}
              <motion.div
                className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Desafio do Mês
                  </span>
                </div>
                <h4 className="font-semibold text-neutral-900">
                  {actionPlan.desafio_mes.nome}
                </h4>
                <p className="text-sm text-neutral-600 mt-1">
                  {actionPlan.desafio_mes.descricao}
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projeção e Próximos Passos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        {/* Projeção */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <CardTitle>Sua Projeção</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              {/* Hoje */}
              <div className="text-center">
                <p className="text-sm text-neutral-500 mb-1">Hoje</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {currentScore.toFixed(1)}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[100px] h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 relative">
                  <ArrowRight className="w-4 h-4 text-emerald-500 absolute right-0 top-1/2 -translate-y-1/2 translate-x-2" />
                </div>
              </div>

              {/* 30 dias */}
              <div className="text-center">
                <p className="text-sm text-neutral-500 mb-1">30 dias</p>
                <p className="text-2xl font-bold text-amber-600">
                  {nextSteps.meta_score_30_dias}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-[100px] h-0.5 bg-gradient-to-r from-amber-400 to-emerald-400 relative">
                  <ArrowRight className="w-4 h-4 text-emerald-500 absolute right-0 top-1/2 -translate-y-1/2 translate-x-2" />
                </div>
              </div>

              {/* 90 dias */}
              <div className="text-center">
                <p className="text-sm text-neutral-500 mb-1">90 dias</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {nextSteps.meta_score_90_dias}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentScore / 100) * 100}%` }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </div>
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>

            <p className="text-sm text-neutral-600 mt-4 text-center">
              Se mantiver o ritmo atual, você alcança{' '}
              <span className="font-semibold text-emerald-600">Alta Performance</span>{' '}
              em 90 dias
            </p>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <CardTitle>Próximos Passos</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextSteps.imediatos.map((passo, index) => (
                <motion.div
                  key={passo}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-neutral-700">{passo}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Principal */}
            <motion.button
              className="w-full mt-4 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
