'use client';

import { Sparkles, X } from 'lucide-react';

export default function DashboardInsightsCard({ insights = [], dismissedInsights = [], onDismiss }) {
  const activeInsights = insights.filter((_, idx) => !dismissedInsights.includes(idx));

  if (activeInsights.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles className="h-3.5 w-3.5 text-[#0047FF]" />
        <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
          Journal Observations
        </span>
      </div>

      {activeInsights.map((insight, idx) => (
        <div
          key={idx}
          className="neu-inset-deep px-5 py-4 rounded-2xl flex items-start justify-between gap-3 text-xs"
        >
          <p className="text-xs text-charcoal leading-relaxed font-medium">
            {insight.message}
          </p>
          <button
            onClick={() => onDismiss(idx)}
            className="text-pencil hover:text-charcoal p-1 cursor-pointer shrink-0 transition-colors neu-btn-sm rounded-lg"
            aria-label="Dismiss observation"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
