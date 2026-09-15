'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardCategoryBreakdown({ categoryBreakdown = [], totalMonthSpent = 0 }) {
  const totalMonth = totalMonthSpent || 1;

  return (
    <div className="neu-card p-5 sm:p-6 rounded-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
          Where Your Money Went
        </h2>
        <span className="text-[11px] text-pencil font-medium">
          {categoryBreakdown.length} Categories
        </span>
      </div>

      {categoryBreakdown.length > 0 ? (
        <div className="space-y-4 pt-1">
          {categoryBreakdown.map((cat) => {
            const percent = Math.round((cat.total / totalMonth) * 100);

            return (
              <div key={cat.categoryId} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal">
                    {cat.categoryName}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-pencil tabular-nums">
                      {percent}%
                    </span>
                    <span className="font-bold text-charcoal tabular-nums">
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                </div>
                {/* Indented Groove Track with Molded Fill */}
                <div className="neu-groove h-2 w-full p-0.5">
                  <div
                    className="h-full bg-charcoal rounded-full neu-progress-fill transition-all duration-300"
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="neu-inset p-6 text-center rounded-2xl space-y-2">
          <p className="text-xs text-pencil">No expenses recorded this month yet.</p>
          <Link
            href="/expenses?action=add"
            className="inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline"
          >
            <Plus className="h-3 w-3" />
            <span>Record your first transaction</span>
          </Link>
        </div>
      )}
    </div>
  );
}
