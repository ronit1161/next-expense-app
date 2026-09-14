'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Search,
  Eye,
  X,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowLeftRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getAdminOverviewAction,
  getAdminUsersAction,
  getAdminUserDetailAction,
  getAdminAllActivitiesAction,
  createCategoryAction,
  deleteCategoryAction,
} from '@/actions/admin-actions';
import { getCategoriesAction } from '@/actions/expense-actions';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();

  // Tab State: 'users' | 'activities' | 'categories'
  const [activeTab, setActiveTab] = useState('users');

  // Overview State
  const [overview, setOverview] = useState(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Users Tab State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [totalUsersPages, setTotalUsersPages] = useState(1);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // User Activity Inspector Modal State
  const [inspectingUser, setInspectingUser] = useState(null);
  const [inspectDetail, setInspectDetail] = useState(null);
  const [loadingInspect, setLoadingInspect] = useState(false);

  // Global Activities Stream State
  const [activities, setActivities] = useState([]);
  const [activitySearch, setActivitySearch] = useState('');
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivityPages, setTotalActivityPages] = useState(1);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Layers');
  const [newCatColor, setNewCatColor] = useState('#0047FF');
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryMsg, setCategoryMsg] = useState('');
  const [categoryError, setCategoryError] = useState('');

  // 1. Fetch Executive Overview
  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await getAdminOverviewAction();
      if (res.success) {
        setOverview(res.stats);
      } else {
        // Forbidden or unauthenticated
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setLoadingOverview(false);
    }
  }, [router]);

  // 2. Fetch Users List
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await getAdminUsersAction({ search: userSearch, page: usersPage, limit: 10 });
      if (res.success) {
        setUsers(res.users);
        setTotalUsersPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, usersPage]);

  // 3. Fetch Global Activities Stream
  const fetchActivities = useCallback(async () => {
    setLoadingActivities(true);
    try {
      const res = await getAdminAllActivitiesAction({
        search: activitySearch,
        page: activityPage,
        limit: 15,
      });
      if (res.success) {
        setActivities(res.activities);
        setTotalActivityPages(res.pagination.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingActivities(false);
    }
  }, [activitySearch, activityPage]);

  // 4. Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesAction();
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
    fetchCategories();
  }, [fetchOverview, fetchCategories]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'activities') {
      fetchActivities();
    }
  }, [activeTab, fetchUsers, fetchActivities]);

  // Open User Activity Deep Dive
  const handleInspectUser = async (user) => {
    setInspectingUser(user);
    setLoadingInspect(true);
    setInspectDetail(null);
    try {
      const res = await getAdminUserDetailAction(user.id);
      if (res.success) {
        setInspectDetail(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInspect(false);
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCategoryMsg('');
    setCategoryError('');
    if (!newCatName.trim()) return;

    setSavingCategory(true);
    try {
      const res = await createCategoryAction({
        name: newCatName,
        icon: newCatIcon,
        color: newCatColor,
      });
      if (res.success) {
        setCategoryMsg('Category created successfully!');
        setNewCatName('');
        fetchCategories();
        setTimeout(() => setCategoryMsg(''), 3000);
      } else {
        setCategoryError(res.error || 'Failed to create category.');
      }
    } catch (err) {
      setCategoryError(err.message || 'Failed to create category.');
    } finally {
      setSavingCategory(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (catId) => {
    if (!window.confirm('Delete this category?')) return;
    setCategoryMsg('');
    setCategoryError('');
    try {
      const res = await deleteCategoryAction(catId);
      if (res.success) {
        setCategoryMsg('Category deleted.');
        fetchCategories();
        setTimeout(() => setCategoryMsg(''), 3000);
      } else {
        setCategoryError(res.error || 'Failed to delete category.');
      }
    } catch (err) {
      setCategoryError(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 animate-fadeIn w-full max-w-full">
      {/* 1. ADMIN PORTAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#DFDBD3]/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0047FF]"></span>
            <span className="text-[10px] font-bold text-[#7D8494] uppercase tracking-wider">
              Platform Administration
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold text-[#1E2025] tracking-tight mt-0.5">
            Admin Portal & Activity Inspector
          </h1>
          <p className="text-xs text-[#7D8494] mt-0.5">
            Monitor system health, inspect all users&apos; activities, and manage platform categories.
          </p>
        </div>

        <button
          onClick={() => {
            fetchOverview();
            if (activeTab === 'users') fetchUsers();
            if (activeTab === 'activities') fetchActivities();
            fetchCategories();
          }}
          className="neu-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#1E2025] cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#0047FF]" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 2. EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="neu-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-[#7D8494]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="h-4 w-4 text-[#0047FF]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1E2025] font-numeric">
            {loadingOverview ? '—' : overview?.totalUsers || 0}
          </p>
          <p className="text-[10px] text-[#7D8494]">Registered accounts</p>
        </div>

        {/* Gross Volume */}
        <div className="neu-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-[#7D8494]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Volume</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1E2025] font-numeric truncate">
            {loadingOverview ? '—' : formatCurrency(overview?.totalVolume || 0)}
          </p>
          <p className="text-[10px] text-[#7D8494]">Logged across platform</p>
        </div>

        {/* Total Expenses Count */}
        <div className="neu-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-[#7D8494]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Expenses</span>
            <CreditCard className="h-4 w-4 text-[#0047FF]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1E2025] font-numeric">
            {loadingOverview ? '—' : overview?.totalExpensesCount || 0}
          </p>
          <p className="text-[10px] text-[#7D8494]">Transactions recorded</p>
        </div>

        {/* Active Budgets & Loans */}
        <div className="neu-card p-4 sm:p-5 space-y-1">
          <div className="flex items-center justify-between text-[#7D8494]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Budgets</span>
            <PiggyBank className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-[#1E2025] font-numeric">
            {loadingOverview ? '—' : overview?.totalBudgetsCount || 0}
          </p>
          <p className="text-[10px] text-[#7D8494]">{overview?.totalLoansCount || 0} peer loans</p>
        </div>
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-[#DFDBD3]/40 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#7D8494] hover:text-[#1E2025]'
          }`}
        >
          All Users & Inspector ({overview?.totalUsers || 0})
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'activities'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#7D8494] hover:text-[#1E2025]'
          }`}
        >
          Global Activity Stream
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'categories'
              ? 'neu-inset text-[#0047FF]'
              : 'neu-btn text-[#7D8494] hover:text-[#1E2025]'
          }`}
        >
          Category Manager ({categories.length})
        </button>
      </div>

      {/* 4. TAB 1: USERS & ACTIVITY INSPECTOR */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search Bar */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D8494]" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setUsersPage(1);
              }}
              placeholder="Search users by name or email..."
              className="neu-input w-full py-2.5 pl-10 pr-4 text-xs text-[#1E2025] focus:outline-none"
            />
          </div>

          {/* Users Table / Mobile Cards */}
          <div className="neu-card overflow-hidden">
            <div className="p-4 border-b border-[#DFDBD3]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E2025] uppercase tracking-wider">
                User Accounts
              </span>
              <span className="text-[11px] text-[#7D8494]">Page {usersPage} of {totalUsersPages}</span>
            </div>

            {loadingUsers ? (
              <div className="p-12 text-center text-xs text-[#7D8494] flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#0047FF]" />
                <span>Loading users...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#7D8494]">
                No users found matching your search.
              </div>
            ) : (
              <>
                {/* Mobile View: Cards */}
                <div className="block sm:hidden divide-y divide-[#DFDBD3]/30">
                  {users.map((u) => (
                    <div key={u.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#1E2025]">{u.name}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                u.role === 'ADMIN'
                                  ? 'bg-[#0047FF] text-white'
                                  : 'neu-inset text-[#7D8494]'
                              }`}
                            >
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7D8494]">{u.email}</p>
                        </div>

                        <button
                          onClick={() => handleInspectUser(u)}
                          className="neu-btn-blue inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#7D8494] pt-1">
                        <span>{u.expenseCount} entries • {u.budgetCount} budgets</span>
                        <span className="font-bold text-[#1E2025]">{formatCurrency(u.totalSpent)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View: Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#DFDBD3]/40 text-[10px] font-bold uppercase tracking-wider text-[#7D8494] bg-[#E5E1D9]/40">
                        <th className="py-3 px-5">User</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Total Spent</th>
                        <th className="py-3 px-4">Activity Count</th>
                        <th className="py-3 px-4">Joined Date</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DFDBD3]/30">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FFFFFF]/25 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-xl neu-card-sm flex items-center justify-center font-bold text-xs text-[#1E2025]">
                                {u.name[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-[#1E2025]">{u.name}</p>
                                <p className="text-[10px] text-[#7D8494]">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                u.role === 'ADMIN'
                                  ? 'bg-[#0047FF] text-white'
                                  : 'neu-inset text-[#7D8494]'
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1E2025] tabular-nums">
                            {formatCurrency(u.totalSpent)}
                          </td>
                          <td className="py-3.5 px-4 text-[#7D8494]">
                            {u.expenseCount} expenses • {u.budgetCount} budgets
                          </td>
                          <td className="py-3.5 px-4 text-[#7D8494]">
                            {formatDate(u.createdAt)}
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <button
                              onClick={() => handleInspectUser(u)}
                              className="neu-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0047FF] hover:text-[#0038D1] cursor-pointer"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>Inspect Activity</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Pagination */}
            {totalUsersPages > 1 && (
              <div className="p-4 border-t border-[#DFDBD3]/40 flex items-center justify-between">
                <button
                  disabled={usersPage === 1}
                  onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                  className="neu-btn px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-[#7D8494]">
                  Page {usersPage} of {totalUsersPages}
                </span>
                <button
                  disabled={usersPage === totalUsersPages}
                  onClick={() => setUsersPage((p) => Math.min(totalUsersPages, p + 1))}
                  className="neu-btn px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 2: GLOBAL ACTIVITY STREAM */}
      {activeTab === 'activities' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D8494]" />
            <input
              type="text"
              value={activitySearch}
              onChange={(e) => {
                setActivitySearch(e.target.value);
                setActivityPage(1);
              }}
              placeholder="Search activities by description, user name, or email..."
              className="neu-input w-full py-2.5 pl-10 pr-4 text-xs text-[#1E2025] focus:outline-none"
            />
          </div>

          <div className="neu-card overflow-hidden">
            <div className="p-4 border-b border-[#DFDBD3]/40 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E2025] uppercase tracking-wider">
                Live Transaction Feed
              </span>
              <span className="text-[11px] text-[#7D8494]">Page {activityPage} of {totalActivityPages}</span>
            </div>

            {loadingActivities ? (
              <div className="p-12 text-center text-xs text-[#7D8494] flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#0047FF]" />
                <span>Loading global activity stream...</span>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#7D8494]">
                No transaction activities found.
              </div>
            ) : (
              <div className="divide-y divide-[#DFDBD3]/30">
                {activities.map((act) => (
                  <div key={act.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FFFFFF]/25 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl neu-card-sm flex items-center justify-center shrink-0">
                        <CategoryIcon iconName={act.categoryIcon} className="h-4 w-4 text-[#7D8494]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#1E2025] truncate">
                          {act.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-[#7D8494] mt-0.5">
                          <span className="font-semibold text-[#0047FF] truncate max-w-[120px]">{act.userName}</span>
                          <span>•</span>
                          <span>{act.categoryName}</span>
                          <span>•</span>
                          <span className="neu-inset px-1.5 py-0.2 rounded text-[9px] font-medium text-[#1E2025]">
                            {act.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-xs sm:text-sm text-[#1E2025] tabular-nums">
                        {formatCurrency(act.amount)}
                      </p>
                      <p className="text-[10px] text-[#7D8494] mt-0.5">
                        {formatDate(act.expenseDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalActivityPages > 1 && (
              <div className="p-4 border-t border-[#DFDBD3]/40 flex items-center justify-between">
                <button
                  disabled={activityPage === 1}
                  onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                  className="neu-btn px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs text-[#7D8494]">
                  Page {activityPage} of {totalActivityPages}
                </span>
                <button
                  disabled={activityPage === totalActivityPages}
                  onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                  className="neu-btn px-3 py-1.5 text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 3: CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Add Category Form */}
          <div className="neu-card p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold text-[#1E2025] uppercase tracking-wider flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#0047FF]" />
              <span>Create New Global Category</span>
            </h3>

            {categoryMsg && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>{categoryMsg}</span>
              </div>
            )}

            {categoryError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-100/80 text-rose-800 text-xs font-bold">
                <AlertCircle className="h-4 w-4" />
                <span>{categoryError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-[#7D8494] uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fitness, Subscriptions, Pets"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="neu-input w-full py-2 px-3 text-xs text-[#1E2025] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7D8494] uppercase mb-1">
                  Lucide Icon Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heart, Dumbbell, Gift"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="neu-input w-full py-2 px-3 text-xs text-[#1E2025] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#7D8494] uppercase mb-1">
                  Color Tag
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="h-8 w-10 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <button
                    type="submit"
                    disabled={savingCategory}
                    className="neu-btn-blue flex-1 py-2 px-3 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
                  >
                    {savingCategory ? 'Creating...' : 'Add'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Existing Categories Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#1E2025] uppercase tracking-wider px-1">
              Existing Platform Categories ({categories.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="neu-card p-4 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon iconName={cat.icon} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#1E2025]">{cat.name}</p>
                      <p className="text-[10px] text-[#7D8494] font-mono">{cat.icon}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-[#7D8494] hover:text-rose-600 cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. USER ACTIVITY INSPECTOR MODAL / DRAWER */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#EAE6DF] rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[90vh] flex flex-col space-y-4 animate-scaleIn">
            {/* Inspector Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#DFDBD3]/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl neu-card flex items-center justify-center font-bold text-sm text-[#1E2025]">
                  {inspectingUser.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#1E2025] flex items-center gap-2">
                    <span>{inspectingUser.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md neu-inset text-[#7D8494]">
                      {inspectingUser.role}
                    </span>
                  </h2>
                  <p className="text-[11px] text-[#7D8494]">{inspectingUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="p-1.5 text-[#7D8494] hover:text-[#1E2025] cursor-pointer neu-btn-sm rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Inspector Body */}
            {loadingInspect ? (
              <div className="p-16 text-center text-xs text-[#7D8494] flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-[#0047FF]" />
                <span>Loading complete user activity ledger...</span>
              </div>
            ) : !inspectDetail ? (
              <div className="p-12 text-center text-xs text-[#7D8494]">
                Failed to load user details.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 max-h-[60vh]">
                {/* User Summary Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="neu-card-sm p-3 rounded-xl">
                    <p className="text-[9px] font-bold uppercase text-[#7D8494]">Total Spend</p>
                    <p className="text-xs sm:text-sm font-bold text-[#1E2025] tabular-nums mt-0.5">
                      {formatCurrency(inspectDetail.user.totalExpenseSum || 0)}
                    </p>
                  </div>
                  <div className="neu-card-sm p-3 rounded-xl">
                    <p className="text-[9px] font-bold uppercase text-[#7D8494]">Expenses Logged</p>
                    <p className="text-xs sm:text-sm font-bold text-[#1E2025] mt-0.5">
                      {inspectDetail.expenses.length}
                    </p>
                  </div>
                  <div className="neu-card-sm p-3 rounded-xl">
                    <p className="text-[9px] font-bold uppercase text-[#7D8494]">Joined Date</p>
                    <p className="text-xs font-bold text-[#1E2025] mt-0.5">
                      {formatDate(inspectDetail.user.createdAt)}
                    </p>
                  </div>
                </div>

                {/* User Expenses Ledger */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494] px-1">
                    Recent Expenses ({inspectDetail.expenses.length})
                  </h4>

                  {inspectDetail.expenses.length === 0 ? (
                    <p className="text-xs text-[#7D8494] p-4 text-center neu-card-sm rounded-xl">
                      No expenses logged by this user yet.
                    </p>
                  ) : (
                    <div className="neu-card rounded-2xl divide-y divide-[#DFDBD3]/30 overflow-hidden max-h-52 overflow-y-auto">
                      {inspectDetail.expenses.map((exp) => (
                        <div key={exp.id} className="p-2.5 sm:p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <CategoryIcon iconName={exp.categoryIcon} className="h-3.5 w-3.5 text-[#7D8494] shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-[#1E2025] truncate">{exp.description}</p>
                              <p className="text-[10px] text-[#7D8494]">{exp.categoryName} • {exp.paymentMethod.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-[#1E2025] tabular-nums">{formatCurrency(exp.amount)}</p>
                            <p className="text-[9px] text-[#7D8494]">{formatDate(exp.expenseDate)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Budgets */}
                {inspectDetail.budgets.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494] px-1">
                      Active Budgets ({inspectDetail.budgets.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {inspectDetail.budgets.map((b) => (
                        <div key={b.id} className="neu-card p-2.5 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-[#1E2025]">
                            <span>{b.categoryName}</span>
                            <span>{formatCurrency(b.amount)}</span>
                          </div>
                          <p className="text-[10px] text-[#7D8494]">Month: {b.month}/{b.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Loans / Debts */}
                {inspectDetail.loans.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494] px-1">
                      Peer Lending & Debts ({inspectDetail.loans.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {inspectDetail.loans.map((l) => (
                        <div key={l.id} className="neu-card p-2.5 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-[#1E2025]">
                            <span>{l.contactName}</span>
                            <span className={l.type === 'LENT' ? 'text-emerald-600' : 'text-rose-600'}>
                              {l.type}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-[#7D8494]">
                            <span>Total: {formatCurrency(l.amount)}</span>
                            <span>Rem: {formatCurrency(l.remainingAmount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inspector Footer */}
            <div className="pt-2 border-t border-[#DFDBD3]/50 flex justify-end">
              <button
                onClick={() => setInspectingUser(null)}
                className="neu-btn px-4 py-2 text-xs font-semibold text-[#1E2025] cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
