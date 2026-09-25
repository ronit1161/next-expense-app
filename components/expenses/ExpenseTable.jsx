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
        <div className="fintech-card p-10 sm:p-14 text-center space-y-4 rounded-3xl">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-muted)]">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-heading font-black text-[var(--text-primary)]">
              No Transactions Logged
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
              No activity found for the selected filters. Log your first expense!
            </p>
          </div>
          <button
            onClick={onOpenAdd}
            className="fintech-btn-primary px-5 py-2.5 text-xs font-bold rounded-full cursor-pointer shadow-sm inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Record Expense</span>
          </button>
        </div>
      ) : (
        sortedDates.map((dateStr) => {
          const dayExpenses = groupedExpenses[dateStr];
          const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

          return (
            <div key={dateStr} className="space-y-2.5">
              {/* Date Group Header */}
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {formatDate(dateStr)}
                </span>
                <span className="text-xs font-heading font-black text-[var(--text-primary)] tabular-nums">
                  Day Total: {formatCurrency(dayTotal)}
                </span>
              </div>

              {/* Day Items List - Clean Fintech Row Layout (matching reference) */}
              <div className="fintech-card p-2 sm:p-3 rounded-2xl divide-y divide-[var(--border-clay)]">
                {dayExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 flex items-center justify-between hover:bg-[var(--bg-recessed)]/50 rounded-xl transition-all gap-3 group"
                  >
                    {/* Left: Icon & Title */}
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: exp.categoryColor || '#181B26' }}
                      >
                        <CategoryIcon iconName={exp.categoryIcon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-heading font-bold text-[var(--text-primary)] truncate">
                          {exp.description || exp.categoryName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)] font-medium">
                          <span>{exp.categoryName}</span>
                          <span>&bull;</span>
                          <span className="uppercase text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg-recessed)]">
                            {exp.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: High-Contrast Amount & Action buttons */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm sm:text-base font-heading font-black text-[var(--text-primary)] tabular-nums">
                        -{formatCurrency(exp.amount)}
                      </span>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenEdit(exp)}
                          className="h-7 w-7 rounded-lg bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                          aria-label="Edit record"
                          title="Edit record"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => onDelete(exp.id)}
                          className="h-7 w-7 rounded-lg bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 transition-all cursor-pointer"
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
        <div className="fintech-card p-3 rounded-2xl flex items-center justify-between">
          <button
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="fintech-btn-secondary px-3.5 py-1.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-bold text-[var(--text-muted)]">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="fintech-btn-secondary px-3.5 py-1.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
