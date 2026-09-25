'use client';

import { X, Receipt, CheckCircle, History } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

const PAYMENT_METHODS = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD' },
  { label: 'Net Banking', value: 'NET_BANKING' },
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

  const isLent = selectedLoan.type === 'LENT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-[#13141D] border border-slate-200 dark:border-white/10 p-6 sm:p-7 space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                Settlement &amp; Audit
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedLoan.contactName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Outstanding Balance Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Outstanding Balance
            </span>
            <span
              className={`text-2xl font-black tabular-nums tracking-tight ${
                isLent ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {formatCurrency(selectedLoan.remainingAmount)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Principal</span>
            <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(selectedLoan.amount)}
            </span>
          </div>
        </div>

        {settleError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-fadeIn">
            {settleError}
          </div>
        )}

        {/* Settle Form if not fully settled */}
        {selectedLoan.remainingAmount > 0 ? (
          <form onSubmit={onRecordSettlement} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Repayment Amount (₹) *
              </label>
              <input
                type="number"
                step="any"
                required
                max={selectedLoan.remainingAmount}
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-full h-12 px-4 text-2xl font-black text-slate-900 dark:text-white tabular-nums rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Settlement Date
                </label>
                <input
                  type="date"
                  required
                  value={settlementDate}
                  onChange={(e) => setSettlementDate(e.target.value)}
                  className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Notes / Remarks
              </label>
              <input
                type="text"
                placeholder="e.g. Partial repayment via UPI"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={settleSaving}
                className="fintech-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40"
              >
                {settleSaving ? 'Recording...' : 'Record Repayment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
            <CheckCircle className="h-7 w-7 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Loan 100% Settled
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All obligations on this peer ledger entry have been completely balanced.
            </p>
          </div>
        )}

        {/* Settlement Audit History */}
        {settlementHistory.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Audit Trail ({settlementHistory.length})
              </span>
            </div>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {settlementHistory.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white tabular-nums">
                      +{formatCurrency(s.amount)} <span className="text-slate-500 font-normal text-xs">({s.paymentMethod})</span>
                    </p>
                    {s.notes && <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{s.notes}</p>}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{formatDate(s.settlementDate)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
