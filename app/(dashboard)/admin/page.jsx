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
  BarChart3,
  Activity,
  Database,
  Download,
  FileSpreadsheet,
  Server,
  HardDrive,
  Cpu,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  getAdminOverviewAction,
  getAdminUsersAction,
  getAdminUserDetailAction,
  getAdminAllActivitiesAction,
  createCategoryAction,
  deleteCategoryAction,
  getAdminAnalyticsAction,
  getAdminSystemHealthAction,
  getAdminBackupSnapshotAction,
  getAdminMasterCsvAction,
} from '@/actions/admin-actions';
import { getCategoriesAction } from '@/actions/expense-actions';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminPage() {
  const router = useRouter();

  // Tab State: 'users' | 'analytics' | 'health' | 'backup' | 'activities' | 'categories'
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

  // Analytics Tab State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // System Health Tab State
  const [health, setHealth] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [pingingDb, setPingingDb] = useState(false);

  // Backup & Export Tab State
  const [csvStartDate, setCsvStartDate] = useState('');
  const [csvEndDate, setCsvEndDate] = useState('');
  const [downloadingBackup, setDownloadingBackup] = useState(false);
  const [downloadingCsv, setDownloadingCsv] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

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

  // 3. Fetch Platform Analytics
  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const res = await getAdminAnalyticsAction();
      if (res.success) {
        setAnalytics(res.analytics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // 4. Fetch System Health
  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true);
    try {
      const res = await getAdminSystemHealthAction();
      if (res.success) {
        setHealth(res.health);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  // 5. Fetch Global Activities Stream
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

  // 6. Fetch Categories
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
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'health') {
      fetchHealth();
    } else if (activeTab === 'activities') {
      fetchActivities();
    }
  }, [activeTab, fetchUsers, fetchAnalytics, fetchHealth, fetchActivities]);

  // Inspect User Activity Handler
  const handleInspectUser = async (user) => {
    setInspectingUser(user);
    setLoadingInspect(true);
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

  // Create Category Handler
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSavingCategory(true);
    setCategoryMsg('');
    setCategoryError('');

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
      } else {
        setCategoryError(res.error || 'Failed to create category.');
      }
    } catch (err) {
      setCategoryError(err.message || 'Error creating category.');
    } finally {
      setSavingCategory(false);
    }
  };

  // Delete Category Handler
  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await deleteCategoryAction(catId);
      if (res.success) {
        fetchCategories();
      } else {
        alert(res.error || 'Failed to delete category.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting category.');
    }
  };

  // Ping Database Handler
  const handlePingDb = async () => {
    setPingingDb(true);
    try {
      const res = await getAdminSystemHealthAction();
      if (res.success) {
        setHealth(res.health);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPingingDb(false);
    }
  };

  // Download Backup Snapshot JSON
  const handleDownloadBackup = async () => {
    setDownloadingBackup(true);
    setExportSuccessMsg('');
    try {
      const res = await getAdminBackupSnapshotAction();
      if (res.success && res.backupData) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(res.backupData, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute(
          'download',
          `expensewise-backup-${new Date().toISOString().split('T')[0]}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setExportSuccessMsg('Platform JSON Snapshot downloaded successfully!');
      } else {
        alert(res.error || 'Failed to generate backup.');
      }
    } catch (err) {
      alert(err.message || 'Error downloading backup.');
    } finally {
      setDownloadingBackup(false);
    }
  };

  // Download Master CSV
  const handleDownloadMasterCsv = async () => {
    setDownloadingCsv(true);
    setExportSuccessMsg('');
    try {
      const res = await getAdminMasterCsvAction({
        startDate: csvStartDate || undefined,
        endDate: csvEndDate || undefined,
      });
      if (res.success && res.csvContent) {
        const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', url);
        downloadAnchor.setAttribute(
          'download',
          `expensewise-master-ledger-${new Date().toISOString().split('T')[0]}.csv`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setExportSuccessMsg(`Master CSV with ${res.count} records downloaded successfully!`);
      } else {
        alert(res.error || 'Failed to generate CSV.');
      }
    } catch (err) {
      alert(err.message || 'Error exporting CSV.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  return (
    <div className="space-y-7 pb-16 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 neu-card p-6 rounded-2xl bg-gradient-to-r from-[#EAE6DF] via-[#F3EFE8] to-[#EAE6DF] border border-purple-200/50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-[0_4px_12px_rgba(147,51,234,0.35)]">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display text-charcoal">
                Platform Admin Portal
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold border border-purple-200">
                STAFF SECURE
              </span>
            </div>
            <p className="text-xs text-pencil mt-0.5">
              Live platform metrics, user activity inspection, system diagnostics & data exports.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            fetchOverview();
            if (activeTab === 'users') fetchUsers();
            if (activeTab === 'analytics') fetchAnalytics();
            if (activeTab === 'health') fetchHealth();
            if (activeTab === 'activities') fetchActivities();
          }}
          className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-charcoal flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#0047FF]" />
          <span>Refresh All</span>
        </button>
      </div>

      {/* 2. Executive KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Total Users
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-[#0047FF] neu-card-sm">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-display font-extrabold text-charcoal">
              {loadingOverview ? '...' : overview?.totalUsers || 0}
            </p>
            <p className="text-[10px] text-pencil mt-0.5">Registered accounts</p>
          </div>
        </div>

        {/* Gross Platform Spend */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Gross Volume
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 neu-card-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-display font-extrabold text-charcoal">
              {loadingOverview ? '...' : formatCurrency(overview?.totalVolume || 0)}
            </p>
            <p className="text-[10px] text-pencil mt-0.5">
              Avg {formatCurrency(overview?.averageSpendPerUser || 0)} / user
            </p>
          </div>
        </div>

        {/* Total Expenses Logged */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Total Entries
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 neu-card-sm">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-display font-extrabold text-charcoal">
              {loadingOverview ? '...' : overview?.totalExpensesCount?.toLocaleString() || 0}
            </p>
            <p className="text-[10px] text-pencil mt-0.5">Across all categories</p>
          </div>
        </div>

        {/* Active Budgets & Lending */}
        <div className="neu-card p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
              Active Budgets
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 neu-card-sm">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-display font-extrabold text-charcoal">
              {loadingOverview ? '...' : overview?.totalBudgetsCount || 0}
            </p>
            <p className="text-[10px] text-pencil mt-0.5">
              {overview?.totalLoansCount || 0} peer debt records
            </p>
          </div>
        </div>
      </div>

      {/* 3. Tab Bar Navigation */}
      <div className="flex items-center gap-2 border-b border-[#D8D2C6] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'neu-inset text-[#0047FF] bg-blue-50/50'
              : 'text-pencil hover:text-charcoal hover:neu-card-sm'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Users & Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'neu-inset text-[#0047FF] bg-blue-50/50'
              : 'text-pencil hover:text-charcoal hover:neu-card-sm'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>Platform Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'health'
              ? 'neu-inset text-emerald-600 bg-emerald-50/50'
              : 'text-pencil hover:text-charcoal hover:neu-card-sm'
          }`}
        >
          <Activity className="h-4 w-4" />
          <span>System & DB Health</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'backup'
              ? 'neu-inset text-purple-600 bg-purple-50/50'
              : 'text-pencil hover:text-charcoal hover:neu-card-sm'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Backups & Master CSV</span>
        </button>

        <button
          onClick={() => setActiveTab('activities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'activities'
              ? 'neu-inset text-[#0047FF] bg-blue-50/50'
              : 'text-pencil hover:text-charcoal hover:neu-card-sm'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Global Stream</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'categories'
              ? 'neu-inset text-[#0047FF] bg-blue-50/50'
              : 'text-pencil hover:text-charcoal hover:neu-card-sm'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Category Manager</span>
        </button>
      </div>

      {/* 4. TAB 1: ALL USERS & DEEP ACTIVITY INSPECTION */}
      {activeTab === 'users' && (
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
                            onClick={() => handleInspectUser(u)}
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
      )}

      {/* 5. TAB 2: PLATFORM ANALYTICS & MACRO CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {loadingAnalytics ? (
            <div className="neu-card p-12 rounded-2xl flex flex-col items-center justify-center text-pencil">
              <Loader2 className="h-8 w-8 animate-spin text-[#0047FF] mb-3" />
              <p className="text-xs font-semibold">Aggregating platform-wide analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* User Activity Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    🟢
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
                      Active Users (&lt; 7 Days)
                    </span>
                    <p className="text-xl font-extrabold text-charcoal">
                      {analytics.userTiers.active}{' '}
                      <span className="text-xs font-normal text-pencil">
                        ({Math.round((analytics.userTiers.active / (analytics.userTiers.total || 1)) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    🟡
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
                      Occasional (&lt; 30 Days)
                    </span>
                    <p className="text-xl font-extrabold text-charcoal">
                      {analytics.userTiers.occasional}{' '}
                      <span className="text-xs font-normal text-pencil">
                        ({Math.round((analytics.userTiers.occasional / (analytics.userTiers.total || 1)) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>

                <div className="neu-card p-5 rounded-2xl flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    🔴
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-pencil uppercase tracking-wider">
                      Dormant (&gt; 30 Days)
                    </span>
                    <p className="text-xl font-extrabold text-charcoal">
                      {analytics.userTiers.dormant}{' '}
                      <span className="text-xs font-normal text-pencil">
                        ({Math.round((analytics.userTiers.dormant / (analytics.userTiers.total || 1)) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* 6-Month Gross Spend Area Chart */}
              <div className="neu-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">
                      6-Month Gross Volume Growth
                    </h3>
                    <p className="text-[11px] text-pencil">
                      Total monetary spending recorded across the entire platform
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#0047FF] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Gross Flow
                  </span>
                </div>

                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.monthlyTrend}>
                      <defs>
                        <linearGradient id="grossSpendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0047FF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#0047FF" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C6" vertical={false} />
                      <XAxis
                        dataKey="month"
                        stroke="#797670"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#797670"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#EAE6DF',
                          borderRadius: '12px',
                          border: '1px solid #D8D2C6',
                          boxShadow: '4px 4px 12px rgba(168,160,146,0.4)',
                        }}
                        formatter={(val) => [formatCurrency(val), 'Platform Spend']}
                      />
                      <Area
                        type="monotone"
                        dataKey="grossSpend"
                        stroke="#0047FF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#grossSpendGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Two Column Visuals: Payment Methods & Category Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Method Distribution */}
                <div className="neu-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-charcoal">
                    Payment Method Share
                  </h3>
                  <p className="text-[11px] text-pencil">
                    UPI vs Cash vs Card split across all platform entries
                  </p>

                  <div className="h-60 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.paymentDistribution}
                          dataKey="amount"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {analytics.paymentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val) => [formatCurrency(val), 'Volume']}
                          contentStyle={{
                            backgroundColor: '#EAE6DF',
                            borderRadius: '12px',
                            border: '1px solid #D8D2C6',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D8D2C6]">
                    {analytics.paymentDistribution.map((p) => (
                      <div key={p.name} className="flex items-center gap-1.5 text-xs">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: p.fill }}
                        ></span>
                        <span className="text-pencil truncate">{p.name}:</span>
                        <span className="font-bold text-charcoal">{p.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Category Volume Distribution */}
                <div className="neu-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-charcoal">
                    Category Spend Volume
                  </h3>
                  <p className="text-[11px] text-pencil">
                    Top categories ranked by total monetary flow
                  </p>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analytics.categoryDistribution.slice(0, 6)}
                        layout="vertical"
                        margin={{ left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C6" horizontal={false} />
                        <XAxis
                          type="number"
                          stroke="#797670"
                          fontSize={10}
                          tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                        />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="#1E2025"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(val) => [formatCurrency(val), 'Total Volume']}
                          contentStyle={{
                            backgroundColor: '#EAE6DF',
                            borderRadius: '12px',
                            border: '1px solid #D8D2C6',
                          }}
                        />
                        <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                          {analytics.categoryDistribution.slice(0, 6).map((entry, index) => (
                            <Cell key={`bar-${index}`} fill={entry.color || '#0047FF'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* 6. TAB 3: SYSTEM HEALTH & DB DIAGNOSTICS */}
      {activeTab === 'health' && (
        <div className="space-y-6 animate-fadeIn">
          {loadingHealth ? (
            <div className="neu-card p-12 rounded-2xl flex flex-col items-center justify-center text-pencil">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-xs font-semibold">Running database & server diagnostics...</p>
            </div>
          ) : health ? (
            <>
              {/* Vitals Summary Card */}
              <div className="neu-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-200/60 bg-gradient-to-r from-[#EAE6DF] via-emerald-50/20 to-[#EAE6DF]">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${
                      health.status === 'HEALTHY'
                        ? 'bg-emerald-600 shadow-[0_4px_12px_rgba(16,185,129,0.35)]'
                        : 'bg-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.35)]'
                    }`}
                  >
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-charcoal">
                        PostgreSQL Database Connection
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                          health.status === 'HEALTHY'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {health.status}
                      </span>
                    </div>
                    <p className="text-xs text-pencil mt-0.5">
                      Neon Serverless Postgres • Measured latency:{' '}
                      <strong className="text-emerald-700 font-bold">
                        {health.databaseLatencyMs} ms
                      </strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePingDb}
                  disabled={pingingDb}
                  className="neu-btn px-4 py-2 rounded-xl text-xs font-semibold text-charcoal flex items-center gap-2 self-start md:self-auto cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 text-emerald-600 ${pingingDb ? 'animate-spin' : ''}`}
                  />
                  <span>{pingingDb ? 'Pinging DB...' : 'Test DB Latency'}</span>
                </button>
              </div>

              {/* Table Row Statistics */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-pencil uppercase tracking-wider">
                  Database Table Row Counts
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="neu-card p-4 rounded-xl text-center">
                    <p className="text-[10px] text-pencil uppercase font-bold">Users</p>
                    <p className="text-lg font-extrabold text-charcoal mt-1">
                      {health.tableCounts.users}
                    </p>
                  </div>

                  <div className="neu-card p-4 rounded-xl text-center">
                    <p className="text-[10px] text-pencil uppercase font-bold">Expenses</p>
                    <p className="text-lg font-extrabold text-charcoal mt-1">
                      {health.tableCounts.expenses}
                    </p>
                  </div>

                  <div className="neu-card p-4 rounded-xl text-center">
                    <p className="text-[10px] text-pencil uppercase font-bold">Budgets</p>
                    <p className="text-lg font-extrabold text-charcoal mt-1">
                      {health.tableCounts.budgets}
                    </p>
                  </div>

                  <div className="neu-card p-4 rounded-xl text-center">
                    <p className="text-[10px] text-pencil uppercase font-bold">Loans</p>
                    <p className="text-lg font-extrabold text-charcoal mt-1">
                      {health.tableCounts.loans}
                    </p>
                  </div>

                  <div className="neu-card p-4 rounded-xl text-center">
                    <p className="text-[10px] text-pencil uppercase font-bold">Settlements</p>
                    <p className="text-lg font-extrabold text-charcoal mt-1">
                      {health.tableCounts.settlements}
                    </p>
                  </div>

                  <div className="neu-card p-4 rounded-xl text-center bg-blue-50/30 border border-blue-200/50">
                    <p className="text-[10px] text-[#0047FF] uppercase font-bold">Total Rows</p>
                    <p className="text-lg font-extrabold text-[#0047FF] mt-1">
                      {health.tableCounts.totalRecords}
                    </p>
                  </div>
                </div>
              </div>

              {/* Server Runtime Environment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="neu-card p-5 rounded-2xl flex items-center gap-3">
                  <Server className="h-5 w-5 text-pencil" />
                  <div>
                    <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                      Node Version & Env
                    </span>
                    <p className="text-xs font-bold text-charcoal mt-0.5">
                      {health.runtime.nodeVersion} • {health.runtime.environment}
                    </p>
                  </div>
                </div>

                <div className="neu-card p-5 rounded-2xl flex items-center gap-3">
                  <HardDrive className="h-5 w-5 text-pencil" />
                  <div>
                    <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                      Memory Heap Used
                    </span>
                    <p className="text-xs font-bold text-charcoal mt-0.5">
                      {health.runtime.memoryUsage?.heapUsedMb || '—'} MB /{' '}
                      {health.runtime.memoryUsage?.heapTotalMb || '—'} MB
                    </p>
                  </div>
                </div>

                <div className="neu-card p-5 rounded-2xl flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-pencil" />
                  <div>
                    <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                      Server Uptime
                    </span>
                    <p className="text-xs font-bold text-charcoal mt-0.5">
                      {Math.floor(health.runtime.uptimeSeconds / 60)} minutes (
                      {health.runtime.uptimeSeconds}s)
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* 7. TAB 4: DATA BACKUP & MASTER EXPORT */}
      {activeTab === 'backup' && (
        <div className="space-y-6 animate-fadeIn">
          {exportSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{exportSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Database Snapshot JSON */}
            <div className="neu-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">
                      Full JSON Platform Snapshot
                    </h3>
                    <p className="text-[11px] text-pencil">
                      Complete database backup including users, expenses, budgets & loans
                    </p>
                  </div>
                </div>
                <p className="text-xs text-pencil pt-2">
                  Downloads a complete structured JSON archive for off-site backup, disaster
                  recovery, or database migrations. Sensitive fields (like password hashes) are
                  securely omitted.
                </p>
              </div>

              <button
                onClick={handleDownloadBackup}
                disabled={downloadingBackup}
                className="neu-btn-blue w-full py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {downloadingBackup ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{downloadingBackup ? 'Generating Snapshot...' : 'Download JSON Backup'}</span>
              </button>
            </div>

            {/* Master CSV Ledger Export */}
            <div className="neu-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-[#0047FF]">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">
                      Master Platform CSV Ledger
                    </h3>
                    <p className="text-[11px] text-pencil">
                      Export all user transactions with user attribution & category metadata
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-pencil uppercase">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={csvStartDate}
                      onChange={(e) => setCsvStartDate(e.target.value)}
                      className="neu-input w-full px-3 py-1.5 text-xs text-charcoal rounded-lg mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-pencil uppercase">End Date</label>
                    <input
                      type="date"
                      value={csvEndDate}
                      onChange={(e) => setCsvEndDate(e.target.value)}
                      className="neu-input w-full px-3 py-1.5 text-xs text-charcoal rounded-lg mt-1"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadMasterCsv}
                disabled={downloadingCsv}
                className="neu-btn w-full py-3 rounded-xl text-xs font-bold text-charcoal flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {downloadingCsv ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#0047FF]" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4 text-[#0047FF]" />
                )}
                <span>{downloadingCsv ? 'Compiling CSV...' : 'Export Master CSV'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 5: GLOBAL ACTIVITY STREAM */}
      {activeTab === 'activities' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Stream Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil" />
              <input
                type="text"
                value={activitySearch}
                onChange={(e) => {
                  setActivitySearch(e.target.value);
                  setActivityPage(1);
                }}
                placeholder="Search transaction or user..."
                className="neu-input w-full pl-10 pr-4 py-2 text-xs text-charcoal placeholder:text-pencil rounded-xl"
              />
            </div>
            <p className="text-xs text-pencil self-end sm:self-auto">
              Page {activityPage} of {totalActivityPages}
            </p>
          </div>

          {/* Activity Timeline List */}
          <div className="neu-card rounded-2xl overflow-hidden border border-[#D8D2C6]/50">
            <div className="divide-y divide-[#E0DBD0]">
              {loadingActivities ? (
                <div className="p-8 text-center text-pencil">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-[#0047FF] mb-2" />
                  Loading platform activity stream...
                </div>
              ) : activities.length === 0 ? (
                <div className="p-8 text-center text-pencil">
                  No platform activity found matching your search.
                </div>
              ) : (
                activities.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#E2DDD4]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center neu-card-sm text-white shrink-0"
                        style={{ backgroundColor: a.categoryColor || '#0047FF' }}
                      >
                        <CategoryIcon name={a.categoryIcon} className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-charcoal">{a.description}</p>
                        <div className="flex items-center gap-2 text-[11px] text-pencil mt-0.5">
                          <span className="font-semibold text-charcoal">{a.userName}</span>
                          <span>•</span>
                          <span>{a.userEmail}</span>
                          <span>•</span>
                          <span>{formatDate(a.expenseDate)}</span>
                          <span>•</span>
                          <span className="uppercase text-[9px] px-1 rounded bg-[#D8D2C6]/50">
                            {a.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="font-bold text-xs text-loss shrink-0">
                      -{formatCurrency(a.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalActivityPages > 1 && (
              <div className="p-4 flex items-center justify-between border-t border-[#D8D2C6] bg-[#EAE6DF]">
                <button
                  disabled={activityPage <= 1}
                  onClick={() => setActivityPage((p) => Math.max(1, p - 1))}
                  className="neu-btn-sm px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </button>
                <span className="text-xs text-pencil">
                  Page {activityPage} of {totalActivityPages}
                </span>
                <button
                  disabled={activityPage >= totalActivityPages}
                  onClick={() => setActivityPage((p) => Math.min(totalActivityPages, p + 1))}
                  className="neu-btn-sm px-3 py-1 rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. TAB 6: CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {/* Create Category Form */}
          <div className="neu-card p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#0047FF]" />
              <span>Add Custom Category</span>
            </h3>

            {categoryMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{categoryMsg}</span>
              </div>
            )}

            {categoryError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{categoryError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-pencil uppercase">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pet Care, Gaming, Gym"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs text-charcoal rounded-xl mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-pencil uppercase">Icon Identifier</label>
                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs text-charcoal rounded-xl mt-1"
                >
                  <option value="Layers">Layers (Default)</option>
                  <option value="Utensils">Utensils / Food</option>
                  <option value="Car">Car / Transport</option>
                  <option value="Home">Home / Rent</option>
                  <option value="Zap">Zap / Bills</option>
                  <option value="Film">Film / Entertainment</option>
                  <option value="ShoppingBag">Shopping Bag</option>
                  <option value="Heart">Heart / Health</option>
                  <option value="GraduationCap">Graduation Cap</option>
                  <option value="Plane">Plane / Travel</option>
                  <option value="Gift">Gift</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-pencil uppercase">Color Swatch</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono text-pencil">{newCatColor}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingCategory}
                className="neu-btn-blue w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {savingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                <span>{savingCategory ? 'Creating...' : 'Create Category'}</span>
              </button>
            </form>
          </div>

          {/* Existing Categories List */}
          <div className="neu-card p-6 rounded-2xl md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-charcoal">
              Global Platform Categories ({categories.length})
            </h3>
            <p className="text-xs text-pencil">
              These categories are available to all users across expense tracking and budgeting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="neu-inset p-3 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: c.color || '#0047FF' }}
                    >
                      <CategoryIcon name={c.icon} className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal">{c.name}</p>
                      <p className="text-[10px] text-pencil uppercase font-mono">{c.color}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    title="Delete Category"
                    className="p-1.5 text-pencil hover:text-loss transition-colors rounded-lg neu-btn-sm cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. USER ACTIVITY INSPECTOR MODAL */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#EAE6DF] rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleIn border border-[#D8D2C6]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D8D2C6]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-charcoal text-white flex items-center justify-center font-bold text-sm">
                  {inspectingUser.name ? inspectingUser.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-charcoal">
                    {inspectingUser.name}’s Activity Profile
                  </h2>
                  <p className="text-xs text-pencil">
                    {inspectingUser.email} • Joined on {formatDate(inspectingUser.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setInspectingUser(null);
                  setInspectDetail(null);
                }}
                className="p-2 text-pencil hover:text-charcoal neu-btn-sm rounded-xl cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {loadingInspect ? (
              <div className="py-16 text-center text-pencil">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#0047FF] mb-2" />
                <p className="text-xs">Fetching complete ledger and activities...</p>
              </div>
            ) : inspectDetail ? (
              <div className="space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="neu-inset p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-pencil uppercase">Total Recorded</span>
                    <p className="text-base font-extrabold text-charcoal mt-0.5">
                      {formatCurrency(inspectDetail.user.totalExpenseSum)}
                    </p>
                  </div>
                  <div className="neu-inset p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-pencil uppercase">Total Entries</span>
                    <p className="text-base font-extrabold text-charcoal mt-0.5">
                      {inspectDetail.expenses.length}
                    </p>
                  </div>
                  <div className="neu-inset p-3.5 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-pencil uppercase">Budgets Set</span>
                    <p className="text-base font-extrabold text-charcoal mt-0.5">
                      {inspectDetail.budgets.length}
                    </p>
                  </div>
                </div>

                {/* Expenses History */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-pencil uppercase tracking-wider">
                    Recent Itemized Expenses ({inspectDetail.expenses.length})
                  </h4>
                  <div className="neu-inset rounded-xl max-h-52 overflow-y-auto divide-y divide-[#D8D2C6]/60">
                    {inspectDetail.expenses.length === 0 ? (
                      <p className="p-4 text-xs text-pencil text-center">No recorded expenses.</p>
                    ) : (
                      inspectDetail.expenses.map((e) => (
                        <div key={e.id} className="p-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0"
                              style={{ backgroundColor: e.categoryColor || '#0047FF' }}
                            >
                              <CategoryIcon name={e.categoryIcon} className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-bold text-charcoal">{e.description}</p>
                              <p className="text-[10px] text-pencil">
                                {e.categoryName} • {formatDate(e.expenseDate)} • {e.paymentMethod}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-loss">-{formatCurrency(e.amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Budgets & Goals */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-pencil uppercase tracking-wider">
                    Active Monthly Budgets ({inspectDetail.budgets.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {inspectDetail.budgets.length === 0 ? (
                      <p className="text-xs text-pencil col-span-2 neu-inset p-3 rounded-xl text-center">
                        No active monthly budgets configured.
                      </p>
                    ) : (
                      inspectDetail.budgets.map((b) => (
                        <div
                          key={b.id}
                          className="neu-card p-3 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="h-6 w-6 rounded-md flex items-center justify-center text-white"
                              style={{ backgroundColor: b.categoryColor || '#0047FF' }}
                            >
                              <CategoryIcon name={b.categoryIcon} className="h-3 w-3" />
                            </div>
                            <span className="font-bold text-charcoal">{b.categoryName}</span>
                          </div>
                          <span className="font-bold text-[#0047FF]">{formatCurrency(b.amount)}/mo</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Peer Debt Ledgers */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-pencil uppercase tracking-wider">
                    Peer Debt & Lending ({inspectDetail.loans.length})
                  </h4>
                  <div className="neu-inset rounded-xl max-h-44 overflow-y-auto divide-y divide-[#D8D2C6]/60">
                    {inspectDetail.loans.length === 0 ? (
                      <p className="p-4 text-xs text-pencil text-center">No peer debt ledgers found.</p>
                    ) : (
                      inspectDetail.loans.map((l) => (
                        <div key={l.id} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-charcoal">{l.contactName}</p>
                            <p className="text-[10px] text-pencil">
                              {l.type === 'GIVEN' ? 'Lent out' : 'Borrowed from'} • Date: {formatDate(l.loanDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-charcoal">{formatCurrency(l.amount)}</p>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                l.status === 'SETTLED'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {l.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
