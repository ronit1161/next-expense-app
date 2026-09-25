'use client';

import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RefreshCw, FileText } from 'lucide-react';

export default function ReportTable({ reportType, data = [], error, onRetry }) {
  return (
    <div className="clay-card rounded-[32px] overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-purple-500/10 bg-white/40 dark:bg-black/10">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-purple-600" />
          <h3 className="text-xs font-heading font-black text-charcoal tracking-wide">
            Statement Preview &bull; {data.length} Records
          </h3>
        </div>
        <span className="text-[11px] font-heading font-bold text-pencil">Base Currency: INR (₹)</span>
      </div>

      {error ? (
        <div className="p-8 text-center space-y-3">
          <p className="text-xs text-rose-600 font-heading font-black">{error}</p>
          <button
            onClick={onRetry}
            className="clay-btn-primary inline-flex items-center gap-2 px-5 py-2 text-xs font-heading font-black rounded-xl cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Query</span>
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-xs text-pencil font-medium">
          No report records found for the selected timeframe.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< 640px): Stacked Statement Cards */}
          <div className="block sm:hidden divide-y divide-purple-500/10">
            {reportType === 'expenses' &&
              data.map((exp, idx) => (
                <div key={exp.id || `exp-${idx}`} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white clay-orb shadow-sm">
                        <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4" />
                      </div>
                      <span className="font-heading font-black text-xs text-charcoal truncate max-w-[170px]">
                        {exp.description || exp.categoryName}
                      </span>
                    </div>
                    <span className="text-xs font-heading font-black text-charcoal tabular-nums">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-pencil font-medium">
                    <span>{exp.categoryName} &bull; {exp.paymentMethod.replace('_', ' ')}</span>
                    <span>{formatDate(exp.expenseDate)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'categories' &&
              data.map((cat, idx) => (
                <div key={cat.categoryId || cat.id || `cat-${idx}`} className="p-4 flex items-center justify-between">
                  <span className="font-heading font-black text-xs text-charcoal">{cat.categoryName}</span>
                  <span className="font-heading font-black text-xs text-charcoal tabular-nums">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))}

            {reportType === 'budgets' &&
              data.map((b, idx) => (
                <div key={b.budgetId || b.id || b.categoryId || `budget-${idx}`} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-charcoal">{b.categoryName}</span>
                    <span className={`text-xs font-heading font-black px-2 py-0.5 rounded-full ${b.isOverBudget ? 'bg-rose-500 text-white' : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'}`}>
                      {b.utilizationPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-pencil font-medium">
                    <span>Cap: {formatCurrency(b.budgetLimit)}</span>
                    <span>Spent: {formatCurrency(b.spentAmount)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'loans' &&
              data.map((l, idx) => (
                <div key={l.id || `loan-${idx}`} className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-black text-xs text-charcoal">{l.contactName}</span>
                    <span className={`text-[10px] font-heading font-black px-2 py-0.5 rounded-full ${l.type === 'LENT' ? 'bg-emerald-500 text-white' : 'bg-pink-500 text-white'}`}>
                      {l.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-pencil font-medium">
                    <span>Principal: {formatCurrency(l.amount)}</span>
                    <span className="font-heading font-black text-charcoal tabular-nums">Rem: {formatCurrency(l.remainingAmount)}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* DESKTOP/TABLET VIEW (>= 640px): Full Statement Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/10 text-[11px] font-heading font-black uppercase tracking-wider text-pencil bg-white/40 dark:bg-black/10">
                  {reportType === 'expenses' && (
                    <>
                      <th className="py-3.5 px-6">Details</th>
                      <th className="py-3.5 px-4">Method</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-6 text-right">Amount</th>
                    </>
                  )}
                  {reportType === 'categories' && (
                    <>
                      <th className="py-3.5 px-6">Sector Category</th>
                      <th className="py-3.5 px-6 text-right">Aggregate Spend</th>
                    </>
                  )}
                  {reportType === 'budgets' && (
                    <>
                      <th className="py-3.5 px-6">Category</th>
                      <th className="py-3.5 px-4">Budget Cap</th>
                      <th className="py-3.5 px-4">Spent</th>
                      <th className="py-3.5 px-4">Remaining</th>
                      <th className="py-3.5 px-6 text-right">Utilization</th>
                    </>
                  )}
                  {reportType === 'loans' && (
                    <>
                      <th className="py-3.5 px-6">Contact</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Principal</th>
                      <th className="py-3.5 px-4">Remaining</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-6 text-right">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {reportType === 'expenses' &&
                  data.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white clay-orb shrink-0 shadow-sm">
                            <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-heading font-black text-charcoal">{exp.description || exp.categoryName}</p>
                            <p className="text-[11px] text-pencil font-medium">{exp.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-charcoal">{exp.paymentMethod.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4 text-pencil font-medium">{formatDate(exp.expenseDate)}</td>
                      <td className="py-3.5 px-6 text-right font-heading font-black text-charcoal tabular-nums">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'categories' &&
                  data.map((cat) => (
                    <tr key={cat.categoryId} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-6 font-heading font-black text-charcoal">{cat.categoryName}</td>
                      <td className="py-3.5 px-6 text-right font-heading font-black text-charcoal tabular-nums">
                        {formatCurrency(cat.total)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'budgets' &&
                  data.map((b) => (
                    <tr key={b.budgetId} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-6 font-heading font-black text-charcoal">{b.categoryName}</td>
                      <td className="py-3.5 px-4 tabular-nums font-medium">{formatCurrency(b.budgetLimit)}</td>
                      <td className="py-3.5 px-4 tabular-nums font-medium">{formatCurrency(b.spentAmount)}</td>
                      <td className="py-3.5 px-4 tabular-nums font-heading font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(b.remainingAmount)}
                      </td>
                      <td className="py-3.5 px-6 text-right tabular-nums">
                        <span
                          className={`font-heading font-black px-2.5 py-0.5 rounded-full ${
                            b.isOverBudget
                              ? 'bg-rose-500 text-white'
                              : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                          }`}
                        >
                          {b.utilizationPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}

                {reportType === 'loans' &&
                  data.map((l) => (
                    <tr key={l.id} className="hover:bg-white/60 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-6 font-heading font-black text-charcoal">{l.contactName}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-heading font-black rounded-full ${
                            l.type === 'LENT' ? 'bg-emerald-500 text-white' : 'bg-pink-500 text-white'
                          }`}
                        >
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 tabular-nums font-medium">{formatCurrency(l.amount)}</td>
                      <td className="py-3.5 px-4 font-heading font-black tabular-nums">{formatCurrency(l.remainingAmount)}</td>
                      <td className="py-3.5 px-4 text-pencil font-medium">{formatDate(l.loanDate)}</td>
                      <td className="py-3.5 px-6 text-right font-heading font-black text-charcoal uppercase">{l.status}</td>
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
