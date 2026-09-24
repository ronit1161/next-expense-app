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
    <div className="space-y-6">
      {expenses.length === 0 ? (
        <div className="border-4 border-black dark:border-white/20 p-8 sm:p-12 text-center space-y-4 bg-[var(--bg-surface)]">
          <CreditCard className="h-8 w-8 text-pencil mx-auto" />
          <div>
            <h3 className="text-sm font-black uppercase text-charcoal">NO TRANSACTIONS LOGGED</h3>
            <p className="text-xs font-mono text-pencil mt-1 max-w-xs mx-auto uppercase">
              NO ACTIVITY FOUND FOR THE SELECTED FILTERS.
            </p>
          </div>
          <button
            onClick={onOpenAdd}
            className="swiss-btn-accent px-4 py-2.5 text-xs font-black uppercase cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1 stroke-[3]" />
            <span>RECORD FIRST EXPENSE</span>
          </button>
        </div>
      ) : (
        sortedDates.map((dateStr) => {
          const dayExpenses = groupedExpenses[dateStr];
          const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

          return (
            <div key={dateStr} className="space-y-2">
              {/* Date Group Header - Swiss Crisp Border */}
              <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-1 px-1">
                <span className="text-xs font-black text-charcoal uppercase tracking-wider">
                  {formatDate(dateStr).toUpperCase()}
                </span>
                <span className="text-xs font-black text-charcoal tabular-nums font-mono">
                  TOTAL: {formatCurrency(dayTotal)}
                </span>
              </div>

              {/* Day Items List */}
              <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] divide-y-2 divide-black/10 dark:divide-white/10">
                {dayExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 flex items-center justify-between hover:bg-[var(--bg-subtle)] transition-colors gap-3"
                  >
                    {/* Left: Icon & Description */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center border border-black dark:border-white/40 bg-black text-white dark:bg-white dark:text-black shrink-0">
                        <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-black text-charcoal truncate uppercase">
                          {exp.description || exp.categoryName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-pencil uppercase">
                          <span className="font-bold text-charcoal">{exp.categoryName}</span>
                          <span>•</span>
                          <span className="border border-current px-1">
                            {exp.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-black text-charcoal tabular-nums font-mono">
                        -{formatCurrency(exp.amount)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenEdit(exp)}
                          className="p-1.5 border border-black/20 dark:border-white/20 hover:border-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                          aria-label="Edit record"
                          title="Edit record"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onDelete(exp.id)}
                          className="p-1.5 border border-black/20 dark:border-white/20 hover:border-[#FF3000] hover:bg-[#FF3000] hover:text-white transition-colors cursor-pointer"
                          aria-label="Delete record"
                          title="Delete record"
                        >
                          <Trash2 className="h-3 w-3" />
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-2 border-black dark:border-white/20 p-3 bg-[var(--bg-surface)]">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="swiss-btn px-3 py-1.5 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>PREVIOUS</span>
          </button>

          <span className="text-xs font-mono font-bold text-pencil uppercase">
            PAGE {page} OF {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="swiss-btn px-3 py-1.5 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>NEXT</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
