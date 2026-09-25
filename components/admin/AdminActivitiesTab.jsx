import { Search, Loader2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
      <div className="clay-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={activitySearch}
            onChange={(e) => {
              setActivitySearch(e.target.value);
              setActivityPage(1);
            }}
            placeholder="Search transaction or user..."
            className="clay-input w-full pl-11 pr-4 py-3 text-xs font-semibold rounded-2xl"
          />
        </div>
        <p className="text-xs font-bold text-[var(--text-muted)] self-end sm:self-auto">
          Page {activityPage} of {totalActivityPages}
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="clay-card rounded-[32px] overflow-hidden p-3 sm:p-4">
        <div className="divide-y divide-[var(--clay-border)]">
          {loadingActivities ? (
            <div className="p-12 text-center text-[var(--text-muted)]">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-violet-500 mb-2" />
              <p className="text-xs font-bold">Streaming real-time audit logs...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-12 text-center text-xs font-bold text-[var(--text-muted)]">
              No platform activity found matching your query.
            </div>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-muted)] transition-colors rounded-2xl"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 clay-orb flex items-center justify-center text-white shrink-0">
                    <CategoryIcon iconName={a.categoryIcon} className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-[var(--text-primary)]">
                      {a.description || a.categoryName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-1 flex-wrap">
                      <span className="font-bold text-violet-600 dark:text-violet-400">{a.userName}</span>
                      <span>•</span>
                      <span>{a.userEmail}</span>
                      <span>•</span>
                      <span>{formatDate(a.expenseDate)}</span>
                      <span>•</span>
                      <span className="clay-badge-pill text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 py-0.5">
                        {a.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className="font-black text-sm text-rose-600 dark:text-rose-400 shrink-0"
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                >
                  -{formatCurrency(a.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalActivityPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-[var(--clay-border)] bg-[var(--bg-muted)]/50 rounded-b-[24px] mt-2">
            <button
              disabled={activityPage <= 1}
              onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
              className="clay-btn-secondary px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              Page {activityPage} of {totalActivityPages}
            </span>
            <button
              disabled={activityPage >= totalActivityPages}
              onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
              className="clay-btn-secondary px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
