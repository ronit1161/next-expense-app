'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Users, TrendingUp, CreditCard, Layers } from 'lucide-react';

const CANDY_PIE_COLORS = ['#7C3AED', '#DB2777', '#0EA5E9', '#10B981', '#F59E0B', '#6366F1'];

export default function AdminAnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* User Activity Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clay-card p-6 rounded-[28px] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] block">
              Active Users (&lt; 7 days)
            </span>
            <p
              className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {analytics.userTiers.active}{' '}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ({Math.round((analytics.userTiers.active / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="clay-badge-pill bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            Tier 01
          </span>
        </div>

        <div className="clay-card p-6 rounded-[28px] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] block">
              Occasional (&lt; 30 days)
            </span>
            <p
              className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {analytics.userTiers.occasional}{' '}
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ({Math.round((analytics.userTiers.occasional / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="clay-badge-pill bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
            Tier 02
          </span>
        </div>

        <div className="clay-card p-6 rounded-[28px] flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[var(--text-muted)] block">
              Dormant (&gt; 30 days)
            </span>
            <p
              className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1 tabular-nums"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {analytics.userTiers.dormant}{' '}
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                ({Math.round((analytics.userTiers.dormant / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="clay-badge-pill bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
            Tier 03
          </span>
        </div>
      </div>

      {/* 6-Month Gross Spend Area Chart */}
      <div className="clay-card p-6 sm:p-8 rounded-[32px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--clay-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">[01]</span>
              <h3
                className="text-lg font-extrabold text-[var(--text-primary)]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                6-Month Gross Volume Trajectory
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
              Platform-wide transaction flow metric
            </p>
          </div>
          <span className="clay-badge-pill bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold self-start sm:self-auto">
            Gross Stream
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="grossSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  borderRadius: '16px',
                  border: '1px solid var(--clay-border)',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(val) => [formatCurrency(val), 'Platform Spend']}
              />
              <Area
                type="monotone"
                dataKey="grossSpend"
                stroke="#7C3AED"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#grossSpendGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Visuals: Payment Methods & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Method Distribution */}
        <div className="clay-card p-6 sm:p-7 rounded-[32px] space-y-4">
          <div className="pb-3 border-b border-[var(--clay-border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">[02]</span>
              <h3
                className="text-base font-extrabold text-[var(--text-primary)]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Payment Channel Distribution
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Settlement rails breakdown (UPI / Cash / Card)
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.paymentDistribution}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {analytics.paymentDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CANDY_PIE_COLORS[index % CANDY_PIE_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Volume']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    borderRadius: '16px',
                    border: '1px solid var(--clay-border)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[var(--clay-border)]">
            {analytics.paymentDistribution.map((p, idx) => (
              <div key={p.name} className="p-3 rounded-2xl bg-[var(--bg-muted)] clay-sunken text-center">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block truncate">
                  {p.name}
                </span>
                <span
                  className="text-base font-black text-[var(--text-primary)] mt-0.5 block tabular-nums"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Category Volume Distribution */}
        <div className="clay-card p-6 sm:p-7 rounded-[32px] space-y-4">
          <div className="pb-3 border-b border-[var(--clay-border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">[03]</span>
              <h3
                className="text-base font-extrabold text-[var(--text-primary)]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Category Volume Matrix
              </h3>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Aggregate spend by category classification
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.categoryDistribution.slice(0, 6)}
                layout="vertical"
                margin={{ left: 10, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 58, 237, 0.1)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--text-muted)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--text-primary)"
                  fontSize={11}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Total Volume']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    borderRadius: '16px',
                    border: '1px solid var(--clay-border)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                  {analytics.categoryDistribution.slice(0, 6).map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={CANDY_PIE_COLORS[index % CANDY_PIE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
