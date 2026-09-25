'use client';

import { formatCurrency } from '@/lib/utils';
import { Wallet, Calendar, PiggyBank, Users } from 'lucide-react';

export default function DashboardSummaryCards({ summary }) {
  const budgetUtilization =
    summary?.budgetLimit > 0
      ? Math.round(((summary?.monthSpent || 0) / summary?.budgetLimit) * 100)
      : 0;

  const netDebt = (summary?.receivable || 0) - (summary?.payable || 0);

  return (
    <div className="space-y-5">
      {/* Dominant Clay KPI Card */}
      <div className="clay-card p-6 sm:p-8 rounded-[36px] relative overflow-hidden">
        {/* Subtle Ambient Decorative Glow in Card */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-pink-500 text-white flex items-center justify-center clay-orb shadow-md">
              <Wallet className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 block">
                Total Monthly Outflow
              </span>
              <p className="text-xs text-pencil">Aggregated expenses across all categories</p>
            </div>
          </div>
          <span className="font-heading text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 self-start sm:self-auto">
            This Month
          </span>
        </div>

        <div className="font-heading font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-charcoal tabular-nums mt-4">
          {formatCurrency(summary?.monthSpent)}
        </div>

        {summary?.budgetLimit > 0 && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-charcoal">
                Budget Cap: <strong className="font-black text-purple-700 dark:text-purple-400">{formatCurrency(summary?.budgetLimit)}</strong>
              </span>
              <span className="font-heading font-black text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {budgetUtilization}% Utilized
              </span>
            </div>
            {/* Clay Groove Progress Bar */}
            <div className="neu-groove">
              <div
                className={`neu-progress-fill transition-all duration-500 ${
                  budgetUtilization > 100 ? 'neu-progress-fill-accent' : ''
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Three Bento Metric Clay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Tile 1: Today's Total */}
        <div className="clay-card p-5 sm:p-6 rounded-[28px] flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
            <span className="font-heading text-xs font-black uppercase tracking-wider text-pencil">
              Today&apos;s Total
            </span>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white clay-orb shadow-sm">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-charcoal tabular-nums mt-3">
            {formatCurrency(summary?.todaySpent)}
          </div>
          <p className="text-xs text-pencil mt-3 pt-2 border-t border-purple-500/10 truncate font-medium">
            Top Sector: <span className="font-heading font-bold text-purple-700 dark:text-purple-300">{summary?.highestCategory || 'None'}</span>
          </p>
        </div>

        {/* Tile 2: Remaining Headroom */}
        <div className="clay-card p-5 sm:p-6 rounded-[28px] flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
            <span className="font-heading text-xs font-black uppercase tracking-wider text-pencil">
              Budget Headroom
            </span>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white clay-orb shadow-sm">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 tabular-nums mt-3">
            {formatCurrency(summary?.remainingBudget)}
          </div>
          <p className="text-xs text-pencil mt-3 pt-2 border-t border-purple-500/10 font-medium">
            Limit: <span className="font-bold text-charcoal">{formatCurrency(summary?.budgetLimit)}</span>
          </p>
        </div>

        {/* Tile 3: Peer Exposure */}
        <div className="clay-card p-5 sm:p-6 rounded-[28px] flex flex-col justify-between hover:-translate-y-1.5 transition-transform duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
            <span className="font-heading text-xs font-black uppercase tracking-wider text-pencil">
              Peer Net Balance
            </span>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white clay-orb shadow-sm">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`font-heading font-black text-2xl sm:text-3xl tabular-nums mt-3 ${
              netDebt < 0 ? 'text-pink-600 dark:text-pink-400' : 'text-charcoal'
            }`}
          >
            {formatCurrency(netDebt)}
          </div>
          <div className="text-xs text-pencil mt-3 pt-2 border-t border-purple-500/10 flex items-center justify-between font-medium">
            <span>To Collect: <strong className="text-emerald-600 font-bold">{formatCurrency(summary?.receivable)}</strong></span>
            <span>To Pay: <strong className="text-pink-600 font-bold">{formatCurrency(summary?.payable)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
