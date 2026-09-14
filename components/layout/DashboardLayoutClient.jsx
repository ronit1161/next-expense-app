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
} from 'lucide-react';
import { logoutAction } from '@/actions/auth-actions';
import InstallPwaButton from '@/components/ui/InstallPwaButton';

export default function DashboardLayoutClient({ user, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  const navItems = [
    { name: 'Overview', to: '/dashboard', icon: Compass },
    { name: 'Activity', to: '/expenses', icon: Clock },
    { name: 'Budgets', to: '/budgets', icon: PiggyBank },
    { name: 'Lending & Debts', to: '/debts', icon: ArrowLeftRight },
    { name: 'Reports', to: '/reports', icon: FileSpreadsheet },
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
    <div className="flex min-h-screen bg-[#EAE6DF] text-[#1E2025] w-full max-w-full overflow-x-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-[#EAE6DF] shadow-[6px_0_18px_rgba(168,160,146,0.32)] p-6 justify-between z-20">
        <div className="flex flex-col gap-7">
          {/* Brand Wordmark */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-[#0047FF] shadow-[0_0_8px_rgba(0,71,255,0.6)]"></span>
              <span className="font-display font-bold tracking-tight text-lg text-[#1E2025]">
                ExpenseWise
              </span>
            </div>
            <p className="text-[10px] font-bold text-pencil uppercase tracking-wider mt-1">
              Personal Finance Journal
            </p>
          </div>

          {/* Quick Add Action */}
          <button
            onClick={handleQuickAdd}
            className="neu-btn-blue inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-white cursor-pointer active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Record Entry</span>
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.to}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'neu-inset text-charcoal'
                      : 'text-pencil hover:text-charcoal hover:neu-card-sm'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#0047FF]' : 'text-pencil'
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Account & Sign Out */}
        <div className="pt-4 flex flex-col gap-3">
          {/* Desktop Install App Trigger (Hidden in standalone app) */}
          <InstallPwaButton className="w-full justify-center" />

          <div className="neu-inset p-3 rounded-xl flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-charcoal text-white text-xs font-bold neu-card-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-charcoal truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-[11px] text-pencil truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-pencil hover:text-loss transition-colors pt-1 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col md:pl-64 min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-[#EAE6DF]">
        {/* MOBILE TOP BAR (Neumorphic Header) */}
        <header className="flex md:hidden h-14 items-center justify-between px-4 bg-[#EAE6DF] shadow-[0_4px_12px_rgba(168,160,146,0.22)] sticky top-0 z-30 w-full min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0047FF] shadow-[0_0_6px_rgba(0,71,255,0.5)]"></span>
            <span className="font-display font-bold text-sm tracking-tight text-charcoal">
              ExpenseWise
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Header Install App Trigger (Hidden in standalone app) */}
            <InstallPwaButton variant="header" />

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAE6DF] text-charcoal neu-card-sm text-[11px] font-bold">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* SCROLLING PAGE BODY */}
        <main className="flex-1 px-4 py-5 md:px-10 md:py-8 max-w-5xl w-full min-w-0 mx-auto pb-24 md:pb-12 bg-[#EAE6DF]">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION (Molded Neumorphic Bar) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 neu-tabbar flex items-center justify-around px-2 z-40">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 transition-colors ${
            pathname === '/dashboard' ? 'text-[#0047FF] font-bold' : 'text-pencil'
          }`}
        >
          <Compass className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/expenses"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 transition-colors ${
            pathname === '/expenses' ? 'text-[#0047FF] font-bold' : 'text-pencil'
          }`}
        >
          <Clock className="h-5 w-5" />
          <span>Activity</span>
        </Link>

        {/* CENTER PROMINENT 3D NEUMORPHIC ADD BUTTON */}
        <button
          onClick={handleQuickAdd}
          aria-label="Record Expense"
          className="neu-btn-blue flex h-13 w-13 items-center justify-center rounded-full text-white active:scale-95 transition-all -mt-6 border-4 border-[#EAE6DF] cursor-pointer"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </button>

        <Link
          href="/budgets"
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 transition-colors ${
            pathname === '/budgets' ? 'text-[#0047FF] font-bold' : 'text-pencil'
          }`}
        >
          <PiggyBank className="h-5 w-5" />
          <span>Budgets</span>
        </Link>

        <button
          onClick={() => setMoreDrawerOpen(true)}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold py-1 px-3 cursor-pointer transition-colors ${
            pathname === '/debts' || pathname === '/reports'
              ? 'text-[#0047FF] font-bold'
              : 'text-pencil'
          }`}
        >
          <Menu className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>

      {/* MOBILE MORE ACTIONS DRAWER */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs md:hidden animate-fadeIn">
          <div className="w-full bg-[#EAE6DF] rounded-t-3xl p-6 shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3">
              <span className="text-[10px] font-bold text-pencil uppercase tracking-wider">
                Additional Ledgers
              </span>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-1 text-pencil hover:text-charcoal cursor-pointer neu-btn-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/debts"
                onClick={() => setMoreDrawerOpen(false)}
                className="neu-card p-4 rounded-xl flex flex-col gap-2 transition-transform active:scale-[0.98]"
              >
                <ArrowLeftRight className="h-5 w-5 text-[#0047FF]" />
                <span className="text-xs font-bold text-charcoal">Peer Ledgers</span>
                <span className="text-[10px] text-pencil">Lending & Borrowing</span>
              </Link>

              <Link
                href="/reports"
                onClick={() => setMoreDrawerOpen(false)}
                className="neu-card p-4 rounded-xl flex flex-col gap-2 transition-transform active:scale-[0.98]"
              >
                <FileSpreadsheet className="h-5 w-5 text-[#0047FF]" />
                <span className="text-xs font-bold text-charcoal">Reports & CSV</span>
                <span className="text-[10px] text-pencil">Statements & export</span>
              </Link>
            </div>

            {/* In-Drawer Install App Action */}
            <InstallPwaButton className="w-full justify-center py-2.5" />

            <div className="pt-3 neu-inset p-3 rounded-xl flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-charcoal truncate">{user?.name}</p>
                <p className="text-[10px] text-pencil truncate">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-bold text-loss px-3 py-1.5 rounded-lg neu-btn cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
