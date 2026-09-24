import { Users, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewCards({ overview, loadingOverview }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Users */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
            TOTAL USERS
          </span>
          <span className="text-[9px] font-mono text-[#FF3000] font-black">06.A</span>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black text-charcoal tabular-nums font-mono">
            {loadingOverview ? '...' : overview?.totalUsers || 0}
          </p>
          <p className="text-[10px] font-mono text-pencil mt-1 uppercase">REGISTERED ACCOUNTS</p>
        </div>
      </div>

      {/* Gross Platform Spend */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
            GROSS VOLUME
          </span>
          <span className="text-[9px] font-mono text-[#FF3000] font-black">06.B</span>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black text-charcoal tabular-nums font-mono">
            {loadingOverview ? '...' : formatCurrency(overview?.totalVolume || 0)}
          </p>
          <p className="text-[10px] font-mono text-pencil mt-1 uppercase">
            AVG {formatCurrency(overview?.averageSpendPerUser || 0)} / USER
          </p>
        </div>
      </div>

      {/* Total Expenses Logged */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
            TOTAL ENTRIES
          </span>
          <span className="text-[9px] font-mono text-[#FF3000] font-black">06.C</span>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black text-charcoal tabular-nums font-mono">
            {loadingOverview ? '...' : overview?.totalExpensesCount?.toLocaleString() || 0}
          </p>
          <p className="text-[10px] font-mono text-pencil mt-1 uppercase">ALL CATEGORIES</p>
        </div>
      </div>

      {/* Active Budgets & Lending */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
            ACTIVE BUDGETS
          </span>
          <span className="text-[9px] font-mono text-[#FF3000] font-black">06.D</span>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black text-charcoal tabular-nums font-mono">
            {loadingOverview ? '...' : overview?.totalBudgetsCount || 0}
          </p>
          <p className="text-[10px] font-mono text-pencil mt-1 uppercase">
            {overview?.totalLoansCount || 0} PEER DEBT RECORDS
          </p>
        </div>
      </div>
    </div>
  );
}
