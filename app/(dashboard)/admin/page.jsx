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
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const AdminAnalyticsCharts = dynamic(
  () => import('@/components/admin/AdminAnalyticsCharts'),
  {
    ssr: false,
    loading: () => (
      <div className="clay-card p-12 text-center text-[var(--text-muted)]">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500 mb-3" />
        <p className="text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Compiling Platform Analytics...
        </p>
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
  const [newCatColor, setNewCatColor] = useState('#7C3AED');
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
        setCategoryMsg('Category added successfully!');
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
    if (!confirm('Are you sure you want to remove this global category?')) return;
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
          `expensewise-snapshot-${new Date().toISOString().split('T')[0]}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setExportSuccessMsg('Platform JSON Snapshot Downloaded!');
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
        setExportSuccessMsg(`Master CSV (${res.count} Records) Downloaded!`);
      } else {
        alert(res.error || 'Failed to generate CSV.');
      }
    } catch (err) {
      alert(err.message || 'Error exporting CSV.');
    } finally {
      setDownloadingCsv(false);
    }
  };

  const navTabs = [
    { id: 'users', label: 'Directory', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'backup', label: 'Backups', icon: Database },
    { id: 'activities', label: 'Stream', icon: Clock },
    { id: 'categories', label: 'Categories', icon: Layers },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="clay-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 clay-orb flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="clay-badge-pill bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-xs font-bold">
                Platform Console
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">Administrator Access</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mt-1"
              style={{ fontFamily: 'Nunito, sans-serif' }}
            >
              Command Center
            </h1>
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
          className="clay-btn-secondary px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 self-stretch sm:self-auto cursor-pointer"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          <RefreshCw className="h-4 w-4 text-violet-500" />
          <span>Sync All Data</span>
        </button>
      </div>

      {/* 2. EXECUTIVE KPI TILES */}
      <AdminOverviewCards overview={overview} loadingOverview={loadingOverview} />

      {/* 3. SUB-SYSTEM NAVIGATION TABS */}
      <div className="clay-card p-2 sm:p-2.5 rounded-[24px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white clay-pill shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'
                }`}
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-violet-500'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ACTIVE TAB CONTENT */}
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

      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          {loadingAnalytics ? (
            <div className="clay-card p-12 text-center text-[var(--text-muted)]">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-500 mb-3" />
              <p className="text-sm font-bold" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Aggregating Platform Analytics...
              </p>
            </div>
          ) : (
            <AdminAnalyticsCharts analytics={analytics} />
          )}
        </div>
      )}

      {activeTab === 'health' && (
        <AdminHealthTab
          health={health}
          loadingHealth={loadingHealth}
          pingingDb={pingingDb}
          handlePingDb={handlePingDb}
        />
      )}

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

      {/* 5. USER INSPECTION MODAL */}
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
