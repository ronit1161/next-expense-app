'use client';

import Link from 'next/link';
import { Plus, PieChart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CATEGORY_GRADIENTS = [
  'from-purple-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-blue-400 to-cyan-600',
  'from-emerald-400 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-700',
];

export default function DashboardCategoryBreakdown({ categoryBreakdown = [], totalMonthSpent = 0 }) {
  const totalMonth = totalMonthSpent || 1;

  return (
    <div className="clay-card p-6 sm:p-7 rounded-[32px] space-y-4 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white clay-orb shadow-sm">
              <PieChart className="h-4 w-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-heading font-black text-base text-charcoal">
                Category Split
              </h2>
              <p className="text-[11px] text-pencil">Expenditure breakdown</p>
            </div>
          </div>
          <span className="font-heading text-[11px] font-bold text-pencil uppercase px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30">
            {categoryBreakdown.length} Sectors
          </span>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="space-y-4 pt-4">
            {categoryBreakdown.map((cat, idx) => {
              const percent = Math.round((cat.total / totalMonth) * 100);
              const grad = CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length];

              return (
                <div key={cat.categoryId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-heading font-extrabold text-charcoal flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${grad} inline-block`} />
                      {cat.categoryName}
                    </span>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-[11px] text-pencil">{percent}%</span>
                      <span className="font-heading font-bold text-charcoal">{formatCurrency(cat.total)}</span>
                    </div>
                  </div>
                  {/* Soft Rounded Progress Groove */}
                  <div className="neu-groove h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-500 shadow-sm`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center space-y-3 mt-4 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C]">
            <p className="text-xs text-pencil font-medium">No expenditures recorded yet</p>
            <Link
              href="/expenses?action=add"
              className="clay-btn-primary px-4 py-2 text-xs font-heading font-black rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Log First Expense</span>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between text-xs font-medium text-pencil">
        <span>Total Aggregated:</span>
        <span className="font-heading font-black text-sm text-purple-700 dark:text-purple-300">
          {formatCurrency(totalMonthSpent)}
        </span>
      </div>
    </div>
  );
}
