'use client';

import Link from 'next/link';
import { ArrowRight, Receipt, Plus } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardRecentTransactions({ transactions = [] }) {
  return (
    <div className="fintech-card p-6 sm:p-7 rounded-[28px] space-y-4">
      {/* Header matching Reference Image 1 */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-clay)]">
        <div>
          <h2 className="font-heading font-black text-base text-[var(--text-primary)]">
            Recent Transaction
          </h2>
          <p className="text-[11px] text-[var(--text-muted)]">Latest monetary activity</p>
        </div>
        <Link
          href="/expenses"
          className="text-xs font-bold text-[var(--brand-accent)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View all</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="divide-y divide-[var(--border-clay)]">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="py-3.5 flex items-center justify-between gap-3 group hover:bg-[var(--bg-recessed)]/50 -mx-2 px-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: tx.categoryColor || '#181B26' }}
                >
                  <CategoryIcon iconName={tx.categoryIcon} className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                    {tx.description || tx.categoryName}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] truncate flex items-center gap-1.5 mt-0.5">
                    <span>{tx.categoryName}</span>
                    <span>&bull;</span>
                    <span>{formatDate(tx.expenseDate)}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-heading font-black text-sm text-[var(--text-primary)] tabular-nums">
                  -{formatCurrency(tx.amount)}
                </span>
                <span className="block text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">
                  {tx.paymentMethod?.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center space-y-3 rounded-2xl bg-[var(--bg-recessed)]">
          <div className="h-10 w-10 rounded-full bg-[var(--bg-card)] border border-[var(--border-clay)] flex items-center justify-center text-[var(--text-muted)] mx-auto">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-xs text-[var(--text-muted)] font-medium">No transactions recorded yet.</p>
          <Link
            href="/expenses?action=add"
            className="fintech-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Record First Expense</span>
          </Link>
        </div>
      )}
    </div>
  );
}
