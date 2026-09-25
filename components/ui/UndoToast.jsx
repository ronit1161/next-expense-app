'use client';

import { useState, useEffect, useRef } from 'react';
import { Undo2, X, Trash2 } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

/**
 * UndoToast:
 * A non-blocking, fintech-grade floating toast that replaces native confirm() dialogs.
 * Provides a 5-second countdown with an "Undo" button and progress bar.
 */
export default function UndoToast({
  isOpen,
  message = 'Transaction removed',
  subMessage = '',
  onUndo,
  onDismiss,
  duration = 5000,
}) {
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    startTimeRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining > 0) {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        if (onDismiss) onDismiss();
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isOpen, duration, onDismiss]);

  if (!isOpen) return null;

  const handleUndoClick = () => {
    triggerHaptic('success');
    if (onUndo) onUndo();
  };

  const handleDismissClick = () => {
    triggerHaptic('light');
    if (onDismiss) onDismiss();
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92vw] animate-scaleIn select-none"
    >
      <div className="relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-2xl p-3.5 border border-white/10 dark:border-slate-800/10 flex items-center justify-between gap-3">
        {/* Left: Trash icon + messages */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-8 w-8 rounded-xl bg-rose-500/20 text-rose-400 dark:text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate leading-tight">
              {message}
            </p>
            {subMessage && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 font-medium">
                {subMessage}
              </p>
            )}
          </div>
        </div>

        {/* Right: Undo action button & dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleUndoClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-500/20 dark:bg-teal-500/15 hover:bg-teal-500/30 text-teal-400 dark:text-teal-600 text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Undo2 className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Undo</span>
          </button>

          <button
            onClick={handleDismissClick}
            className="h-7 w-7 rounded-lg text-slate-400 hover:text-white dark:hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bottom countdown progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 dark:bg-slate-900/10">
          <div
            className="h-full bg-teal-400 dark:bg-teal-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
