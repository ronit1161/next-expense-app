'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function SpendingTrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-44 sm:h-56 md:h-64 items-center justify-center text-xs text-pencil font-medium rounded-2xl bg-[#EFEBF5]/50 dark:bg-[#1C172C]/50">
        No trajectory records available yet
      </div>
    );
  }

  return (
    <div className="h-44 sm:h-56 md:h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="clayVioletGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.08)" vertical={false} />
          <XAxis
            dataKey="period"
            stroke="var(--text-muted)"
            fontSize={11}
            fontWeight={600}
            fontFamily="DM Sans, sans-serif"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              const parts = v.split('-');
              if (parts.length === 2) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthIdx = parseInt(parts[1], 10) - 1;
                return months[monthIdx] || v;
              }
              return v;
            }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
            fontWeight={600}
            fontFamily="DM Sans, sans-serif"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
              return `₹${v}`;
            }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="clay-card p-3 rounded-2xl text-xs bg-white/95 dark:bg-[#231D35]/95 shadow-lg border border-purple-500/20">
                    <p className="font-heading font-black text-[11px] uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {label}
                    </p>
                    <p className="font-heading font-black text-sm text-charcoal tabular-nums mt-0.5">
                      ₹{Number(payload[0].value).toLocaleString('en-IN')}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#7C3AED"
            strokeWidth={3.5}
            fill="url(#clayVioletGrad)"
            dot={{ r: 4, fill: '#FFFFFF', stroke: '#7C3AED', strokeWidth: 3 }}
            activeDot={{ r: 6, fill: '#DB2777', stroke: '#FFFFFF', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
