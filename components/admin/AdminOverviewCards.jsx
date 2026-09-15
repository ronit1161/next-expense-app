import { Users, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewCards({ overview, loadingOverview }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users */}
      <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            Total Users
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-[#0047FF] neu-card-sm">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-display font-extrabold text-charcoal">
            {loadingOverview ? '...' : overview?.totalUsers || 0}
          </p>
          <p className="text-[10px] text-pencil mt-0.5">Registered accounts</p>
        </div>
      </div>

      {/* Gross Platform Spend */}
      <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            Gross Volume
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 neu-card-sm">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-display font-extrabold text-charcoal">
            {loadingOverview ? '...' : formatCurrency(overview?.totalVolume || 0)}
          </p>
          <p className="text-[10px] text-pencil mt-0.5">
            Avg {formatCurrency(overview?.averageSpendPerUser || 0)} / user
          </p>
        </div>
      </div>

      {/* Total Expenses Logged */}
      <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            Total Entries
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 neu-card-sm">
            <CreditCard className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-display font-extrabold text-charcoal">
            {loadingOverview ? '...' : overview?.totalExpensesCount?.toLocaleString() || 0}
          </p>
          <p className="text-[10px] text-pencil mt-0.5">Across all categories</p>
        </div>
      </div>

      {/* Active Budgets & Lending */}
      <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
            Active Budgets
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 neu-card-sm">
            <PiggyBank className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-display font-extrabold text-charcoal">
            {loadingOverview ? '...' : overview?.totalBudgetsCount || 0}
          </p>
          <p className="text-[10px] text-pencil mt-0.5">
            {overview?.totalLoansCount || 0} peer debt records
          </p>
        </div>
      </div>
    </div>
  );
}
