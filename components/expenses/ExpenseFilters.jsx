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
    <div className="space-y-2.5 w-full min-w-0">
      <div className="flex items-center gap-2.5 w-full min-w-0">
        {/* Horizontal Category Strip */}
        <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none no-scrollbar">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[36px] flex items-center rounded-xl ${
              categoryId === ''
                ? 'neu-inset text-[#0047FF] font-bold'
                : 'neu-btn text-pencil hover:text-charcoal'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(String(cat.id))}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[36px] rounded-xl ${
                categoryId === String(cat.id)
                  ? 'neu-inset text-[#0047FF] font-bold'
                  : 'neu-btn text-pencil hover:text-charcoal'
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
          className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center shrink-0 min-h-[36px] min-w-[36px] transition-all cursor-pointer relative ${
            showFilters || startDate || endDate
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-pencil hover:text-charcoal'
          }`}
          title="Date Filter"
          aria-label="Toggle date filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {(startDate || endDate) && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#0047FF] shadow-[0_0_6px_rgba(0,71,255,0.7)]" />
          )}
        </button>
      </div>

      {/* Date Filter Drawer */}
      {showFilters && (
        <div className="neu-card p-4 rounded-2xl space-y-3 bg-[var(--bg-main)] animate-fadeIn">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="neu-input block w-full py-2 px-3 text-xs min-h-[38px]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-pencil uppercase tracking-wider block mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="neu-input block w-full py-2 px-3 text-xs min-h-[38px]"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end pt-1">
              <button
                onClick={onResetFilters}
                className="neu-btn px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-[11px] font-semibold text-pencil hover:text-charcoal cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
