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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[var(--bg-main)] neu-card p-6 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3">
          <div>
            <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
              Peer Ledger
            </span>
            <h3 className="text-lg font-display font-semibold text-charcoal">
              Record Peer Loan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loanError && (
          <div className="mt-4 neu-inset p-3 text-xs font-semibold text-loss rounded-xl">
            {loanError}
          </div>
        )}

        <form onSubmit={onSave} className="mt-4 space-y-4">
          {/* Type Switcher */}
          <div>
            <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
              Classification *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setLoanType('LENT')}
                className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                  loanType === 'LENT'
                    ? 'neu-inset text-gain font-bold'
                    : 'neu-btn text-pencil hover:text-charcoal'
                }`}
              >
                I Lent (To Receive)
              </button>
              <button
                type="button"
                onClick={() => setLoanType('BORROWED')}
                className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all cursor-pointer ${
                  loanType === 'BORROWED'
                    ? 'neu-inset text-loss font-bold'
                    : 'neu-btn text-pencil hover:text-charcoal'
                }`}
              >
                I Borrowed (To Pay)
              </button>
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
              Contact Person *
            </label>
            <input
              type="text"
              required
              placeholder="Enter contact name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="neu-input block w-full py-2.5 px-3 text-xs"
            />
          </div>

          {/* Principal Amount */}
          <div>
            <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
              Principal Amount (INR ₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="neu-input block w-full py-2.5 px-3 text-sm font-bold font-numeric text-charcoal"
            />
          </div>

          {/* Date & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                Loan Date *
              </label>
              <input
                type="date"
                required
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                className="neu-input block w-full py-2 px-3 text-xs cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                Due Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="neu-input block w-full py-2 px-3 text-xs cursor-pointer"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
              Notes / Context
            </label>
            <input
              type="text"
              placeholder="e.g. For concert tickets, Rent share"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="neu-input block w-full py-2.5 px-3 text-xs"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-4 py-2.5 text-xs font-semibold text-pencil hover:text-charcoal cursor-pointer rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loanSaving}
              className="neu-btn-blue px-5 py-2.5 text-xs font-semibold text-white cursor-pointer rounded-xl"
            >
              {loanSaving ? 'Saving...' : 'Record Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
