'use client';

import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RefreshCw, FileText } from 'lucide-react';

export default function ReportTable({ reportType, data = [], error, onRetry }) {
  return (
    <div className="fintech-card rounded-2xl overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">
            Statement Preview &bull; {data.length} Records
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Base Currency: INR (₹)</span>
      </div>

      {error ? (
        <div className="p-8 text-center space-y-3">
          <p className="text-xs text-rose-500 font-bold">{error}</p>
          <button
            onClick={onRetry}
            className="fintech-btn-primary inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Query</span>
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 font-medium">
          No report records found for the selected timeframe.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< 640px): Stacked Statement Cards */}
          <div className="block sm:hidden divide-y divide-slate-100 dark:divide-white/5">
            {reportType === 'expenses' &&
              data.map((exp, idx) => (
                <div key={exp.id || `exp-${idx}`} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                        <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[170px]">
                        {exp.description || exp.categoryName}
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{exp.categoryName} &bull; {exp.paymentMethod.replace('_', ' ')}</span>
                    <span>{formatDate(exp.expenseDate)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'categories' &&
              data.map((cat, idx) => (
                <div key={cat.categoryId || cat.id || `cat-${idx}`} className="p-4 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{cat.categoryName}</span>
                  <span className="font-black text-sm text-slate-900 dark:text-white tabular-nums">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))}

            {reportType === 'budgets' &&
              data.map((b, idx) => (
                <div key={b.budgetId || b.id || b.categoryId || `budget-${idx}`} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{b.categoryName}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full tabular-nums ${b.isOverBudget ? 'bg-rose-500/15 text-rose-600 border border-rose-500/20' : 'bg-teal-500/15 text-teal-600 border border-teal-500/20'}`}>
                      {b.utilizationPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Cap: {formatCurrency(b.budgetLimit)}</span>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">Spent: {formatCurrency(b.spentAmount)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'loans' &&
              data.map((l, idx) => (
                <div key={l.id || `loan-${idx}`} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{l.contactName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${l.type === 'LENT' ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-600 border border-amber-500/20'}`}>
                      {l.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Principal: {formatCurrency(l.amount)}</span>
                    <span className="font-black text-slate-900 dark:text-white tabular-nums">Rem: {formatCurrency(l.remainingAmount)}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* DESKTOP/TABLET VIEW (>= 640px): Full Statement Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
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
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {reportType === 'expenses' &&
                  data.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                            <CategoryIcon iconName={exp.categoryIcon} className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{exp.description || exp.categoryName}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{exp.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">{exp.paymentMethod.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{formatDate(exp.expenseDate)}</td>
                      <td className="py-3.5 px-6 text-right font-black text-slate-900 dark:text-white tabular-nums text-sm">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'categories' &&
                  data.map((cat) => (
                    <tr key={cat.categoryId} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{cat.categoryName}</td>
                      <td className="py-3.5 px-6 text-right font-black text-slate-900 dark:text-white tabular-nums text-sm">
                        {formatCurrency(cat.total)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'budgets' &&
                  data.map((b) => (
                    <tr key={b.budgetId} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{b.categoryName}</td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(b.budgetLimit)}</td>
                      <td className="py-3.5 px-4 tabular-nums font-black text-slate-900 dark:text-white">{formatCurrency(b.spentAmount)}</td>
                      <td className="py-3.5 px-4 tabular-nums font-bold text-teal-600 dark:text-teal-400">
                        {formatCurrency(b.remainingAmount)}
                      </td>
                      <td className="py-3.5 px-6 text-right tabular-nums">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-xs ${
                            b.isOverBudget
                              ? 'bg-rose-500/15 text-rose-600 border border-rose-500/20'
                              : 'bg-teal-500/15 text-teal-600 border border-teal-500/20'
                          }`}
                        >
                          {b.utilizationPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}

                {reportType === 'loans' &&
                  data.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white">{l.contactName}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            l.type === 'LENT' ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-600 border border-amber-500/20'
                          }`}
                        >
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 tabular-nums text-slate-700 dark:text-slate-300 font-medium">{formatCurrency(l.amount)}</td>
                      <td className="py-3.5 px-4 font-black tabular-nums text-slate-900 dark:text-white">{formatCurrency(l.remainingAmount)}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{formatDate(l.loanDate)}</td>
                      <td className="py-3.5 px-6 text-right font-bold text-slate-900 dark:text-white uppercase">{l.status}</td>
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
