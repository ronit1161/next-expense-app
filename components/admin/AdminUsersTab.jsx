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
            placeholder="Search user name or email..."
            className="neu-input w-full pl-10 pr-4 py-2 text-xs text-charcoal placeholder:text-pencil rounded-xl"
          />
        </div>
        <p className="text-xs text-pencil self-end sm:self-auto">
          Page {usersPage} of {totalUsersPages}
        </p>
      </div>

      {/* Users Table */}
      <div className="neu-card rounded-2xl overflow-hidden border border-[#D8D2C6]/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#D8D2C6] bg-[#E5E1D8]/60 text-pencil uppercase font-bold text-[10px] tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-center">Entries</th>
                <th className="p-4 text-center">Budgets</th>
                <th className="p-4 text-right">Total Recorded</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0DBD0]">
              {loadingUsers ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-pencil">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#0047FF] mb-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-pencil">
                    No registered users match your search query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#E2DDD4]/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-charcoal text-white flex items-center justify-center font-bold text-xs">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal">{u.name}</p>
                          <p className="text-[11px] text-pencil">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-gray-200/80 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-pencil">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-center font-semibold text-charcoal">
                      {u.expenseCount}
                    </td>
                    <td className="p-4 text-center font-semibold text-charcoal">
                      {u.budgetCount}
                    </td>
                    <td className="p-4 text-right font-bold text-charcoal">
                      {formatCurrency(u.totalSpent)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onInspectUser(u)}
                        className="neu-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0047FF] inline-flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect Activity</span>
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
          <div className="p-4 flex items-center justify-between border-t border-[#D8D2C6] bg-[#EAE6DF]">
            <button
              disabled={usersPage <= 1}
              onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
              className="neu-btn-sm px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <span className="text-xs text-pencil">
              Page {usersPage} of {totalUsersPages}
            </span>
            <button
              disabled={usersPage >= totalUsersPages}
              onClick={() => setUsersPage((p) => Math.min(totalUsersPages, p + 1))}
              className="neu-btn-sm px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
