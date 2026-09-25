'use client';

import { useState } from 'react';
import {
  CreditCard,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import SwipeableExpenseRow from './SwipeableExpenseRow';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
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
  const [activeSwipedId, setActiveSwipedId] = useState(null);

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
      {/* Mobile Gestures Helper Badge */}
      {expenses.length > 0 && (
        <div className="sm:hidden flex items-center justify-between px-3.5 py-2 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-bold">
            <span>&larr;</span> Swipe right to Edit
          </span>
          <span className="text-slate-300 dark:text-white/10 font-black">&bull;</span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
            Swipe left to Delete <span>&rarr;</span>
          </span>
        </div>
      )}

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
                <span className="text-xs font-heading font-black text-[var(--text-primary)]">
                  Day Total: <AnimatedNumber value={dayTotal} />
                </span>
              </div>

              {/* Day Items List - Swipeable Rows */}
              <div className="space-y-1.5">
                {dayExpenses.map((exp) => (
                  <SwipeableExpenseRow
                    key={exp.id}
                    expense={exp}
                    onOpenEdit={onOpenEdit}
                    onDelete={onDelete}
                    isSwipedOpen={activeSwipedId === exp.id}
                    onSwipeChange={(id, action) => {
                      setActiveSwipedId(action ? id : null);
                    }}
                  />
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
