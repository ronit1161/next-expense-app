'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Trash2,
  AlertTriangle,
  X,
  Target,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';
import {
  getBudgetStatusAction,
  setBudgetAction,
  deleteBudgetAction,
} from '@/actions/budget-actions';
import { getCategoriesAction } from '@/actions/expense-actions';
import { BudgetMetersSkeleton } from '@/components/ui/skeletons';

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
      setModalError('Please specify a positive budget limit amount.');
      return;
    }
    if (!selectedCategoryId) {
      setModalError('Please pick a category.');
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
        setSuccessMsg('Budget limit saved.');
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
    if (!window.confirm('Remove this category budget cap?')) return;

    try {
      const res = await deleteBudgetAction(id);
      if (res.success) {
        setSuccessMsg('Budget cap removed.');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchBudgets();
      } else {
        setError(res.error || 'Failed to delete budget limit.');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete budget cap.');
    }
  };

  // Aggregated totals
  const totalLimit = budgets.reduce((acc, b) => acc + b.budgetLimit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const totalRemaining = Math.max(0, totalLimit - totalSpent);
  const overallUtilization = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  if (loading && budgets.length === 0) {
    return <BudgetMetersSkeleton />;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            Spending Targets
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-charcoal tracking-tight mt-0.5">
            Budget Pacing
          </h1>
          <p className="text-xs md:text-sm text-pencil mt-1">
            Category thresholds, pacing velocities, and limit tracking.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="neu-btn-blue inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs md:text-sm font-semibold text-white cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Set Budget Limit</span>
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl neu-inset px-4 py-3 text-xs font-semibold text-loss animate-fadeIn">
          <span>{error}</span>
          <button
            onClick={() => {
              setLoading(true);
              fetchBudgets();
            }}
            className="flex items-center gap-1 text-xs underline cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. PERIOD SELECTOR & OVERALL PROGRESS */}
      <div className="neu-card rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-charcoal">
            <Calendar className="h-4 w-4 text-pencil" />
            <span>Budget Cycle:</span>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal cursor-pointer"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1} className="bg-[#EAE6DF] text-charcoal">
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="neu-input py-1.5 px-3 text-xs font-medium text-charcoal cursor-pointer"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y} className="bg-[#EAE6DF] text-charcoal">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Utilization Progress */}
        {totalLimit > 0 && (
          <div className="pt-3 neu-inset p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-pencil font-medium">
                Overall Spend: <strong className="text-charcoal tabular-nums">{formatCurrency(totalSpent)}</strong> of{' '}
                <strong className="text-charcoal tabular-nums">{formatCurrency(totalLimit)}</strong>
              </span>
              <span
                className={`font-bold tabular-nums ${
                  totalSpent > totalLimit ? 'text-loss' : 'text-charcoal'
                }`}
              >
                {overallUtilization}% utilized
              </span>
            </div>

            <div className="neu-groove h-2.5 w-full p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  totalSpent > totalLimit ? 'bg-loss' : 'bg-[#0047FF]'
                }`}
                style={{ width: `${Math.min(100, overallUtilization)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. CATEGORY METERS GRID */}
      {budgets.length === 0 ? (
        <div className="neu-card p-12 text-center rounded-3xl space-y-4">
          <Target className="h-8 w-8 text-pencil mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-charcoal">NO BUDGET TARGETS CONFIGURED</h3>
            <p className="text-xs text-pencil mt-1 max-w-xs mx-auto">
              Set spending limits for {MONTHS[month - 1]} {year} to prevent overspending.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="neu-btn-blue inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Set Target</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((b, idx) => (
            <div
              key={b.budgetId || b.id || b.categoryId || `budget-card-${idx}`}
              className="neu-card rounded-2xl p-5 space-y-3.5 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl neu-card-sm text-charcoal">
                    <CategoryIcon iconName={b.categoryIcon} className="h-4 w-4 text-pencil" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-charcoal">{b.categoryName}</h4>
                    <p className="text-[11px] text-pencil tabular-nums">
                      Cap: {formatCurrency(b.budgetLimit)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg tabular-nums ${
                      b.isOverBudget
                        ? 'neu-inset text-loss'
                        : 'neu-inset text-[#0047FF]'
                    }`}
                  >
                    {b.utilizationPercentage}%
                  </span>
                  <button
                    onClick={() => handleDeleteBudget(b.budgetId)}
                    className="neu-btn p-1.5 text-pencil hover:text-loss rounded-lg cursor-pointer"
                    title="Remove Budget Cap"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Indented Groove Meter */}
              <div className="neu-groove h-2 w-full p-0.5">
                <div
                  className={`h-full rounded-full neu-progress-fill transition-all duration-300 ${
                    b.isOverBudget ? 'bg-loss' : 'bg-charcoal'
                  }`}
                  style={{ width: `${Math.min(100, b.utilizationPercentage)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-pencil font-medium">
                  Spent: <strong className="text-charcoal tabular-nums">{formatCurrency(b.spentAmount)}</strong>
                </span>
                <span
                  className={`font-semibold tabular-nums ${
                    b.isOverBudget ? 'text-loss' : 'text-gain'
                  }`}
                >
                  {b.isOverBudget
                    ? `Over by ${formatCurrency(b.spentAmount - b.budgetLimit)}`
                    : `${formatCurrency(b.remainingAmount)} left`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#EAE6DF] neu-card p-6 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="text-[10px] font-bold text-pencil uppercase tracking-wider block">
                  Budget Control
                </span>
                <h3 className="text-lg font-display font-semibold text-charcoal">
                  Set Spending Limit
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="neu-btn p-2 text-pencil hover:text-charcoal cursor-pointer rounded-xl"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 neu-inset p-3 text-xs font-semibold text-loss rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveBudget} className="mt-4 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
                  Category *
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-xs cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-[#EAE6DF] text-charcoal">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1.5">
                  Monthly Limit Amount (INR ₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="neu-input block w-full py-2.5 px-3 text-sm font-bold font-numeric text-charcoal"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="neu-btn px-4 py-2.5 text-xs font-semibold text-pencil hover:text-charcoal cursor-pointer rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="neu-btn-blue px-5 py-2.5 text-xs font-semibold text-white cursor-pointer rounded-xl"
                >
                  {saving ? 'Saving...' : 'Set Limit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
