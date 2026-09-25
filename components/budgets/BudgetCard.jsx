'use client';

import { Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

export default function BudgetCard({ budget, onDelete }) {
  return (
    <div className="clay-card p-5 sm:p-6 rounded-[28px] space-y-3.5 transition-transform hover:-translate-y-1.5 duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 text-white clay-orb shadow-sm">
              <CategoryIcon iconName={budget.categoryIcon} className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-heading font-black text-charcoal truncate">{budget.categoryName}</h4>
              <p className="text-[11px] text-pencil font-medium">
                Cap: <strong className="font-bold text-charcoal">{formatCurrency(budget.budgetLimit)}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-heading font-black px-2 py-0.5 rounded-full ${
                budget.isOverBudget
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
              }`}
            >
              {budget.utilizationPercentage}%
            </span>
            <button
              onClick={() => onDelete(budget.budgetId)}
              className="p-1.5 rounded-lg text-pencil hover:text-rose-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
              title="Remove Budget Cap"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Clay Progress Meter */}
        <div className="neu-groove h-2.5 w-full mt-3.5">
          <div
            className={`h-full rounded-full transition-all duration-500 shadow-sm ${
              budget.isOverBudget
                ? 'bg-gradient-to-r from-rose-500 to-red-600'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 border-t border-purple-500/10 font-medium">
        <span className="text-pencil">
          Spent: <strong className="text-charcoal font-heading font-bold">{formatCurrency(budget.spentAmount)}</strong>
        </span>
        <span
          className={`font-heading font-black text-xs ${
            budget.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {budget.isOverBudget
            ? `+${formatCurrency(budget.spentAmount - budget.budgetLimit)} Over`
            : `${formatCurrency(budget.remainingAmount)} Left`}
        </span>
      </div>
    </div>
  );
}
