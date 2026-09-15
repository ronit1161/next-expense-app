'use client';

import { X } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[var(--bg-main)] neu-card p-6 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between pb-3">
          <div>
            <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
              Debt Settlement
            </span>
            <h3 className="text-lg font-display font-semibold text-charcoal">
              {selectedLoan.contactName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Remaining Balance Stat */}
        <div className="neu-card p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
              Outstanding Balance
            </span>
            <span className="text-xl font-bold text-charcoal tabular-nums">
              {formatCurrency(selectedLoan.remainingAmount)}
            </span>
          </div>
          <span className="text-xs font-semibold text-pencil">
            Principal: {formatCurrency(selectedLoan.amount)}
          </span>
        </div>

        {settleError && (
          <div className="neu-inset p-3 text-xs font-semibold text-loss rounded-xl">
            {settleError}
          </div>
        )}

        {/* Settle Form if not settled */}
        {selectedLoan.remainingAmount > 0 ? (
          <form onSubmit={onRecordSettlement} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                Repayment Amount (INR ₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                max={selectedLoan.remainingAmount}
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="neu-input block w-full py-2.5 px-3 text-sm font-bold font-numeric text-charcoal"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-xs cursor-pointer"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-[var(--bg-main)] text-charcoal">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={settlementDate}
                  onChange={(e) => setSettlementDate(e.target.value)}
                  className="neu-input block w-full py-2 px-3 text-xs cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Partial GPay transfer"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="neu-input block w-full py-2.5 px-3 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={settleSaving}
              className="neu-btn-blue w-full py-3 text-xs font-semibold text-white cursor-pointer"
            >
              {settleSaving ? 'Recording Settlement...' : 'Confirm Repayment'}
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-2xl neu-inset text-center text-xs font-bold text-gain">
            This debt obligation is fully settled.
          </div>
        )}

        {/* Audit History Timeline */}
        <div className="space-y-3 pt-2">
          <h4 className="text-[10px] font-bold text-pencil uppercase tracking-wider">
            Settlement Audit Trail
          </h4>
          {settlementHistory.length === 0 ? (
            <p className="text-xs text-pencil">No repayments logged yet.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto neu-inset p-3 rounded-2xl">
              {settlementHistory.map((s) => (
                <div key={s.id} className="py-1 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-charcoal tabular-nums">
                      {formatCurrency(s.amount)}
                    </span>
                    <span className="text-[10px] text-pencil block">
                      {s.paymentMethod.replace('_', ' ')} • {formatDate(s.settlementDate)}
                    </span>
                  </div>
                  {s.notes && <span className="text-[11px] text-pencil truncate">{s.notes}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
