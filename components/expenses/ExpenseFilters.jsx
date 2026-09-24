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
      <div className="flex items-center gap-2 w-full min-w-0">
        {/* Horizontal Category Strip */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none no-scrollbar">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer border-2 ${
              categoryId === ''
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'border-black dark:border-white/30 text-charcoal hover:bg-black hover:text-white'
            }`}
          >
            ALL SECTORS
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(String(cat.id))}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase whitespace-nowrap shrink-0 transition-all cursor-pointer border-2 ${
                categoryId === String(cat.id)
                  ? 'bg-[#FF3000] text-white border-[#FF3000]'
                  : 'border-black dark:border-white/30 text-charcoal hover:border-[#FF3000] hover:text-[#FF3000]'
              }`}
            >
              <CategoryIcon iconName={cat.icon} className="h-3 w-3" />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Date Filter Drawer Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 border-2 text-xs font-black flex items-center justify-center shrink-0 transition-all cursor-pointer relative ${
            showFilters || startDate || endDate
              ? 'bg-[#FF3000] text-white border-[#FF3000]'
              : 'border-black dark:border-white/30 text-charcoal hover:bg-black hover:text-white'
          }`}
          title="Date Filter"
          aria-label="Toggle date filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Date Filter Drawer */}
      {showFilters && (
        <div className="border-4 border-black dark:border-white/30 p-4 space-y-3 bg-[var(--bg-surface)] animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-charcoal uppercase tracking-widest block mb-1">
                START DATE
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-charcoal uppercase tracking-widest block mb-1">
                END DATE
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="swiss-input block w-full py-2 px-3 text-xs font-mono"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end pt-2 border-t border-black/10 dark:border-white/10">
              <button
                onClick={onResetFilters}
                className="swiss-btn px-3 py-1.5 text-xs font-black flex items-center gap-1.5 text-[#FF3000]"
              >
                <RotateCcw className="h-3 w-3" />
                <span>RESET ALL FILTERS</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
