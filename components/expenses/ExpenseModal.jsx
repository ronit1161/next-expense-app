'use client';

import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[var(--bg-main)] neu-card shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[85vh] overflow-hidden animate-scaleIn">
        {/* Sheet Drag Handle for Mobile */}
        <div className="w-12 h-1.5 rounded-full bg-[#C7C2B7] dark:bg-[#252A36] mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
              {modalMode === 'add' ? 'New Journal Outflow' : 'Revise Entry'}
            </span>
            <h3 className="text-lg font-display font-semibold text-charcoal">
              {modalMode === 'add' ? 'Record Expense' : 'Edit Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
            aria-label="Close form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-4">
          {modalError && (
            <div className="neu-inset p-3 text-xs font-semibold text-loss rounded-xl animate-fadeIn">
              {modalError}
            </div>
          )}

          <form id="expense-form" onSubmit={onSave} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
                Amount (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-lg text-pencil">
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
                  className="neu-input block w-full py-3 pl-9 pr-3 text-2xl font-bold font-numeric text-charcoal min-h-[50px]"
                />
              </div>
            </div>

            {/* Category Grid Selection */}
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
                Category *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 neu-inset rounded-2xl">
                {categories.map((cat) => {
                  const isSelected = selectedCategoryId === String(cat.id);
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(String(cat.id))}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer min-h-[40px] text-left truncate ${
                        isSelected
                          ? 'neu-inset text-[#0047FF] font-bold'
                          : 'neu-btn text-pencil hover:text-charcoal'
                      }`}
                    >
                      <CategoryIcon
                        iconName={cat.icon}
                        className={`h-4 w-4 shrink-0 ${
                          isSelected ? 'text-[#0047FF]' : 'text-pencil'
                        }`}
                      />
                      <span className="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                Note / Description
              </label>
              <input
                type="text"
                placeholder="e.g., Grocery shopping, Metro card recharge"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="neu-input block w-full py-2.5 px-3 text-xs sm:text-sm min-h-[44px]"
              />
            </div>

            {/* Payment Method & Date (2 Column Layout) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-xs bg-transparent min-h-[44px] cursor-pointer"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value} className="bg-[var(--bg-main)] text-charcoal">
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="neu-input block w-full py-2 px-3 text-xs min-h-[44px] cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Modal Sticky Footer */}
        <div className="px-6 py-4 bg-[var(--bg-main)] flex items-center gap-3 shrink-0 pb-safe">
          <button
            type="button"
            onClick={onClose}
            className="neu-btn flex-1 py-3 text-xs font-semibold text-pencil hover:text-charcoal cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="expense-form"
            disabled={saving}
            className="neu-btn-blue flex-1 py-3 text-xs font-semibold text-white cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
          >
            {saving
              ? modalMode === 'add'
                ? 'Recording...'
                : 'Updating...'
              : modalMode === 'add'
              ? 'Record Expense'
              : 'Update Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
