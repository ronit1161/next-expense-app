'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { getDashboardDataAction } from '@/actions/dashboard-actions';
import { DashboardSkeleton, Skeleton } from '@/components/ui/skeletons';
import PullToRefresh from '@/components/ui/PullToRefresh';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardRecentTransactions from '@/components/dashboard/DashboardRecentTransactions';
import DashboardInsightsCard from '@/components/dashboard/DashboardInsightsCard';
import DashboardCategoryBreakdown from '@/components/dashboard/DashboardCategoryBreakdown';

const SpendingTrendChart = dynamic(
  () => import('@/components/dashboard/SpendingTrendChart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full rounded-2xl" />,
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
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentExpenses, setRecentExpenses] = useState([]);
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
        setRecentExpenses(res.data.recentExpenses || []);
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
      <div className="fintech-card p-8 sm:p-10 text-center max-w-md mx-auto my-12 space-y-4 rounded-3xl">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-rose-500/15 text-rose-500 border border-rose-500/20 flex items-center justify-center font-heading font-black text-xl">
          !
        </div>
        <div>
          <h3 className="text-base font-heading font-black text-[var(--text-primary)]">
            Failed to Load Overview
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">{error}</p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          className="fintech-btn-primary py-2.5 px-6 text-xs font-bold flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={fetchDashboardData}>
      <div className="space-y-7 pb-16 animate-fadeIn">
      {/* 1. TOP HERO GREETING (DESKTOP VIEW) */}
      <div className="hidden sm:flex sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-recessed)] border border-[var(--border-clay)] text-[var(--text-muted)] text-[11px] font-bold">
            <Sparkles className="h-3 w-3 text-[var(--brand-accent)]" />
            <span>Active Cycle &bull; {currentMonthName} {currentYear}</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-[var(--text-primary)]">
            Good {greeting}!
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-medium">
            Here is your live cash flow and financial pulse.
          </p>
        </div>

        <Link
          href="/expenses"
          className="fintech-btn-secondary px-4 py-2.5 text-xs font-bold flex items-center gap-2 cursor-pointer"
        >
          <span>All Transactions</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 2. FINTECH HERO MESH CARD + ACTION BUTTONS + METRICS */}
      <DashboardSummaryCards summary={summary} />

      {/* 3. RECENT TRANSACTIONS STREAM (MATCHING REFERENCE PHONE 1) */}
      <DashboardRecentTransactions transactions={recentExpenses} />

      {/* 4. ASYMMETRIC BENTO GRID - TREND CHART & CATEGORIES (MATCHING REFERENCE PHONE 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Vertical Bar Analytics */}
        <div className="lg:col-span-7 fintech-card p-6 sm:p-7 rounded-[28px] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-clay)]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-primary)]">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-heading font-black text-base text-[var(--text-primary)]">
                  Analytics &amp; Trends
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  6-month transaction flow
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[var(--bg-recessed)] text-[var(--text-muted)] border border-[var(--border-clay)]">
              6-Month
            </span>
          </div>

          <SpendingTrendChart data={analytics?.monthlyTrend || []} />
        </div>

        {/* Right Column (5 cols): Category Breakdown Matrix */}
        <div className="lg:col-span-5">
          <DashboardCategoryBreakdown
            categoryBreakdown={analytics?.categoryBreakdown || []}
            totalMonthSpent={summary?.monthSpent || 0}
          />
        </div>
      </div>

      {/* 5. FINANCIAL INTELLIGENCE OBSERVATIONS */}
      <DashboardInsightsCard
        insights={insights}
        dismissedInsights={dismissedInsights}
        onDismiss={dismissInsight}
      />
      </div>
    </PullToRefresh>
  );
}
