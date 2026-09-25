'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

export default function SpendingTrendChart({ data = [] }) {
  const [activeIndex, setActiveIndex] = useState(data.length ? data.length - 1 : null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-52 sm:h-64 items-center justify-center text-xs text-[var(--text-muted)] font-medium rounded-2xl bg-[var(--bg-recessed)]">
        No trajectory records available yet
      </div>
    );
  }

  const latestVal = activeIndex !== null && data[activeIndex] ? data[activeIndex].total : data[data.length - 1]?.total || 0;
  const latestLabel = activeIndex !== null && data[activeIndex] ? data[activeIndex].period : data[data.length - 1]?.period || '';

  return (
    <div className="space-y-4">
      {/* Top Value Display matching Phone 3 in reference image */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-bold block">
            {latestLabel ? `Period: ${latestLabel}` : 'Selected Period'}
          </span>
          <span className="font-heading font-black text-2xl sm:text-3xl text-[var(--text-primary)] tabular-nums">
            {formatCurrency(latestVal)}
          </span>
        </div>

        <div className="px-3 py-1 rounded-full bg-[var(--bg-recessed)] text-[var(--text-secondary)] text-xs font-bold border border-[var(--border-clay)]">
          Monthly Pacing
        </div>
      </div>

      {/* Bar Chart matching Reference Phone 3 (Clean vertical bars with rounded tops) */}
      <div className="h-48 sm:h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 8, left: -24, bottom: 0 }}
            onMouseMove={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <XAxis
              dataKey="period"
              stroke="var(--text-muted)"
              fontSize={11}
              fontWeight={700}
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
              fontSize={10}
              fontWeight={600}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => {
                if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
                return `₹${v}`;
              }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="px-3 py-1.5 rounded-xl text-xs bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xl font-bold font-heading">
                      <span>₹{Number(payload[0].value).toLocaleString('en-IN')}</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="total" radius={[8, 8, 4, 4]}>
              {data.map((entry, index) => {
                const isCurrent = index === (activeIndex !== null ? activeIndex : data.length - 1);
                return (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={isCurrent ? '#818CF8' : 'var(--bg-muted)'}
                    className="transition-all duration-200 cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
