'use client';

import { X } from 'lucide-react';

export default function SetBudgetModal({
  isOpen,
  onClose,
  categories = [],
  selectedCategoryId,
  setSelectedCategoryId,
  amount,
  setAmount,
  modalError,
  saving,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[var(--bg-main)] neu-card p-6 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3">
          <div>
            <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
              Budget Control
            </span>
            <h3 className="text-lg font-display font-semibold text-charcoal">
              Set Spending Limit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {modalError && (
          <div className="mt-4 neu-inset p-3 text-xs font-semibold text-loss rounded-xl">
            {modalError}
          </div>
        )}

        <form onSubmit={onSave} className="mt-4 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
              Category *
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="neu-input block w-full py-2.5 px-3 text-xs cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[var(--bg-main)] text-charcoal">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
              Monthly Limit Amount (INR ₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="neu-input block w-full py-2.5 px-3 text-sm font-bold font-numeric text-charcoal"
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
              disabled={saving}
              className="neu-btn-blue px-5 py-2.5 text-xs font-semibold text-white cursor-pointer rounded-xl"
            >
              {saving ? 'Saving...' : 'Set Limit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
