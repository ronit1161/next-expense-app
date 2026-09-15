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
    <div className="neu-card p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
        <Calendar className="h-4 w-4 text-pencil" />
        <span>Reporting Period:</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal focus:outline-none cursor-pointer"
        >
          {MONTHS.map((m, idx) => (
            <option key={m} value={idx + 1} className="bg-[var(--bg-main)] text-charcoal">
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal focus:outline-none cursor-pointer"
        >
          {[year - 1, year, year + 1].map((y) => (
            <option key={y} value={y} className="bg-[var(--bg-main)] text-charcoal">
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
