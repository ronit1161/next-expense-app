'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Sparkles, X, RefreshCw, Layers } from 'lucide-react';
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
    setSaving(true);

    try {
      const payload = {
        amount: parseFloat(amount),
        categoryId: parseInt(selectedCategoryId, 10),
        description: description.trim() || undefined,
        paymentMethod,
        expenseDate,
      };

      let result;
      if (modalMode === 'add') {
        result = await createExpenseAction(payload);
      } else {
        result = await updateExpenseAction(editingExpenseId, payload);
      }

      if (result.success) {
        closeModal();
        setSuccessMsg(modalMode === 'add' ? 'Expense logged successfully!' : 'Expense updated!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchExpenses();
      } else {
        setModalError(result.error || 'Failed to process transaction.');
      }
    } catch (err) {
      setModalError('Failed to process transaction.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense entry?')) return;
    try {
      const result = await deleteExpenseAction(id);
      if (result.success) {
        setSuccessMsg('Expense removed');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchExpenses();
      } else {
        alert(result.error || 'Failed to remove entry.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to remove entry.');
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 text-xs font-heading font-black mb-1">
            <Layers className="h-3.5 w-3.5 text-purple-600" />
            <span>Activity Ledger</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-charcoal">
            Expenses &amp; Activity
          </h1>
          <p className="text-sm font-medium text-pencil">
            Review and itemize all your personal financial transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* SMS Parser Button */}
          <button
            onClick={() => setIsSmsModalOpen(true)}
            className="clay-btn-secondary px-4 py-2.5 text-xs font-heading font-black flex items-center gap-2 rounded-[20px] cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>Paste SMS</span>
          </button>

          {/* Manual Add Button */}
          <button
            onClick={openAddModal}
            className="clay-btn-primary px-5 py-2.5 text-xs font-heading font-black flex items-center gap-2 rounded-[20px] cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* SUCCESS / ERROR ALERTS */}
      {successMsg && (
        <div className="clay-card bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl text-xs font-heading font-black tracking-wide flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="p-1 rounded-full hover:bg-emerald-500/20 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="clay-card bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 p-4 rounded-2xl text-xs font-heading font-black tracking-wide">
          {error}
        </div>
      )}

      {/* 2. FILTER BAR */}
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

      {/* 3. TRANSACTION TIMELINE / TABLE */}
      {loading ? (
        <ActivityTimelineSkeleton />
      ) : (
        <ExpenseTable
          expenses={expenses}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onOpenAdd={openAddModal}
          onOpenEdit={openEditModal}
          onDelete={handleDeleteExpense}
        />
      )}

      {/* EXPENSE ENTRY FORM MODAL */}
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

      {/* SMS BULK PARSER MODAL */}
      <SmsParserModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        categories={categories}
        onBatchCreated={() => {
          fetchExpenses();
          setSuccessMsg('SMS transactions imported successfully!');
          setTimeout(() => setSuccessMsg(''), 3000);
        }}
      />
    </div>
  );
}
