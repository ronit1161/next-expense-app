'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsRight, Check, Loader2 } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

/**
 * SwipeToConfirm:
 * Ultra-tactile fintech slider (CashApp/Revolut/CRED style).
 * - Drag thumb from left to right to confirm.
 * - Haptic pulse when snapping to completion.
 * - Full touch and mouse drag support with global release listener.
 * - Keyboard support (Enter/Space) and direct tap fallback for full accessibility.
 */
export default function SwipeToConfirm({
  onConfirm,
  label = 'Slide to Record',
  disabled = false,
  disabledText = 'Enter amount & category',
  loading = false,
  className = '',
}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const currentDragXRef = useRef(0);

  const THUMB_SIZE = 40; // 40px thumb
  const PADDING = 4; // 4px padding inside track

  // Calculate maximum draggable distance
  const getMaxDrag = useCallback(() => {
    if (!trackRef.current) return 0;
    return Math.max(0, trackRef.current.offsetWidth - THUMB_SIZE - PADDING * 2);
  }, []);

  // Reset slider if loading completes or state resets
  useEffect(() => {
    if (!loading && isConfirmed) {
      const timer = setTimeout(() => {
        setIsConfirmed(false);
        setDragX(0);
        currentDragXRef.current = 0;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loading, isConfirmed]);

  // Handle Drag Start (Touch & Mouse)
  const handleStart = (clientX) => {
    if (disabled || loading || isConfirmed) return;
    setIsDragging(true);
    startXRef.current = clientX - currentDragXRef.current;
    triggerHaptic('selection');
  };

  // Drag Move
  const handleMove = useCallback(
    (clientX) => {
      if (!isDragging) return;
      const maxDrag = getMaxDrag();
      const rawX = clientX - startXRef.current;
      const boundedX = Math.max(0, Math.min(rawX, maxDrag));

      currentDragXRef.current = boundedX;
      setDragX(boundedX);
    },
    [isDragging, getMaxDrag]
  );

  // Drag End / Release
  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const maxDrag = getMaxDrag();
    const threshold = maxDrag * 0.82; // 82% threshold to trigger

    if (currentDragXRef.current >= threshold && !disabled && !loading) {
      // Snapped to confirmation
      currentDragXRef.current = maxDrag;
      setDragX(maxDrag);
      setIsConfirmed(true);
      triggerHaptic('success');
      if (onConfirm) onConfirm();
    } else {
      // Released before threshold -> spring back
      currentDragXRef.current = 0;
      setDragX(0);
      triggerHaptic('light');
    }
  }, [isDragging, getMaxDrag, disabled, loading, onConfirm]);

  // Attach global window listeners when dragging so finger/cursor can move outside track bounds
  useEffect(() => {
    if (!isDragging) return;

    const onPointerMove = (e) => handleMove(e.clientX);
    const onPointerUp = () => handleEnd();

    const onTouchMove = (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (disabled || loading || isConfirmed) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsConfirmed(true);
      triggerHaptic('success');
      if (onConfirm) onConfirm();
    }
  };

  const maxDrag = getMaxDrag();
  const progress = maxDrag > 0 ? dragX / maxDrag : 0;

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      tabIndex={disabled || loading ? -1 : 0}
      onKeyDown={handleKeyDown}
      className={`relative h-12 w-full rounded-2xl select-none overflow-hidden flex items-center transition-all ${
        disabled
          ? 'bg-[var(--bg-recessed)]/50 border border-[var(--border-clay)]/60 opacity-60 cursor-not-allowed'
          : 'bg-[var(--bg-recessed)] border border-[var(--border-clay)] hover:border-[var(--border-subtle)] cursor-grab active:cursor-grabbing shadow-inner'
      } ${className}`}
    >
      {/* Dynamic Progress Fill behind Thumb */}
      <div
        className="absolute inset-y-0 left-0 bg-emerald-500/15 dark:bg-emerald-400/20 transition-all pointer-events-none"
        style={{
          width: `${dragX + THUMB_SIZE + PADDING}px`,
          transition: isDragging ? 'none' : 'width 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />

      {/* Track Label Text (fades out as thumb slides right) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none px-12 transition-opacity"
        style={{
          opacity: disabled ? 0.7 : Math.max(0, 1 - progress * 1.6),
          transition: isDragging ? 'none' : 'opacity 0.2s ease',
        }}
      >
        <span className="font-heading font-black text-xs uppercase tracking-wider text-[var(--text-muted)] truncate">
          {disabled ? disabledText : label}
        </span>
      </div>

      {/* Draggable Thumb */}
      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => e.touches[0] && handleStart(e.touches[0].clientX)}
        style={{
          transform: `translateX(${dragX + PADDING}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl flex items-center justify-center font-bold transition-shadow ${
          disabled
            ? 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-clay)]'
            : isConfirmed || loading
            ? 'bg-emerald-500 text-white shadow-md'
            : 'bg-[var(--text-primary)] text-[var(--bg-canvas)] shadow-md hover:scale-105 active:scale-95'
        }`}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isConfirmed ? (
          <Check className="h-4 w-4 stroke-[3] animate-scaleIn" />
        ) : (
          <ChevronsRight className="h-4 w-4 stroke-[2.5]" />
        )}
      </div>
    </div>
  );
}
