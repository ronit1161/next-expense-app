'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getDashboardDataAction } from '@/actions/dashboard-actions';
import { DashboardSkeleton, Skeleton } from '@/components/ui/skeletons';

// Dynamic lazy-loaded chart to avoid bundle bloat and improve initial paint
const SpendingTrendChart = dynamic(
  () => import('@/components/dashboard/SpendingTrendChart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 sm:h-64 w-full rounded-xl" />,
  }
);

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [dismissedInsights, setDismissedInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const currentMonthName = MONTH_NAMES[now.getMonth()];
  const currentYear = now.getFullYear();
  const greeting = getGreeting();

  const fetchDashboardData = async () => {
    try {
      setError('');
      const res = await getDashboardDataAction();

      if (res.success) {
        setSummary(res.data.summary);
        setAnalytics(res.data.analytics);
        setInsights(res.data.insights || []);
      } else {
        setError(res.error || 'Failed to retrieve financial logs.');
      }
    } catch (err) {
      setError('Unable to load dashboard records. Please check your network.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dismissInsight = (idx) => {
    setDismissedInsights((prev) => [...prev, idx]);
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="journal-card p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <div className="h-10 w-10 mx-auto rounded-full bg-[#FCE8E6] flex items-center justify-center text-loss font-bold">
          !
        </div>
        <div>
          <h3 className="text-sm font-bold text-charcoal">FAILED TO LOAD OVERVIEW</h3>
          <p className="text-xs text-pencil mt-1">{error}</p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-charcoal text-white hover:bg-black py-2.5 px-5 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  const activeInsights = insights.filter((_, idx) => !dismissedInsights.includes(idx));
  const netDebt = (summary?.receivable || 0) - (summary?.payable || 0);

  const budgetUtilization =
    summary?.budgetLimit > 0
      ? Math.round(((summary?.monthSpent || 0) / summary?.budgetLimit) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-20 md:pb-8 animate-fadeIn">
      {/* 1. TOP EDITORIAL HERO HEADER */}
      <div className="pt-2 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            {greeting} • {currentMonthName} {currentYear}
          </span>
          <Link
            href="/expenses"
            className="neu-btn px-3 py-1.5 text-xs font-bold text-electric flex items-center gap-1.5 group"
          >
            <span>Activity Timeline</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Large Dominant Financial Figure */}
        <div className="mt-4 neu-card p-5 sm:p-6 rounded-3xl">
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
      </div>

      {/* 2. THREE RESTRAINED STAT TILES (Molded Cushion Modules) */}
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

      {/* 3. FINANCIAL OBSERVATIONS (Deeply Indented Recessed Modules) */}
      {activeInsights.length > 0 && (
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
                onClick={() => dismissInsight(idx)}
                className="text-pencil hover:text-charcoal p-1 cursor-pointer shrink-0 transition-colors neu-btn-sm rounded-lg"
                aria-label="Dismiss observation"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. WHERE YOUR MONEY WENT (Category Allocation in Neumorphic Card) */}
      <div className="neu-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
            Where Your Money Went
          </h2>
          <span className="text-[11px] text-pencil font-medium">
            {analytics?.categoryBreakdown?.length || 0} Categories
          </span>
        </div>

        {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
          <div className="space-y-4 pt-1">
            {analytics.categoryBreakdown.map((cat) => {
              const totalMonth = summary?.monthSpent || 1;
              const percent = Math.round((cat.total / totalMonth) * 100);

              return (
                <div key={cat.categoryId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal">
                      {cat.categoryName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-pencil tabular-nums">
                        {percent}%
                      </span>
                      <span className="font-bold text-charcoal tabular-nums">
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                  </div>
                  {/* Indented Groove Track with Molded Fill */}
                  <div className="neu-groove h-2 w-full p-0.5">
                    <div
                      className="h-full bg-charcoal rounded-full neu-progress-fill transition-all duration-300"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="neu-inset p-6 text-center rounded-2xl space-y-2">
            <p className="text-xs text-pencil">No expenses recorded this month yet.</p>
            <Link
              href="/expenses?action=add"
              className="inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>Record your first transaction</span>
            </Link>
          </div>
        )}
      </div>

      {/* 5. 6-MONTH SPENDING TRAJECTORY */}
      <div className="neu-card p-5 sm:p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
            6-Month Trajectory
          </h2>
          <span className="text-[11px] text-pencil">Historical Cash Outflows</span>
        </div>

        <div className="pt-2">
          <SpendingTrendChart data={analytics?.monthlyTrend || []} />
        </div>
      </div>
    </div>
  );
}
