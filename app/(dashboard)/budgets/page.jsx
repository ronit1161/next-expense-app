'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Target,
  RefreshCw,
  Calendar,
  X,
  PiggyBank,
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
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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
      setModalError('Please specify a valid positive budget amount.');
      return;
    }
    if (!selectedCategoryId) {
      setModalError('Please select a category.');
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
        setSuccessMsg('Budget limit saved successfully!');
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
    if (!confirm('Remove this category budget cap?')) return;
    try {
      const res = await deleteBudgetAction(id);
      if (res.success) {
        setSuccessMsg('Budget limit removed');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F766E]/10 dark:bg-[#14B8A6]/20 text-[#0F766E] dark:text-[#2DD4BF] text-xs font-heading font-black mb-1">
            <PiggyBank className="h-3.5 w-3.5" />
            <span>Budget Control</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Monthly Spending Budgets
          </h1>
          <p className="text-sm font-medium text-[#64748B]">
            Set and track spending boundaries for every expenditure sector.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="fintech-btn-primary px-5 py-2.5 text-xs font-bold flex items-center gap-2 self-start sm:self-auto rounded-xl cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Set Category Budget</span>
        </button>
      </div>

      {/* SUCCESS / ERROR ALERTS */}
      {successMsg && (
        <div className="fintech-card bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="p-1 rounded-full hover:bg-emerald-500/20 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="fintech-card bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* 2. OVERALL AGGREGATE SUMMARY & PERIOD SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Aggregate KPI */}
        <div className="md:col-span-8 fintech-card p-6 sm:p-7 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
                <Target className="h-4 w-4 text-teal-400 dark:text-teal-600" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Overall Budget Health
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500 uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5">
              {budgets.length} Active Caps
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
            <div className="font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatCurrency(totalSpent)}{' '}
              <span className="text-base sm:text-xl text-slate-400 font-semibold">
                / {formatCurrency(totalBudgeted)}
              </span>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                overallUtilization > 100
                  ? 'bg-rose-500 text-white'
                  : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
              }`}
            >
              {overallUtilization}% Utilized
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallUtilization > 100 ? 'bg-rose-500' : 'bg-gradient-to-r from-teal-500 to-indigo-500'
              }`}
              style={{ width: `${Math.min(100, overallUtilization)}%` }}
            />
          </div>
        </div>

        {/* Period Selector Block */}
        <div className="md:col-span-4 fintech-card p-6 rounded-3xl flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
            <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Target Period
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full h-10 px-3 text-xs font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:outline-none"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1} className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full h-10 px-3 text-xs font-medium rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white cursor-pointer focus:outline-none"
              >
                {[year - 1, year, year + 1].map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-[#13141D] text-slate-900 dark:text-white">
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
        <div className="fintech-card p-8 sm:p-12 text-center space-y-4 rounded-3xl">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-xs">
            <Target className="h-7 w-7 text-teal-400 dark:text-teal-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No Budget Caps Configured
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              No spending limits set for {MONTHS[month - 1]} {year}.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="fintech-btn-primary px-5 py-2.5 text-xs font-bold rounded-xl cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Set First Budget Cap</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
