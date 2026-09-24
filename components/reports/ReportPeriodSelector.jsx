'use client';

import { Calendar } from 'lucide-react';

const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export default function ReportPeriodSelector({ month, year, onMonthChange, onYearChange }) {
  return (
    <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-xs font-black uppercase text-charcoal">
        <Calendar className="h-4 w-4 text-[#FF3000]" />
        <span>REPORTING PERIOD TIMEFRAME:</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="swiss-input py-1.5 px-3 text-xs font-mono font-bold uppercase cursor-pointer"
        >
          {MONTHS.map((m, idx) => (
            <option key={m} value={idx + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="swiss-input py-1.5 px-3 text-xs font-mono font-bold uppercase cursor-pointer"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
