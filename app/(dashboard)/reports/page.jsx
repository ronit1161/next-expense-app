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
          <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
            Statements & Audits
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-charcoal tracking-tight mt-0.5">
            Reports & Export
          </h1>
          <p className="text-xs md:text-sm text-pencil mt-1">
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
              : 'neu-btn text-pencil hover:text-charcoal'
          }`}
        >
          <FileText
            className={`h-4 w-4 mb-2 ${
              reportType === 'expenses' ? 'text-[#0047FF]' : 'text-pencil'
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
              : 'neu-btn text-pencil hover:text-charcoal'
          }`}
        >
          <PieChart
            className={`h-4 w-4 mb-2 ${
              reportType === 'categories' ? 'text-[#0047FF]' : 'text-pencil'
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
              : 'neu-btn text-pencil hover:text-charcoal'
          }`}
        >
          <Target
            className={`h-4 w-4 mb-2 ${
              reportType === 'budgets' ? 'text-[#0047FF]' : 'text-pencil'
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
              : 'neu-btn text-pencil hover:text-charcoal'
          }`}
        >
          <Users2
            className={`h-4 w-4 mb-2 ${
              reportType === 'loans' ? 'text-[#0047FF]' : 'text-pencil'
            }`}
          />
          <h4 className="text-xs font-bold">Peer Ledger</h4>
          <p className="text-[10px] opacity-75 mt-0.5 leading-snug">Lent & Borrowed</p>
        </button>
      </div>

      {/* PERIOD CONTROLS (for expenses and budgets) */}
      {(reportType === 'expenses' || reportType === 'budgets') && (
        <ReportPeriodSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      )}

      {/* REPORT DATA PREVIEW TABLE */}
      <ReportTable
        reportType={reportType}
        data={data}
        error={error}
        onRetry={fetchReportData}
      />
    </div>
  );
}
