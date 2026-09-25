'use client';

import { History, Trash2, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DebtCard({ loan, onOpenSettlement, onDelete }) {
  const isLent = loan.type === 'LENT';
  const isFullySettled = loan.status === 'SETTLED';
  const repaidPercentage = loan.amount > 0
    ? Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)
    : 0;

  return (
    <div className="fintech-card p-5 rounded-2xl transition-all duration-200 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-white/20">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-white/5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isLent
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}
              >
                {isLent ? 'Receivable' : 'Payable'}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 truncate">
              {loan.contactName}
            </h4>
            {loan.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{loan.description}</p>
            )}
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Outstanding
            </span>
            <span
              className={`text-lg font-black tracking-tight tabular-nums ${
                !isLent ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {formatCurrency(loan.remainingAmount)}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium tabular-nums">
              Total: {formatCurrency(loan.amount)}
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Settled: {repaidPercentage}%</span>
            <span className="flex items-center gap-1 text-[11px]">
              <Calendar className="h-3 w-3" />
              {formatDate(loan.loanDate)}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFullySettled
                  ? 'bg-teal-500'
                  : isLent
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                  : 'bg-gradient-to-r from-amber-500 to-rose-500'
              }`}
              style={{ width: `${Math.min(100, repaidPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-100 dark:border-white/5">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            isFullySettled
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : loan.status === 'PARTIAL'
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10'
          }`}
        >
          {loan.status}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSettlement(loan)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <History className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>{isFullySettled ? 'Audit' : 'Settle'}</span>
          </button>
          <button
            onClick={() => onDelete(loan.id)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Delete Loan Record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
