import { Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminActivitiesTab({
  activities,
  loadingActivities,
  activitySearch,
  setActivitySearch,
  activityPage,
  setActivityPage,
  totalActivityPages,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stream Search */}
      <div className="fintech-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={activitySearch}
            onChange={(e) => {
              setActivitySearch(e.target.value);
              setActivityPage(1);
            }}
            placeholder="Search transaction or user..."
            className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
          />
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 self-end sm:self-auto">
          Page {activityPage} of {totalActivityPages}
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="fintech-card rounded-2xl overflow-hidden p-3 sm:p-4">
        <div className="divide-y divide-slate-100 dark:divide-white/5">
          {loadingActivities ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600 mb-2" />
              <p className="text-xs font-semibold">Streaming real-time audit logs...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center text-xs font-semibold text-slate-400">
              No platform activity found matching your query.
            </div>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                    <CategoryIcon iconName={a.categoryIcon} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">
                      {a.description || a.categoryName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{a.userName}</span>
                      <span>&bull;</span>
                      <span>{a.userEmail}</span>
                      <span>&bull;</span>
                      <span>{formatDate(a.expenseDate)}</span>
                      <span>&bull;</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-medium">
                        {a.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="font-black text-xs text-slate-900 dark:text-white tabular-nums shrink-0">
                  {formatCurrency(a.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalActivityPages > 1 && (
          <div className="p-3.5 flex items-center justify-between border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] rounded-b-xl mt-2">
            <button
              disabled={activityPage <= 1}
              onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Page {activityPage} of {totalActivityPages}
            </span>
            <button
              disabled={activityPage >= totalActivityPages}
              onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
