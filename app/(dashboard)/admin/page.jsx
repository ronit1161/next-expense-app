'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  Layers,
  RefreshCw,
  Clock,
  Loader2,
  BarChart3,
  Activity,
  Database,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const AdminAnalyticsCharts = dynamic(
  () => import('@/components/admin/AdminAnalyticsCharts'),
  {
    ssr: false,
    loading: () => (
      <div className="neu-card p-12 rounded-2xl flex flex-col items-center justify-center text-pencil">
        <Loader2 className="h-8 w-8 animate-spin text-[#0047FF] mb-3" />
        <p className="text-xs font-semibold">Loading platform analytics & charts...</p>
      </div>
    ),
  }
);

import AdminOverviewCards from '@/components/admin/AdminOverviewCards';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminUserInspectModal from '@/components/admin/AdminUserInspectModal';
import AdminActivitiesTab from '@/components/admin/AdminActivitiesTab';
import AdminCategoriesTab from '@/components/admin/AdminCategoriesTab';
import AdminHealthTab from '@/components/admin/AdminHealthTab';
import AdminBackupTab from '@/components/admin/AdminBackupTab';

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
      <AdminOverviewCards overview={overview} loadingOverview={loadingOverview} />

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
        <AdminUsersTab
          users={users}
          loadingUsers={loadingUsers}
          userSearch={userSearch}
          setUserSearch={setUserSearch}
          usersPage={usersPage}
          setUsersPage={setUsersPage}
          totalUsersPages={totalUsersPages}
          onInspectUser={handleInspectUser}
        />
      )}

      {/* 5. TAB 2: PLATFORM ANALYTICS & MACRO CHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {loadingAnalytics ? (
            <div className="neu-card p-12 rounded-2xl flex flex-col items-center justify-center text-pencil">
              <Loader2 className="h-8 w-8 animate-spin text-[#0047FF] mb-3" />
              <p className="text-xs font-semibold">Aggregating platform-wide analytics...</p>
            </div>
          ) : (
            <AdminAnalyticsCharts analytics={analytics} />
          )}
        </div>
      )}

      {/* 6. TAB 3: SYSTEM HEALTH & DB DIAGNOSTICS */}
      {activeTab === 'health' && (
        <AdminHealthTab
          health={health}
          loadingHealth={loadingHealth}
          pingingDb={pingingDb}
          handlePingDb={handlePingDb}
        />
      )}

      {/* 7. TAB 4: DATA BACKUP & MASTER EXPORT */}
      {activeTab === 'backup' && (
        <AdminBackupTab
          exportSuccessMsg={exportSuccessMsg}
          downloadingBackup={downloadingBackup}
          handleDownloadBackup={handleDownloadBackup}
          downloadingCsv={downloadingCsv}
          handleDownloadMasterCsv={handleDownloadMasterCsv}
          csvStartDate={csvStartDate}
          setCsvStartDate={setCsvStartDate}
          csvEndDate={csvEndDate}
          setCsvEndDate={setCsvEndDate}
        />
      )}

      {/* 8. TAB 5: GLOBAL ACTIVITY STREAM */}
      {activeTab === 'activities' && (
        <AdminActivitiesTab
          activities={activities}
          loadingActivities={loadingActivities}
          activitySearch={activitySearch}
          setActivitySearch={setActivitySearch}
          activityPage={activityPage}
          setActivityPage={setActivityPage}
          totalActivityPages={totalActivityPages}
        />
      )}

      {/* 9. TAB 6: CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <AdminCategoriesTab
          categories={categories}
          newCatName={newCatName}
          setNewCatName={setNewCatName}
          newCatIcon={newCatIcon}
          setNewCatIcon={setNewCatIcon}
          newCatColor={newCatColor}
          setNewCatColor={setNewCatColor}
          savingCategory={savingCategory}
          categoryMsg={categoryMsg}
          categoryError={categoryError}
          handleCreateCategory={handleCreateCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      )}

      {/* 10. USER ACTIVITY INSPECTOR MODAL */}
      <AdminUserInspectModal
        inspectingUser={inspectingUser}
        inspectDetail={inspectDetail}
        loadingInspect={loadingInspect}
        onClose={() => {
          setInspectingUser(null);
          setInspectDetail(null);
        }}
      />
    </div>
  );
}
