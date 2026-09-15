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

  return (
    <div className="space-y-8 pb-20 md:pb-8 animate-fadeIn">
      {/* 1. TOP EDITORIAL HERO HEADER */}
      <div className="pt-2">
        <div className="flex items-center justify-between pb-4">
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

        {/* 2. SUMMARY METRIC CARDS */}
        <DashboardSummaryCards summary={summary} />
      </div>

      {/* 3. FINANCIAL OBSERVATIONS */}
      <DashboardInsightsCard
        insights={insights}
        dismissedInsights={dismissedInsights}
        onDismiss={dismissInsight}
      />

      {/* 4. WHERE YOUR MONEY WENT (Category Allocation) */}
      <DashboardCategoryBreakdown
        categoryBreakdown={analytics?.categoryBreakdown || []}
        totalMonthSpent={summary?.monthSpent || 0}
      />

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
