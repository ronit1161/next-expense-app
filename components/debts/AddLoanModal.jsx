'use client';

import { X, HandCoins, ArrowUpRight, ArrowDownLeft, Calendar, FileText, User, IndianRupee } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fadeIn">
      <div className="clay-surface w-full max-w-lg p-6 sm:p-8 space-y-6 animate-scaleIn max-h-[90vh] overflow-y-auto rounded-[36px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--clay-border)]">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 clay-orb flex items-center justify-center text-white shrink-0">
              <HandCoins className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                Peer Ledger Entry
              </span>
              <h3
                className="text-xl font-black text-[var(--text-primary)]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Record Peer Loan
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[var(--bg-muted)] hover:bg-[var(--clay-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loanError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold animate-fadeIn">
            {loanError}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-5">
          {/* Classification Switcher */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-2">
              Loan Classification *
            </label>
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[var(--bg-muted)] clay-sunken">
              <button
                type="button"
                onClick={() => setLoanType('LENT')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  loanType === 'LENT'
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>I Lent (Receivable)</span>
              </button>
              <button
                type="button"
                onClick={() => setLoanType('BORROWED')}
                className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  loanType === 'BORROWED'
                    ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <ArrowDownLeft className="h-4 w-4" />
                <span>I Borrowed (Payable)</span>
              </button>
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
              Contact Person *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                required
                placeholder="e.g. Alex Mercer"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="clay-input block w-full pl-11 pr-4 py-3.5 text-sm font-semibold rounded-2xl"
              />
            </div>
          </div>

          {/* Principal Amount */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
              Principal Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-[var(--text-muted)]">₹</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="clay-input block w-full pl-11 pr-4 py-3.5 text-xl font-black text-[var(--text-primary)] rounded-2xl"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              />
            </div>
          </div>

          {/* Loan Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
                Loan Date *
              </label>
              <input
                type="date"
                required
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                className="clay-input block w-full py-3 px-4 text-xs font-semibold rounded-2xl"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="clay-input block w-full py-3 px-4 text-xs font-semibold rounded-2xl"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-[var(--text-secondary)] block mb-1.5">
              Reason / Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="e.g. Emergency cash, shared vacation dinner"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="clay-input block w-full pl-11 pr-4 py-3.5 text-sm font-semibold rounded-2xl"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--clay-border)]">
            <button
              type="button"
              onClick={onClose}
              className="clay-btn-secondary px-5 py-3 rounded-2xl text-xs font-bold cursor-pointer"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loanSaving}
              className="clay-btn-primary px-7 py-3 rounded-2xl text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              {loanSaving ? 'Saving...' : 'Record Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
