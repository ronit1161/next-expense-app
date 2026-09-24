'use client';

import { X } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const PAYMENT_METHODS = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'CASH', value: 'CASH' },
  { label: 'CREDIT CARD', value: 'CREDIT_CARD' },
  { label: 'DEBIT CARD', value: 'DEBIT_CARD' },
  { label: 'NET BANKING', value: 'NET_BANKING' },
];

export default function SettlementModal({
  isOpen,
  onClose,
  selectedLoan,
  settleAmount,
  setSettleAmount,
  paymentMethod,
  setPaymentMethod,
  settlementDate,
  setSettlementDate,
  notes,
  setNotes,
  settlementHistory = [],
  settleSaving,
  settleError,
  onRecordSettlement,
}) {
  if (!isOpen || !selectedLoan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md border-4 border-black dark:border-white bg-[var(--bg-surface)] p-6 space-y-5 animate-scaleIn max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
          <div>
            <span className="text-[10px] font-black text-[#FF3000] uppercase tracking-widest block">
              05.B SETTLEMENT AUDIT
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-charcoal">
              {selectedLoan.contactName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-black dark:border-white text-pencil hover:text-charcoal cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Remaining Balance Stat */}
        <div className="border-2 border-black dark:border-white/20 p-4 flex items-center justify-between bg-[var(--bg-subtle)]">
          <div>
            <span className="text-[10px] font-black uppercase text-pencil block">
              OUTSTANDING BALANCE
            </span>
            <span className="text-xl font-black text-charcoal font-mono tabular-nums">
              {formatCurrency(selectedLoan.remainingAmount)}
            </span>
          </div>
          <span className="text-xs font-mono text-pencil uppercase">
            TOTAL: {formatCurrency(selectedLoan.amount)}
          </span>
        </div>

        {settleError && (
          <div className="border-2 border-[#FF3000] bg-[#FF3000]/10 p-3 text-xs font-black text-[#FF3000] uppercase">
            {settleError}
          </div>
        )}

        {/* Settle Form if not fully settled */}
        {selectedLoan.remainingAmount > 0 ? (
          <form onSubmit={onRecordSettlement} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                REPAYMENT AMOUNT (INR ₹) *
              </label>
              <input
                type="number"
                step="any"
                required
                max={selectedLoan.remainingAmount}
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="swiss-input block w-full py-2.5 px-3 text-lg font-black font-mono text-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                  METHOD
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="swiss-input block w-full py-2 px-2.5 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                  SETTLEMENT DATE
                </label>
                <input
                  type="date"
                  required
                  value={settlementDate}
                  onChange={(e) => setSettlementDate(e.target.value)}
                  className="swiss-input block w-full py-2 px-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                NOTES // REMARKS
              </label>
              <input
                type="text"
                placeholder="e.g. PARTIAL CASH RETURN"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono uppercase"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-black/10 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="swiss-btn px-4 py-2 text-xs font-black"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={settleSaving}
                className="swiss-btn-accent px-5 py-2 text-xs font-black disabled:opacity-40"
              >
                {settleSaving ? 'PROCESSING...' : 'RECORD REPAYMENT'}
              </button>
            </div>
          </form>
        ) : (
          <div className="border-2 border-black bg-black text-white p-4 text-center text-xs font-black uppercase">
            THIS PEER LOAN IS 100% SETTLED.
          </div>
        )}

        {/* Settlement Audit History */}
        {settlementHistory.length > 0 && (
          <div className="pt-3 border-t-2 border-black dark:border-white/20 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-pencil block">
              SETTLEMENT AUDIT TRAIL ({settlementHistory.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto border border-black/10 dark:border-white/10 p-2 bg-[var(--bg-subtle)]">
              {settlementHistory.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs font-mono p-1.5 border-b border-black/10 dark:border-white/10 last:border-b-0">
                  <div>
                    <p className="font-bold text-charcoal uppercase">
                      +{formatCurrency(s.amount)} ({s.paymentMethod})
                    </p>
                    {s.notes && <p className="text-[9px] text-pencil uppercase">{s.notes}</p>}
                  </div>
                  <span className="text-[10px] text-pencil">{formatDate(s.settlementDate)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
