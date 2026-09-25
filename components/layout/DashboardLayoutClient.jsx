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
  Wallet,
  Bell,
  Sparkles,
  BarChart3,
  CreditCard,
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
    },
    {
      name: 'Activity',
      to: '/expenses',
      icon: Clock,
    },
    {
      name: 'Budgets',
      to: '/budgets',
      icon: PiggyBank,
    },
    {
      name: 'Peer Debts',
      to: '/debts',
      icon: ArrowLeftRight,
    },
    {
      name: 'Reports',
      to: '/reports',
      icon: FileSpreadsheet,
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
      {/* DESKTOP SIDEBAR - MINIMALIST FINTECH CAPSULE */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-4 md:left-4 z-30 justify-between">
        <div className="bg-[var(--bg-card)] border border-[var(--border-clay)] rounded-[28px] h-full p-6 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-sm">
          <div className="flex flex-col gap-6">
            {/* Brand Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-clay)]">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-heading font-black text-lg tracking-tight text-[var(--text-primary)]">
                  ExpenseWise
                </h1>
                <p className="font-heading font-bold text-[10px] text-[var(--text-muted)] tracking-wider uppercase">
                  Mobile Fintech Ledger
                </p>
              </div>
            </div>

            {/* Quick Record Action Trigger (Crisp Pill CTA) */}
            <button
              onClick={handleQuickAdd}
              className="fintech-btn-primary w-full h-12 text-xs font-heading font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Record Expense</span>
            </button>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5">
              <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-3 mb-1">
                Main Menu
              </span>
              {navItems.map((item) => {
                const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.to}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-heading font-bold text-xs transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-md'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-recessed)]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 stroke-[2.2] ${isActive ? 'text-[var(--bg-canvas)]' : 'text-[var(--text-muted)]'}`} />
                    <span className="tracking-tight">{item.name}</span>
                  </Link>
                );
              })}

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-heading font-bold text-xs transition-all duration-200 mt-2 border ${
                    pathname.startsWith('/admin')
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--text-primary)] shadow-md'
                      : 'border-[var(--border-clay)] text-[var(--text-primary)] hover:bg-[var(--bg-recessed)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-4 w-4 text-rose-500 stroke-[2.2]" />
                    <span>Admin Portal</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500 border border-rose-500/20">
                    STAFF
                  </span>
                </Link>
              )}
            </nav>
          </div>

          {/* User Profile & Controls */}
          <div className="pt-4 border-t border-[var(--border-clay)] flex flex-col gap-3">
            <ThemeToggle variant="sidebar" />
            <InstallPwaButton className="w-full justify-center" />

            {/* User Account Capsule */}
            <div className="p-3 rounded-2xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-heading font-black text-xs flex items-center justify-center shrink-0">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-heading font-bold text-xs text-[var(--text-primary)] truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate font-medium">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                aria-label="Sign Out"
                title="Sign Out"
                className="h-8 w-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border-clay)] flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col md:pl-80 min-h-screen w-full min-w-0 max-w-full overflow-x-hidden">
        {/* MOBILE TOP BAR (MATCHES THE REFERENCE APP HEADER) */}
        <header className="flex md:hidden h-16 items-center justify-between px-4 mx-3 my-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-clay)] sticky top-2 z-30 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-heading font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Welcome back,
              </p>
              <h2 className="font-heading font-bold text-xs text-[var(--text-primary)] truncate max-w-[150px]">
                {user?.name || 'Fintech User'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="header" />
            <InstallPwaButton variant="header" />
          </div>
        </header>

        {/* SCROLLING PAGE BODY */}
        <main className="flex-1 px-4 py-4 md:px-8 md:py-6 max-w-5xl w-full min-w-0 mx-auto pb-28 md:pb-10">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION DOCK (MATCHES REFERENCE PHONE BOTTOM BAR) */}
      <nav className="md:hidden fintech-bottom-nav">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            pathname === '/dashboard'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${pathname === '/dashboard' ? 'bg-white/15 text-white' : ''}`}>
            <Compass className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-bold">Home</span>
        </Link>

        <Link
          href="/expenses"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            pathname === '/expenses'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${pathname === '/expenses' ? 'bg-white/15 text-white' : ''}`}>
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-bold">Activity</span>
        </Link>

        {/* QUICK RECORD ACTION TRIGGER (CENTER FLOATING BUTTON) */}
        <button
          onClick={handleQuickAdd}
          aria-label="Record Expense"
          className="fintech-btn-primary flex h-11 w-11 rounded-full items-center justify-center text-white -mt-5 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5 stroke-[3]" />
        </button>

        <Link
          href="/reports"
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
            pathname === '/reports'
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${pathname === '/reports' ? 'bg-white/15 text-white' : ''}`}>
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-bold">Analytics</span>
        </Link>

        <button
          onClick={() => setMoreDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            pathname === '/budgets' || pathname === '/debts' || pathname.startsWith('/admin')
              ? 'text-[var(--text-primary)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${pathname === '/budgets' || pathname === '/debts' ? 'bg-white/15 text-white' : ''}`}>
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-[9px] font-bold">More</span>
        </button>
      </nav>

      {/* MOBILE MORE ACTIONS DRAWER */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:hidden animate-fadeIn p-3">
          <div className="w-full bg-[var(--bg-card)] border border-[var(--border-clay)] p-6 space-y-4 rounded-3xl shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-clay)]">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                More Features
              </span>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-2 rounded-xl hover:bg-[var(--bg-recessed)] cursor-pointer text-[var(--text-muted)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={`grid ${user?.role === 'ADMIN' ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
              <Link
                href="/budgets"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-3.5 rounded-2xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex flex-col gap-1.5 transition-transform hover:scale-102"
              >
                <div className="h-8 w-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <PiggyBank className="h-4 w-4" />
                </div>
                <span className="font-heading text-xs font-bold text-[var(--text-primary)]">Budgets</span>
                <span className="text-[10px] text-[var(--text-muted)]">Target Limits</span>
              </Link>

              <Link
                href="/debts"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-3.5 rounded-2xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex flex-col gap-1.5 transition-transform hover:scale-102"
              >
                <div className="h-8 w-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <span className="font-heading text-xs font-bold text-[var(--text-primary)]">Peer Debts</span>
                <span className="text-[10px] text-[var(--text-muted)]">Lending &amp; IOUs</span>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMoreDrawerOpen(false)}
                  className="p-3.5 rounded-2xl bg-[var(--bg-recessed)] border border-rose-500/30 flex flex-col gap-1.5 transition-transform hover:scale-102"
                >
                  <div className="h-8 w-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <ShieldAlert className="h-4 w-4" />
                  </div>
                  <span className="font-heading text-xs font-bold text-rose-500">Admin</span>
                  <span className="text-[10px] text-[var(--text-muted)]">Staff Portal</span>
                </Link>
              )}
            </div>

            <ThemeToggle variant="sidebar" />
            <InstallPwaButton className="w-full justify-center py-2.5" />

            <div className="pt-3 border-t border-[var(--border-clay)] flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="font-heading font-bold text-xs text-[var(--text-primary)] truncate">{user?.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="fintech-btn-secondary py-2 px-4 text-xs font-heading font-bold rounded-xl cursor-pointer"
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
