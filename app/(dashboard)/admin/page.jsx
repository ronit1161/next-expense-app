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
      <div className="border-4 border-black dark:border-white/20 p-12 text-center text-pencil bg-[var(--bg-surface)]">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#FF3000] mb-2" />
        <p className="text-xs font-mono uppercase font-black">COMPILING PLATFORM ANALYTICS...</p>
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
  const [newCatColor, setNewCatColor] = useState('#000000');
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
        setCategoryMsg('CATEGORY INITIALIZED');
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
    if (!confirm('CONFIRM DELETE: Remove this global category?')) return;
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
        setExportSuccessMsg('PLATFORM JSON SNAPSHOT DOWNLOADED');
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
        setExportSuccessMsg(`MASTER CSV (${res.count} RECORDS) DOWNLOADED`);
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
    { id: 'users', label: '06.1 DIRECTORY', icon: Users },
    { id: 'analytics', label: '06.2 ANALYTICS', icon: BarChart3 },
    { id: 'health', label: '06.3 HEALTH', icon: Activity },
    { id: 'backup', label: '06.4 BACKUPS', icon: Database },
    { id: 'activities', label: '06.5 STREAM', icon: Clock },
    { id: 'categories', label: '06.6 CATEGORIES', icon: Layers },
  ];

  return (
    <div className="space-y-8 pb-16 animate-fadeIn">
      {/* 1. TOP HEADER BANNER */}
      <div className="border-b-4 border-black dark:border-white/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-3 w-3 bg-[#FF3000]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
                06. ADMIN // PLATFORM CONSOLE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-charcoal">
              STAFF COMMAND CENTER
            </h1>
          </div>

          <button
            onClick={() => {
              fetchOverview();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'analytics') fetchAnalytics();
              if (activeTab === 'health') fetchHealth();
              if (activeTab === 'activities') fetchActivities();
            }}
            className="swiss-btn px-4 py-2 text-xs font-black flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#FF3000]" />
            <span>SYNC ALL DATA</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI TILES */}
      <AdminOverviewCards overview={overview} loadingOverview={loadingOverview} />

      {/* 3. SUB-SYSTEM NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2.5 border-2 text-xs font-black uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-black dark:border-white/30 bg-[var(--bg-surface)] text-charcoal hover:bg-black hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#FF3000]' : ''}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
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
            <div className="border-4 border-black dark:border-white/20 p-12 text-center text-pencil bg-[var(--bg-surface)]">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#FF3000] mb-2" />
              <p className="text-xs font-mono uppercase font-black">AGGREGATING PLATFORM ANALYTICS...</p>
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
