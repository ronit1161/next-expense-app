'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { triggerHaptic } from '@/lib/haptics';
import { playAudio } from '@/lib/audio';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  EyeOff,
  Calendar,
  PiggyBank,
  Users,
  Sparkles,
} from 'lucide-react';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function DashboardSummaryCards({ summary }) {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  const now = new Date();
  const currentMonthName = MONTH_NAMES[now.getMonth()];
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - now.getDate() + 1);

  const budgetUtilization =
    summary?.budgetLimit > 0
      ? Math.round(((summary?.monthSpent || 0) / summary?.budgetLimit) * 100)
      : 0;

  const safeDailyPace =
    summary?.budgetLimit > 0
      ? Math.max(0, Math.round((summary?.remainingBudget || 0) / daysLeft))
      : null;

  const netDebt = (summary?.receivable || 0) - (summary?.payable || 0);

  const handleQuickAdd = () => {
    triggerHaptic('selection');
    playAudio('tick');
    router.push('/expenses?action=add');
  };

  return (
    <div className="space-y-6">
      {/* 1. MINIMAL HERO SPENDING OVERVIEW */}
      <div className="fintech-card p-6 sm:p-8 rounded-3xl border border-[var(--border-clay)] bg-[var(--bg-card)] shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Spending & Budget Track */}
          <div className="space-y-4 max-w-xl">
            {/* Meta Pill Row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Total Monthly Spending
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--bg-recessed)] text-[var(--text-muted)] border border-[var(--border-clay)]">
                {currentMonthName} {now.getFullYear()}
              </span>
              {safeDailyPace !== null && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-[11px] font-bold">
                  <Sparkles className="h-3 w-3" />
                  <span>Safe Pace: {formatCurrency(safeDailyPace)}/day</span>
                </div>
              )}
            </div>

            {/* Large Spend Metric */}
            <div className="flex items-center gap-3.5">
              {showBalance ? (
                <AnimatedNumber
                  value={summary?.monthSpent || 0}
                  duration={850}
                  className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--text-primary)]"
                />
              ) : (
                <span className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[var(--text-primary)] tabular-nums">
                  ₹ ••••••••
                </span>
              )}

              <button
                onClick={() => {
                  triggerHaptic('selection');
                  playAudio('pop');
                  setShowBalance(!showBalance);
                }}
                aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                className="p-2.5 rounded-xl bg-[var(--bg-recessed)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-clay)] transition-all cursor-pointer"
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>

            {/* Budget Target & Minimal Utilization Bar */}
            {summary?.budgetLimit > 0 ? (
              <div className="space-y-2 pt-1 max-w-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-medium">
                    Budget Target:{' '}
                    <strong className="text-[var(--text-primary)] font-bold">
                      {formatCurrency(summary?.budgetLimit)}
                    </strong>
                  </span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {budgetUtilization}% used &bull; {daysLeft} days left
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--bg-recessed)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      budgetUtilization > 95
                        ? 'bg-rose-500'
                        : budgetUtilization > 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, budgetUtilization)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)] font-medium">
                No monthly budget target set.
              </p>
            )}
          </div>

          {/* Clean Quick Actions */}
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-2.5 sm:gap-3 shrink-0 pt-2 lg:pt-0">
            <Link
              href="/debts"
              className="py-2.5 px-4 rounded-xl bg-[var(--bg-recessed)] hover:bg-[var(--bg-muted)] border border-[var(--border-clay)] text-[var(--text-primary)] flex items-center justify-center gap-2 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs"
            >
              <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)]" />
              <span>Send</span>
            </Link>

            <Link
              href="/debts"
              className="py-2.5 px-4 rounded-xl bg-[var(--bg-recessed)] hover:bg-[var(--bg-muted)] border border-[var(--border-clay)] text-[var(--text-primary)] flex items-center justify-center gap-2 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-2xs"
            >
              <ArrowDownLeft className="h-4 w-4 text-[var(--text-muted)]" />
              <span>Receive</span>
            </Link>

            <button
              onClick={handleQuickAdd}
              className="fintech-btn-primary py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:scale-102 cursor-pointer shadow-sm col-span-1"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span className="whitespace-nowrap">Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. THREE COMPACT METRIC TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Today's Spend */}
        <div className="fintech-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-clay)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Today&apos;s Spend
            </span>
            <div className="h-7 w-7 rounded-xl bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-muted)]">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="font-heading font-black text-2xl text-[var(--text-primary)] mt-3">
            <AnimatedNumber value={summary?.todaySpent || 0} />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2 font-medium truncate">
            Top Sector: <span className="font-bold text-[var(--text-primary)]">{summary?.highestCategory || 'None'}</span>
          </p>
        </div>

        {/* Budget Headroom */}
        <div className="fintech-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-clay)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Remaining Budget
            </span>
            <div className="h-7 w-7 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <PiggyBank className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="font-heading font-black text-2xl text-teal-600 dark:text-teal-400 mt-3">
            <AnimatedNumber value={summary?.remainingBudget || 0} />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-2 font-medium truncate">
            Limit: <span className="font-bold text-[var(--text-primary)]">{formatCurrency(summary?.budgetLimit || 0)}</span>
          </p>
        </div>

        {/* Peer Debt Exposure */}
        <div className="fintech-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-clay)]">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Net Peer IOUs
            </span>
            <div className="h-7 w-7 rounded-xl bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-muted)]">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div
            className={`font-heading font-black text-2xl mt-3 ${
              netDebt < 0 ? 'text-rose-500' : 'text-[var(--text-primary)]'
            }`}
          >
            <AnimatedNumber value={netDebt} />
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-2 flex items-center justify-between font-medium">
            <span>To Collect: <strong className="text-emerald-500 font-bold">{formatCurrency(summary?.receivable || 0)}</strong></span>
            <span>To Pay: <strong className="text-rose-500 font-bold">{formatCurrency(summary?.payable || 0)}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
