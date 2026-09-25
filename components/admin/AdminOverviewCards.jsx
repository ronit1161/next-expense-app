import { Users, TrendingUp, Receipt, PiggyBank } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewCards({ overview, loadingOverview }) {
  const cards = [
    {
      title: 'Total Users',
      value: loadingOverview ? '...' : (overview?.totalUsers || 0).toLocaleString(),
      subtitle: 'Registered Accounts',
      icon: Users,
      iconColor: 'text-indigo-500',
    },
    {
      title: 'Gross Volume',
      value: loadingOverview ? '...' : formatCurrency(overview?.totalVolume || 0),
      subtitle: `Avg ${formatCurrency(overview?.averageSpendPerUser || 0)} / user`,
      icon: TrendingUp,
      iconColor: 'text-teal-500',
    },
    {
      title: 'Total Entries',
      value: loadingOverview ? '...' : (overview?.totalExpensesCount || 0).toLocaleString(),
      subtitle: 'All Recorded Categories',
      icon: Receipt,
      iconColor: 'text-amber-500',
    },
    {
      title: 'Active Budgets',
      value: loadingOverview ? '...' : (overview?.totalBudgetsCount || 0).toLocaleString(),
      subtitle: `${overview?.totalLoansCount || 0} peer debt records`,
      icon: PiggyBank,
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="fintech-card p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div
                className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0"
              >
                <Icon className={`h-4 w-4 stroke-[2.2] ${card.iconColor}`} />
              </div>
            </div>

            <div className="mt-3.5">
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                {card.value}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
