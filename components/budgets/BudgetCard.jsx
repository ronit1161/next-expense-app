'use client';

import { Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

export default function BudgetCard({ budget, onDelete }) {
  return (
    <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 space-y-3 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center bg-black text-white dark:bg-white dark:text-black">
              <CategoryIcon iconName={budget.categoryIcon} className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-charcoal">{budget.categoryName}</h4>
              <p className="text-[10px] font-mono text-pencil uppercase">
                CAP: {formatCurrency(budget.budgetLimit)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black font-mono px-1.5 py-0.5 border ${
                budget.isOverBudget
                  ? 'bg-[#FF3000] text-white border-[#FF3000]'
                  : 'bg-black text-white border-black dark:bg-white dark:text-black'
              }`}
            >
              {budget.utilizationPercentage}%
            </span>
            <button
              onClick={() => onDelete(budget.budgetId)}
              className="p-1 border border-black/20 dark:border-white/20 hover:border-[#FF3000] hover:bg-[#FF3000] hover:text-white cursor-pointer transition-colors"
              title="Remove Budget Cap"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Solid Progress Meter */}
        <div className="border border-black dark:border-white/20 bg-[var(--bg-subtle)] h-3 w-full p-0.5 mt-3">
          <div
            className={`h-full transition-all duration-300 ${
              budget.isOverBudget ? 'bg-[#FF3000]' : 'bg-black dark:bg-white'
            }`}
            style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono pt-2 border-t border-black/10 dark:border-white/10 uppercase">
        <span className="text-pencil">
          SPENT: <strong className="text-charcoal font-black">{formatCurrency(budget.spentAmount)}</strong>
        </span>
        <span
          className={`font-black ${
            budget.isOverBudget ? 'text-[#FF3000]' : 'text-charcoal'
          }`}
        >
          {budget.isOverBudget
            ? `OVER BY ${formatCurrency(budget.spentAmount - budget.budgetLimit)}`
            : `${formatCurrency(budget.remainingAmount)} LEFT`}
        </span>
      </div>
    </div>
  );
}
