'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
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
    loading: () => <Skeleton className="h-56 sm:h-64 w-full" />,
  }
);

const MONTH_NAMES = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'MORNING';
  if (hour < 17) return 'AFTERNOON';
  return 'EVENING';
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
      <div className="border-4 border-black dark:border-white/30 p-8 text-center max-w-md mx-auto my-12 space-y-4 bg-[var(--bg-surface)]">
        <div className="h-10 w-10 mx-auto bg-[#FF3000] text-white flex items-center justify-center font-black">
          !
        </div>
        <div>
          <h3 className="text-sm font-black uppercase text-charcoal">FAILED TO LOAD OVERVIEW</h3>
          <p className="text-xs font-mono text-pencil mt-1">{error}</p>
        </div>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          className="swiss-btn-black py-2.5 px-5 text-xs font-black uppercase flex items-center justify-center gap-2 mx-auto cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>TRY AGAIN</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP SWISS HEADER BANNER */}
      <div className="border-b-4 border-black dark:border-white/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 bg-[#FF3000]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                01. OVERVIEW // EXECUTIVE DASHBOARD
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-charcoal">
              GOOD {greeting} • {currentMonthName} {currentYear}
            </h1>
          </div>

          <Link
            href="/expenses"
            className="swiss-btn px-4 py-2 text-xs font-black flex items-center gap-2 self-start sm:self-auto group"
          >
            <span>ACTIVITY TIMELINE</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-[#FF3000]" />
          </Link>
        </div>
      </div>

      {/* 2. SUMMARY METRIC TILES */}
      <DashboardSummaryCards summary={summary} />

      {/* 3. SMART SPENDING OBSERVATIONS */}
      <DashboardInsightsCard
        insights={insights}
        dismissedInsights={dismissedInsights}
        onDismiss={dismissInsight}
      />

      {/* 4. ASYMMETRIC 8:4 GRID - TRAJECTORY & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Trajectory & Monthly Velocity */}
        <div className="lg:col-span-8 border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                01.2 ANALYTICS
              </span>
              <h2 className="text-sm font-black uppercase tracking-tight text-charcoal">
                SPENDING TRAJECTORY // 6-MONTH TREND
              </h2>
            </div>
            <span className="text-[10px] font-mono text-pencil uppercase">
              MONTHLY VELOCITY
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
