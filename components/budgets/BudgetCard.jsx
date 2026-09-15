'use client';

import { Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

export default function BudgetCard({ budget, onDelete }) {
  return (
    <div className="neu-card rounded-2xl p-5 space-y-3.5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl neu-card-sm text-charcoal">
            <CategoryIcon iconName={budget.categoryIcon} className="h-4 w-4 text-pencil" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-charcoal">{budget.categoryName}</h4>
            <p className="text-[11px] text-pencil tabular-nums">
              Cap: {formatCurrency(budget.budgetLimit)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-lg tabular-nums ${
              budget.isOverBudget
                ? 'neu-inset text-loss'
                : 'neu-inset text-[#0047FF]'
            }`}
          >
            {budget.utilizationPercentage}%
          </span>
          <button
            onClick={() => onDelete(budget.budgetId)}
            className="neu-btn p-1.5 text-pencil hover:text-loss rounded-lg cursor-pointer"
            title="Remove Budget Cap"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Indented Groove Meter */}
      <div className="neu-groove h-2 w-full p-0.5">
        <div
          className={`h-full rounded-full neu-progress-fill transition-all duration-300 ${
            budget.isOverBudget ? 'bg-loss' : 'bg-charcoal'
          }`}
          style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1">
        <span className="text-pencil font-medium">
          Spent: <strong className="text-charcoal tabular-nums">{formatCurrency(budget.spentAmount)}</strong>
        </span>
        <span
          className={`font-semibold tabular-nums ${
            budget.isOverBudget ? 'text-loss' : 'text-gain'
          }`}
        >
          {budget.isOverBudget
            ? `Over by ${formatCurrency(budget.spentAmount - budget.budgetLimit)}`
            : `${formatCurrency(budget.remainingAmount)} left`}
        </span>
      </div>
    </div>
  );
}
