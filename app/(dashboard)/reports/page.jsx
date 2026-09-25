'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  FileText,
  PieChart,
  Target,
  Users2,
  FileSpreadsheet,
} from 'lucide-react';
import { downloadCSV } from '@/lib/utils';
import { getExpensesAction } from '@/actions/expense-actions';
import { getDashboardAnalyticsAction } from '@/actions/dashboard-actions';
import { getBudgetStatusAction } from '@/actions/budget-actions';
import { getLoansAction } from '@/actions/loan-actions';
import { ReportsStatementSkeleton } from '@/components/ui/skeletons';
import ReportPeriodSelector from '@/components/reports/ReportPeriodSelector';
import ReportTable from '@/components/reports/ReportTable';

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
    downloadCSV(csvContent, `expensewise-${reportType}-report-${timestamp}.csv`);
  };

  const navTabs = [
    { id: 'expenses', label: 'Item Statement', icon: FileText, gradient: 'from-blue-400 to-indigo-600' },
    { id: 'categories', label: 'Sector Split', icon: PieChart, gradient: 'from-purple-400 to-purple-600' },
    { id: 'budgets', label: 'Budget Audit', icon: Target, gradient: 'from-pink-400 to-pink-600' },
    { id: 'loans', label: 'Peer Debts', icon: Users2, gradient: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 text-xs font-heading font-black mb-1">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Financial Statements</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-charcoal">
            Reports &amp; Data Export
          </h1>
          <p className="text-sm font-medium text-pencil">
            Analyze historical records and export clean CSV ledgers.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={!data || data.length === 0}
          className="clay-btn-primary px-5 py-2.5 text-xs font-heading font-black flex items-center gap-2 self-start sm:self-auto disabled:opacity-40 rounded-[20px] cursor-pointer shadow-md"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* 2. REPORT TYPE TAB SELECTOR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {navTabs.map((tab) => {
          const isActive = reportType === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`p-4 rounded-[24px] text-xs font-heading font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                isActive
                  ? 'clay-btn-primary scale-102 shadow-md'
                  : 'clay-card hover:-translate-y-1 text-charcoal'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${tab.gradient} ${
                    isActive ? 'clay-orb shadow-sm' : 'opacity-85'
                  }`}
                >
                  <Icon className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. PERIOD SELECTOR (FOR PERIODIC REPORTS) */}
      {(reportType === 'expenses' || reportType === 'budgets') && (
        <ReportPeriodSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      )}

      {/* 4. STATEMENT DATA TABLE */}
      {loading ? (
        <ReportsStatementSkeleton />
      ) : (
        <ReportTable
          reportType={reportType}
          data={data}
          error={error}
          onRetry={fetchReportData}
        />
      )}
    </div>
  );
}
