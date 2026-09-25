'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', variant = 'sidebar' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`h-11 w-11 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C] opacity-50 ${className}`}
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
        className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-charcoal hover:-translate-y-0.5 active:scale-90 shadow-sm transition-all cursor-pointer ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600" />
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`clay-btn-secondary px-4 py-2 text-xs font-black uppercase text-charcoal flex items-center gap-2 cursor-pointer ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="h-4 w-4 text-amber-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 text-indigo-600" />
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
      className={`clay-btn-secondary p-2.5 flex items-center justify-between w-full text-xs font-extrabold text-charcoal cursor-pointer group rounded-[20px] ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-400 to-indigo-600 text-white shadow-sm">
          {isDark ? <Sun className="h-3.5 w-3.5 text-amber-200" /> : <Moon className="h-3.5 w-3.5" />}
        </div>
        <span className="font-heading font-extrabold text-xs tracking-wide">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </div>

      <span
        className={`text-[10px] font-heading font-black px-2.5 py-1 rounded-full ${
          isDark
            ? 'bg-amber-400/20 text-amber-300'
            : 'bg-purple-600/15 text-purple-700'
        }`}
      >
        {isDark ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
