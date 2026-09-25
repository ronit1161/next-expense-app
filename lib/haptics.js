/**
 * Safe Haptic Feedback Utility using the Web Vibration API (navigator.vibrate).
 * Gracefully degrades to no-op on unsupported devices (e.g., desktops, iOS Safari restrictions).
 */
export function triggerHaptic(type = 'light') {
  if (typeof window === 'undefined') return;
  if (!('vibrate' in navigator) || typeof navigator.vibrate !== 'function') return;

  try {
    switch (type) {
      case 'selection':
        // Extremely subtle tick for selecting pills, toggles
        navigator.vibrate(6);
        break;
      case 'light':
        // Crisp tick for snapping drawers (e.g., swipe to edit/delete)
        navigator.vibrate(12);
        break;
      case 'medium':
        // Solid tap for primary button clicks
        navigator.vibrate(25);
        break;
      case 'success':
        // Delightful double-tap pattern for successful transaction or settlement
        navigator.vibrate([15, 50, 20]);
        break;
      case 'warning':
        // Alert tap for deleting records or undo triggers
        navigator.vibrate([30, 40, 25]);
        break;
      default:
        navigator.vibrate(10);
    }
  } catch {
    // Gracefully ignore vibration errors
  }
}
