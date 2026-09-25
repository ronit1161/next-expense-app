'use client';

import { Sparkles, X } from 'lucide-react';

export default function DashboardInsightsCard({ insights = [], dismissedInsights = [], onDismiss }) {
  const activeInsights = insights.filter((_, idx) => !dismissedInsights.includes(idx));

  if (activeInsights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-[var(--brand-accent)]" />
        <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Financial Intelligence &amp; Observations
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeInsights.map((insight, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl flex items-start justify-between gap-3 text-xs bg-[var(--bg-card)] border border-[var(--border-clay)] shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                {insight.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(idx)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-lg hover:bg-[var(--bg-recessed)] cursor-pointer shrink-0 transition-colors"
              aria-label="Dismiss observation"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
