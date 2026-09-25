'use client';

import {
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Calendar,
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
        <div className="clay-card p-8 sm:p-12 text-center space-y-4 rounded-[32px]">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 text-white flex items-center justify-center clay-orb shadow-md">
            <CreditCard className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-heading font-black text-charcoal">No Transactions Logged</h3>
            <p className="text-xs text-pencil mt-1 max-w-xs mx-auto">
              No activity found for the selected filters. Log your first expense!
            </p>
          </div>
          <button
            onClick={onOpenAdd}
            className="clay-btn-primary px-5 py-3 text-xs font-heading font-black rounded-2xl cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Record First Expense</span>
          </button>
        </div>
      ) : (
        sortedDates.map((dateStr) => {
          const dayExpenses = groupedExpenses[dateStr];
          const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

          return (
            <div key={dateStr} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-heading font-black text-charcoal uppercase tracking-wider">
                    {formatDate(dateStr)}
                  </span>
                </div>
                <span className="text-xs font-heading font-black text-purple-700 dark:text-purple-300 tabular-nums">
                  Day Total: {formatCurrency(dayTotal)}
                </span>
              </div>

              {/* Day Items List */}
              <div className="clay-card p-2 rounded-[28px] divide-y divide-purple-500/10">
                {dayExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 flex items-center justify-between hover:bg-white/60 dark:hover:bg-white/5 rounded-2xl transition-all gap-3"
                  >
                    {/* Left: Icon & Description */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 text-white shrink-0 clay-orb shadow-sm">
                        <CategoryIcon iconName={exp.categoryIcon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-heading font-black text-charcoal truncate">
                          {exp.description || exp.categoryName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-pencil font-medium">
                          <span className="font-heading font-bold text-purple-600 dark:text-purple-400">{exp.categoryName}</span>
                          <span>&bull;</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#EFEBF5] dark:bg-[#1C172C] text-[10px] font-heading font-bold">
                            {exp.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Amount & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm sm:text-base font-heading font-black text-charcoal tabular-nums">
                        -{formatCurrency(exp.amount)}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenEdit(exp)}
                          className="h-8 w-8 rounded-xl bg-white dark:bg-[#2B243D] flex items-center justify-center text-pencil hover:text-purple-600 hover:scale-110 active:scale-95 shadow-sm transition-all cursor-pointer"
                          aria-label="Edit record"
                          title="Edit record"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(exp.id)}
                          className="h-8 w-8 rounded-xl bg-white dark:bg-[#2B243D] flex items-center justify-center text-pencil hover:text-rose-600 hover:scale-110 active:scale-95 shadow-sm transition-all cursor-pointer"
                          aria-label="Delete record"
                          title="Delete record"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="clay-card p-3 rounded-[24px] flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="clay-btn-secondary px-4 py-2 text-xs font-heading font-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-heading font-bold text-pencil">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="clay-btn-secondary px-4 py-2 text-xs font-heading font-black rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
