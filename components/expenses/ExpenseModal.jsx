'use client';

import { useState, useRef } from 'react';
import {
  X,
  Check,
  Calendar,
  Zap,
  Banknote,
  CreditCard,
  Wallet,
  Building2,
  Receipt,
  Plus,
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import SwipeToConfirm from '@/components/ui/SwipeToConfirm';
import { triggerHaptic } from '@/lib/haptics';

const PAYMENT_METHODS = [
  { label: 'UPI', value: 'UPI', icon: Zap },
  { label: 'Cash', value: 'CASH', icon: Banknote },
  { label: 'Credit Card', value: 'CREDIT_CARD', icon: CreditCard },
  { label: 'Debit Card', value: 'DEBIT_CARD', icon: Wallet },
  { label: 'Net Banking', value: 'NET_BANKING', icon: Building2 },
];

const PRESET_AMOUNTS = [100, 500, 1000, 2000];

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

  const selectedCat = categories.find((c) => String(c.id) === String(selectedCategoryId));

  const formRef = useRef(null);

  const handleSwipeConfirm = () => {
    if (formRef.current) {
      if (typeof formRef.current.requestSubmit === 'function') {
        formRef.current.requestSubmit();
      } else {
        onSave({ preventDefault: () => {} });
      }
    } else {
      onSave({ preventDefault: () => {} });
    }
  };

  const handleAddPreset = (val) => {
    triggerHaptic('selection');
    const current = parseFloat(amount) || 0;
    setAmount(String(current + val));
  };

  const handleClearAmount = () => {
    triggerHaptic('light');
    setAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-clay)] rounded-t-[28px] sm:rounded-[28px] shadow-2xl p-5 sm:p-6 space-y-3.5 animate-scaleIn max-h-[96vh] overflow-y-auto no-scrollbar">
        {/* 1. TOP HEADER WITH ICON & CLOSE BUTTON */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-clay)]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex items-center justify-center text-[var(--brand-accent)] shrink-0">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-[var(--text-primary)]">
                {modalMode === 'add' ? 'Record Expense' : 'Edit Expense'}
              </h3>
              <p className="text-[10px] text-[var(--text-muted)] font-medium">
                {modalMode === 'add' ? 'Log monetary outflow to ledger' : 'Update existing transaction'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-recessed)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {modalError && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs font-bold text-rose-500 animate-fadeIn">
            {modalError}
          </div>
        )}

        <form ref={formRef} onSubmit={onSave} className="space-y-3">
          {/* 2. ULTRA-CLEAN HERO AMOUNT CARD */}
          <div className="bg-[var(--bg-recessed)]/60 border border-[var(--border-clay)] rounded-2xl p-3.5 text-center space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <span>Transaction Amount</span>
              {amount && Number(amount) > 0 ? (
                <button
                  type="button"
                  onClick={handleClearAmount}
                  className="text-[10px] text-rose-500 hover:underline cursor-pointer font-bold"
                >
                  Clear
                </button>
              ) : (
                <span className="opacity-75 font-mono">INR (₹)</span>
              )}
            </div>

            {/* Compact Centered Number */}
            <div className="flex items-center justify-center gap-1">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[var(--text-muted)]">₹</span>
              <input
                type="number"
                step="any"
                inputMode="decimal"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-center font-heading font-black text-3xl sm:text-4xl text-[var(--text-primary)] tracking-tight focus:outline-none w-56 max-w-full placeholder-[var(--text-muted)]/30 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Quick Increment Preset Chips */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleAddPreset(preset)}
                  className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-[var(--bg-card)] border border-[var(--border-clay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--brand-accent)] cursor-pointer transition-all shadow-xs active:scale-95 flex items-center gap-1"
                >
                  <Plus className="h-2.5 w-2.5 stroke-[3]" />
                  <span>₹{preset >= 1000 ? `${preset / 1000}k` : preset}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. COMPACT VISUAL CATEGORY PICKER */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Select Category *
              </label>
              {selectedCat && (
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                  {selectedCat.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {categories.map((c) => {
                const isSelected = String(c.id) === String(selectedCategoryId);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedCategoryId(String(c.id));
                    }}
                    className={`py-1.5 px-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer border text-left min-w-0 ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--text-primary)] shadow-xs ring-1 ring-[var(--text-primary)]/20'
                        : 'bg-[var(--bg-card)] border-[var(--border-clay)] text-[var(--text-secondary)] hover:border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-recessed)]'
                    }`}
                  >
                    <div
                      className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-transform"
                      style={{
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `${c.color || '#6366F1'}18`,
                        color: isSelected ? 'currentColor' : c.color || '#6366F1',
                      }}
                    >
                      <CategoryIcon iconName={c.icon} className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold truncate">
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. DATE & DESCRIPTION ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="fintech-input block w-full py-2 px-3 text-xs font-bold rounded-xl"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Starbucks, Uber..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="fintech-input block w-full py-2 px-3 text-xs font-medium rounded-xl"
              />
            </div>
          </div>

          {/* 5. PAYMENT RAIL SEGMENTED CONTROL */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-1">
              Payment Rail
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.value;
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setPaymentMethod(method.value);
                    }}
                    className={`py-1 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg-card)] border-[var(--border-clay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. BOTTOM ACTION: SWIPE TO RECORD */}
          <div className="pt-2 flex items-center gap-2.5 border-t border-[var(--border-clay)]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-3 rounded-2xl bg-[var(--bg-recessed)] hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs font-bold transition-colors cursor-pointer shrink-0"
              aria-label="Cancel"
            >
              Cancel
            </button>

            <div className="flex-1 min-w-0">
              <SwipeToConfirm
                onConfirm={handleSwipeConfirm}
                disabled={saving || !amount || Number(amount) <= 0 || !selectedCategoryId}
                disabledText={!amount ? 'Enter amount' : !selectedCategoryId ? 'Select category' : 'Slide to Record'}
                label={modalMode === 'add' ? 'Slide to Record' : 'Slide to Save'}
                loading={saving}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
