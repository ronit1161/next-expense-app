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
            placeholder="Search transaction or user..."
            className="neu-input w-full pl-10 pr-4 py-2 text-xs text-charcoal placeholder:text-pencil rounded-xl"
          />
        </div>
        <p className="text-xs text-pencil self-end sm:self-auto">
          Page {activityPage} of {totalActivityPages}
        </p>
      </div>

      {/* Activity Timeline List */}
      <div className="neu-card rounded-2xl overflow-hidden border border-[#D8D2C6]/50">
        <div className="divide-y divide-[#E0DBD0]">
          {loadingActivities ? (
            <div className="p-8 text-center text-pencil">
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#0047FF] mb-2" />
              Loading platform activity stream...
            </div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-pencil">
              No platform activity found matching your search.
            </div>
          ) : (
            activities.map((a) => (
              <div
                key={a.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-[#E2DDD4]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center neu-card-sm text-white shrink-0"
                    style={{ backgroundColor: a.categoryColor || '#0047FF' }}
                  >
                    <CategoryIcon name={a.categoryIcon} className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-charcoal">{a.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-pencil mt-0.5">
                      <span className="font-semibold text-charcoal">{a.userName}</span>
                      <span>•</span>
                      <span>{a.userEmail}</span>
                      <span>•</span>
                      <span>{formatDate(a.expenseDate)}</span>
                      <span>•</span>
                      <span className="uppercase text-[9px] px-1 rounded bg-[#D8D2C6]/50">
                        {a.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="font-bold text-xs text-loss shrink-0">
                  -{formatCurrency(a.amount)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalActivityPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-[#D8D2C6] bg-[#EAE6DF]">
            <button
              disabled={activityPage <= 1}
              onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
              className="neu-btn-sm px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span className="text-xs text-pencil">
              Page {activityPage} of {totalActivityPages}
            </span>
            <button
              disabled={activityPage >= totalActivityPages}
              onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
              className="neu-btn-sm px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
