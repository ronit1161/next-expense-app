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
      {/* Large Dominant Financial Figure */}
      <div className="neu-card p-5 sm:p-6 rounded-3xl">
        <span className="text-[11px] font-bold text-pencil uppercase tracking-wider block">
          Total Monthly Outflow
        </span>
        <div className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-charcoal tabular-nums mt-1">
          {formatCurrency(summary?.monthSpent)}
        </div>
        {summary?.budgetLimit > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 neu-groove h-2 p-0.5">
              <div
                className={`h-full rounded-full ${
                  budgetUtilization > 100 ? 'bg-loss' : 'bg-[#0047FF]'
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
            <span className="text-xs text-pencil font-medium shrink-0">
              {budgetUtilization}% of {formatCurrency(summary?.budgetLimit)}
            </span>
          </div>
        )}
      </div>

      {/* Three Restrained Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tile A: Today */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            Today&apos;s Spend
          </span>
          <div className="text-2xl font-bold text-charcoal tabular-nums mt-2">
            {formatCurrency(summary?.todaySpent)}
          </div>
          <p className="text-[11px] text-pencil mt-2 truncate">
            Top: <span className="font-semibold text-charcoal">{summary?.highestCategory || 'N/A'}</span>
          </p>
        </div>

        {/* Tile B: Budget Headroom */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            Remaining Budget
          </span>
          <div className="text-2xl font-bold text-charcoal tabular-nums mt-2">
            {formatCurrency(summary?.remainingBudget)}
          </div>
          <p className="text-[11px] text-pencil mt-2">
            Cap: {formatCurrency(summary?.budgetLimit)}
          </p>
        </div>

        {/* Tile C: Peer Exposure */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            Peer Net Balance
          </span>
          <div
            className={`text-2xl font-bold tabular-nums mt-2 ${
              netDebt >= 0 ? 'text-gain' : 'text-loss'
            }`}
          >
            {formatCurrency(netDebt)}
          </div>
          <p className="text-[11px] text-pencil mt-2 flex items-center justify-between">
            <span>To Rec: {formatCurrency(summary?.receivable)}</span>
            <span>To Pay: {formatCurrency(summary?.payable)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
