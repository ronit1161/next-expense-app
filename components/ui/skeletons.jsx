export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-[var(--bg-muted)] clay-sunken ${className}`}
      aria-hidden="true"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn" aria-label="Loading dashboard overview...">
      {/* 1. Top Clay Hero Skeleton */}
      <div className="clay-card p-6 sm:p-8 space-y-4 rounded-[36px]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-64 sm:h-14 sm:w-80" />
          <Skeleton className="h-4 w-44" />
        </div>
      </div>

      {/* 2. Three Compact Stat Tiles Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="clay-card p-6 space-y-3 rounded-[28px]">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="clay-card p-6 space-y-3 rounded-[28px]">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="clay-card p-6 space-y-3 rounded-[28px]">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* 3. Category Breakdown Skeleton */}
      <div className="clay-card p-6 sm:p-8 space-y-5 rounded-[32px]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Spending Trajectory Chart Skeleton */}
      <div className="clay-card p-6 sm:p-8 space-y-5 rounded-[32px]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="h-52 sm:h-64 flex items-end justify-between gap-4 pt-6 px-4">
          <Skeleton className="h-1/3 w-full rounded-2xl" />
          <Skeleton className="h-2/3 w-full rounded-2xl" />
          <Skeleton className="h-1/2 w-full rounded-2xl" />
          <Skeleton className="h-4/5 w-full rounded-2xl" />
          <Skeleton className="h-3/5 w-full rounded-2xl" />
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-fadeIn" aria-label="Loading transactions...">
      {/* Header Skeleton */}
      <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[36px]">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-52" />
        </div>
        <Skeleton className="h-14 w-full sm:w-44 rounded-2xl" />
      </div>

      {/* Filter Toolbar Skeleton */}
      <div className="clay-card p-4 sm:p-6 flex items-center gap-3 overflow-x-hidden rounded-[28px]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-2xl shrink-0" />
        ))}
      </div>

      {/* Timeline Rows Skeleton */}
      <div className="clay-card p-4 sm:p-6 space-y-4 rounded-[32px]">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="p-4 flex items-center justify-between rounded-2xl bg-[var(--bg-muted)]/50">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetMetersSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-fadeIn" aria-label="Loading budget meters...">
      <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[36px]">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-52" />
        </div>
        <Skeleton className="h-14 w-full sm:w-44 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="clay-card p-6 space-y-4 rounded-[28px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DebtsLedgerSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-fadeIn" aria-label="Loading peer ledger...">
      <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[36px]">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-52" />
        </div>
        <Skeleton className="h-14 w-full sm:w-44 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="clay-card p-6 space-y-3 rounded-[28px]">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-36" />
        </div>
        <div className="clay-card p-6 space-y-3 rounded-[28px]">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-36" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="clay-card p-6 space-y-4 rounded-[28px]">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-7 w-20 rounded-xl" />
              <Skeleton className="h-7 w-20 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsStatementSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-fadeIn" aria-label="Loading reports statement...">
      <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[36px]">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-52" />
        </div>
        <Skeleton className="h-14 w-full sm:w-44 rounded-2xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="clay-card p-6 rounded-[28px]">
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      <div className="clay-card p-6 sm:p-8 space-y-5 rounded-[32px]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--clay-border)]">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-20" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-[var(--clay-border)]">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}
