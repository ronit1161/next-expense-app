'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

/**
 * PullToRefresh:
 * Wraps page content to provide a smooth, native-feeling pull-to-refresh
 * gesture on mobile touch screens with haptic feedback.
 */
export default function PullToRefresh({
  onRefresh,
  children,
  disabled = false,
  className = '',
}) {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const reachedThresholdRef = useRef(false);

  const THRESHOLD = 60;
  const MAX_PULL = 90;

  const handleTouchStart = (e) => {
    if (disabled || isRefreshing) return;
    // Only allow pull-to-refresh when at the top of the viewport
    if (window.scrollY <= 2) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
      reachedThresholdRef.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!isPullingRef.current || isRefreshing || disabled) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;

    // Only engage if pulling downwards from top
    if (deltaY > 0 && window.scrollY <= 2) {
      // Damped resistance formula
      const pull = Math.min(deltaY * 0.45, MAX_PULL);
      setPullY(pull);

      // Trigger subtle haptic tick once when threshold is crossed
      if (pull >= THRESHOLD && !reachedThresholdRef.current) {
        reachedThresholdRef.current = true;
        triggerHaptic('selection');
      } else if (pull < THRESHOLD && reachedThresholdRef.current) {
        reachedThresholdRef.current = false;
      }

      // Prevent native browser refresh stutter if active
      if (e.cancelable && pull > 10) {
        e.preventDefault();
      }
    } else {
      setPullY(0);
      isPullingRef.current = false;
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    if (pullY >= THRESHOLD && onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      setPullY(50);
      triggerHaptic('light');

      try {
        await onRefresh();
        triggerHaptic('success');
      } catch (err) {
        console.error('Refresh failed:', err);
      } finally {
        setIsRefreshing(false);
        setPullY(0);
      }
    } else {
      setPullY(0);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative ${className}`}
    >
      {/* Floating Refresh Indicator */}
      <div
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-200 ease-out"
        style={{
          transform: `translate(-50%, ${pullY > 0 ? pullY - 20 : -60}px) scale(${Math.min(
            1,
            pullY / 45
          )})`,
          opacity: pullY > 10 || isRefreshing ? 1 : 0,
        }}
      >
        <div className="h-10 w-10 rounded-full bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-900 shadow-2xl backdrop-blur-md flex items-center justify-center border border-white/10 dark:border-slate-800/10">
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            style={{
              transform: isRefreshing ? 'none' : `rotate(${pullY * 4}deg)`,
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          transform: pullY > 0 ? `translateY(${pullY * 0.25}px)` : 'none',
          transition: isPullingRef.current ? 'none' : 'transform 0.25s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
