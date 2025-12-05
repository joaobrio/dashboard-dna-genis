import { motion } from 'framer-motion';
import { TimelineEvent } from '@/lib/insights';

interface InsightsTimelineProps {
  events: TimelineEvent[];
  totalDurationSec?: number;
  title?: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  high: 'bg-red-500',
  medium: 'bg-orange-400',
  low: 'bg-emerald-400',
};

export function InsightsTimeline({ events, totalDurationSec, title = 'Linha do Tempo' }: InsightsTimelineProps) {
  if (!events || events.length === 0) return null;

  const maxTime = totalDurationSec && totalDurationSec > 0
    ? totalDurationSec
    : Math.max(...events.map((e) => e.time)) + 10;

  return (
    <div className="glass-card rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-genis-yellow">Sensor Audiovisual</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Forte</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Gap</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Crítico</span>
        </div>
      </div>

      <div className="relative h-16">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] bg-white/10" />
        {events.map((event, idx) => {
          const position = Math.min(100, Math.max(0, (event.time / maxTime) * 100));
          const color = SEVERITY_COLORS[event.severity] || SEVERITY_COLORS.low;
          return (
            <motion.div
              key={`${event.indicator || event.label}-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="absolute flex flex-col items-center"
              style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
            >
              <div className={`w-3 h-3 rounded-full border border-white/20 ${color} shadow-lg`} />
              <div className="mt-2 text-center space-y-1">
                <p className="text-[11px] text-white font-semibold leading-tight">
                  {event.label}
                </p>
                {event.indicator && (
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                    {event.indicator}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
