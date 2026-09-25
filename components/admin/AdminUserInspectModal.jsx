import { X, Loader2, User, Wallet, PiggyBank, HandCoins, ArrowUpRight } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminUserInspectModal({
  inspectingUser,
  inspectDetail,
  loadingInspect,
  onClose,
}) {
  if (!inspectingUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 animate-fadeIn">
      <div className="clay-surface w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 animate-scaleIn rounded-[36px]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--clay-border)]">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 clay-orb flex items-center justify-center text-white font-black text-lg shrink-0">
              {inspectingUser.name ? inspectingUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 block">
                User Activity Profile
              </span>
              <h2
                className="text-xl font-black text-[var(--text-primary)]"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                {inspectingUser.name}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                {inspectingUser.email} • Joined {formatDate(inspectingUser.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-[var(--bg-muted)] hover:bg-[var(--clay-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loadingInspect ? (
          <div className="py-16 text-center text-[var(--text-muted)]">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500 mb-2" />
            <p className="text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
              Extracting user ledger records...
            </p>
          </div>
        ) : inspectDetail ? (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--bg-muted)] clay-sunken text-center">
                <span className="text-xs font-bold text-[var(--text-muted)] block">Total Outflow</span>
                <p
                  className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-1"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {formatCurrency(inspectDetail.user?.totalExpenseSum || 0)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-muted)] clay-sunken text-center">
                <span className="text-xs font-bold text-[var(--text-muted)] block">Total Entries</span>
                <p
                  className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-1"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {inspectDetail.expenses?.length || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[var(--bg-muted)] clay-sunken text-center">
                <span className="text-xs font-bold text-[var(--text-muted)] block">Budgets Set</span>
                <p
                  className="text-lg sm:text-xl font-black text-[var(--text-primary)] mt-1"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  {inspectDetail.budgets?.length || 0}
                </p>
              </div>
            </div>

            {/* Expenses History */}
            <div className="space-y-3">
              <h4
                className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Recent Recorded Expenses ({inspectDetail.expenses?.length || 0})
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {!inspectDetail.expenses || inspectDetail.expenses.length === 0 ? (
                  <p className="p-6 text-xs text-[var(--text-muted)] text-center rounded-2xl bg-[var(--bg-muted)]">
                    No expenses recorded by this user yet.
                  </p>
                ) : (
                  inspectDetail.expenses.map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-2xl bg-[var(--bg-muted)] clay-sunken flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 clay-orb flex items-center justify-center text-white shrink-0">
                          <CategoryIcon iconName={e.categoryIcon} className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">
                            {e.description || e.categoryName}
                          </p>
                          <p className="text-[11px] text-[var(--text-muted)]">
                            {e.categoryName} • {formatDate(e.expenseDate)} • {e.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <span
                        className="font-black text-rose-600 dark:text-rose-400 text-sm"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        -{formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Budgets & Goals */}
            <div className="space-y-3">
              <h4
                className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Configured Monthly Budgets ({inspectDetail.budgets?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {!inspectDetail.budgets || inspectDetail.budgets.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)] col-span-2 p-4 text-center rounded-2xl bg-[var(--bg-muted)]">
                    No monthly budgets configured.
                  </p>
                ) : (
                  inspectDetail.budgets.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-[var(--bg-muted)] clay-sunken flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-[var(--text-primary)]">{b.categoryName}</span>
                      <span
                        className="font-black text-violet-600 dark:text-violet-400"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        {formatCurrency(b.amount)}/mo
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Peer Debt Ledgers */}
            <div className="space-y-3">
              <h4
                className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Peer Debt Ledgers ({inspectDetail.loans?.length || 0})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {!inspectDetail.loans || inspectDetail.loans.length === 0 ? (
                  <p className="p-6 text-xs text-[var(--text-muted)] text-center rounded-2xl bg-[var(--bg-muted)]">
                    No peer debts logged by this user.
                  </p>
                ) : (
                  inspectDetail.loans.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-2xl bg-[var(--bg-muted)] clay-sunken flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{l.contactName}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {l.type === 'GIVEN' || l.type === 'LENT' ? 'Lent' : 'Borrowed'} • {formatDate(l.loanDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-black text-[var(--text-primary)]"
                          style={{ fontFamily: 'Nunito, sans-serif' }}
                        >
                          {formatCurrency(l.amount)}
                        </p>
                        <span className="clay-badge-pill text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400">
                          {l.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
