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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#13141D] border border-slate-200 dark:border-white/10 p-6 sm:p-7 space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                Target Allocation
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Set Spending Cap
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

        {modalError && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            {modalError}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full py-2.5 px-3.5 text-sm font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Monthly Cap Limit (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="15000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-12 pl-10 pr-4 text-xl font-black text-slate-900 dark:text-white tabular-nums rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="fintech-btn-primary px-6 py-2.5 text-xs font-bold rounded-xl disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'Save Spending Cap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
