'use client';

import { X } from 'lucide-react';

export default function AddLoanModal({
  isOpen,
  onClose,
  loanType,
  setLoanType,
  contactName,
  setContactName,
  amount,
  setAmount,
  loanDate,
  setLoanDate,
  dueDate,
  setDueDate,
  description,
  setDescription,
  loanError,
  loanSaving,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md border-4 border-black dark:border-white bg-[var(--bg-surface)] p-6 space-y-5 animate-scaleIn max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
          <div>
            <span className="text-[10px] font-black text-[#FF3000] uppercase tracking-widest block">
              05.A PEER LEDGER ENTRY
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-charcoal">
              RECORD PEER LOAN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-black dark:border-white text-pencil hover:text-charcoal cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loanError && (
          <div className="border-2 border-[#FF3000] bg-[#FF3000]/10 p-3 text-xs font-black text-[#FF3000] uppercase">
            {loanError}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          {/* Classification Switcher */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              CLASSIFICATION *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLoanType('LENT')}
                className={`py-2 px-3 text-xs font-black uppercase border-2 transition-all cursor-pointer ${
                  loanType === 'LENT'
                    ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                    : 'border-black/20 dark:border-white/20 text-charcoal hover:border-black'
                }`}
              >
                I LENT (RECEIVABLE)
              </button>
              <button
                type="button"
                onClick={() => setLoanType('BORROWED')}
                className={`py-2 px-3 text-xs font-black uppercase border-2 transition-all cursor-pointer ${
                  loanType === 'BORROWED'
                    ? 'bg-[#FF3000] text-white border-[#FF3000]'
                    : 'border-black/20 dark:border-white/20 text-charcoal hover:border-black'
                }`}
              >
                I BORROWED (PAYABLE)
              </button>
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              CONTACT PERSON *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ALEX MERCER"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="swiss-input block w-full py-2 px-3 text-xs font-mono uppercase"
            />
          </div>

          {/* Principal Amount */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              PRINCIPAL AMOUNT (INR ₹) *
            </label>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="swiss-input block w-full py-2.5 px-3 text-lg font-black font-mono text-charcoal"
            />
          </div>

          {/* Loan Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                LOAN DATE *
              </label>
              <input
                type="date"
                required
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                DUE DATE (OPTIONAL)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              REASON // NOTES (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. EMERGENCY CASH, SHARED TRIP"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="swiss-input block w-full py-2 px-3 text-xs font-mono uppercase"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t-2 border-black dark:border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="swiss-btn px-4 py-2 text-xs font-black"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loanSaving}
              className="swiss-btn-accent px-5 py-2 text-xs font-black disabled:opacity-40"
            >
              {loanSaving ? 'COMMITTING...' : 'RECORD LOAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
