'use client';

import { Sparkles, X } from 'lucide-react';

export default function DashboardInsightsCard({ insights = [], dismissedInsights = [], onDismiss }) {
  const activeInsights = insights.filter((_, idx) => !dismissedInsights.includes(idx));

  if (activeInsights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 bg-[#FF3000]"></span>
        <span className="text-[10px] font-black uppercase tracking-widest text-charcoal">
          01.1 OBSERVATION FEED // SMART INSIGHTS
        </span>
      </div>

      <div className="space-y-2">
        {activeInsights.map((insight, idx) => (
          <div
            key={idx}
            className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] p-4 flex items-start justify-between gap-4 text-xs"
          >
            <div className="flex items-start gap-3">
              <span className="text-[10px] font-mono font-black text-[#FF3000] shrink-0 mt-0.5">
                [{idx + 1}]
              </span>
              <p className="text-xs text-charcoal leading-relaxed font-bold uppercase">
                {insight.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(idx)}
              className="text-pencil hover:text-charcoal hover:border-black dark:hover:border-white p-1 border border-transparent cursor-pointer shrink-0 transition-colors"
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
