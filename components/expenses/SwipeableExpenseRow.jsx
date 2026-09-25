'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { formatCurrency } from '@/lib/utils';
import { triggerHaptic } from '@/lib/haptics';

/**
 * SwipeableExpenseRow:
 * - Mobile Touch Gestures:
 *     Swipe right (→) reveals "Edit" on the left
 *     Swipe left (←) reveals "Delete" on the right
 * - Non-Gesture Accessibility:
 *     Permanent action buttons on the right so functionality NEVER depends on gestures.
 *     Full keyboard support (Tab, Enter/Space) and ARIA labels.
 */
export default function SwipeableExpenseRow({
  expense,
  onOpenEdit,
  onDelete,
  isSwipedOpen,
  onSwipeChange,
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalRef = useRef(null);
  const rowRef = useRef(null);

  // Sync internal offset when another row is opened elsewhere or reset
  useEffect(() => {
    if (!isSwipedOpen) {
      setOffsetX(0);
    }
  }, [isSwipedOpen]);

  // Reset row position
  const closeSwipe = useCallback(() => {
    setOffsetX(0);
    if (onSwipeChange) onSwipeChange(expense.id, null);
  }, [expense.id, onSwipeChange]);

  // Touch & Mouse Gesture Handlers
  const handleStart = (clientX, clientY) => {
    startXRef.current = clientX;
    startYRef.current = clientY;
    isHorizontalRef.current = null;
    setIsDragging(true);
  };

  const handleMove = (clientX, clientY, e) => {
    if (!isDragging) return;
    const deltaX = clientX - startXRef.current;
    const deltaY = clientY - startYRef.current;

    // Detect direction intent: horizontal vs vertical scroll
    if (isHorizontalRef.current === null) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalRef.current = true;
      } else if (Math.abs(deltaY) > 6) {
        isHorizontalRef.current = false;
      }
    }

    // Only apply horizontal transform if user is swiping horizontally
    if (isHorizontalRef.current === true) {
      if (e && e.cancelable && e.preventDefault) {
        e.preventDefault();
      }

      // Add soft resistance when pulling past action drawer width (80px)
      let clampedX = deltaX;
      if (deltaX > 80) {
        clampedX = 80 + (deltaX - 80) * 0.25;
      } else if (deltaX < -80) {
        clampedX = -80 + (deltaX + 80) * 0.25;
      }

      setOffsetX(clampedX);
    }
  };

  const handleEnd = (clientX) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (isHorizontalRef.current === true) {
      const totalDelta = clientX - startXRef.current;

      // Far swipe trigger (> 130px auto-triggers action)
      if (totalDelta > 130) {
        setOffsetX(0);
        triggerHaptic('medium');
        if (onSwipeChange) onSwipeChange(expense.id, null);
        onOpenEdit(expense);
        return;
      } else if (totalDelta < -130) {
        setOffsetX(0);
        triggerHaptic('warning');
        if (onSwipeChange) onSwipeChange(expense.id, null);
        onDelete(expense.id);
        return;
      }

      // Threshold to snap open (35px)
      if (totalDelta > 35) {
        setOffsetX(80);
        triggerHaptic('light');
        if (onSwipeChange) onSwipeChange(expense.id, 'edit');
      } else if (totalDelta < -35) {
        setOffsetX(-80);
        triggerHaptic('light');
        if (onSwipeChange) onSwipeChange(expense.id, 'delete');
      } else {
        setOffsetX(0);
        if (onSwipeChange) onSwipeChange(expense.id, null);
      }
    } else {
      // If tapped while already open, close it
      if (offsetX !== 0) {
        closeSwipe();
      }
    }

    isHorizontalRef.current = null;
  };

  // Touch Handlers
  const handleTouchStart = (e) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY, e);
  };
  const handleTouchEnd = (e) => {
    handleEnd(e.changedTouches[0].clientX);
  };

  // Mouse Handlers (for desktop testing / drag interaction)
  const handleMouseDown = (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    handleStart(e.clientX, e.clientY);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.clientY, e);
  };
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    handleEnd(e.clientX);
  };
  const handleMouseLeave = (e) => {
    if (isDragging) {
      handleEnd(e.clientX);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none group my-1">
      {/* 1. BEHIND DRAWER - LEFT (Revealed when swiped right -> EDIT) */}
      <div
        className={`absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-500 dark:to-emerald-500 text-white flex items-center justify-start pl-4 rounded-l-2xl transition-opacity duration-200 ${
          offsetX > 5 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={offsetX <= 5}
      >
        <button
          onClick={() => {
            closeSwipe();
            onOpenEdit(expense);
          }}
          className="flex flex-col items-center gap-1 text-white font-bold text-[10px] cursor-pointer active:scale-95 transition-transform"
          aria-label={`Edit ${expense.description || expense.categoryName}`}
        >
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shadow-xs">
            <Pencil className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span>Edit</span>
        </button>
      </div>

      {/* 2. BEHIND DRAWER - RIGHT (Revealed when swiped left -> DELETE) */}
      <div
        className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-rose-600 to-red-600 dark:from-rose-500 dark:to-red-500 text-white flex items-center justify-end pr-4 rounded-r-2xl transition-opacity duration-200 ${
          offsetX < -5 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={offsetX >= -5}
      >
        <button
          onClick={() => {
            closeSwipe();
            onDelete(expense.id);
          }}
          className="flex flex-col items-center gap-1 text-white font-bold text-[10px] cursor-pointer active:scale-95 transition-transform"
          aria-label={`Delete ${expense.description || expense.categoryName}`}
        >
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shadow-xs">
            <Trash2 className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span>Delete</span>
        </button>
      </div>

      {/* 3. FOREGROUND ROW (Slides with gesture) */}
      <div
        ref={rowRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translateX(${offsetX}px)`,
          touchAction: 'pan-y',
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        onClick={() => {
          if (offsetX !== 0) closeSwipe();
        }}
        className="relative z-10 bg-[var(--bg-card)] p-3.5 flex items-center justify-between rounded-2xl border border-[var(--border-clay)] hover:border-slate-300 dark:hover:border-white/20 shadow-xs transition-colors gap-3 cursor-grab active:cursor-grabbing"
      >
        {/* Left: Category Icon, Description & Details */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-white shrink-0 shadow-xs"
            style={{ backgroundColor: expense.categoryColor || '#181B26' }}
          >
            <CategoryIcon iconName={expense.categoryIcon} className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
              {expense.description || expense.categoryName}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[var(--text-muted)] font-medium">
              <span>{expense.categoryName}</span>
              <span>&bull;</span>
              <span className="uppercase text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-[var(--bg-recessed)] text-[var(--text-muted)]">
                {expense.paymentMethod?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Right: High-Contrast Amount & Accessible Non-Gesture Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm sm:text-base font-black text-[var(--text-primary)] tabular-nums tracking-tight">
            -{formatCurrency(expense.amount)}
          </span>

          {/* NORMAL ACCESSIBLE ACTION BUTTONS (Never depends purely on swipe gestures) */}
          <div className="flex items-center gap-1.5">
            {/* Direct Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                onOpenEdit(expense);
              }}
              className="h-8 w-8 rounded-xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex items-center justify-center text-[var(--text-muted)] hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-500/10 transition-all cursor-pointer"
              aria-label={`Edit transaction: ${expense.description || expense.categoryName}`}
              title="Edit transaction"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            {/* Direct Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('warning');
                onDelete(expense.id);
              }}
              className="h-8 w-8 rounded-xl bg-[var(--bg-recessed)] border border-[var(--border-clay)] flex items-center justify-center text-[var(--text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              aria-label={`Delete transaction: ${expense.description || expense.categoryName}`}
              title="Delete transaction"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
