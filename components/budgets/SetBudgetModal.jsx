'use client';

import { X, Target } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md clay-surface bg-white dark:bg-[#231D35] p-6 sm:p-8 space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto rounded-[36px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-600 text-white flex items-center justify-center clay-orb shadow-md">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-[10px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-widest block">
                Allocation Target
              </span>
              <h3 className="text-xl font-heading font-black text-charcoal">
                Set Spending Cap
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-pencil hover:text-charcoal cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {modalError && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-heading font-extrabold text-rose-600 dark:text-rose-400">
            {modalError}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Sector Category *
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="clay-input block w-full py-3 px-4 text-xs font-heading font-bold rounded-xl cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Monthly Cap Amount (INR ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-black text-xl text-purple-600">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="clay-input block w-full h-14 pl-10 pr-4 text-xl font-heading font-black text-charcoal rounded-2xl"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-purple-500/10">
            <button
              type="button"
              onClick={onClose}
              className="clay-btn-secondary px-5 py-2.5 text-xs font-heading font-black rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="clay-btn-primary px-6 py-2.5 text-xs font-heading font-black rounded-2xl disabled:opacity-40 shadow-md"
            >
              {saving ? 'Saving...' : 'Save Budget Cap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
