'use client';

import { History, Trash2, ArrowUpRight, ArrowDownLeft, Clock, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DebtCard({ loan, onOpenSettlement, onDelete }) {
  const isLent = loan.type === 'LENT';
  const isFullySettled = loan.status === 'SETTLED';
  const repaidPercentage = loan.amount > 0
    ? Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)
    : 0;

  return (
    <div className="clay-card p-6 rounded-[28px] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--clay-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`clay-badge-pill text-[11px] font-bold ${
                  isLent
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                {isLent ? 'Lent (Receivable)' : 'Borrowed (Payable)'}
              </span>
            </div>
            <h4
              className="text-base font-extrabold text-[var(--text-primary)] mt-2"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {loan.contactName}
            </h4>
            {loan.description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{loan.description}</p>
            )}
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider block">
              Outstanding
            </span>
            <span
              className={`text-lg font-black tracking-tight ${
                !isLent ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {formatCurrency(loan.remainingAmount)}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block font-medium">
              Total: {formatCurrency(loan.amount)}
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
            <span className="font-bold text-[var(--text-secondary)]">Settled: {repaidPercentage}%</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(loan.loanDate)}
            </span>
          </div>
          <div className="clay-progress-track">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFullySettled
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : isLent
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500'
              }`}
              style={{ width: `${Math.min(100, repaidPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--clay-border)]">
        <span
          className={`clay-badge-pill text-[10px] font-bold uppercase tracking-wider ${
            isFullySettled
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : loan.status === 'PARTIAL'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              : 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
          }`}
        >
          {loan.status}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSettlement(loan)}
            className="clay-btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <History className="h-3.5 w-3.5" />
            <span>{isFullySettled ? 'Audit' : 'Settle'}</span>
          </button>
          <button
            onClick={() => onDelete(loan.id)}
            className="p-2 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete Loan Record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
