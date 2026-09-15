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
    <div className="neu-card rounded-2xl p-5 space-y-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider neu-inset ${
                isLent ? 'text-gain' : 'text-loss'
              }`}
            >
              {isLent ? 'Lent to' : 'Borrowed from'}
            </span>
            <span className="text-[10px] font-semibold text-pencil">
              {formatDate(loan.loanDate)}
            </span>
          </div>
          <h4 className="text-base font-display font-semibold text-charcoal mt-1.5">
            {loan.contactName}
          </h4>
          {loan.description && (
            <p className="text-xs text-pencil mt-0.5">{loan.description}</p>
          )}
        </div>

        <div className="text-right">
          <span className="text-xs text-pencil block">Remaining</span>
          <span className="text-base font-bold text-charcoal tabular-nums">
            {formatCurrency(loan.remainingAmount)}
          </span>
          <span className="text-[10px] text-pencil block">
            of {formatCurrency(loan.amount)}
          </span>
        </div>
      </div>

      {/* Progress track */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-pencil">
          <span>Principal: {formatCurrency(loan.amount)}</span>
          <span>Settled: {repaidPercentage}%</span>
        </div>
        <div className="neu-groove h-2 w-full p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isFullySettled ? 'bg-gain' : 'bg-[#0047FF]'
            }`}
            style={{ width: `${Math.min(100, repaidPercentage)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg neu-inset ${
            isFullySettled
              ? 'text-gain'
              : loan.status === 'PARTIAL'
              ? 'text-[#0047FF]'
              : 'text-pencil'
          }`}
        >
          {loan.status}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenSettlement(loan)}
            className="neu-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-charcoal cursor-pointer rounded-xl"
          >
            <History className="h-3.5 w-3.5 text-pencil" />
            <span>{isFullySettled ? 'Audit Log' : 'Settle'}</span>
          </button>
          <button
            onClick={() => onDelete(loan.id)}
            className="neu-btn p-1.5 text-pencil hover:text-loss rounded-xl cursor-pointer"
            title="Delete Loan"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
