'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { triggerHaptic } from '@/lib/haptics';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  EyeOff,
  ChevronDown,
  Calendar,
  PiggyBank,
  Users,
} from 'lucide-react';

export default function DashboardSummaryCards({ summary }) {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);

  const budgetUtilization =
    summary?.budgetLimit > 0
      ? Math.round(((summary?.monthSpent || 0) / summary?.budgetLimit) * 100)
      : 0;

  const netDebt = (summary?.receivable || 0) - (summary?.payable || 0);

  const handleQuickAdd = () => {
    router.push('/expenses?action=add');
  };

  return (
    <div className="space-y-6">
      {/* 1. FINTECH HERO IRIDESCENT MESH CARD (BASED ON REFERENCE IMAGE 1) */}
      <div className="fintech-mesh-card p-6 sm:p-8 min-h-[220px] flex flex-col justify-between">
        {/* Card Top Row */}
        <div className="flex items-center justify-between z-10">
          <div className="fintech-glass-pill px-3.5 py-1.5 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm">
            <span>Main card &bull;&bull;&bull;&bull; 6510</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </div>

          {/* Two overlapping translucent card emblem circles */}
          <div className="flex items-center -space-x-2.5 opacity-80">
            <div className="h-7 w-7 rounded-full bg-white/40 backdrop-blur-xs" />
            <div className="h-7 w-7 rounded-full bg-white/25 backdrop-blur-xs" />
          </div>
        </div>

        {/* Card Center: Large Financial Balance & Privacy Toggle */}
        <div className="my-4 z-10">
          <span className="text-xs font-medium text-white/80 block tracking-wide">
            Total monthly spending
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            {showBalance ? (
              <AnimatedNumber
                value={summary?.monthSpent || 0}
                duration={850}
                className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white"
              />
            ) : (
              <span className="font-heading font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white tabular-nums">
                ₹ ••••••••
              </span>
            )}
            <button
              onClick={() => {
                triggerHaptic('selection');
                setShowBalance(!showBalance);
              }}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            >
              {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Card Bottom Row: Micro Budget Indicator */}
        <div className="z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-white/15 text-xs text-white/90">
          <div className="flex items-center gap-2">
            <span className="opacity-80">Budget Target:</span>
            <span className="font-bold">{formatCurrency(summary?.budgetLimit || 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
            <span className="font-bold">{budgetUtilization}%</span>
          </div>
        </div>
      </div>

      {/* 2. THREE QUICK ACTION BUTTONS (DIRECTLY UNDER HERO - MATCHING REFERENCE IMAGE) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/debts"
          className="fintech-action-btn hover:scale-102"
        >
          <div className="h-8 w-8 rounded-full bg-[var(--bg-recessed)] flex items-center justify-center">
            <ArrowUpRight className="h-4 w-4 text-[var(--text-primary)]" />
          </div>
          <span className="text-xs font-heading font-bold text-[var(--text-primary)]">Send</span>
        </Link>

        <Link
          href="/debts"
          className="fintech-action-btn hover:scale-102"
        >
          <div className="h-8 w-8 rounded-full bg-[var(--bg-recessed)] flex items-center justify-center">
            <ArrowDownLeft className="h-4 w-4 text-[var(--text-primary)]" />
          </div>
          <span className="text-xs font-heading font-bold text-[var(--text-primary)]">Receive</span>
        </Link>

        <button
          onClick={handleQuickAdd}
          className="fintech-action-btn fintech-action-btn-primary hover:scale-102"
        >
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-xs font-heading font-black">Top Up / Add</span>
        </button>
      </div>

      {/* 3. THREE COMPACT METRIC TILES */}
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
