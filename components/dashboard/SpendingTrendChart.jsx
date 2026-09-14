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
      <div className="flex h-44 sm:h-56 md:h-64 items-center justify-center text-xs text-pencil">
        No trajectory data recorded yet.
      </div>
    );
  }

  return (
    <div className="h-44 sm:h-56 md:h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 4, left: -22, bottom: 0 }}
        >
          <defs>
            <linearGradient id="journalBlueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0047FF" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0047FF" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="period"
            stroke="var(--text-muted)"
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              // Convert "2026-09" to "Sep" on narrow screens
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
            fontSize={9}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => {
              if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
              return `₹${v}`;
            }}
          />
          <Tooltip
            formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Outflow']}
            labelStyle={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px', fontSize: '10px' }}
            contentStyle={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-subtle)',
              borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              fontSize: '11px',
              padding: '8px 12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#0047FF"
            strokeWidth={2}
            fill="url(#journalBlueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
