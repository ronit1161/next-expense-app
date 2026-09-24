'use client';

import { formatCurrency } from '@/lib/utils';

export default function DashboardSummaryCards({ summary }) {
  const budgetUtilization =
    summary?.budgetLimit > 0
      ? Math.round(((summary?.monthSpent || 0) / summary?.budgetLimit) * 100)
      : 0;

  const netDebt = (summary?.receivable || 0) - (summary?.payable || 0);

  return (
    <div className="space-y-4">
      {/* Dominant Swiss KPI Tile */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 sm:p-8 swiss-dots relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black dark:border-white/20 pb-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#FF3000]">
            01.0 // TOTAL MONTHLY OUTFLOW
          </span>
          <span className="text-[10px] font-mono uppercase text-pencil">
            RECORDED EXPENDITURE
          </span>
        </div>

        <div className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-charcoal tabular-nums mt-4">
          {formatCurrency(summary?.monthSpent)}
        </div>

        {summary?.budgetLimit > 0 && (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-charcoal uppercase">
                CAPACITY: {budgetUtilization}% UTILIZED
              </span>
              <span className="text-pencil font-bold">
                BUDGET CAP: {formatCurrency(summary?.budgetLimit)}
              </span>
            </div>
            {/* Rectangular Solid Progress Bar */}
            <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] h-4 p-0.5">
              <div
                className={`h-full transition-all duration-300 ${
                  budgetUtilization > 100 ? 'bg-[#FF3000]' : 'bg-black dark:bg-white'
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Three Structural Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tile 1: Today's Total */}
        <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
              TODAY&apos;S TOTAL
            </span>
            <span className="text-[9px] font-mono text-[#FF3000] font-black">01.A</span>
          </div>
          <div className="text-2xl font-black text-charcoal tabular-nums mt-3">
            {formatCurrency(summary?.todaySpent)}
          </div>
          <p className="text-[10px] font-mono text-pencil mt-3 pt-2 border-t border-black/10 dark:border-white/10 uppercase truncate">
            TOP CAT: <span className="font-bold text-charcoal">{summary?.highestCategory || 'NONE'}</span>
          </p>
        </div>

        {/* Tile 2: Remaining Headroom */}
        <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
              BUDGET HEADROOM
            </span>
            <span className="text-[9px] font-mono text-[#FF3000] font-black">01.B</span>
          </div>
          <div className="text-2xl font-black text-charcoal tabular-nums mt-3">
            {formatCurrency(summary?.remainingBudget)}
          </div>
          <p className="text-[10px] font-mono text-pencil mt-3 pt-2 border-t border-black/10 dark:border-white/10 uppercase">
            LIMIT: {formatCurrency(summary?.budgetLimit)}
          </p>
        </div>

        {/* Tile 3: Peer Exposure */}
        <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
              PEER NET BALANCE
            </span>
            <span className="text-[9px] font-mono text-[#FF3000] font-black">01.C</span>
          </div>
          <div
            className={`text-2xl font-black tabular-nums mt-3 ${
              netDebt < 0 ? 'text-[#FF3000]' : 'text-charcoal'
            }`}
          >
            {formatCurrency(netDebt)}
          </div>
          <div className="text-[10px] font-mono text-pencil mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between uppercase">
            <span>REC: {formatCurrency(summary?.receivable)}</span>
            <span>PAY: {formatCurrency(summary?.payable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
