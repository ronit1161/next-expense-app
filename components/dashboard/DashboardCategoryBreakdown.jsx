'use client';

import Link from 'next/link';
import { Plus, PieChart, Layers } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

export default function DashboardCategoryBreakdown({ categoryBreakdown = [], totalMonthSpent = 0 }) {
  const totalMonth = totalMonthSpent || 1;

  return (
    <div className="fintech-card p-6 sm:p-7 rounded-[28px] space-y-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-clay)]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-primary)]">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-[var(--text-primary)]">
                Category Split
              </h2>
              <p className="text-[11px] text-[var(--text-muted)]">Sectors breakdown</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase px-2.5 py-0.5 rounded-full bg-[var(--bg-recessed)] border border-[var(--border-clay)]">
            {categoryBreakdown.length} Sectors
          </span>
        </div>

        {categoryBreakdown.length > 0 ? (
          /* 2-Column Fintech Grid matching Reference Phone 3 */
          <div className="grid grid-cols-2 gap-3 pt-4">
            {categoryBreakdown.map((cat) => {
              const percent = Math.round((cat.total / totalMonth) * 100);

              return (
                <div
                  key={cat.categoryId}
                  className="p-3.5 rounded-2xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex flex-col justify-between gap-2 hover:border-[var(--border-subtle)] transition-all"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-[var(--text-muted)] truncate block">
                      {cat.categoryName}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--brand-accent)] shrink-0">
                      {percent}%
                    </span>
                  </div>

                  <span className="font-heading font-black text-sm sm:text-base text-[var(--text-primary)] tabular-nums block">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3 mt-4 rounded-2xl bg-[var(--bg-recessed)]">
            <p className="text-xs text-[var(--text-muted)] font-medium">No expenditures recorded yet</p>
            <Link
              href="/expenses?action=add"
              className="fintech-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log First Expense</span>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-[var(--border-clay)] flex items-center justify-between text-xs font-medium text-[var(--text-muted)]">
        <span>Total Aggregated:</span>
        <span className="font-heading font-black text-sm text-[var(--text-primary)]">
          {formatCurrency(totalMonthSpent)}
        </span>
      </div>
    </div>
  );
}
