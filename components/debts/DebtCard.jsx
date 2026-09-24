'use client';

import { History, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DebtCard({ loan, onOpenSettlement, onDelete }) {
  const isLent = loan.type === 'LENT';
  const isFullySettled = loan.status === 'SETTLED';
  const repaidPercentage = loan.amount > 0
    ? Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)
    : 0;

  return (
    <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 space-y-4 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[9px] font-black font-mono px-1.5 py-0.5 uppercase border ${
                  isLent
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                    : 'bg-[#FF3000] text-white border-[#FF3000]'
                }`}
              >
                {isLent ? 'LENT (RECEIVABLE)' : 'BORROWED (PAYABLE)'}
              </span>
            </div>
            <h4 className="text-sm font-black uppercase text-charcoal mt-1.5">
              {loan.contactName}
            </h4>
            {loan.description && (
              <p className="text-[10px] font-mono text-pencil uppercase mt-0.5">{loan.description}</p>
            )}
          </div>

          <div className="text-right">
            <span className="text-[9px] font-mono text-pencil uppercase block">OUTSTANDING</span>
            <span
              className={`text-base font-black font-mono tabular-nums ${
                !isLent ? 'text-[#FF3000]' : 'text-charcoal'
              }`}
            >
              {formatCurrency(loan.remainingAmount)}
            </span>
            <span className="text-[9px] font-mono text-pencil block">
              TOTAL: {formatCurrency(loan.amount)}
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-pencil uppercase">
            <span>SETTLED: {repaidPercentage}%</span>
            <span>DATE: {formatDate(loan.loanDate)}</span>
          </div>
          <div className="border border-black dark:border-white/20 bg-[var(--bg-subtle)] h-2.5 w-full p-0.5">
            <div
              className={`h-full transition-all duration-300 ${
                isFullySettled ? 'bg-black dark:bg-white' : 'bg-[#FF3000]'
              }`}
              style={{ width: `${Math.min(100, repaidPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
        <span className="text-[9px] font-black font-mono uppercase px-1 border border-current">
          STATUS // {loan.status}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenSettlement(loan)}
            className="swiss-btn px-2.5 py-1 text-[10px] font-black flex items-center gap-1"
          >
            <History className="h-3 w-3" />
            <span>{isFullySettled ? 'AUDIT' : 'SETTLE'}</span>
          </button>
          <button
            onClick={() => onDelete(loan.id)}
            className="p-1 border border-black/20 dark:border-white/20 hover:border-[#FF3000] hover:bg-[#FF3000] hover:text-white transition-colors cursor-pointer"
            title="Delete Loan Record"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
