import { Search, Loader2, Eye, ChevronLeft, ChevronRight, UserCheck, Shield } from 'lucide-react';
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
      <div className="clay-card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => {
              setUserSearch(e.target.value);
              setUsersPage(1);
            }}
            placeholder="Search user name or email..."
            className="clay-input w-full pl-11 pr-4 py-3 text-xs font-semibold rounded-2xl"
          />
        </div>
        <p className="text-xs font-bold text-[var(--text-muted)] self-end sm:self-auto">
          Page {usersPage} of {totalUsersPages}
        </p>
      </div>

      {/* Users Table */}
      <div className="clay-card rounded-[32px] overflow-hidden p-2 sm:p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--clay-border)] text-[var(--text-muted)] font-bold text-xs">
                <th className="p-4">User Account</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-center">Entries</th>
                <th className="p-4 text-center">Budgets</th>
                <th className="p-4 text-right">Recorded Spend</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--clay-border)]">
              {loadingUsers ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-[var(--text-muted)]">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-violet-500 mb-2" />
                    <span className="font-bold text-xs">Indexing user directory...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-[var(--text-muted)] font-bold text-sm">
                    No registered users match your search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-muted)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-600 clay-orb flex items-center justify-center text-white font-extrabold text-xs shrink-0">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-extrabold text-[var(--text-primary)] text-sm">
                            {u.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`clay-badge-pill text-[11px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                            : 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-muted)] font-medium">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-center font-bold text-[var(--text-primary)]">
                      {u.expenseCount}
                    </td>
                    <td className="p-4 text-center font-bold text-[var(--text-primary)]">
                      {u.budgetCount}
                    </td>
                    <td
                      className="p-4 text-right font-black text-[var(--text-primary)] text-sm"
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                    >
                      {formatCurrency(u.totalSpent)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onInspectUser(u)}
                        className="clay-btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                      >
                        <Eye className="h-3.5 w-3.5 text-violet-500" />
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
          <div className="p-4 flex items-center justify-between border-t border-[var(--clay-border)] bg-[var(--bg-muted)]/50 rounded-b-[24px]">
            <button
              disabled={usersPage <= 1}
              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
              className="clay-btn-secondary px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <span className="text-xs font-bold text-[var(--text-muted)]">
              Page {usersPage} of {totalUsersPages}
            </span>
            <button
              disabled={usersPage >= totalUsersPages}
              onClick={() => setUsersPage((p) => Math.min(totalUsersPages, p + 1))}
              className="clay-btn-secondary px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
