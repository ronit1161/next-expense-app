'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  Clock,
  PiggyBank,
  ArrowLeftRight,
  FileSpreadsheet,
  LogOut,
  Plus,
  Menu,
  X,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import InstallPwaButton from '@/components/ui/InstallPwaButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DashboardLayoutClient({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const navItems = [
    {
      name: 'Overview',
      to: '/dashboard',
      icon: Compass,
      gradient: 'from-blue-400 to-indigo-600',
    },
    {
      name: 'Activity',
      to: '/expenses',
      icon: Clock,
      gradient: 'from-purple-400 to-purple-600',
    },
    {
      name: 'Budgets',
      to: '/budgets',
      icon: PiggyBank,
      gradient: 'from-pink-400 to-pink-600',
    },
    {
      name: 'Debts & Loans',
      to: '/debts',
      icon: ArrowLeftRight,
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      name: 'Reports',
      to: '/reports',
      icon: FileSpreadsheet,
      gradient: 'from-emerald-400 to-teal-600',
    },
  ];

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  const handleQuickAdd = () => {
    if (pathname === '/expenses') {
      window.dispatchEvent(new CustomEvent('open-add-expense-modal'));
    } else {
      router.push('/expenses?action=add');
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] w-full max-w-full overflow-x-hidden relative">
      {/* DESKTOP SIDEBAR - FLOATING CLAY CAPSULE */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-4 md:left-4 z-30 justify-between">
        <div className="clay-card h-full p-6 flex flex-col justify-between overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-6">
            {/* Brand Wordmark with 3D Candy Orb */}
            <div className="flex items-center gap-3 pb-2 border-b border-purple-500/10">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-400 via-purple-600 to-pink-500 flex items-center justify-center text-white clay-orb shrink-0 shadow-lg">
                <Sparkles className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-heading font-black text-xl tracking-tight text-charcoal bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                  ExpenseWise
                </h1>
                <p className="font-heading font-bold text-[11px] text-pencil tracking-wider uppercase">
                  Digital Clay Finance
                </p>
              </div>
            </div>

            {/* Quick Record Action Trigger (Chunky Squishy Clay Button) */}
            <button
              onClick={handleQuickAdd}
              className="clay-btn-primary w-full h-14 text-sm font-heading font-black flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="h-5 w-5 stroke-[3]" />
              <span>Record Expense</span>
            </button>

            {/* Navigation Links with Tactile Pill Active State */}
            <nav className="flex flex-col gap-1.5">
              <span className="font-heading text-[10px] font-black uppercase tracking-widest text-pencil px-3 mb-1">
                Menu
              </span>
              {navItems.map((item) => {
                const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.to}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-[20px] font-heading font-extrabold text-sm transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600/15 to-pink-600/10 dark:from-purple-500/25 dark:to-pink-500/15 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-500/20 translate-x-1'
                        : 'text-pencil hover:text-charcoal hover:bg-white/60 dark:hover:bg-white/5 hover:translate-x-1'
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${item.gradient} ${
                        isActive ? 'clay-orb shadow-md scale-105' : 'opacity-85 shadow-sm'
                      }`}
                    >
                      <Icon className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span className="tracking-tight">{item.name}</span>
                  </Link>
                );
              })}

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`flex items-center justify-between px-3.5 py-3 rounded-[20px] font-heading font-extrabold text-sm transition-all duration-200 mt-2 border ${
                    pathname.startsWith('/admin')
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-300 border-pink-500/30 shadow-sm translate-x-1'
                      : 'border-pink-500/20 text-charcoal hover:bg-pink-500/10 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white clay-orb shadow-sm">
                      <ShieldAlert className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span>Admin Portal</span>
                  </div>
                  <span className="text-[10px] font-heading font-black px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-sm">
                    STAFF
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* User Profile & Controls */}
          <div className="pt-4 border-t border-purple-500/10 flex flex-col gap-3">
            <ThemeToggle variant="sidebar" />
            <InstallPwaButton className="w-full justify-center" />

            {/* User Account Capsule */}
            <div className="p-3.5 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C] flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white font-heading font-black text-sm flex items-center justify-center clay-orb shrink-0">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-heading font-extrabold text-xs text-charcoal truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-pencil truncate">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                aria-label="Sign Out"
                title="Sign Out"
                className="h-8 w-8 rounded-xl bg-white dark:bg-[#2B243D] flex items-center justify-center text-pencil hover:text-rose-600 shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col md:pl-80 min-h-screen w-full min-w-0 max-w-full overflow-x-hidden">
        {/* MOBILE TOP BAR - FLOATING CLAY PILL */}
        <header className="flex md:hidden h-16 items-center justify-between px-4 mx-3 my-2 rounded-[24px] clay-card sticky top-2 z-30">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-400 via-purple-600 to-pink-500 flex items-center justify-center text-white clay-orb">
              <Sparkles className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="font-heading font-black text-base tracking-tight bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
              ExpenseWise
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="header" />
            <InstallPwaButton variant="header" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white font-heading font-black text-xs clay-orb">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* SCROLLING PAGE BODY */}
        <main className="flex-1 px-4 py-4 md:px-8 md:py-6 max-w-6xl w-full min-w-0 mx-auto pb-28 md:pb-10">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION - FLOATING CLAY DOCK */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 h-16 rounded-[28px] clay-card flex items-center justify-around px-2 z-40 shadow-xl border border-white/80 dark:border-white/10">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-heading font-extrabold py-1 px-2.5 rounded-2xl transition-all ${
            pathname === '/dashboard'
              ? 'text-purple-600 dark:text-purple-400 scale-110'
              : 'text-pencil hover:text-charcoal'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/expenses"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-heading font-extrabold py-1 px-2.5 rounded-2xl transition-all ${
            pathname === '/expenses'
              ? 'text-purple-600 dark:text-purple-400 scale-110'
              : 'text-pencil hover:text-charcoal'
          }`}
        >
          <Clock className="h-5 w-5" />
          <span>Activity</span>
        </Link>

        {/* CENTER SQUISHY ACTION ORB */}
        <button
          onClick={handleQuickAdd}
          aria-label="Record Expense"
          className="clay-btn-primary flex h-13 w-13 rounded-full items-center justify-center text-white -mt-6 shadow-xl active:scale-90 transition-transform cursor-pointer"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
        </button>

        <Link
          href="/budgets"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-heading font-extrabold py-1 px-2.5 rounded-2xl transition-all ${
            pathname === '/budgets'
              ? 'text-purple-600 dark:text-purple-400 scale-110'
              : 'text-pencil hover:text-charcoal'
          }`}
        >
          <PiggyBank className="h-5 w-5" />
          <span>Budgets</span>
        </Link>

        <button
          onClick={() => setMoreDrawerOpen(true)}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-heading font-extrabold py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
            pathname === '/debts' || pathname === '/reports' || pathname.startsWith('/admin')
              ? 'text-purple-600 dark:text-purple-400 scale-110'
              : 'text-pencil hover:text-charcoal'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>

      {/* MOBILE MORE ACTIONS DRAWER */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:hidden animate-fadeIn p-3">
          <div className="w-full clay-surface bg-white dark:bg-[#231D35] p-6 space-y-4 rounded-[36px] shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/10">
              <span className="font-heading text-xs font-black uppercase tracking-wider text-charcoal">
                More Features
              </span>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={`grid ${user?.role === 'ADMIN' ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
              <Link
                href="/debts"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-3.5 rounded-[24px] bg-[#EFEBF5] dark:bg-[#1C172C] flex flex-col gap-1.5 transition-transform hover:scale-105"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white clay-orb">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <span className="font-heading text-xs font-black">Lending</span>
                <span className="text-[10px] text-pencil">Debts & Loans</span>
              </Link>

              <Link
                href="/reports"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-3.5 rounded-[24px] bg-[#EFEBF5] dark:bg-[#1C172C] flex flex-col gap-1.5 transition-transform hover:scale-105"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white clay-orb">
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <span className="font-heading text-xs font-black">Reports</span>
                <span className="text-[10px] text-pencil">Export Ledger</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="p-3.5 rounded-[24px] bg-[#EFEBF5] dark:bg-[#1C172C] flex flex-col gap-1.5 transition-transform hover:scale-105 border border-pink-500/20"
                >
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white clay-orb">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <span className="font-heading text-xs font-black text-pink-600">Admin</span>
                  <span className="text-[10px] text-pencil">Staff Portal</span>
                </Link>
              )}
            </div>

            <ThemeToggle variant="sidebar" />
            <InstallPwaButton className="w-full justify-center py-3" />

            <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="font-heading font-black text-xs text-charcoal truncate">{user?.name}</p>
                <p className="text-[11px] text-pencil truncate">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="clay-btn-primary py-2 px-4 text-xs font-heading font-black rounded-xl cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
