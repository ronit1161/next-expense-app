import { Search, Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminUsersTab({
  users,
  loadingUsers,
  userSearch,
  setUserSearch,
  usersPage,
  setUsersPage,
  totalUsersPages,
  onInspectUser,
}) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search and Filters Bar */}
      <div className="fintech-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUsersPage(1);
            }}
            placeholder="Search user name or email..."
            className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white transition"
          />
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 self-end sm:self-auto">
          Page {usersPage} of {totalUsersPages}
        </p>
      </div>

      {/* Users Table */}
      <div className="fintech-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-white/[0.02]">
                <th className="py-3.5 px-5">User Account</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-center">Entries</th>
                <th className="py-3.5 px-4 text-center">Budgets</th>
                <th className="py-3.5 px-5 text-right">Recorded Spend</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loadingUsers ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600 mb-2" />
                    <span className="font-bold text-xs">Indexing user directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400 font-bold text-xs">
                    No registered users match your search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-xs">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-500/15 text-rose-600 border border-rose-500/20'
                            : 'bg-teal-500/15 text-teal-600 border border-teal-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">{formatDate(u.createdAt)}</td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {u.expenseCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {u.budgetCount}
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-slate-900 dark:text-white text-xs tabular-nums">
                      {formatCurrency(u.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onInspectUser(u)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalUsersPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
            <button
              disabled={usersPage <= 1}
              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Page {usersPage} of {totalUsersPages}
            </span>
            <button
              disabled={usersPage >= totalUsersPages}
              onClick={() => setUsersPage((p) => Math.min(totalUsersPages, p + 1))}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
