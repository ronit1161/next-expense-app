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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md border-4 border-black dark:border-white bg-[var(--bg-surface)] p-6 space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
          <div>
            <span className="text-[10px] font-black text-[#FF3000] uppercase tracking-widest block">
              03.A ALLOCATION TARGET
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-charcoal">
              SET SPENDING LIMIT
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-black dark:border-white text-pencil hover:text-charcoal cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {modalError && (
          <div className="border-2 border-[#FF3000] bg-[#FF3000]/10 p-3 text-xs font-black text-[#FF3000] uppercase">
            {modalError}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              CATEGORY *
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="swiss-input block w-full py-2.5 px-3 text-xs font-mono font-bold uppercase cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              MONTHLY CAP AMOUNT (INR ₹) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="swiss-input block w-full py-2.5 px-3 text-lg font-black font-mono text-charcoal"
            />
          </div>

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
              disabled={saving}
              className="swiss-btn-accent px-5 py-2 text-xs font-black disabled:opacity-40"
            >
              {saving ? 'COMMITTING...' : 'SAVE BUDGET LIMIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
