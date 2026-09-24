'use client';

import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

export default function ReportTable({ reportType, data = [], error, onRetry }) {
  return (
    <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-5 py-3.5 flex items-center justify-between border-b-2 border-black dark:border-white/20 bg-[var(--bg-subtle)]">
        <h3 className="text-xs font-black text-charcoal uppercase tracking-widest">
          STATEMENT PREVIEW // {data.length} RECORDS
        </h3>
        <span className="text-[10px] font-mono font-bold text-pencil">BASE: INR (₹)</span>
      </div>

      {error ? (
        <div className="p-8 text-center space-y-3">
          <p className="text-xs text-[#FF3000] font-black uppercase">{error}</p>
          <button
            onClick={onRetry}
            className="swiss-btn-accent inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>RETRY QUERY</span>
          </button>
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center text-xs font-mono text-pencil uppercase">
          NO REPORT DATA AVAILABLE FOR SPECIFIED TIMEFRAME.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (< 640px): Stacked Statement Cards */}
          <div className="block sm:hidden divide-y-2 divide-black/10 dark:divide-white/10">
            {reportType === 'expenses' &&
              data.map((exp, idx) => (
                <div key={exp.id || `exp-${idx}`} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon iconName={exp.categoryIcon} className="h-3.5 w-3.5" />
                      <span className="font-black text-xs text-charcoal uppercase truncate max-w-[180px]">
                        {exp.description || exp.categoryName}
                      </span>
                    </div>
                    <span className="text-xs font-black text-charcoal font-mono tabular-nums">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-pencil uppercase">
                    <span>{exp.categoryName} • {exp.paymentMethod.replace('_', ' ')}</span>
                    <span>{formatDate(exp.expenseDate)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'categories' &&
              data.map((cat, idx) => (
                <div key={cat.categoryId || cat.id || `cat-${idx}`} className="p-3.5 flex items-center justify-between">
                  <span className="font-black text-xs text-charcoal uppercase">{cat.categoryName}</span>
                  <span className="font-black text-xs text-charcoal font-mono tabular-nums">
                    {formatCurrency(cat.total)}
                  </span>
                </div>
              ))}

            {reportType === 'budgets' &&
              data.map((b, idx) => (
                <div key={b.budgetId || b.id || b.categoryId || `budget-${idx}`} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-charcoal uppercase">{b.categoryName}</span>
                    <span className={`text-xs font-black font-mono tabular-nums ${b.isOverBudget ? 'text-[#FF3000]' : 'text-charcoal'}`}>
                      {b.utilizationPercentage}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-pencil uppercase">
                    <span>CAP: {formatCurrency(b.budgetLimit)}</span>
                    <span>SPENT: {formatCurrency(b.spentAmount)}</span>
                  </div>
                </div>
              ))}

            {reportType === 'loans' &&
              data.map((l, idx) => (
                <div key={l.id || `loan-${idx}`} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-charcoal uppercase">{l.contactName}</span>
                    <span className={`text-[10px] font-black border px-1 ${l.type === 'LENT' ? 'bg-black text-white' : 'bg-[#FF3000] text-white'}`}>
                      {l.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-pencil uppercase">
                    <span>PRINCIPAL: {formatCurrency(l.amount)}</span>
                    <span className="font-black text-charcoal tabular-nums">REM: {formatCurrency(l.remainingAmount)}</span>
                  </div>
                </div>
              ))}
          </div>

          {/* DESKTOP/TABLET VIEW (>= 640px): Full Swiss Statement Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b-2 border-black dark:border-white/20 text-[10px] font-black uppercase tracking-widest text-charcoal bg-[var(--bg-subtle)]">
                  {reportType === 'expenses' && (
                    <>
                      <th className="py-3 px-5">DETAILS</th>
                      <th className="py-3 px-4">METHOD</th>
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-5 text-right">AMOUNT</th>
                    </>
                  )}
                  {reportType === 'categories' && (
                    <>
                      <th className="py-3 px-5">CATEGORY SECTOR</th>
                      <th className="py-3 px-5 text-right">AGGREGATE SPEND</th>
                    </>
                  )}
                  {reportType === 'budgets' && (
                    <>
                      <th className="py-3 px-5">CATEGORY</th>
                      <th className="py-3 px-4">BUDGET CAP</th>
                      <th className="py-3 px-4">SPENT</th>
                      <th className="py-3 px-4">REMAINING</th>
                      <th className="py-3 px-5 text-right">UTILIZATION</th>
                    </>
                  )}
                  {reportType === 'loans' && (
                    <>
                      <th className="py-3 px-5">CONTACT</th>
                      <th className="py-3 px-4">CLASSIFICATION</th>
                      <th className="py-3 px-4">PRINCIPAL</th>
                      <th className="py-3 px-4">REMAINING</th>
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-5 text-right">STATUS</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {reportType === 'expenses' &&
                  data.map((exp) => (
                    <tr key={exp.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          <CategoryIcon iconName={exp.categoryIcon} className="h-3.5 w-3.5 shrink-0" />
                          <div>
                            <p className="font-black text-charcoal uppercase">{exp.description || exp.categoryName}</p>
                            <p className="text-[10px] text-pencil uppercase">{exp.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 uppercase">{exp.paymentMethod.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-pencil">{formatDate(exp.expenseDate)}</td>
                      <td className="py-3 px-5 text-right font-black text-charcoal tabular-nums">
                        {formatCurrency(exp.amount)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'categories' &&
                  data.map((cat) => (
                    <tr key={cat.categoryId} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3 px-5 font-black text-charcoal uppercase">{cat.categoryName}</td>
                      <td className="py-3 px-5 text-right font-black text-charcoal tabular-nums">
                        {formatCurrency(cat.total)}
                      </td>
                    </tr>
                  ))}

                {reportType === 'budgets' &&
                  data.map((b) => (
                    <tr key={b.budgetId} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3 px-5 font-black text-charcoal uppercase">{b.categoryName}</td>
                      <td className="py-3 px-4 tabular-nums">{formatCurrency(b.budgetLimit)}</td>
                      <td className="py-3 px-4 tabular-nums">{formatCurrency(b.spentAmount)}</td>
                      <td className="py-3 px-4 tabular-nums font-bold text-charcoal">
                        {formatCurrency(b.remainingAmount)}
                      </td>
                      <td className="py-3 px-5 text-right tabular-nums">
                        <span
                          className={`font-black px-1.5 py-0.5 border ${
                            b.isOverBudget
                              ? 'bg-[#FF3000] text-white border-[#FF3000]'
                              : 'bg-black text-white border-black dark:bg-white dark:text-black'
                          }`}
                        >
                          {b.utilizationPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}

                {reportType === 'loans' &&
                  data.map((l) => (
                    <tr key={l.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                      <td className="py-3 px-5 font-black text-charcoal uppercase">{l.contactName}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-1 py-0.5 text-[9px] font-black border ${
                            l.type === 'LENT' ? 'bg-black text-white' : 'bg-[#FF3000] text-white'
                          }`}
                        >
                          {l.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 tabular-nums">{formatCurrency(l.amount)}</td>
                      <td className="py-3 px-4 font-black tabular-nums">{formatCurrency(l.remainingAmount)}</td>
                      <td className="py-3 px-4 text-pencil">{formatDate(l.loanDate)}</td>
                      <td className="py-3 px-5 text-right font-black uppercase text-charcoal">{l.status}</td>
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
