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
        <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 rounded-none flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
              ACTIVE USERS (&lt; 7 DAYS)
            </span>
            <p className="font-mono text-2xl font-black text-black dark:text-white mt-1 tabular-nums">
              {analytics.userTiers.active}{' '}
              <span className="text-xs font-normal text-neutral-500">
                ({Math.round((analytics.userTiers.active / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black font-bold uppercase rounded-none">
            TIER 01
          </span>
        </div>

        <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 rounded-none flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
              OCCASIONAL (&lt; 30 DAYS)
            </span>
            <p className="font-mono text-2xl font-black text-black dark:text-white mt-1 tabular-nums">
              {analytics.userTiers.occasional}{' '}
              <span className="text-xs font-normal text-neutral-500">
                ({Math.round((analytics.userTiers.occasional / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 border border-black dark:border-white text-black dark:text-white font-bold uppercase rounded-none">
            TIER 02
          </span>
        </div>

        <div className="border-2 border-black dark:border-white bg-white dark:bg-black p-5 rounded-none flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
              DORMANT (&gt; 30 DAYS)
            </span>
            <p className="font-mono text-2xl font-black text-black dark:text-white mt-1 tabular-nums">
              {analytics.userTiers.dormant}{' '}
              <span className="text-xs font-normal text-neutral-500">
                ({Math.round((analytics.userTiers.dormant / (analytics.userTiers.total || 1)) * 100)}%)
              </span>
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 bg-swiss-red text-white font-bold uppercase rounded-none">
            TIER 03
          </span>
        </div>
      </div>

      {/* 6-Month Gross Spend Area Chart */}
      <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 rounded-none space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black dark:border-white pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-swiss-red">[01]</span>
              <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                6-Month Gross Volume Trajectory
              </h3>
            </div>
            <p className="font-mono text-[11px] text-neutral-500 uppercase mt-0.5">
              PLATFORM-WIDE TRANSACTION FLOW METRIC
            </p>
          </div>
          <span className="font-mono text-xs font-black text-white bg-black dark:bg-white dark:text-black px-3 py-1 uppercase rounded-none self-start sm:self-auto">
            GROSS_STREAM
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="grossSpendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF3000" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FF3000" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#d4d4d4" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#737373"
                fontSize={11}
                tickLine={true}
                axisLine={true}
                fontFamily="var(--font-mono, monospace)"
              />
              <YAxis
                stroke="#737373"
                fontSize={11}
                tickLine={true}
                axisLine={true}
                fontFamily="var(--font-mono, monospace)"
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '0px',
                  border: '2px solid #FFFFFF',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '12px',
                }}
                formatter={(val) => [formatCurrency(val), 'PLATFORM_SPEND']}
              />
              <Area
                type="monotone"
                dataKey="grossSpend"
                stroke="#FF3000"
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
        <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 rounded-none space-y-4">
          <div className="border-b-2 border-black dark:border-white pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-swiss-red">[02]</span>
              <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                Payment Channel Distribution
              </h3>
            </div>
            <p className="font-mono text-[11px] text-neutral-500 uppercase mt-0.5">
              SETTLEMENT RAILS BREAKDOWN (UPI / CASH / CARD)
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
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={0}
                >
                  {analytics.paymentDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#000000' : index === 1 ? '#FF3000' : '#737373'}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'VOLUME']}
                  contentStyle={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    borderRadius: '0px',
                    border: '2px solid #FFFFFF',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t-2 border-black dark:border-white">
            {analytics.paymentDistribution.map((p, idx) => (
              <div key={p.name} className="border border-black dark:border-white p-2 text-center">
                <span className="font-mono text-[10px] text-neutral-500 uppercase block truncate">
                  {p.name}
                </span>
                <span className="font-mono text-sm font-black text-black dark:text-white mt-0.5 block tabular-nums">
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Category Volume Distribution */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-black p-6 rounded-none space-y-4">
          <div className="border-b-2 border-black dark:border-white pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black text-swiss-red">[03]</span>
              <h3 className="font-black text-base uppercase tracking-tight text-black dark:text-white">
                Category Volume Matrix
              </h3>
            </div>
            <p className="font-mono text-[11px] text-neutral-500 uppercase mt-0.5">
              AGGREGATE SPEND BY CATEGORY CLASSIFICATION
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.categoryDistribution.slice(0, 6)}
                layout="vertical"
                margin={{ left: 10 }}
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#d4d4d4" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#737373"
                  fontSize={10}
                  fontFamily="var(--font-mono, monospace)"
                  tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#000000"
                  fontSize={10}
                  fontFamily="var(--font-mono, monospace)"
                  tickLine={true}
                  axisLine={true}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val), 'TOTAL_VOLUME']}
                  contentStyle={{
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    borderRadius: '0px',
                    border: '2px solid #FFFFFF',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" radius={[0, 0, 0, 0]}>
                  {analytics.categoryDistribution.slice(0, 6).map((entry, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={index % 2 === 0 ? '#000000' : '#FF3000'}
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
