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
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import InstallPwaButton from '@/components/ui/InstallPwaButton';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function DashboardLayoutClient({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const navItems = [
    { number: '01', name: 'OVERVIEW', to: '/dashboard', icon: Compass },
    { number: '02', name: 'ACTIVITY', to: '/expenses', icon: Clock },
    { number: '03', name: 'BUDGETS', to: '/budgets', icon: PiggyBank },
    { number: '04', name: 'LENDING & DEBTS', to: '/debts', icon: ArrowLeftRight },
    { number: '05', name: 'REPORTS', to: '/reports', icon: FileSpreadsheet },
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
    <div className="flex min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] w-full max-w-full overflow-x-hidden">
      {/* DESKTOP SIDEBAR - SWISS INTERNATIONAL ARCHITECTURAL GRID */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[var(--bg-main)] border-r-4 border-black dark:border-white/20 p-6 justify-between z-20 transition-colors">
        <div className="flex flex-col gap-6">
          {/* Brand Wordmark with Swiss Accent Flag */}
          <div className="border-b-2 border-black dark:border-white/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 bg-[#FF3000] inline-block shrink-0"></span>
              <span className="font-black text-xl tracking-tighter uppercase text-charcoal">
                EXPENSEWISE
              </span>
            </div>
            <p className="text-[10px] font-bold text-pencil uppercase tracking-widest mt-1">
              FINANCIAL LEDGER // SYSTEM
            </p>
          </div>

          {/* Quick Record Action Trigger */}
          <button
            onClick={handleQuickAdd}
            className="swiss-btn-accent w-full py-3 px-4 text-xs font-black text-white flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>RECORD ENTRY</span>
          </button>

          {/* Navigation Links - Numbered Swiss Precision */}
          <nav className="flex flex-col gap-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-pencil mb-1">
              INDEX DIRECTORY
            </span>
            {navItems.map((item) => {
              const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.to}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all border ${
                    isActive
                      ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                      : 'border-transparent text-pencil hover:text-charcoal hover:border-black dark:hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-[#FF3000]' : ''}`} />
                    <span className="tracking-tight">{item.name}</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono ${
                      isActive ? 'text-[#FF3000]' : 'text-pencil opacity-60'
                    }`}
                  >
                    {item.number}
                  </span>
                </Link>
              );
            })}

            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold transition-all border mt-2 ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#FF3000] text-white border-[#FF3000]'
                    : 'border-black dark:border-white/30 text-charcoal hover:bg-black hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="tracking-tight">ADMIN PORTAL</span>
                </div>
                <span className="text-[9px] font-mono px-1 bg-black text-white dark:bg-white dark:text-black">
                  STAFF
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* User Account & Controls */}
        <div className="pt-4 border-t-2 border-black dark:border-white/20 flex flex-col gap-3">
          {/* Theme Switcher in Sidebar */}
          <ThemeToggle variant="sidebar" />

          {/* Desktop Install App Trigger */}
          <InstallPwaButton className="w-full justify-center" />

          {/* User Account Block */}
          <div className="p-3 border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center bg-black text-white dark:bg-white dark:text-black text-xs font-black shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-charcoal truncate leading-tight uppercase">
                  {user?.name}
                </p>
                <p className="text-[10px] font-mono text-pencil truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-1.5 px-2 text-[11px] font-bold text-pencil hover:text-[#FF3000] hover:border-[#FF3000] border border-black/20 dark:border-white/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase"
            >
              <LogOut className="h-3 w-3" />
              <span>SIGN OUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col md:pl-64 min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-[var(--bg-main)] transition-colors">
        {/* MOBILE TOP BAR - SWISS RECTANGULAR HEADER */}
        <header className="flex md:hidden h-14 items-center justify-between px-4 bg-[var(--bg-main)] border-b-2 border-black dark:border-white/20 sticky top-0 z-30 w-full min-w-0 transition-colors">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 bg-[#FF3000]"></span>
            <span className="font-black text-sm uppercase tracking-tight text-charcoal">
              EXPENSEWISE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="header" />
            <InstallPwaButton variant="header" />
            <div className="flex h-7 w-7 items-center justify-center bg-black text-white dark:bg-white dark:text-black text-[10px] font-black">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* SCROLLING PAGE BODY */}
        <main className="flex-1 px-4 py-6 md:px-10 md:py-8 max-w-6xl w-full min-w-0 mx-auto pb-24 md:pb-12 bg-[var(--bg-main)] transition-colors">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--bg-surface)] border-t-3 border-black dark:border-white/20 flex items-center justify-around px-1 z-40">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black py-1 px-2 uppercase transition-colors ${
            pathname === '/dashboard' ? 'text-[#FF3000] border-b-2 border-[#FF3000]' : 'text-pencil'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span>HOME</span>
        </Link>

        <Link
          href="/expenses"
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black py-1 px-2 uppercase transition-colors ${
            pathname === '/expenses' ? 'text-[#FF3000] border-b-2 border-[#FF3000]' : 'text-pencil'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>ACTIVITY</span>
        </Link>

        {/* CENTER SWISS ACTION TRIGGER */}
        <button
          onClick={handleQuickAdd}
          aria-label="Record Expense"
          className="swiss-btn-accent flex h-11 w-11 items-center justify-center text-white active:scale-95 transition-all -mt-5 border-2 border-black cursor-pointer shadow-none"
        >
          <Plus className="h-5 w-5 stroke-[3]" />
        </button>

        <Link
          href="/budgets"
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black py-1 px-2 uppercase transition-colors ${
            pathname === '/budgets' ? 'text-[#FF3000] border-b-2 border-[#FF3000]' : 'text-pencil'
          }`}
        >
          <PiggyBank className="h-4 w-4" />
          <span>BUDGETS</span>
        </Link>

        <button
          onClick={() => setMoreDrawerOpen(true)}
          className={`flex flex-col items-center gap-0.5 text-[9px] font-black py-1 px-2 uppercase cursor-pointer transition-colors ${
            pathname === '/debts' || pathname === '/reports' || pathname.startsWith('/admin')
              ? 'text-[#FF3000] border-b-2 border-[#FF3000]'
              : 'text-pencil'
          }`}
        >
          <Menu className="h-4 w-4" />
          <span>MORE</span>
        </button>
      </nav>

      {/* MOBILE MORE ACTIONS DRAWER */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-none md:hidden animate-fadeIn">
          <div className="w-full bg-[var(--bg-surface)] border-t-4 border-black dark:border-white p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-white/20">
              <span className="text-xs font-black uppercase tracking-widest text-charcoal">
                ADDITIONAL DIRECTORY
              </span>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-1 text-pencil hover:text-charcoal border border-black dark:border-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className={`grid ${user?.role === 'ADMIN' ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
              <Link
                href="/debts"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-3 border-2 border-black dark:border-white/30 bg-[var(--bg-subtle)] flex flex-col gap-1 transition-colors hover:bg-black hover:text-white"
              >
                <ArrowLeftRight className="h-5 w-5 text-[#FF3000]" />
                <span className="text-xs font-black uppercase">PEER LEDGERS</span>
                <span className="text-[9px] text-pencil">Lending & Debt</span>
              </Link>

              <Link
                href="/reports"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-3 border-2 border-black dark:border-white/30 bg-[var(--bg-subtle)] flex flex-col gap-1 transition-colors hover:bg-black hover:text-white"
              >
                <FileSpreadsheet className="h-5 w-5 text-[#FF3000]" />
                <span className="text-xs font-black uppercase">REPORTS</span>
                <span className="text-[9px] text-pencil">Export data</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="p-3 border-2 border-[#FF3000] bg-[var(--bg-subtle)] flex flex-col gap-1 transition-colors hover:bg-[#FF3000] hover:text-white"
                >
                  <ShieldAlert className="h-5 w-5 text-[#FF3000]" />
                  <span className="text-xs font-black uppercase">ADMIN</span>
                  <span className="text-[9px] text-pencil">Staff portal</span>
                </Link>
              )}
            </div>

            {/* In-Drawer Theme Switcher & Install */}
            <ThemeToggle variant="sidebar" />
            <InstallPwaButton className="w-full justify-center py-2.5" />

            <div className="pt-3 border-t-2 border-black dark:border-white/20 flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs font-black text-charcoal truncate uppercase">{user?.name}</p>
                <p className="text-[10px] font-mono text-pencil truncate">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="py-1.5 px-3 text-xs font-black text-white bg-[#FF3000] border border-[#FF3000] uppercase cursor-pointer"
              >
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
