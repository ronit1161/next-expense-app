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

const PROFESSIONAL_COLORS = ['#0F766E', '#14B8A6', '#6366F1', '#10B981', '#F59E0B', '#0EA5E9'];

export default function AdminAnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* User Activity Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fintech-card p-5 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Active Users (&lt; 7 days)
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {analytics.userTiers.active}{' '}
              <span className="text-xs font-bold text-emerald-500">
                ({Math.round((analytics.userTiers.active / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/20 text-xs font-bold">
            Tier 01
          </span>
        </div>

        <div className="fintech-card p-5 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Occasional (&lt; 30 days)
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {analytics.userTiers.occasional}{' '}
              <span className="text-xs font-bold text-amber-500">
                ({Math.round((analytics.userTiers.occasional / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/20 text-xs font-bold">
            Tier 02
          </span>
        </div>

        <div className="fintech-card p-5 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Dormant (&gt; 30 days)
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
              {analytics.userTiers.dormant}{' '}
              <span className="text-xs font-bold text-rose-500">
                ({Math.round((analytics.userTiers.dormant / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 border border-rose-500/20 text-xs font-bold">
            Tier 03
          </span>
        </div>
      </div>

      {/* 6-Month Gross Spend Area Chart */}
      <div className="fintech-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">[01]</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                6-Month Gross Volume Trajectory
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Platform-wide transaction flow metric
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold self-start sm:self-auto">
            Gross Stream
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="grossSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.15} vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#13141D',
                  color: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                formatter={(val) => [formatCurrency(val), 'Platform Spend']}
              />
              <Area
                type="monotone"
                dataKey="grossSpend"
                stroke="#0F766E"
                strokeWidth={2.5}
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
        <div className="fintech-card p-6 rounded-3xl space-y-4">
          <div className="pb-3.5 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">[02]</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Payment Channel Distribution
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                      fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Volume']}
                  contentStyle={{
                    backgroundColor: '#13141D',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 dark:border-white/5">
            {analytics.paymentDistribution.map((p) => (
              <div key={p.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block truncate">
                  {p.name}
                </span>
                <span className="text-base font-black text-slate-900 dark:text-white mt-0.5 block tabular-nums">
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Category Volume Distribution */}
        <div className="fintech-card p-6 rounded-3xl space-y-4">
          <div className="pb-3.5 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">[03]</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Category Volume Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.15} horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#94A3B8"
                  fontSize={11}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Total Volume']}
                  contentStyle={{
                    backgroundColor: '#13141D',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                  {analytics.categoryDistribution.slice(0, 6).map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]}
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
