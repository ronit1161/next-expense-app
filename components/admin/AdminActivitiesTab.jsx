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
    <div className="space-y-4 animate-fadeIn">
      {/* Stream Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil" />
          <input
            type="text"
            value={activitySearch}
            onChange={(e) => {
              setActivitySearch(e.target.value);
              setActivityPage(1);
            }}
            placeholder="SEARCH TRANSACTION OR USER..."
            className="swiss-input w-full pl-10 pr-4 py-2 text-xs font-mono uppercase"
          />
        </div>
        <p className="text-xs font-mono text-pencil self-end sm:self-auto uppercase">
          PAGE {activityPage} OF {totalActivityPages}
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] overflow-hidden">
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {loadingActivities ? (
            <div className="p-8 text-center text-pencil">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#FF3000] mb-2" />
              <p className="text-xs font-mono uppercase font-black">STREAMING REAL-TIME AUDIT LOGS...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-pencil uppercase">
              NO PLATFORM ACTIVITY FOUND MATCHING QUERY.
            </div>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                    <CategoryIcon iconName={a.categoryIcon} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-black text-xs text-charcoal uppercase">{a.description || a.categoryName}</p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-pencil uppercase mt-0.5">
                      <span className="font-bold text-charcoal">{a.userName}</span>
                      <span>•</span>
                      <span>{a.userEmail}</span>
                      <span>•</span>
                      <span>{formatDate(a.expenseDate)}</span>
                      <span>•</span>
                      <span className="border border-current px-1">
                        {a.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="font-black text-xs font-mono text-[#FF3000] shrink-0">
                  -{formatCurrency(a.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalActivityPages > 1 && (
          <div className="p-3 flex items-center justify-between border-t-2 border-black dark:border-white/20 bg-[var(--bg-subtle)]">
            <button
              disabled={activityPage <= 1}
              onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
              className="swiss-btn px-3 py-1 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> PREVIOUS
            </button>
            <span className="text-xs font-mono text-pencil uppercase font-bold">
              PAGE {activityPage} OF {totalActivityPages}
            </span>
            <button
              disabled={activityPage >= totalActivityPages}
              onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
              className="swiss-btn px-3 py-1 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              NEXT <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
