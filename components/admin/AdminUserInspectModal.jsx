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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#EAE6DF] rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleIn border border-[#D8D2C6]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C6]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-charcoal text-white flex items-center justify-center font-bold text-sm">
              {inspectingUser.name ? inspectingUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal">
                {inspectingUser.name}’s Activity Profile
              </h2>
              <p className="text-xs text-pencil">
                {inspectingUser.email} • Joined on {formatDate(inspectingUser.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-pencil hover:text-charcoal neu-btn-sm rounded-xl cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loadingInspect ? (
          <div className="py-16 text-center text-pencil">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#0047FF] mb-2" />
            <p className="text-xs">Fetching complete ledger and activities...</p>
          </div>
        ) : inspectDetail ? (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="neu-inset p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold text-pencil uppercase">Total Recorded</span>
                <p className="text-base font-extrabold text-charcoal mt-0.5">
                  {formatCurrency(inspectDetail.user?.totalExpenseSum || 0)}
                </p>
              </div>
              <div className="neu-inset p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold text-pencil uppercase">Total Entries</span>
                <p className="text-base font-extrabold text-charcoal mt-0.5">
                  {inspectDetail.expenses?.length || 0}
                </p>
              </div>
              <div className="neu-inset p-3.5 rounded-xl text-center">
                <span className="text-[10px] font-bold text-pencil uppercase">Budgets Set</span>
                <p className="text-base font-extrabold text-charcoal mt-0.5">
                  {inspectDetail.budgets?.length || 0}
                </p>
              </div>
            </div>

            {/* Expenses History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-pencil uppercase tracking-wider">
                Recent Itemized Expenses ({inspectDetail.expenses?.length || 0})
              </h4>
              <div className="neu-inset rounded-xl max-h-52 overflow-y-auto divide-y divide-[#D8D2C6]/60">
                {!inspectDetail.expenses || inspectDetail.expenses.length === 0 ? (
                  <p className="p-4 text-xs text-pencil text-center">No recorded expenses.</p>
                ) : (
                  inspectDetail.expenses.map((e) => (
                    <div key={e.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: e.categoryColor || '#0047FF' }}
                        >
                          <CategoryIcon name={e.categoryIcon} className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-charcoal">{e.description}</p>
                          <p className="text-[10px] text-pencil">
                            {e.categoryName} • {formatDate(e.expenseDate)} • {e.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-loss">-{formatCurrency(e.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Budgets & Goals */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-pencil uppercase tracking-wider">
                Active Monthly Budgets ({inspectDetail.budgets?.length || 0})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {!inspectDetail.budgets || inspectDetail.budgets.length === 0 ? (
                  <p className="text-xs text-pencil col-span-2 neu-inset p-3 rounded-xl text-center">
                    No active monthly budgets configured.
                  </p>
                ) : (
                  inspectDetail.budgets.map((b) => (
                    <div
                      key={b.id}
                      className="neu-card p-3 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-md flex items-center justify-center text-white"
                          style={{ backgroundColor: b.categoryColor || '#0047FF' }}
                        >
                          <CategoryIcon name={b.categoryIcon} className="h-3 w-3" />
                        </div>
                        <span className="font-bold text-charcoal">{b.categoryName}</span>
                      </div>
                      <span className="font-bold text-[#0047FF]">{formatCurrency(b.amount)}/mo</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Peer Debt Ledgers */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-pencil uppercase tracking-wider">
                Peer Debt & Lending ({inspectDetail.loans?.length || 0})
              </h4>
              <div className="neu-inset rounded-xl max-h-44 overflow-y-auto divide-y divide-[#D8D2C6]/60">
                {!inspectDetail.loans || inspectDetail.loans.length === 0 ? (
                  <p className="p-4 text-xs text-pencil text-center">No peer debt ledgers found.</p>
                ) : (
                  inspectDetail.loans.map((l) => (
                    <div key={l.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-charcoal">{l.contactName}</p>
                        <p className="text-[10px] text-pencil">
                          {l.type === 'GIVEN' ? 'Lent out' : 'Borrowed from'} • Date: {formatDate(l.loanDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-charcoal">{formatCurrency(l.amount)}</p>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            l.status === 'SETTLED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
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
