'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', variant = 'sidebar' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl bg-[#E2E8F0] dark:bg-[#1E293B] opacity-50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  if (variant === 'header') {
    return (
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700" />
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`fintech-btn-secondary px-3.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 cursor-pointer rounded-xl ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default 'sidebar' variant (full width with label and toggle indicator)
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`p-2.5 flex items-center justify-between w-full text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-200">
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700 dark:text-slate-300" />}
        </div>
        <span className="text-xs font-semibold">
          {isDark ? 'Light Theme' : 'Dark Theme'}
        </span>
      </div>

      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          isDark
            ? 'bg-amber-400/20 text-amber-400'
            : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
        }`}
      >
        {isDark ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
