'use client';

import { Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

export default function BudgetCard({ budget, onDelete }) {
  return (
    <div className="fintech-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-slate-300 dark:hover:border-white/20">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shrink-0">
              <CategoryIcon iconName={budget.categoryIcon} className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {budget.categoryName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cap: <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">{formatCurrency(budget.budgetLimit)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full tabular-nums ${
                budget.isOverBudget
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20'
              }`}
            >
              {budget.utilizationPercentage}%
            </span>
            <button
              onClick={() => onDelete(budget.budgetId)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
              title="Remove Budget Cap"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full mt-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budget.isOverBudget
                ? 'bg-rose-500'
                : 'bg-gradient-to-r from-teal-500 to-cyan-400'
            }`}
            style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3.5 mt-2 border-t border-slate-100 dark:border-white/5">
        <span className="text-slate-500 dark:text-slate-400">
          Spent: <strong className="text-slate-900 dark:text-white font-black tabular-nums">{formatCurrency(budget.spentAmount)}</strong>
        </span>
        <span
          className={`font-bold tabular-nums ${
            budget.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'
          }`}
        >
          {budget.isOverBudget
            ? `+${formatCurrency(budget.spentAmount - budget.budgetLimit)} over`
            : `${formatCurrency(budget.remainingAmount)} left`}
        </span>
      </div>
    </div>
  );
}
