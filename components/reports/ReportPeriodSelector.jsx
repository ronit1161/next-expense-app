'use client';

import { Calendar } from 'lucide-react';

const MONTHS = [
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

export default function ReportPeriodSelector({ month, year, onMonthChange, onYearChange }) {
  return (
    <div className="fintech-card p-4 rounded-2xl flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)]">
        <div className="h-8 w-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
          <Calendar className="h-4 w-4" />
        </div>
        <span>Statement Timeframe:</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="py-2 px-3 text-xs font-semibold rounded-xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand-accent)] transition"
        >
          {MONTHS.map((m, idx) => (
            <option key={m} value={idx + 1} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="py-2 px-3 text-xs font-semibold rounded-xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] text-[var(--text-primary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--brand-accent)] transition"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y} className="bg-[var(--bg-card)] text-[var(--text-primary)]">
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
