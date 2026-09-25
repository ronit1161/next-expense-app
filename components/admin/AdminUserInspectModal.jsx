import { X, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#13141D] border border-slate-200 dark:border-white/10 p-6 sm:p-8 space-y-6 animate-scaleIn rounded-3xl shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white flex items-center justify-center font-bold text-base shrink-0">
              {inspectingUser.name ? inspectingUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                User Activity Profile
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {inspectingUser.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {inspectingUser.email} &bull; Joined {formatDate(inspectingUser.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loadingInspect ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-600 mb-2" />
            <p className="text-sm font-semibold">
              Extracting user ledger records...
            </p>
          </div>
        ) : inspectDetail ? (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Total Outflow</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {formatCurrency(inspectDetail.user?.totalExpenseSum || 0)}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Total Entries</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {inspectDetail.expenses?.length || 0}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Budgets Set</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                  {inspectDetail.budgets?.length || 0}
                </p>
              </div>
            </div>

            {/* Expenses History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Recent Recorded Expenses ({inspectDetail.expenses?.length || 0})
              </h4>
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {!inspectDetail.expenses || inspectDetail.expenses.length === 0 ? (
                  <p className="p-6 text-xs text-slate-400 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    No expenses recorded by this user yet.
                  </p>
                ) : (
                  inspectDetail.expenses.map((e) => (
                    <div
                      key={e.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                          <CategoryIcon iconName={e.categoryIcon} className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {e.description || e.categoryName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {e.categoryName} &bull; {formatDate(e.expenseDate)} &bull; {e.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white text-sm tabular-nums">
                        {formatCurrency(e.amount)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Budgets & Goals */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Configured Monthly Budgets ({inspectDetail.budgets?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {!inspectDetail.budgets || inspectDetail.budgets.length === 0 ? (
                  <p className="text-xs text-slate-400 col-span-2 p-4 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    No monthly budgets configured.
                  </p>
                ) : (
                  inspectDetail.budgets.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">{b.categoryName}</span>
                      <span className="font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                        {formatCurrency(b.amount)}/mo
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Peer Debt Ledgers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Peer Debt Ledgers ({inspectDetail.loans?.length || 0})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {!inspectDetail.loans || inspectDetail.loans.length === 0 ? (
                  <p className="p-6 text-xs text-slate-400 text-center rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    No peer debts logged by this user.
                  </p>
                ) : (
                  inspectDetail.loans.map((l) => (
                    <div
                      key={l.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{l.contactName}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {l.type === 'GIVEN' || l.type === 'LENT' ? 'Lent' : 'Borrowed'} &bull; {formatDate(l.loanDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 dark:text-white tabular-nums">
                          {formatCurrency(l.amount)}
                        </p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
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
