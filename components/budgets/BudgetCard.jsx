'use client';

import { Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { formatCurrency } from '@/lib/utils';

export default function BudgetCard({ budget, onDelete }) {
  return (
    <div className="fintech-card p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-[var(--border-subtle)]">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-[var(--border-clay)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] text-[var(--text-primary)] shrink-0">
              <CategoryIcon iconName={budget.categoryIcon} className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">
                {budget.categoryName}
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                Cap: <span className="font-semibold text-[var(--text-secondary)] tabular-nums">{formatCurrency(budget.budgetLimit)}</span>
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
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-600 hover:bg-[var(--bg-recessed)] cursor-pointer transition-colors"
              title="Remove Budget Cap"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full mt-4 bg-[var(--bg-recessed)] rounded-full overflow-hidden">
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

      <div className="flex items-center justify-between text-xs pt-3.5 mt-2 border-t border-[var(--border-clay)]">
        <span className="text-[var(--text-muted)]">
          Spent: <strong className="text-[var(--text-primary)] font-black"><AnimatedNumber value={budget.spentAmount} /></strong>
        </span>
        <span
          className={`font-bold ${
            budget.isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-teal-600 dark:text-teal-400'
          }`}
        >
          {budget.isOverBudget ? (
            <span>+<AnimatedNumber value={budget.spentAmount - budget.budgetLimit} prefix="" /> over</span>
          ) : (
            <span><AnimatedNumber value={budget.remainingAmount} prefix="₹" /> left</span>
          )}
        </span>
      </div>
    </div>
  );
}
