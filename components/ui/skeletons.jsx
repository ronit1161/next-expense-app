export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#DFDBD3] ${className}`}
      aria-hidden="true"
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn" aria-label="Loading dashboard overview...">
      {/* 1. Top Neumorphic Hero Skeleton */}
      <div className="neu-card p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 sm:h-12 sm:w-80" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* 2. Three Compact Stat Tiles Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="neu-card-sm p-4 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
        <div className="neu-card-sm p-4 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="neu-card-sm p-4 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* 3. Category Breakdown Skeleton */}
      <div className="neu-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#DFDBD3]/40">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Spending Trajectory Chart Skeleton */}
      <div className="neu-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#DFDBD3]/40">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="h-48 sm:h-56 flex items-end justify-between gap-3 pt-6 px-4">
          <Skeleton className="h-1/3 w-full rounded-t-lg" />
          <Skeleton className="h-2/3 w-full rounded-t-lg" />
          <Skeleton className="h-1/2 w-full rounded-t-lg" />
          <Skeleton className="h-4/5 w-full rounded-t-lg" />
          <Skeleton className="h-3/5 w-full rounded-t-lg" />
          <Skeleton className="h-full w-full rounded-t-lg" />
        </div>
      </div>
    </div>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn" aria-label="Loading transactions...">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
      </div>

      {/* Category Pills Skeleton */}
      <div className="flex items-center gap-2 overflow-x-hidden py-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-xl shrink-0" />
        ))}
      </div>

      {/* Timeline Rows Skeleton */}
      <div className="space-y-6 pt-2">
        {[1, 2].map((group) => (
          <div key={group} className="space-y-2">
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="neu-card divide-y divide-[#DFDBD3]/30">
              {[1, 2, 3].map((row) => (
                <div key={row} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BudgetMetersSkeleton() {
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn" aria-label="Loading budget meters...">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="neu-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DebtsLedgerSkeleton() {
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn" aria-label="Loading peer ledger...">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3 w-60" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="neu-card p-5 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="neu-card p-5 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
      </div>

      <div className="neu-card p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportsStatementSkeleton() {
  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn" aria-label="Loading reports statement...">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>

      <div className="neu-card overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFDBD3]/40">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-16" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#DFDBD3]/20">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
