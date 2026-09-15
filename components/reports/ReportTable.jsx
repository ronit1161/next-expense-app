'use client';

import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export default function ReportTable({ reportType, data = [], error, onRetry }) {
  return (
    <div className="neu-card overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#DFDBD3]/40 dark:border-[#252A36]">
        <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">
          Statement Preview ({data.length} records)
        </h3>
        <span className="text-[11px] font-mono text-pencil">INR (₹)</span>
      </div>

      {error ? (
        <div className="p-8 text-center space-y-3">
          <p className="text-xs text-rose-600 font-medium">{error}</p>
          <button
            onClick={onRetry}
            className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-charcoal cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry Query</span>
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-xs text-pencil">
          No report data available for the specified criteria.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< 640px): Stacked Statement Cards */}
          <div className="block sm:hidden divide-y divide-[#DFDBD3]/30 dark:divide-[#252A36]">
            {reportType === 'expenses' &&
              data.map((exp, idx) => (
                <div key={exp.id || `exp-${idx}`} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon iconName={exp.categoryIcon} className="h-3.5 w-3.5 text-pencil" />
                      <span className="font-bold text-xs text-charcoal">{exp.description || exp.categoryName}</span>
                    </div>
                    <span className="text-xs font-bold text-charcoal tabular-nums">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-pencil">
                    <span>{exp.categoryName} • {exp.paymentMethod.replace('_', ' ')}</span>
                    <span>{formatDate(exp.expenseDate)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'categories' &&
              data.map((cat, idx) => (
                <div key={cat.categoryId || cat.id || `cat-${idx}`} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.categoryColor }} />
                    <span className="font-semibold text-xs text-charcoal">{cat.categoryName}</span>
                  </div>
                  <span className="font-bold text-xs text-charcoal tabular-nums">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))}

            {reportType === 'budgets' &&
              data.map((b, idx) => (
                <div key={b.budgetId || b.id || b.categoryId || `budget-${idx}`} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-charcoal">{b.categoryName}</span>
                    <span className={`text-xs font-bold tabular-nums ${b.isOverBudget ? 'text-rose-600' : 'text-charcoal'}`}>
                      {b.utilizationPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-pencil">
                    <span>Cap: {formatCurrency(b.budgetLimit)}</span>
                    <span>Spent: {formatCurrency(b.spentAmount)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'loans' &&
              data.map((l, idx) => (
                <div key={l.id || `loan-${idx}`} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-charcoal">{l.contactName}</span>
                    <span className={`text-[10px] font-bold ${l.type === 'LENT' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {l.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-pencil">
                    <span>Principal: {formatCurrency(l.amount)}</span>
                    <span className="font-bold text-charcoal tabular-nums">Rem: {formatCurrency(l.remainingAmount)}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* DESKTOP/TABLET VIEW (>= 640px): Standard Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DFDBD3]/40 dark:border-[#252A36] text-[10px] font-bold uppercase tracking-wider text-pencil bg-[#E5E1D9]/40 dark:bg-[#12151F]">
                  {reportType === 'expenses' && (
                    <>
                      <th className="py-3 px-5">Expense Details</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-5 text-right">Amount</th>
                    </>
                  )}
                  {reportType === 'categories' && (
                    <>
                      <th className="py-3 px-5">Category</th>
                      <th className="py-3 px-5 text-right">Total Aggregate Spend</th>
                    </>
                  )}
                  {reportType === 'budgets' && (
                    <>
                      <th className="py-3 px-5">Category</th>
                      <th className="py-3 px-4">Budget Cap</th>
                      <th className="py-3 px-4">Spent</th>
                      <th className="py-3 px-4">Remaining</th>
                      <th className="py-3 px-5 text-right">Utilization</th>
                    </>
                  )}
                  {reportType === 'loans' && (
                    <>
                      <th className="py-3 px-5">Contact</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Principal</th>
                      <th className="py-3 px-4">Remaining</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-5 text-right">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFDBD3]/30 dark:divide-[#252A36]">
                {reportType === 'expenses' &&
                  data.map((exp, idx) => (
                    <tr key={exp.id || `exp-row-${idx}`} className="hover:bg-[#FFFFFF]/25 dark:hover:bg-[#FFFFFF]/5 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-charcoal">
                        <div className="flex items-center gap-2.5">
                          <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4 text-pencil" />
                          <span>{exp.description || exp.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-pencil">
                        {exp.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 text-pencil font-medium">
                        {formatDate(exp.expenseDate)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-charcoal tabular-nums">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'categories' &&
                  data.map((cat, idx) => (
                    <tr key={cat.categoryId || cat.id || `cat-row-${idx}`} className="hover:bg-[#FFFFFF]/25 dark:hover:bg-[#FFFFFF]/5 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: cat.categoryColor }}
                          />
                          <span className="font-semibold text-charcoal">{cat.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-charcoal tabular-nums">
                        {formatCurrency(cat.total)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'budgets' &&
                  data.map((b, idx) => (
                    <tr key={b.budgetId || b.id || b.categoryId || `budget-row-${idx}`} className="hover:bg-[#FFFFFF]/25 dark:hover:bg-[#FFFFFF]/5 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <CategoryIcon iconName={b.categoryIcon} className="h-4 w-4 text-pencil" />
                          <span className="font-semibold text-charcoal">{b.categoryName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-pencil font-medium tabular-nums">
                        {formatCurrency(b.budgetLimit)}
                      </td>
                      <td className="py-3.5 px-4 text-charcoal font-semibold tabular-nums">
                        {formatCurrency(b.spentAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-600 font-semibold tabular-nums">
                        {formatCurrency(b.remainingAmount)}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span
                          className={`font-bold tabular-nums ${
                            b.isOverBudget ? 'text-rose-600' : 'text-charcoal'
                          }`}
                        >
                          {b.utilizationPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}

                {reportType === 'loans' &&
                  data.map((l, idx) => (
                    <tr key={l.id || `loan-row-${idx}`} className="hover:bg-[#FFFFFF]/25 dark:hover:bg-[#FFFFFF]/5 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-charcoal">{l.contactName}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold text-[11px] ${
                            l.type === 'LENT' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-pencil tabular-nums">{formatCurrency(l.amount)}</td>
                      <td className="py-3.5 px-4 font-bold text-charcoal tabular-nums">
                        {formatCurrency(l.remainingAmount)}
                      </td>
                      <td className="py-3.5 px-4 text-pencil">{formatDate(l.loanDate)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="inline-flex rounded-md neu-inset px-2.5 py-0.5 text-[10px] font-semibold text-charcoal">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
