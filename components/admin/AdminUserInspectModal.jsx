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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--bg-surface)] border-4 border-black dark:border-white p-6 space-y-5 animate-scaleIn">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-white/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-sm">
              {inspectingUser.name ? inspectingUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000] block">
                06.1 USER ACTIVITY PROFILE
              </span>
              <h2 className="text-base font-black uppercase text-charcoal">
                {inspectingUser.name}
              </h2>
              <p className="text-xs font-mono text-pencil uppercase">
                {inspectingUser.email} • JOINED {formatDate(inspectingUser.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-black dark:border-white text-pencil hover:text-charcoal cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loadingInspect ? (
          <div className="py-16 text-center text-pencil">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#FF3000] mb-2" />
            <p className="text-xs font-mono uppercase font-black">EXTRACTING FULL USER LEDGER...</p>
          </div>
        ) : inspectDetail ? (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] p-3 text-center">
                <span className="text-[10px] font-black text-pencil uppercase">TOTAL OUTFLOW</span>
                <p className="text-base font-black text-charcoal font-mono tabular-nums mt-1">
                  {formatCurrency(inspectDetail.user?.totalExpenseSum || 0)}
                </p>
              </div>
              <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] p-3 text-center">
                <span className="text-[10px] font-black text-pencil uppercase">TOTAL ENTRIES</span>
                <p className="text-base font-black text-charcoal font-mono tabular-nums mt-1">
                  {inspectDetail.expenses?.length || 0}
                </p>
              </div>
              <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] p-3 text-center">
                <span className="text-[10px] font-black text-pencil uppercase">BUDGETS SET</span>
                <p className="text-base font-black text-charcoal font-mono tabular-nums mt-1">
                  {inspectDetail.budgets?.length || 0}
                </p>
              </div>
            </div>

            {/* Expenses History */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-charcoal uppercase tracking-widest">
                RECENT RECORDED EXPENSES ({inspectDetail.expenses?.length || 0})
              </h4>
              <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] max-h-52 overflow-y-auto divide-y divide-black/10 dark:divide-white/10">
                {!inspectDetail.expenses || inspectDetail.expenses.length === 0 ? (
                  <p className="p-4 text-xs font-mono text-pencil text-center uppercase">NO EXPENSES RECORDED</p>
                ) : (
                  inspectDetail.expenses.map((e) => (
                    <div key={e.id} className="p-2.5 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                          <CategoryIcon iconName={e.categoryIcon} className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-charcoal uppercase">{e.description || e.categoryName}</p>
                          <p className="text-[10px] text-pencil uppercase">
                            {e.categoryName} • {formatDate(e.expenseDate)} • {e.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-[#FF3000]">-{formatCurrency(e.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Budgets & Goals */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-charcoal uppercase tracking-widest">
                CONFIGURED MONTHLY BUDGETS ({inspectDetail.budgets?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {!inspectDetail.budgets || inspectDetail.budgets.length === 0 ? (
                  <p className="text-xs font-mono text-pencil col-span-2 border-2 border-dashed border-black/20 p-3 text-center uppercase">
                    NO MONTHLY BUDGETS CONFIGURED
                  </p>
                ) : (
                  inspectDetail.budgets.map((b) => (
                    <div
                      key={b.id}
                      className="border-2 border-black dark:border-white/20 p-2.5 flex items-center justify-between text-xs font-mono"
                    >
                      <span className="font-black text-charcoal uppercase">{b.categoryName}</span>
                      <span className="font-black text-charcoal">{formatCurrency(b.amount)}/MO</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Peer Debt Ledgers */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-charcoal uppercase tracking-widest">
                PEER DEBT LEDGERS ({inspectDetail.loans?.length || 0})
              </h4>
              <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] max-h-44 overflow-y-auto divide-y divide-black/10 dark:divide-white/10">
                {!inspectDetail.loans || inspectDetail.loans.length === 0 ? (
                  <p className="p-4 text-xs font-mono text-pencil text-center uppercase">NO PEER DEBTS FOUND</p>
                ) : (
                  inspectDetail.loans.map((l) => (
                    <div key={l.id} className="p-2.5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <p className="font-black text-charcoal uppercase">{l.contactName}</p>
                        <p className="text-[10px] text-pencil uppercase">
                          {l.type === 'GIVEN' ? 'LENT' : 'BORROWED'} • {formatDate(l.loanDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-charcoal">{formatCurrency(l.amount)}</p>
                        <span className="text-[9px] font-black border border-current px-1 uppercase">
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
