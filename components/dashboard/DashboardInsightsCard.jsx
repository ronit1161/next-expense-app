'use client';

import { Sparkles, X } from 'lucide-react';

export default function DashboardInsightsCard({ insights = [], dismissedInsights = [], onDismiss }) {
  const activeInsights = insights.filter((_, idx) => !dismissedInsights.includes(idx));

  if (activeInsights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-4 w-4 text-purple-600" />
        <span className="font-heading text-xs font-black uppercase tracking-wider text-charcoal">
          Smart Observations &amp; Insights
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeInsights.map((insight, idx) => (
          <div
            key={idx}
            className="clay-card p-4 rounded-[24px] flex items-start justify-between gap-3 text-xs bg-white/80 dark:bg-[#231D35]/80"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white clay-orb shrink-0 shadow-sm mt-0.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-xs text-charcoal leading-relaxed font-medium">
                {insight.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(idx)}
              className="text-pencil hover:text-charcoal p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer shrink-0 transition-colors"
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
