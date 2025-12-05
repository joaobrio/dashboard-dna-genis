import { DnaGenisAnalysis } from './zod-student';
import {
  ConfidenceBand,
  InsightHighlight,
  InsightSeverity,
  InsightsData,
  TimelineEvent,
} from '@/types/dna-genis';

export type { ConfidenceBand, InsightHighlight, InsightSeverity, InsightsData, TimelineEvent } from '@/types/dna-genis';

function parseTimestampToSeconds(timestamp: string): number | null {
  // Supports "mm:ss" or "mm:ss-mm:ss"
  const clean = timestamp.trim();
  const range = clean.split('-')[0];
  const [min, sec] = range.split(':').map(Number);
  if (Number.isNaN(min) || Number.isNaN(sec)) return null;
  return min * 60 + sec;
}

function severityFromScore(score: number): InsightSeverity {
  if (score >= 85) return 'low'; // highlight good
  if (score >= 75) return 'medium';
  return 'high';
}

function severityFromGap(score: number): InsightSeverity {
  if (score < 70) return 'high';
  if (score < 80) return 'medium';
  return 'low';
}

function severityFromConfidence(conf: number | undefined): InsightSeverity {
  if (conf === undefined || Number.isNaN(conf)) return 'medium';
  if (conf >= 0.9) return 'high';
  if (conf >= 0.75) return 'medium';
  return 'low';
}

export function buildInsightsFromAnalysis(data: DnaGenisAnalysis): InsightsData {
  const sortedByScore = [...data.indicadores].sort((a, b) => b.score - a.score);
  const strengths = sortedByScore.slice(0, 3).map((ind) => ({
    indicator: ind.codigo,
    label: ind.nome,
    score: ind.score,
    severity: severityFromScore(ind.score),
    description: ind.evidencias?.[0],
  }));

  const gaps = [...data.indicadores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((ind) => ({
      indicator: ind.codigo,
      label: ind.nome,
      score: ind.score,
      severity: severityFromGap(ind.score),
      description: ind.evidencias?.[0],
    }));

  const timeline: TimelineEvent[] = [];
  data.indicadores.forEach((ind) => {
    const severity = ind.prioridade_acao
      ? ind.prioridade_acao <= 2
        ? 'high'
        : 'medium'
      : severityFromGap(ind.score);

    ind.timestamps?.forEach((ts) => {
      const time = parseTimestampToSeconds(ts);
      if (time !== null) {
        timeline.push({
          time,
          label: ind.nome,
          indicator: ind.codigo,
          severity: severity === 'low' ? severityFromScore(ind.score) : severity,
          category: ind.pilar,
        });
      }
    });
  });

  // Sort timeline by time for a smooth marker sequence
  timeline.sort((a, b) => a.time - b.time);

  const confidence: ConfidenceBand[] = data.indicadores.map((ind) => ({
    indicator: ind.codigo,
    confidence: ind.confianca ?? 0,
    severity: severityFromConfidence(ind.confianca),
  }));

  return {
    highlights: {
      strengths,
      gaps,
    },
    timeline,
    confidence,
  };
}
