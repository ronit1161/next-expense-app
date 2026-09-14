'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import SmsParserModal from '@/components/expenses/SmsParserModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  getExpensesAction,
  getCategoriesAction,
  createExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
} from '@/actions/expense-actions';
import { ActivityTimelineSkeleton } from '@/components/ui/skeletons';

const PAYMENT_METHODS = [
  { label: 'UPI / QR', value: 'UPI' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Credit Card', value: 'CREDIT_CARD' },
  { label: 'Debit Card', value: 'DEBIT_CARD' },
  { label: 'Net Banking', value: 'NET_BANKING' },
];

export default function ExpensesPage() {
  const searchParams = useSearchParams();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const result = await getExpensesAction({
        page,
        limit: 15,
        categoryId: categoryId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (result.success) {
        setExpenses(result.expenses);
        setTotalPages(result.pagination.totalPages);
      } else {
        setError(result.error || 'Failed to fetch transaction entries.');
      }
    } catch (err) {
      setError('Failed to fetch transaction entries.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, categoryId, startDate, endDate]);

  const fetchCategories = async () => {
    try {
      const result = await getCategoriesAction();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Check URL query action=add or custom event to open modal
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      openAddModal();
    }

    const handleCustomAdd = () => openAddModal();
    window.addEventListener('open-add-expense-modal', handleCustomAdd);
    return () => window.removeEventListener('open-add-expense-modal', handleCustomAdd);
  }, [searchParams, categories]);

  // MODAL HANDLERS
  const openAddModal = () => {
    setModalMode('add');
    setEditingExpenseId(null);
    setAmount('');
    setSelectedCategoryId(categories[0]?.id ? String(categories[0].id) : '');
    setDescription('');
    setPaymentMethod('UPI');
    setExpenseDate(new Date().toISOString().split('T')[0]);
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setModalMode('edit');
    setEditingExpenseId(exp.id);
    setAmount(String(exp.amount));
    setSelectedCategoryId(String(exp.categoryId));
    setDescription(exp.description || '');
    setPaymentMethod(exp.paymentMethod);
    setExpenseDate(exp.expenseDate);
    setModalError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalError('');
  };

  const handleResetFilters = () => {
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
    setShowFilters(false);
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!amount || Number(amount) <= 0) {
      setModalError('Please enter a valid amount.');
      return;
    }
    if (!selectedCategoryId) {
      setModalError('Please choose a category.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        amount: Number(amount),
        categoryId: Number(selectedCategoryId),
        description: description.trim() || null,
        paymentMethod,
        expenseDate,
      };

      let res;
      if (modalMode === 'add') {
        res = await createExpenseAction(payload);
      } else {
        res = await updateExpenseAction(editingExpenseId, payload);
      }

      if (res.success) {
        setSuccessMsg(
          modalMode === 'add' ? 'Entry recorded in journal.' : 'Entry updated.'
        );
        setTimeout(() => setSuccessMsg(''), 3000);
        closeModal();
        fetchExpenses();
      } else {
        setModalError(res.error || 'Failed to save entry.');
      }
    } catch (err) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this transaction from your journal?')) return;

    // Optimistically remove from state immediately for 0ms perceived latency
    const prevExpenses = [...expenses];
    setExpenses((current) => current.filter((e) => e.id !== id));

    try {
      const res = await deleteExpenseAction(id);
      if (res.success) {
        setSuccessMsg('Entry deleted.');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        // Rollback on server failure
        setExpenses(prevExpenses);
        setError(res.error || 'Failed to delete entry.');
      }
    } catch (err) {
      setExpenses(prevExpenses);
      setError(err.message || 'Failed to delete entry.');
    }
  };

  // Group transactions by Date for the Editorial Timeline
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const dateKey = expense.expenseDate;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b) - new Date(a));
  const hasActiveFilters = Boolean(categoryId || startDate || endDate);

  if (loading && expenses.length === 0) {
    return <ActivityTimelineSkeleton />;
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 pb-12 animate-fadeIn">
      {/* 1. HEADER (Compact, Mobile Friendly) */}
      <div className="flex items-center justify-between pb-2 gap-2 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
            Journal Outflows
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-semibold text-charcoal tracking-tight truncate">
            Activity Timeline
          </h1>
        </div>

        {/* Action Buttons: Smart SMS Parser + New Entry */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="neu-btn inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs font-bold text-[#0047FF] hover:text-[#0038D1] cursor-pointer min-h-[36px]"
            title="Auto-detect and log expenses from bank SMS or UPI alerts"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Paste SMS / UPI</span>
            <span className="sm:hidden">SMS</span>
          </button>

          <button
            onClick={openAddModal}
            className="neu-btn-blue inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-semibold text-white cursor-pointer shrink-0 min-h-[36px]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Entry</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-emerald-800 animate-fadeIn w-full min-w-0">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="p-1 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-loss animate-fadeIn w-full min-w-0">
          <span>{error}</span>
          <button onClick={() => setError('')} className="p-1 cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* 2. CATEGORY HORIZONTAL FILTER STRIP & FILTER TOGGLE */}
      <div className="space-y-2.5 w-full min-w-0">
        <div className="flex items-center gap-2.5 w-full min-w-0">
          {/* Horizontal Category Strip */}
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none no-scrollbar">
            <button
              onClick={() => {
                setCategoryId('');
                setPage(1);
              }}
              className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[36px] flex items-center rounded-xl ${
                categoryId === ''
                  ? 'neu-inset text-[#0047FF] font-bold'
                  : 'neu-btn text-pencil hover:text-charcoal'
              }`}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategoryId(String(cat.id));
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[36px] rounded-xl ${
                  categoryId === String(cat.id)
                    ? 'neu-inset text-[#0047FF] font-bold'
                    : 'neu-btn text-pencil hover:text-charcoal'
                }`}
              >
                <CategoryIcon iconName={cat.icon} className="h-3.5 w-3.5" />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Date Filter Drawer Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center shrink-0 min-h-[36px] min-w-[36px] transition-all cursor-pointer relative ${
              showFilters || startDate || endDate
                ? 'neu-inset text-[#0047FF]'
                : 'neu-btn text-pencil hover:text-charcoal'
            }`}
            title="Date Filter"
            aria-label="Toggle date filter"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {(startDate || endDate) && (
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#0047FF] shadow-[0_0_6px_rgba(0,71,255,0.7)]" />
            )}
          </button>
        </div>

        {/* Date Filter Drawer */}
        {showFilters && (
          <div className="neu-card p-4 rounded-2xl space-y-3 bg-[#EAE6DF] animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="neu-input block w-full py-2 px-3 text-xs min-h-[38px]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="neu-input block w-full py-2 px-3 text-xs min-h-[38px]"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleResetFilters}
                  className="neu-btn px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-semibold text-pencil hover:text-charcoal cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. DATE-GROUPED TIMELINE (Neumorphic Sculpted Rows) */}
      <div className="space-y-5">
        {expenses.length === 0 ? (
          <div className="neu-card p-8 sm:p-12 text-center rounded-3xl space-y-4">
            <CreditCard className="h-8 w-8 text-pencil mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-charcoal">NO TRANSACTIONS LOGGED</h3>
              <p className="text-xs text-pencil mt-1 max-w-xs mx-auto">
                No activity found for the selected category or period.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="neu-btn-blue inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold cursor-pointer min-h-[38px]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record First Expense</span>
            </button>
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const dayExpenses = groupedExpenses[dateStr];
            const dayTotal = dayExpenses.reduce((sum, item) => sum + item.amount, 0);

            return (
              <div key={dateStr} className="space-y-2">
                {/* Date Group Header */}
                <div className="flex items-center justify-between px-2 pb-0.5">
                  <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
                    {formatDate(dateStr)}
                  </span>
                  <span className="text-xs font-bold text-charcoal tabular-nums font-numeric">
                    {formatCurrency(dayTotal)}
                  </span>
                </div>

                {/* Day Items List */}
                <div className="neu-card rounded-2xl p-2 space-y-1.5">
                  {dayExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-xl flex items-center justify-between hover:neu-inset transition-all gap-2.5"
                    >
                      {/* Left: Icon & Description */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl neu-card-sm text-charcoal shrink-0">
                          <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4 text-pencil" />
                        </div>
                        <div className="min-w-0 flex-1 pr-1">
                          <p className="text-xs sm:text-sm font-bold text-charcoal truncate leading-tight">
                            {exp.description || exp.categoryName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-pencil">
                            <span className="truncate max-w-[90px] sm:max-w-none">{exp.categoryName}</span>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 rounded-md neu-inset text-charcoal font-medium shrink-0">
                              {exp.paymentMethod.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-charcoal tabular-nums font-numeric">
                          {formatCurrency(exp.amount)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(exp)}
                            className="neu-btn p-1.5 text-pencil hover:text-charcoal rounded-lg cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Edit"
                            aria-label="Edit expense"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="neu-btn p-1.5 text-pencil hover:text-loss rounded-lg cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                            title="Delete"
                            aria-label="Delete expense"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* 4. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="neu-btn inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-charcoal disabled:opacity-40 cursor-pointer min-h-[36px]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>

            <span className="text-xs font-medium text-pencil tabular-nums">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="neu-btn inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-charcoal disabled:opacity-40 cursor-pointer min-h-[36px]"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 5. ADD / EDIT EXPENSE BOTTOM SHEET MODAL (Neumorphic Drawer) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#EAE6DF] neu-card shadow-2xl flex flex-col max-h-[90dvh] sm:max-h-[85vh] overflow-hidden animate-scaleIn">
            {/* Sheet Drag Handle for Mobile */}
            <div className="w-12 h-1.5 rounded-full bg-[#C7C2B7] mx-auto mt-3 mb-1 sm:hidden shrink-0" />

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
                onClick={closeModal}
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

              <form id="expense-form" onSubmit={handleSaveExpense} className="space-y-4">
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
                        <option key={m.value} value={m.value} className="bg-[#EAE6DF] text-charcoal">
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
            <div className="px-6 py-4 bg-[#EAE6DF] flex items-center gap-3 shrink-0 pb-safe">
              <button
                type="button"
                onClick={closeModal}
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
      )}

      {/* 6. SMART SMS & UPI PARSER MODAL */}
      <SmsParserModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        categories={categories}
        onBatchCreated={fetchExpenses}
      />
    </div>
  );
}

