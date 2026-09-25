'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * AnimatedNumber:
 * Smoothly counts up from current/zero to target value using requestAnimationFrame
 * with an ease-out exponential easing curve and Indian currency formatting.
 */
export default function AnimatedNumber({
  value = 0,
  duration = 750,
  prefix = '₹',
  suffix = '',
  decimals = 2,
  className = '',
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const [displayValue, setDisplayValue] = useState(numericValue);
  const prevValueRef = useRef(numericValue);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const startVal = prevValueRef.current;
    const endVal = numericValue;
    prevValueRef.current = endVal;

    // If change is negligible, update directly
    if (Math.abs(startVal - endVal) < 0.001) {
      setDisplayValue(endVal);
      return;
    }

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease Out Expo: fast rise that settles gracefully
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startVal + (endVal - startVal) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(endVal);
      }
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [numericValue, duration]);

  const formattedNumber = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(displayValue));

  const isNegative = displayValue < 0;

  return (
    <span className={`tabular-nums font-inherit ${className}`}>
      {isNegative ? `-${prefix}` : prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
}
