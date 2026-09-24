'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Target,
  RefreshCw,
  Calendar,
  X,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  getBudgetStatusAction,
  setBudgetAction,
  deleteBudgetAction,
} from '@/actions/budget-actions';
import { getCategoriesAction } from '@/actions/expense-actions';
import { BudgetMetersSkeleton } from '@/components/ui/skeletons';
import BudgetCard from '@/components/budgets/BudgetCard';
import SetBudgetModal from '@/components/budgets/SetBudgetModal';

const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const result = await getBudgetStatusAction(year, month);
      if (result.success) {
        setBudgets(result.budgets);
      } else {
        setError(result.error || 'Failed to fetch budget status.');
      }
    } catch (err) {
      setError('Failed to fetch budget status records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

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
    fetchBudgets();
  }, [fetchBudgets]);

  const openAddModal = () => {
    setSelectedCategoryId(categories[0]?.id ? String(categories[0].id) : '');
    setAmount('');
    setModalError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalError('');
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!amount || Number(amount) <= 0) {
      setModalError('PLEASE SPECIFY A POSITIVE BUDGET AMOUNT.');
      return;
    }
    if (!selectedCategoryId) {
      setModalError('PLEASE SELECT A CATEGORY.');
      return;
    }

    setSaving(true);
    try {
      const res = await setBudgetAction({
        categoryId: Number(selectedCategoryId),
        amount: Number(amount),
        month: Number(month),
        year: Number(year),
      });

      if (res.success) {
        setSuccessMsg('BUDGET LIMIT COMMITTED');
        setTimeout(() => setSuccessMsg(''), 3000);
        closeModal();
        fetchBudgets();
      } else {
        setModalError(res.error || 'Failed to update budget limit.');
      }
    } catch (err) {
      setModalError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!confirm('CONFIRM DELETE: Remove this monthly category budget limit?')) return;
    try {
      const res = await deleteBudgetAction(id);
      if (res.success) {
        setSuccessMsg('BUDGET LIMIT REMOVED');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchBudgets();
      } else {
        alert(res.error || 'Failed to delete budget.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete budget.');
    }
  };

  const totalBudgeted = budgets.reduce((acc, b) => acc + b.budgetLimit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const overallUtilization = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="border-b-4 border-black dark:border-white/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 bg-[#FF3000]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                03. BUDGETS // ALLOCATION CONTROL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-charcoal">
              MONTHLY SPENDING CAPS
            </h1>
          </div>

          <button
            onClick={openAddModal}
            className="swiss-btn-accent px-4 py-2 text-xs font-black flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>SET CATEGORY BUDGET</span>
          </button>
        </div>
      </div>

      {/* SUCCESS / ERROR ALERTS */}
      {successMsg && (
        <div className="border-2 border-black bg-black text-white p-3 text-xs font-black uppercase tracking-wider animate-fadeIn flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="border-2 border-[#FF3000] bg-[#FF3000]/10 text-[#FF3000] p-3 text-xs font-black uppercase tracking-wider animate-fadeIn">
          {error}
        </div>
      )}

      {/* 2. OVERALL AGGREGATE SUMMARY & PERIOD SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Aggregate KPI */}
        <div className="md:col-span-8 border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF3000]">
              03.0 OVERALL BUDGET HEALTH
            </span>
            <span className="text-[10px] font-mono text-pencil uppercase">
              {budgets.length} ACTIVE CAPS
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-2">
            <div className="text-3xl sm:text-5xl font-black text-charcoal tabular-nums font-mono">
              {formatCurrency(totalSpent)}{' '}
              <span className="text-lg sm:text-2xl text-pencil font-bold">
                / {formatCurrency(totalBudgeted)}
              </span>
            </div>
            <span
              className={`text-sm font-black font-mono uppercase px-2 py-0.5 border-2 ${
                overallUtilization > 100
                  ? 'bg-[#FF3000] text-white border-[#FF3000]'
                  : 'bg-black text-white border-black dark:bg-white dark:text-black'
              }`}
            >
              {overallUtilization}% UTILIZED
            </span>
          </div>

          {/* Solid Heavy Progress Bar */}
          <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] h-4 p-0.5 mt-2">
            <div
              className={`h-full transition-all duration-300 ${
                overallUtilization > 100 ? 'bg-[#FF3000]' : 'bg-black dark:bg-white'
              }`}
              style={{ width: `${Math.min(100, overallUtilization)}%` }}
            />
          </div>
        </div>

        {/* Period Selector Block */}
        <div className="md:col-span-4 border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 flex flex-col justify-between space-y-3">
          <div className="border-b-2 border-black dark:border-white/20 pb-2">
            <span className="text-xs font-black uppercase tracking-widest text-pencil">
              TARGET PERIOD
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                MONTH
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-charcoal block mb-1">
                YEAR
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono font-bold uppercase cursor-pointer"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ITEM-BY-ITEM BUDGET CARDS GRID */}
      {loading ? (
        <BudgetMetersSkeleton />
      ) : budgets.length === 0 ? (
        <div className="border-4 border-black dark:border-white/20 p-8 sm:p-12 text-center space-y-4 bg-[var(--bg-surface)]">
          <Target className="h-8 w-8 text-pencil mx-auto" />
          <div>
            <h3 className="text-sm font-black uppercase text-charcoal">
              NO BUDGET CAPS CONFIGURED
            </h3>
            <p className="text-xs font-mono text-pencil mt-1 max-w-xs mx-auto uppercase">
              NO SPENDING LIMITS SET FOR {MONTHS[month - 1]} {year}.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="swiss-btn-accent px-4 py-2.5 text-xs font-black uppercase cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1 stroke-[3]" />
            <span>SET FIRST BUDGET CAP</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.budgetId || budget.categoryId}
              budget={budget}
              onDelete={handleDeleteBudget}
            />
          ))}
        </div>
      )}

      {/* SET BUDGET MODAL */}
      <SetBudgetModal
        isOpen={isModalOpen}
        onClose={closeModal}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        amount={amount}
        setAmount={setAmount}
        modalError={modalError}
        saving={saving}
        onSave={handleSaveBudget}
      />
    </div>
  );
}
