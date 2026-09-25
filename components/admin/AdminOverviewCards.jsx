import { Users, TrendingUp, CreditCard, PiggyBank, Receipt, HandCoins, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewCards({ overview, loadingOverview }) {
  const cards = [
    {
      title: 'Total Users',
      value: loadingOverview ? '...' : (overview?.totalUsers || 0).toLocaleString(),
      subtitle: 'Registered Accounts',
      icon: Users,
      gradient: 'from-blue-400 to-indigo-600',
    },
    {
      title: 'Gross Volume',
      value: loadingOverview ? '...' : formatCurrency(overview?.totalVolume || 0),
      subtitle: `Avg ${formatCurrency(overview?.averageSpendPerUser || 0)} / user`,
      icon: TrendingUp,
      gradient: 'from-violet-400 to-purple-600',
    },
    {
      title: 'Total Entries',
      value: loadingOverview ? '...' : (overview?.totalExpensesCount || 0).toLocaleString(),
      subtitle: 'All Recorded Categories',
      icon: Receipt,
      gradient: 'from-pink-400 to-rose-600',
    },
    {
      title: 'Active Budgets',
      value: loadingOverview ? '...' : (overview?.totalBudgetsCount || 0).toLocaleString(),
      subtitle: `${overview?.totalLoansCount || 0} peer debt records`,
      icon: PiggyBank,
      gradient: 'from-emerald-400 to-teal-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="clay-card p-6 rounded-[28px] flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
              <span className="text-xs font-bold text-[var(--text-secondary)]">
                {card.title}
              </span>
              <div
                className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${card.gradient} clay-orb flex items-center justify-center text-white shrink-0`}
              >
                <Icon className="h-5 w-5 stroke-[2.2]" />
              </div>
            </div>

            <div className="mt-4">
              <p
                className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {card.value}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
