'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function SpendingTrendChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-44 sm:h-56 md:h-64 items-center justify-center text-xs font-mono text-pencil uppercase border-2 border-dashed border-black/20 dark:border-white/20">
        NO TRAJECTORY DATA RECORDED
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
            <linearGradient id="swissRedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF3000" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#FF3000" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="period"
            stroke="var(--text-muted)"
            fontSize={10}
            fontWeight={700}
            fontFamily="Inter, sans-serif"
            tickLine={true}
            axisLine={{ stroke: 'var(--border-main)', strokeWidth: 1.5 }}
            tickFormatter={(v) => {
              const parts = v.split('-');
              if (parts.length === 2) {
                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                const monthIdx = parseInt(parts[1], 10) - 1;
                return months[monthIdx] || v;
              }
              return v;
            }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={10}
            fontWeight={700}
            fontFamily="Inter, sans-serif"
            tickLine={true}
            axisLine={{ stroke: 'var(--border-main)', strokeWidth: 1.5 }}
            tickFormatter={(v) => {
              if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
              return `₹${v}`;
            }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="border-2 border-black dark:border-white bg-[var(--bg-surface)] p-3 text-xs shadow-none">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                      PERIOD // {label}
                    </p>
                    <p className="text-sm font-black text-charcoal tabular-nums mt-1">
                      ₹{Number(payload[0].value).toLocaleString('en-IN')}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="linear"
            dataKey="amount"
            stroke="#FF3000"
            strokeWidth={3}
            fill="url(#swissRedGradient)"
            dot={{ r: 4, fill: '#000000', stroke: '#FF3000', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#FF3000', stroke: '#000000', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
