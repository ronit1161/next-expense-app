'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isAudioEnabled, setAudioEnabled, playAudio } from '@/lib/audio';
import { triggerHaptic } from '@/lib/haptics';

export default function SoundToggle({ className = '', variant = 'sidebar' }) {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEnabled(isAudioEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setAudioEnabled(next);
    triggerHaptic('selection');
    if (next) {
      playAudio('pop');
    }
  };

  if (!mounted) {
    return (
      <div
        className={`h-9 w-9 rounded-xl bg-[var(--bg-recessed)] opacity-50 ${className}`}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'header') {
    return (
      <button
        onClick={handleToggle}
        title={enabled ? 'Mute Sounds' : 'Enable Tactile Sounds'}
        aria-label={enabled ? 'Mute Sounds' : 'Enable Tactile Sounds'}
        className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--bg-card)] border border-[var(--border-clay)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)] transition-all cursor-pointer ${className}`}
      >
        {enabled ? (
          <Volume2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <VolumeX className="h-4 w-4 text-[var(--text-muted)] opacity-60" />
        )}
      </button>
    );
  }

  // Default 'sidebar' variant (full width with label and toggle indicator)
  return (
    <button
      onClick={handleToggle}
      aria-label={enabled ? 'Mute Sounds' : 'Enable Tactile Sounds'}
      className={`p-2.5 flex items-center justify-between w-full text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-recessed)] rounded-xl transition cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-clay)] text-[var(--text-primary)]">
          {enabled ? (
            <Volume2 className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          )}
        </div>
        <span className="text-xs font-semibold">
          Haptic Audio
        </span>
      </div>

      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          enabled
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-[var(--bg-recessed)] text-[var(--text-muted)] border border-[var(--border-clay)]'
        }`}
      >
        {enabled ? 'ON' : 'MUTED'}
      </span>
    </button>
  );
}
