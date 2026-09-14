'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  FileText,
  PieChart,
  Target,
  Users2,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate, downloadCSV } from '@/lib/utils';
import { getExpensesAction } from '@/actions/expense-actions';
import { getDashboardAnalyticsAction } from '@/actions/dashboard-actions';
import { getBudgetStatusAction } from '@/actions/budget-actions';
import { getLoansAction } from '@/actions/loan-actions';
import { ReportsStatementSkeleton } from '@/components/ui/skeletons';

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

export default function ReportsPage() {
  const [reportType, setReportType] = useState('expenses'); // 'expenses' | 'categories' | 'budgets' | 'loans'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (reportType === 'expenses') {
        const startStr = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDay = new Date(year, month, 0).getDate();
        const endStr = `${year}-${String(month).padStart(2, '0')}-${endDay}`;

        const res = await getExpensesAction({
          page: 1,
          limit: 1000,
          startDate: startStr,
          endDate: endStr,
        });
        if (res.success) {
          setData(res.expenses);
        } else {
          setError(res.error || 'Failed to fetch report data');
        }
      } else if (reportType === 'categories') {
        const res = await getDashboardAnalyticsAction();
        if (res.success) {
          setData(res.data.categoryBreakdown);
        } else {
          setError(res.error || 'Failed to fetch report data');
        }
      } else if (reportType === 'budgets') {
        const res = await getBudgetStatusAction(year, month);
        if (res.success) {
          setData(res.budgets);
        } else {
          setError(res.error || 'Failed to fetch report data');
        }
      } else if (reportType === 'loans') {
        const res = await getLoansAction();
        if (res.success) {
          setData(res.loans);
        } else {
          setError(res.error || 'Failed to fetch report data');
        }
      }
    } catch (err) {
      setError('Failed to generate report dataset.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [reportType, month, year]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // EXPORT CSV HANDLER
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    let headers = [];
    let rows = [];
    const timestamp = new Date().toISOString().split('T')[0];

    if (reportType === 'expenses') {
      headers = ['ID', 'Date', 'Category', 'Description', 'Payment Method', 'Amount (INR)'];
      rows = data.map((d) => [
        d.id,
        d.expenseDate,
        `"${d.categoryName || ''}"`,
        `"${d.description || ''}"`,
        d.paymentMethod,
        d.amount,
      ]);
    } else if (reportType === 'categories') {
      headers = ['Category ID', 'Category Name', 'Total Spend (INR)'];
      rows = data.map((d) => [d.categoryId, `"${d.categoryName}"`, d.total]);
    } else if (reportType === 'budgets') {
      headers = [
        'Category Name',
        'Budget Limit (INR)',
        'Spent Amount (INR)',
        'Remaining (INR)',
        'Utilization (%)',
        'Over Budget?',
      ];
      rows = data.map((d) => [
        `"${d.categoryName}"`,
        d.budgetLimit,
        d.spentAmount,
        d.remainingAmount,
        d.utilizationPercentage,
        d.isOverBudget ? 'YES' : 'NO',
      ]);
    } else if (reportType === 'loans') {
      headers = [
        'ID',
        'Contact Name',
        'Classification',
        'Principal Amount (INR)',
        'Remaining Amount (INR)',
        'Status',
        'Loan Date',
        'Due Date',
        'Description',
      ];
      rows = data.map((d) => [
        d.id,
        `"${d.contactName}"`,
        d.type,
        d.amount,
        d.remainingAmount,
        d.status,
        d.loanDate,
        d.dueDate || '',
        `"${d.description || ''}"`,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSV(`ExpenseWise_${reportType}_Report_${timestamp}.csv`, csvContent);
  };

  if (loading && data.length === 0) {
    return <ReportsStatementSkeleton />;
  }

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-[10px] font-bold text-[#7D8494] uppercase tracking-wider">
            Statements & Audits
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#1E2025] tracking-tight mt-0.5">
            Reports & Export
          </h1>
          <p className="text-xs md:text-sm text-[#7D8494] mt-1">
            Review structured audit logs and download offline CSV statements.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={loading || data.length === 0}
          className="neu-btn-blue inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs md:text-sm font-semibold disabled:opacity-40 cursor-pointer w-full sm:w-auto"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* REPORT TYPE SELECTOR CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setReportType('expenses')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer ${
            reportType === 'expenses'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#5E6472] hover:text-[#1E2025]'
          }`}
        >
          <FileText
            className={`h-4 w-4 mb-2 ${
              reportType === 'expenses' ? 'text-[#0047FF]' : 'text-[#7D8494]'
            }`}
          />
          <h4 className="text-xs font-bold">Expense Ledger</h4>
          <p className="text-[10px] opacity-75 mt-0.5 leading-snug">Itemized journal</p>
        </button>

        <button
          onClick={() => setReportType('categories')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer ${
            reportType === 'categories'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#5E6472] hover:text-[#1E2025]'
          }`}
        >
          <PieChart
            className={`h-4 w-4 mb-2 ${
              reportType === 'categories' ? 'text-[#0047FF]' : 'text-[#7D8494]'
            }`}
          />
          <h4 className="text-xs font-bold">Category Summary</h4>
          <p className="text-[10px] opacity-75 mt-0.5 leading-snug">Spending distribution</p>
        </button>

        <button
          onClick={() => setReportType('budgets')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer ${
            reportType === 'budgets'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#5E6472] hover:text-[#1E2025]'
          }`}
        >
          <Target
            className={`h-4 w-4 mb-2 ${
              reportType === 'budgets' ? 'text-[#0047FF]' : 'text-[#7D8494]'
            }`}
          />
          <h4 className="text-xs font-bold">Budget Pacing</h4>
          <p className="text-[10px] opacity-75 mt-0.5 leading-snug">Limits vs Actuals</p>
        </button>

        <button
          onClick={() => setReportType('loans')}
          className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer ${
            reportType === 'loans'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#5E6472] hover:text-[#1E2025]'
          }`}
        >
          <Users2
            className={`h-4 w-4 mb-2 ${
              reportType === 'loans' ? 'text-[#0047FF]' : 'text-[#7D8494]'
            }`}
          />
          <h4 className="text-xs font-bold">Peer Ledger</h4>
          <p className="text-[10px] opacity-75 mt-0.5 leading-snug">Lent & Borrowed</p>
        </button>
      </div>

      {/* PERIOD CONTROLS (for expenses and budgets) */}
      {(reportType === 'expenses' || reportType === 'budgets') && (
        <div className="neu-card p-3 sm:p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E2025]">
            <Calendar className="h-4 w-4 text-[#7D8494]" />
            <span>Reporting Period:</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="neu-input py-1.5 px-3 text-xs font-medium text-[#1E2025] focus:outline-none cursor-pointer"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="neu-input py-1.5 px-3 text-xs font-medium text-[#1E2025] focus:outline-none cursor-pointer"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* REPORT DATA PREVIEW */}
      <div className="neu-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#DFDBD3]/40">
          <h3 className="text-xs font-bold text-[#1E2025] uppercase tracking-wider">
            Statement Preview ({data.length} records)
          </h3>
          <span className="text-[11px] font-mono text-[#7D8494]">INR (₹)</span>
        </div>

        {error ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-rose-600 font-medium">{error}</p>
            <button
              onClick={fetchReportData}
              className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1E2025] cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry Query</span>
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#7D8494]">
            No report data available for the specified criteria.
          </div>
        ) : (
          <>
            {/* MOBILE VIEW (< 640px): Stacked Statement Cards */}
            <div className="block sm:hidden divide-y divide-[#DFDBD3]/30">
              {reportType === 'expenses' &&
                data.map((exp, idx) => (
                  <div key={exp.id || `exp-${idx}`} className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={exp.categoryIcon} className="h-3.5 w-3.5 text-[#7D8494]" />
                        <span className="font-bold text-xs text-[#1E2025]">{exp.description || exp.categoryName}</span>
                      </div>
                      <span className="text-xs font-bold text-[#1E2025] tabular-nums">
                        {formatCurrency(exp.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#7D8494]">
                      <span>{exp.categoryName} • {exp.paymentMethod.replace('_', ' ')}</span>
                      <span>{formatDate(exp.expenseDate)}</span>
                    </div>
                  </div>
                ))}

              {reportType === 'categories' &&
                data.map((cat, idx) => (
                  <div key={cat.categoryId || cat.id || `cat-${idx}`} className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.categoryColor }} />
                      <span className="font-semibold text-xs text-[#1E2025]">{cat.categoryName}</span>
                    </div>
                    <span className="font-bold text-xs text-[#1E2025] tabular-nums">
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                ))}

              {reportType === 'budgets' &&
                data.map((b, idx) => (
                  <div key={b.budgetId || b.id || b.categoryId || `budget-${idx}`} className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#1E2025]">{b.categoryName}</span>
                      <span className={`text-xs font-bold tabular-nums ${b.isOverBudget ? 'text-rose-600' : 'text-[#1E2025]'}`}>
                        {b.utilizationPercentage}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#7D8494]">
                      <span>Cap: {formatCurrency(b.budgetLimit)}</span>
                      <span>Spent: {formatCurrency(b.spentAmount)}</span>
                    </div>
                  </div>
                ))}

              {reportType === 'loans' &&
                data.map((l, idx) => (
                  <div key={l.id || `loan-${idx}`} className="p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#1E2025]">{l.contactName}</span>
                      <span className={`text-[10px] font-bold ${l.type === 'LENT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {l.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#7D8494]">
                      <span>Principal: {formatCurrency(l.amount)}</span>
                      <span className="font-bold text-[#1E2025] tabular-nums">Rem: {formatCurrency(l.remainingAmount)}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* DESKTOP/TABLET VIEW (>= 640px): Standard Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DFDBD3]/40 text-[10px] font-bold uppercase tracking-wider text-[#7D8494] bg-[#E5E1D9]/40">
                    {reportType === 'expenses' && (
                      <>
                        <th className="py-3 px-5">Expense Details</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-5 text-right">Amount</th>
                      </>
                    )}
                    {reportType === 'categories' && (
                      <>
                        <th className="py-3 px-5">Category</th>
                        <th className="py-3 px-5 text-right">Total Aggregate Spend</th>
                      </>
                    )}
                    {reportType === 'budgets' && (
                      <>
                        <th className="py-3 px-5">Category</th>
                        <th className="py-3 px-4">Budget Cap</th>
                        <th className="py-3 px-4">Spent</th>
                        <th className="py-3 px-4">Remaining</th>
                        <th className="py-3 px-5 text-right">Utilization</th>
                      </>
                    )}
                    {reportType === 'loans' && (
                      <>
                        <th className="py-3 px-5">Contact</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Principal</th>
                        <th className="py-3 px-4">Remaining</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-5 text-right">Status</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFDBD3]/30">
                  {reportType === 'expenses' &&
                    data.map((exp, idx) => (
                      <tr key={exp.id || `exp-row-${idx}`} className="hover:bg-[#FFFFFF]/25 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-[#1E2025]">
                          <div className="flex items-center gap-2.5">
                            <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4 text-[#7D8494]" />
                            <span>{exp.description || exp.categoryName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#7D8494]">
                          {exp.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4 text-[#7D8494] font-medium">
                          {formatDate(exp.expenseDate)}
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-[#1E2025] tabular-nums">
                          {formatCurrency(exp.amount)}
                        </td>
                      </tr>
                    ))}

                  {reportType === 'categories' &&
                    data.map((cat, idx) => (
                      <tr key={cat.categoryId || cat.id || `cat-row-${idx}`} className="hover:bg-[#FFFFFF]/25 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: cat.categoryColor }}
                            />
                            <span className="font-semibold text-[#1E2025]">{cat.categoryName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-right font-bold text-[#1E2025] tabular-nums">
                          {formatCurrency(cat.total)}
                        </td>
                      </tr>
                    ))}

                  {reportType === 'budgets' &&
                    data.map((b, idx) => (
                      <tr key={b.budgetId || b.id || b.categoryId || `budget-row-${idx}`} className="hover:bg-[#FFFFFF]/25 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-2.5">
                            <CategoryIcon iconName={b.categoryIcon} className="h-4 w-4 text-[#7D8494]" />
                            <span className="font-semibold text-[#1E2025]">{b.categoryName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#7D8494] font-medium tabular-nums">
                          {formatCurrency(b.budgetLimit)}
                        </td>
                        <td className="py-3.5 px-4 text-[#1E2025] font-semibold tabular-nums">
                          {formatCurrency(b.spentAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-600 font-semibold tabular-nums">
                          {formatCurrency(b.remainingAmount)}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <span
                            className={`font-bold tabular-nums ${
                              b.isOverBudget ? 'text-rose-600' : 'text-[#1E2025]'
                            }`}
                          >
                            {b.utilizationPercentage}%
                          </span>
                        </td>
                      </tr>
                    ))}

                  {reportType === 'loans' &&
                    data.map((l, idx) => (
                      <tr key={l.id || `loan-row-${idx}`} className="hover:bg-[#FFFFFF]/25 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-[#1E2025]">{l.contactName}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold text-[11px] ${
                              l.type === 'LENT' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {l.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#7D8494] tabular-nums">{formatCurrency(l.amount)}</td>
                        <td className="py-3.5 px-4 font-bold text-[#1E2025] tabular-nums">
                          {formatCurrency(l.remainingAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-[#7D8494]">{formatDate(l.loanDate)}</td>
                        <td className="py-3.5 px-5 text-right">
                          <span className="inline-flex rounded-md neu-inset px-2.5 py-0.5 text-[10px] font-semibold text-[#1E2025]">
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
