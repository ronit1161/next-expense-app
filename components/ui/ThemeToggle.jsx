'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', variant = 'sidebar' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 border-2 border-black dark:border-white/20 bg-[var(--bg-subtle)] opacity-50 ${className}`}
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
        className={`flex h-7 w-7 items-center justify-center border border-black dark:border-white/30 text-charcoal hover:bg-black hover:text-white transition-colors cursor-pointer ${className}`}
      >
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-white" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-black" />
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 border-2 border-black dark:border-white/30 text-xs font-black uppercase text-charcoal hover:bg-black hover:text-white cursor-pointer transition-all ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5" />
            <span>LIGHT MODE</span>
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5" />
            <span>DARK MODE</span>
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
      className={`border-2 border-black dark:border-white/20 p-2 flex items-center justify-between w-full text-xs font-black text-charcoal bg-[var(--bg-subtle)] transition-all cursor-pointer hover:bg-black hover:text-white group ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black">
          {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
        </div>
        <span className="text-[10px] uppercase tracking-wider">
          {isDark ? 'LIGHT MODE' : 'DARK MODE'}
        </span>
      </div>

      <span className="text-[9px] font-mono px-1 border border-current uppercase">
        {isDark ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}
