'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '', variant = 'sidebar' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl neu-inset opacity-50 ${className}`}
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
        className={`flex h-8 w-8 items-center justify-center rounded-xl neu-btn-sm text-charcoal hover:text-[#0047FF] transition-transform active:scale-95 cursor-pointer ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 animate-spin-slow" />
        ) : (
          <Moon className="h-4 w-4 text-[#0047FF]" />
        )}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl neu-btn text-xs font-semibold text-charcoal cursor-pointer active:scale-95 transition-all ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5 text-amber-400" />
            <span>Light Theme</span>
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5 text-[#0047FF]" />
            <span>Dark Theme</span>
          </>
        )}
      </button>
    );
  }

  // Default 'sidebar' variant (full width with label and toggle switch)
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`neu-inset p-2.5 rounded-xl flex items-center justify-between w-full text-xs font-semibold text-charcoal transition-all cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`h-6 w-6 rounded-lg flex items-center justify-center neu-card-sm ${
            isDark ? 'text-amber-400' : 'text-[#0047FF]'
          }`}
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </div>
        <span className="text-[11px] text-pencil group-hover:text-charcoal transition-colors">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      <div
        className={`h-4 w-8 rounded-full p-0.5 flex items-center transition-colors ${
          isDark ? 'bg-blue-600 justify-end' : 'bg-[#D8D2C6] justify-start'
        }`}
      >
        <span className="h-3 w-3 rounded-full bg-white shadow-sm"></span>
      </div>
    </button>
  );
}
