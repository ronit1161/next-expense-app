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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 dark:bg-pink-400/20 text-pink-700 dark:text-pink-300 text-xs font-heading font-black mb-1">
            <PiggyBank className="h-3.5 w-3.5 text-pink-600" />
            <span>Budget Control</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-charcoal">
            Monthly Spending Budgets
          </h1>
          <p className="text-sm font-medium text-pencil">
            Set and track spending boundaries for every expenditure sector.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="clay-btn-primary px-5 py-2.5 text-xs font-heading font-black flex items-center gap-2 self-start sm:self-auto rounded-[20px] cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Set Category Budget</span>
        </button>
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

      {/* 2. OVERALL AGGREGATE SUMMARY & PERIOD SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Aggregate KPI */}
        <div className="md:col-span-8 clay-card p-6 sm:p-7 rounded-[32px] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white clay-orb shadow-sm">
                <Target className="h-4 w-4" />
              </div>
              <span className="font-heading text-xs font-black text-charcoal">
                Overall Budget Health
              </span>
            </div>
            <span className="font-heading text-xs font-bold text-pencil uppercase px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/30">
              {budgets.length} Active Caps
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
            <div className="font-heading font-black text-3xl sm:text-4xl text-charcoal tabular-nums">
              {formatCurrency(totalSpent)}{' '}
              <span className="text-base sm:text-xl text-pencil font-bold">
                / {formatCurrency(totalBudgeted)}
              </span>
            </div>
            <span
              className={`text-xs font-heading font-black px-3 py-1 rounded-full ${
                overallUtilization > 100
                  ? 'bg-rose-500 text-white'
                  : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
              }`}
            >
              {overallUtilization}% Utilized
            </span>
          </div>

          {/* Clay Progress Bar */}
          <div className="neu-groove">
            <div
              className={`neu-progress-fill ${
                overallUtilization > 100 ? 'neu-progress-fill-accent' : ''
              }`}
              style={{ width: `${Math.min(100, overallUtilization)}%` }}
            />
          </div>
        </div>

        {/* Period Selector Block */}
        <div className="md:col-span-4 clay-card p-6 rounded-[32px] flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-purple-500/10">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="font-heading text-xs font-black uppercase tracking-wider text-charcoal">
              Target Period
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-heading font-black uppercase text-pencil block mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="clay-input block w-full py-2 px-3 text-xs font-heading font-bold rounded-xl cursor-pointer"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-heading font-black uppercase text-pencil block mb-1">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="clay-input block w-full py-2 px-3 text-xs font-heading font-bold rounded-xl cursor-pointer"
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
        <div className="clay-card p-8 sm:p-12 text-center space-y-4 rounded-[32px]">
          <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-600 text-white flex items-center justify-center clay-orb shadow-md">
            <Target className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-base font-heading font-black text-charcoal">
              No Budget Caps Configured
            </h3>
            <p className="text-xs text-pencil mt-1 max-w-xs mx-auto">
              No spending limits set for {MONTHS[month - 1]} {year}.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="clay-btn-primary px-5 py-3 text-xs font-heading font-black rounded-2xl cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
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
