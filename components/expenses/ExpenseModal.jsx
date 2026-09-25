'use client';

import { useState } from 'react';
import { X, Check, Paperclip, Calendar, ChevronDown } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';

const PAYMENT_METHODS = [
  { label: 'UPI', value: 'UPI' },
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
  const [editingAmount, setEditingAmount] = useState(false);

  if (!isOpen) return null;

  const selectedCat = categories.find((c) => String(c.id) === String(selectedCategoryId));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-clay)] p-6 sm:p-7 space-y-5 rounded-t-[32px] sm:rounded-[32px] shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* TOP IRIDESCENT MESH BANNER MATCHING REFERENCE PHONE 2 */}
        <div className="fintech-mesh-card p-6 sm:p-7 text-center rounded-[24px] space-y-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              {modalMode === 'add' ? 'New Transaction' : 'Modify Record'}
            </span>
            <span className="text-[10px] opacity-75 font-mono">INR (₹)</span>
          </div>

          {/* Huge Centered Amount Display */}
          <div className="py-2">
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-black text-white/90">₹</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-center font-heading font-black text-4xl sm:text-5xl text-white tracking-tight focus:outline-none w-56 placeholder-white/40"
              />
            </div>
            <div className="fintech-glass-pill inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold mt-2">
              <span>✎ Set Amount</span>
            </div>
          </div>
        </div>

        {modalError && (
          <div className="rounded-2xl bg-rose-500/15 border border-rose-500/25 p-3 text-xs font-bold text-rose-500">
            {modalError}
          </div>
        )}

        <form onSubmit={onSave} className="space-y-4">
          {/* Category Dropdown & Grid */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
              Category *
            </label>
            <div className="relative">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required
                className="fintech-input block w-full py-3 px-4 text-xs font-bold rounded-2xl appearance-none cursor-pointer pr-10"
              >
                <option value="" disabled>Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          {/* Date Picker matching reference */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
              Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                className="fintech-input block w-full py-3 px-4 text-xs font-bold rounded-2xl"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
            </div>
          </div>

          {/* Description Textarea/Input matching reference */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Netflix monthly subscription payment, Starbucks latte..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="fintech-input block w-full p-3.5 text-xs font-medium rounded-2xl resize-none"
            />
          </div>

          {/* Payment Method Pills */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
              Payment Rail
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                        : 'bg-[var(--bg-recessed)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ACTION ROW MATCHING REFERENCE PHONE 2 (Cancel [X], Paperclip, Confirm [✓]) */}
          <div className="pt-3 flex items-center justify-between gap-3 border-t border-[var(--border-clay)]">
            <button
              type="button"
              onClick={onClose}
              className="h-12 w-14 rounded-2xl bg-[var(--bg-recessed)] hover:bg-[var(--border-clay)] flex items-center justify-center text-[var(--text-primary)] cursor-pointer transition-colors"
              aria-label="Cancel"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="h-12 w-14 rounded-2xl bg-[var(--bg-recessed)] flex items-center justify-center text-[var(--text-muted)]">
              <Paperclip className="h-4 w-4" />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="h-12 flex-1 rounded-2xl bg-[var(--text-primary)] text-[var(--bg-canvas)] flex items-center justify-center gap-2 font-heading font-black text-xs cursor-pointer shadow-md disabled:opacity-50 hover:scale-102 transition-transform"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>{saving ? 'Processing...' : modalMode === 'add' ? 'Confirm Record' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
