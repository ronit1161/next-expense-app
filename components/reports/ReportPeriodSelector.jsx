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
    <div className="clay-card p-4 rounded-[24px] flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5 text-xs font-heading font-black text-charcoal">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white clay-orb shadow-sm">
          <Calendar className="h-4 w-4" />
        </div>
        <span>Statement Timeframe:</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="clay-input py-2 px-3 text-xs font-heading font-bold rounded-xl cursor-pointer"
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
          className="clay-input py-2 px-3 text-xs font-heading font-bold rounded-xl cursor-pointer"
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
