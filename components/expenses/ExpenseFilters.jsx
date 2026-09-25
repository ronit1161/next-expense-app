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
        {/* Horizontal Category Strip */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-4 py-2 text-xs font-heading font-black uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer rounded-2xl ${
              categoryId === ''
                ? 'clay-btn-primary'
                : 'clay-btn-secondary'
            }`}
          >
            All Sectors
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(String(cat.id))}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-heading font-black whitespace-nowrap shrink-0 transition-all cursor-pointer rounded-2xl ${
                categoryId === String(cat.id)
                  ? 'clay-btn-primary'
                  : 'clay-btn-secondary'
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
          className={`p-3 text-xs font-heading font-black flex items-center justify-center shrink-0 transition-all cursor-pointer rounded-2xl shadow-sm ${
            showFilters || startDate || endDate
              ? 'clay-btn-primary'
              : 'clay-btn-secondary'
          }`}
          title="Date Filter"
          aria-label="Toggle date filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Date Filter Drawer */}
      {showFilters && (
        <div className="clay-card p-5 space-y-4 rounded-[28px] animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-heading font-black text-charcoal uppercase tracking-wider block mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="clay-input block w-full py-2.5 px-3.5 text-xs font-medium rounded-xl"
              />
            </div>
            <div>
              <label className="text-xs font-heading font-black text-charcoal uppercase tracking-wider block mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="clay-input block w-full py-2.5 px-3.5 text-xs font-medium rounded-xl"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end pt-3 border-t border-purple-500/10">
              <button
                onClick={onResetFilters}
                className="clay-btn-secondary px-4 py-2 text-xs font-heading font-black flex items-center gap-1.5 text-rose-600 rounded-xl"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
