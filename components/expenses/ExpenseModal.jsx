'use client';

import { X } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

const PAYMENT_METHODS = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'CASH', value: 'CASH' },
  { label: 'CREDIT CARD', value: 'CREDIT_CARD' },
  { label: 'DEBIT CARD', value: 'DEBIT_CARD' },
  { label: 'NET BANKING', value: 'NET_BANKING' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg border-4 border-black dark:border-white bg-[var(--bg-surface)] p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
          <div>
            <span className="text-[10px] font-black text-[#FF3000] uppercase tracking-widest block">
              {modalMode === 'add' ? '02.A NEW LEDGER ENTRY' : '02.B REVISE ENTRY'}
            </span>
            <h3 className="text-xl font-black uppercase tracking-tight text-charcoal">
              {modalMode === 'add' ? 'RECORD EXPENDITURE' : 'MODIFY RECORD'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-black dark:border-white text-pencil hover:text-charcoal cursor-pointer"
            aria-label="Close form"
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
          {/* Amount Input */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              AMOUNT (INR ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-black text-xl text-charcoal">
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
                className="swiss-input block w-full py-3 pl-8 pr-3 text-2xl font-black font-mono text-charcoal"
              />
            </div>
          </div>

          {/* Category Grid Selection */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              SELECT CATEGORY *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto p-2 border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)]">
              {categories.map((cat) => {
                const isSelected = selectedCategoryId === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(String(cat.id))}
                    className={`p-2 border text-xs font-black uppercase flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'border-black/20 dark:border-white/20 bg-[var(--bg-surface)] text-charcoal hover:border-black'
                    }`}
                  >
                    <CategoryIcon iconName={cat.icon} className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              NOTE // MERCHANT (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="e.g. GROCERIES, COFFEE, RECHARGE"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="swiss-input block w-full py-2 px-3 text-xs font-mono uppercase"
            />
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              SETTLEMENT METHOD
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`py-1.5 px-2 border text-[10px] font-black uppercase transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF3000] text-white border-[#FF3000]'
                        : 'border-black/20 dark:border-white/20 bg-[var(--bg-surface)] text-charcoal hover:border-black'
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
            <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
              ENTRY DATE
            </label>
            <input
              type="date"
              required
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              className="swiss-input block w-full py-2 px-3 text-xs font-mono"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t-2 border-black dark:border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="swiss-btn px-4 py-2.5 text-xs font-black"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="swiss-btn-accent px-5 py-2.5 text-xs font-black disabled:opacity-50"
            >
              {saving ? 'SAVING RECORD...' : modalMode === 'add' ? 'COMMIT RECORD' : 'SAVE CHANGES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
