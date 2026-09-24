'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardCategoryBreakdown({ categoryBreakdown = [], totalMonthSpent = 0 }) {
  const totalMonth = totalMonthSpent || 1;

  return (
    <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] p-6 space-y-4 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white/20 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
              01.3 ALLOCATION
            </span>
            <h2 className="text-sm font-black uppercase tracking-tight text-charcoal">
              CATEGORY BREAKDOWN
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold text-pencil uppercase">
            {categoryBreakdown.length} SECTORS
          </span>
        </div>

        {categoryBreakdown.length > 0 ? (
          <div className="space-y-4 pt-4">
            {categoryBreakdown.map((cat, idx) => {
              const percent = Math.round((cat.total / totalMonth) * 100);

              return (
                <div key={cat.categoryId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-black text-charcoal uppercase">
                      {idx + 1}. {cat.categoryName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-pencil">{percent}%</span>
                      <span className="font-bold text-charcoal">{formatCurrency(cat.total)}</span>
                    </div>
                  </div>
                  {/* Solid Sharp Progress Bar */}
                  <div className="border border-black dark:border-white/20 bg-[var(--bg-subtle)] h-2.5 p-0.5">
                    <div
                      className="h-full bg-black dark:bg-white transition-all duration-300"
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] p-6 text-center space-y-3 mt-4">
            <p className="text-xs font-mono text-pencil uppercase">NO EXPENDITURES RECORDED</p>
            <Link
              href="/expenses?action=add"
              className="swiss-btn-accent px-3 py-1.5 text-xs font-black"
            >
              <Plus className="h-3 w-3 mr-1" />
              <span>LOG FIRST RECORD</span>
            </Link>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-pencil uppercase">
        <span>AGGREGATE:</span>
        <span className="font-bold text-charcoal">{formatCurrency(totalMonthSpent)}</span>
      </div>
    </div>
  );
}
