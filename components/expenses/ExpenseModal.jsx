'use client';

import { X, Sparkles } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

const PAYMENT_METHODS = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD' },
  { label: 'Net Banking', value: 'NET_BANKING' },
];

export default function ExpenseModal({
  isOpen,
  onClose,
  modalMode,
  amount,
  setAmount,
  categories = [],
  selectedCategoryId,
  setSelectedCategoryId,
  description,
  setDescription,
  paymentMethod,
  setPaymentMethod,
  expenseDate,
  setExpenseDate,
  modalError,
  saving,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-lg clay-surface bg-white dark:bg-[#231D35] p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto rounded-[36px] shadow-2xl animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 text-white flex items-center justify-center clay-orb shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                {modalMode === 'add' ? 'New Ledger Entry' : 'Modify Record'}
              </span>
              <h3 className="text-xl font-heading font-black text-charcoal">
                {modalMode === 'add' ? 'Record Expense' : 'Edit Expense'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-pencil hover:text-charcoal cursor-pointer transition-colors"
            aria-label="Close form"
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
          {/* Amount Input */}
          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Amount (INR ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-black text-2xl text-purple-600">
                ₹
              </span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="clay-input block w-full h-16 pl-10 pr-4 text-2xl font-heading font-black text-charcoal rounded-2xl"
              />
            </div>
          </div>

          {/* Category Grid Selection */}
          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Select Sector Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-2.5 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C] no-scrollbar">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(String(cat.id))}
                    className={`p-2.5 rounded-xl text-xs font-heading font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'clay-btn-primary scale-105'
                        : 'bg-white dark:bg-[#2B243D] text-charcoal hover:scale-102 shadow-sm'
                    }`}
                  >
                    <CategoryIcon iconName={cat.icon} className="h-4 w-4 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Note / Merchant (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Groceries, Starbucks, Recharge"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="clay-input block w-full h-12 px-4 text-sm font-medium rounded-xl"
            />
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Settlement Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-heading font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? 'clay-btn-primary'
                        : 'clay-btn-secondary text-pencil'
                    }`}
                  >
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expense Date */}
          <div>
            <label className="text-xs font-heading font-black uppercase tracking-wider text-charcoal block mb-1.5">
              Entry Date
            </label>
            <input
              type="date"
              required
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="clay-input block w-full h-12 px-4 text-sm font-medium rounded-xl"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-purple-500/10">
            <button
              type="button"
              onClick={onClose}
              className="clay-btn-secondary px-5 py-3 text-xs font-heading font-black rounded-2xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="clay-btn-primary px-6 py-3 text-xs font-heading font-black rounded-2xl disabled:opacity-50 shadow-md"
            >
              {saving ? 'Saving...' : modalMode === 'add' ? 'Record Expense' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
