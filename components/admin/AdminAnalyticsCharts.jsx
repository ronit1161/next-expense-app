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

export default function AdminAnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* User Activity Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            🟢
          </div>
          <div>
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Active Users (&lt; 7 Days)
            </span>
            <p className="text-xl font-extrabold text-charcoal">
              {analytics.userTiers.active}{' '}
              <span className="text-xs font-normal text-pencil">
                ({Math.round((analytics.userTiers.active / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
            🟡
          </div>
          <div>
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Occasional (&lt; 30 Days)
            </span>
            <p className="text-xl font-extrabold text-charcoal">
              {analytics.userTiers.occasional}{' '}
              <span className="text-xs font-normal text-pencil">
                ({Math.round((analytics.userTiers.occasional / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 flex items-center justify-center font-bold">
            🔴
          </div>
          <div>
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Dormant (&gt; 30 Days)
            </span>
            <p className="text-xl font-extrabold text-charcoal">
              {analytics.userTiers.dormant}{' '}
              <span className="text-xs font-normal text-pencil">
                ({Math.round((analytics.userTiers.dormant / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 6-Month Gross Spend Area Chart */}
      <div className="neu-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-charcoal">
              6-Month Gross Volume Growth
            </h3>
            <p className="text-[11px] text-pencil">
              Total monetary spending recorded across the entire platform
            </p>
          </div>
          <span className="text-xs font-bold text-[#0047FF] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
            Gross Flow
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="grossSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0047FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0047FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
                formatter={(val) => [formatCurrency(val), 'Platform Spend']}
              />
              <Area
                type="monotone"
                dataKey="grossSpend"
                stroke="#0047FF"
                strokeWidth={3}
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
        <div className="neu-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-charcoal">
            Payment Method Share
          </h3>
          <p className="text-[11px] text-pencil">
            UPI vs Cash vs Card split across all platform entries
          </p>

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
                  paddingAngle={3}
                >
                  {analytics.paymentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Volume']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D8D2C6] dark:border-white/10">
            {analytics.paymentDistribution.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: p.fill }}
                ></span>
                <span className="text-pencil truncate">{p.name}:</span>
                <span className="font-bold text-charcoal">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Category Volume Distribution */}
        <div className="neu-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-charcoal">
            Category Spend Volume
          </h3>
          <p className="text-[11px] text-pencil">
            Top categories ranked by total monetary flow
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.categoryDistribution.slice(0, 6)}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="var(--text-muted)"
                  fontSize={10}
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--text-primary)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'Total Volume']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {analytics.categoryDistribution.slice(0, 6).map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color || '#0047FF'} />
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
