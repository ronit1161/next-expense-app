'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Sparkles, X } from 'lucide-react';
import SmsParserModal from '@/components/expenses/SmsParserModal';
import ExpenseModal from '@/components/expenses/ExpenseModal';
import ExpenseFilters from '@/components/expenses/ExpenseFilters';
import ExpenseTable from '@/components/expenses/ExpenseTable';
import {
  getExpensesAction,
  getCategoriesAction,
  createExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
} from '@/actions/expense-actions';
import { ActivityTimelineSkeleton } from '@/components/ui/skeletons';

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

  // Open modal if URL query has action=add or custom event triggered
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

  if (loading && expenses.length === 0) {
    return <ActivityTimelineSkeleton />;
  }

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 pb-12 animate-fadeIn">
      {/* 1. HEADER */}
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
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-emerald-800 dark:text-emerald-400 animate-fadeIn w-full min-w-0">
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
      <ExpenseFilters
        categories={categories}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setPage(1);
        }}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        startDate={startDate}
        onStartDateChange={(val) => {
          setStartDate(val);
          setPage(1);
        }}
        endDate={endDate}
        onEndDateChange={(val) => {
          setEndDate(val);
          setPage(1);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* 3. DATE-GROUPED TIMELINE TABLE & LIST */}
      <ExpenseTable
        expenses={expenses}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onOpenAdd={openAddModal}
        onOpenEdit={openEditModal}
        onDelete={handleDeleteExpense}
      />

      {/* 4. ADD / EDIT EXPENSE MODAL */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalMode={modalMode}
        amount={amount}
        setAmount={setAmount}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        description={description}
        setDescription={setDescription}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        expenseDate={expenseDate}
        setExpenseDate={setExpenseDate}
        modalError={modalError}
        saving={saving}
        onSave={handleSaveExpense}
      />

      {/* 5. SMART SMS & UPI PARSER MODAL */}
      <SmsParserModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        categories={categories}
        onBatchCreated={fetchExpenses}
      />
    </div>
  );
}
