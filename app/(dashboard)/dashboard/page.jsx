'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { getDashboardDataAction } from '@/actions/dashboard-actions';
import { DashboardSkeleton, Skeleton } from '@/components/ui/skeletons';
import DashboardSummaryCards from '@/components/dashboard/DashboardSummaryCards';
import DashboardInsightsCard from '@/components/dashboard/DashboardInsightsCard';
import DashboardCategoryBreakdown from '@/components/dashboard/DashboardCategoryBreakdown';

// Dynamic lazy-loaded chart to avoid bundle bloat and improve initial paint
const SpendingTrendChart = dynamic(
  () => import('@/components/dashboard/SpendingTrendChart'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 sm:h-64 w-full rounded-[24px]" />,
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
      <div className="clay-card p-8 sm:p-10 text-center max-w-md mx-auto my-12 space-y-4 rounded-[36px]">
        <div className="h-14 w-14 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-red-600 text-white flex items-center justify-center font-heading font-black text-xl clay-orb shadow-lg">
          !
        </div>
        <div>
          <h3 className="text-base font-heading font-black text-charcoal">Failed to Load Overview</h3>
          <p className="text-xs text-pencil mt-1">{error}</p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          className="clay-btn-primary py-3 px-6 text-xs font-heading font-black flex items-center justify-center gap-2 mx-auto rounded-2xl cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP CLAY HERO BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 text-xs font-heading font-black mb-1">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>Overview &bull; {currentMonthName} {currentYear}</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-charcoal bg-gradient-to-r from-purple-800 via-pink-600 to-indigo-600 dark:from-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
            Good {greeting}!
          </h1>
          <p className="text-sm font-medium text-pencil">
            Here is your financial pulse and monthly pacing overview.
          </p>
        </div>

        <Link
          href="/expenses"
          className="clay-btn-secondary px-5 py-3 text-xs font-heading font-extrabold flex items-center gap-2 self-start sm:self-auto rounded-[20px] shadow-sm hover:text-purple-600 group"
        >
          <span>View All Activity</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-purple-600" />
        </Link>
      </div>

      {/* 2. SUMMARY METRIC TILES */}
      <DashboardSummaryCards summary={summary} />

      {/* 3. SMART SPENDING OBSERVATIONS */}
      <DashboardInsightsCard
        insights={insights}
        dismissedInsights={dismissedInsights}
        onDismiss={dismissInsight}
      />

      {/* 4. ASYMMETRIC 8:4 BENTO GRID - TRAJECTORY & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Trajectory & Monthly Velocity */}
        <div className="lg:col-span-8 clay-card p-6 sm:p-8 space-y-4 rounded-[32px]">
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 text-white flex items-center justify-center clay-orb shadow-md">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading font-black text-base text-charcoal">
                  Spending Trajectory
                </h2>
                <p className="text-xs text-pencil">
                  6-month monetary volume & velocity
                </p>
              </div>
            </div>
            <span className="font-heading text-xs font-extrabold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              6-Month Trend
            </span>
          </div>

          <SpendingTrendChart data={analytics?.monthlyTrend || []} />
        </div>

        {/* Right Column (4 cols): Category Breakdown */}
        <div className="lg:col-span-4">
          <DashboardCategoryBreakdown
            categoryBreakdown={analytics?.categoryBreakdown || []}
            totalMonthSpent={summary?.monthSpent || 0}
          />
        </div>
      </div>
    </div>
  );
}
