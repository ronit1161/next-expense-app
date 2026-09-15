'use client';

import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ExpenseTable({
  expenses = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  onOpenAdd,
  onOpenEdit,
  onDelete,
}) {
  // Group transactions by Date for the Editorial Timeline
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const dateKey = expense.expenseDate;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="space-y-5">
      {expenses.length === 0 ? (
        <div className="neu-card p-8 sm:p-12 text-center rounded-3xl space-y-4">
          <CreditCard className="h-8 w-8 text-pencil mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-charcoal">NO TRANSACTIONS LOGGED</h3>
            <p className="text-xs text-pencil mt-1 max-w-xs mx-auto">
              No activity found for the selected category or period.
            </p>
          </div>
          <button
            onClick={onOpenAdd}
            className="neu-btn-blue inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold cursor-pointer min-h-[38px]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record First Expense</span>
          </button>
        </div>
      ) : (
        sortedDates.map((dateStr) => {
          const dayExpenses = groupedExpenses[dateStr];
          const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

          return (
            <div key={dateStr} className="space-y-2">
              {/* Date Group Header */}
              <div className="flex items-center justify-between px-2 pb-0.5">
                <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
                  {formatDate(dateStr)}
                </span>
                <span className="text-xs font-bold text-charcoal tabular-nums font-numeric">
                  {formatCurrency(dayTotal)}
                </span>
              </div>

              {/* Day Items List */}
              <div className="neu-card rounded-2xl p-2 space-y-1.5">
                {dayExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 rounded-xl flex items-center justify-between hover:neu-inset transition-all gap-2.5"
                  >
                    {/* Left: Icon & Description */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl neu-card-sm text-charcoal shrink-0">
                        <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4 text-pencil" />
                      </div>
                      <div className="min-w-0 flex-1 pr-1">
                        <p className="text-xs sm:text-sm font-bold text-charcoal truncate leading-tight">
                          {exp.description || exp.categoryName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-pencil">
                          <span className="truncate max-w-[90px] sm:max-w-none">{exp.categoryName}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 rounded-md neu-inset text-charcoal font-medium shrink-0">
                            {exp.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-charcoal tabular-nums font-numeric">
                        {formatCurrency(exp.amount)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenEdit(exp)}
                          className="neu-btn p-1.5 text-pencil hover:text-charcoal rounded-lg cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Edit"
                          aria-label="Edit expense"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(exp.id)}
                          className="neu-btn p-1.5 text-pencil hover:text-loss rounded-lg cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                          title="Delete"
                          aria-label="Delete expense"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="neu-btn inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-charcoal disabled:opacity-40 cursor-pointer min-h-[36px]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-medium text-pencil tabular-nums">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="neu-btn inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-charcoal disabled:opacity-40 cursor-pointer min-h-[36px]"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
