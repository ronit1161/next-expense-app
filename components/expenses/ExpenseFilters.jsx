'use client';

import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';

export default function ExpenseFilters({
  categories = [],
  categoryId,
  onCategoryChange,
  showFilters,
  setShowFilters,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onResetFilters,
}) {
  const hasActiveFilters = Boolean(categoryId || startDate || endDate);

  return (
    <div className="space-y-3 w-full min-w-0">
      <div className="flex items-center gap-2.5 w-full min-w-0">
        {/* Horizontal Category Pill Strip */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3.5 py-1.5 text-xs font-heading font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer rounded-full ${
              categoryId === ''
                ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                : 'fintech-btn-secondary'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(String(cat.id))}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-heading font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer rounded-full ${
                categoryId === String(cat.id)
                  ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
                  : 'fintech-btn-secondary'
              }`}
            >
              <CategoryIcon iconName={cat.icon} className="h-3.5 w-3.5" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Date Filter Drawer Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`h-9 w-9 text-xs font-bold flex items-center justify-center shrink-0 transition-all cursor-pointer rounded-full ${
            showFilters || startDate || endDate
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-xs'
              : 'fintech-btn-secondary'
          }`}
          title="Date Filter"
          aria-label="Toggle date filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Date Filter Drawer */}
      {showFilters && (
        <div className="fintech-card p-4 space-y-4 rounded-2xl animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="fintech-input block w-full py-2 px-3 text-xs font-medium rounded-xl"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="fintech-input block w-full py-2 px-3 text-xs font-medium rounded-xl"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end pt-2 border-t border-[var(--border-clay)]">
              <button
                onClick={onResetFilters}
                className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
