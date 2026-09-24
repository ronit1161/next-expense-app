'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  FileText,
  PieChart,
  Target,
  Users2,
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
    { id: 'expenses', label: '04.1 ITEM STATEMENT', icon: FileText },
    { id: 'categories', label: '04.2 SECTOR AGGREGATES', icon: PieChart },
    { id: 'budgets', label: '04.3 BUDGET AUDIT', icon: Target },
    { id: 'loans', label: '04.4 PEER EXPOSURE', icon: Users2 },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="border-b-4 border-black dark:border-white/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 bg-[#FF3000]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                04. REPORTS // FINANCIAL STATEMENTS
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-charcoal">
              STATEMENTS &amp; LEDGER EXPORT
            </h1>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={!data || data.length === 0}
            className="swiss-btn-accent px-4 py-2 text-xs font-black flex items-center gap-2 self-start sm:self-auto disabled:opacity-30 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>EXPORT CSV LEDGER</span>
          </button>
        </div>
      </div>

      {/* 2. REPORT TYPE TAB SELECTOR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {navTabs.map((tab) => {
          const isActive = reportType === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`p-3 border-2 text-xs font-black uppercase flex items-center justify-between transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black dark:border-white/30 bg-[var(--bg-surface)] text-charcoal hover:bg-black hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#FF3000]' : ''}`} />
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
