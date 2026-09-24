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
    <div className="space-y-4 animate-fadeIn">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUsersPage(1);
            }}
            placeholder="SEARCH USER NAME OR EMAIL..."
            className="swiss-input w-full pl-10 pr-4 py-2 text-xs font-mono uppercase"
          />
        </div>
        <p className="text-xs font-mono text-pencil self-end sm:self-auto uppercase">
          PAGE {usersPage} OF {totalUsersPages}
        </p>
      </div>

      {/* Users Table */}
      <div className="border-4 border-black dark:border-white/20 bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] text-charcoal uppercase font-black text-[10px] tracking-widest">
                <th className="p-4">USER ACCOUNT</th>
                <th className="p-4">ROLE</th>
                <th className="p-4">JOINED</th>
                <th className="p-4 text-center">ENTRIES</th>
                <th className="p-4 text-center">BUDGETS</th>
                <th className="p-4 text-right">RECORDED</th>
                <th className="p-4 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {loadingUsers ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-pencil">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#FF3000] mb-2" />
                    INDEXING USER DIRECTORY...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-pencil uppercase font-bold">
                    NO REGISTERED USERS MATCH SEARCH CRITERIA.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black text-xs">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-black text-charcoal uppercase">{u.name}</p>
                          <p className="text-[10px] text-pencil">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-1.5 py-0.5 text-[9px] font-black uppercase border ${
                          u.role === 'ADMIN'
                            ? 'bg-[#FF3000] text-white border-[#FF3000]'
                            : 'bg-black text-white border-black dark:bg-white dark:text-black'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-pencil">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-center font-black text-charcoal">
                      {u.expenseCount}
                    </td>
                    <td className="p-4 text-center font-black text-charcoal">
                      {u.budgetCount}
                    </td>
                    <td className="p-4 text-right font-black text-charcoal tabular-nums">
                      {formatCurrency(u.totalSpent)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onInspectUser(u)}
                        className="swiss-btn px-2.5 py-1 text-[10px] font-black inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" />
                        <span>INSPECT</span>
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
          <div className="p-3 flex items-center justify-between border-t-2 border-black dark:border-white/20 bg-[var(--bg-subtle)]">
            <button
              disabled={usersPage <= 1}
              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
              className="swiss-btn px-3 py-1 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> PREVIOUS
            </button>
            <span className="text-xs font-mono text-pencil uppercase font-bold">
              PAGE {usersPage} OF {totalUsersPages}
            </span>
            <button
              disabled={usersPage >= totalUsersPages}
              onClick={() => setUsersPage((p) => Math.min(totalUsersPages, p + 1))}
              className="swiss-btn px-3 py-1 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              NEXT <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
