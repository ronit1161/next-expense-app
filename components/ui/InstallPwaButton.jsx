'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

export default function InstallPwaButton({ className = '', variant = 'button' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(true); // Default true to avoid flash
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if running inside the standalone PWA app
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) return;

    // 2. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Listen for Android / Chrome / Edge install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // NEVER render if the app is already installed & running in standalone mode
  if (isStandalone) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosGuide(true);
    } else {
      // Chrome cooldown / browser fallback
      alert('To install, tap your browser menu (⋮) and select "Install App" or "Add to Home Screen".');
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        aria-label="Install ExpenseWise App"
        title="Install ExpenseWise App on your device"
        className={`inline-flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
          variant === 'header'
            ? 'px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200 hover:-translate-y-0.5 active:scale-95 shadow-sm'
            : 'fintech-btn-secondary px-4 py-2.5 rounded-xl'
        } ${className}`}
      >
        <Download className="h-4 w-4 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
        <span>Install App</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm fintech-card p-6 space-y-4 text-center rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Install on iOS Safari
              </span>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-14 w-14 mx-auto rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Smartphone className="h-7 w-7" />
            </div>

            <div className="space-y-2.5 text-left text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">1.</span>
                <span>Tap the <strong>Share</strong> icon in Safari (the square with arrow pointing up).</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">2.</span>
                <span>Scroll down and choose <strong>&quot;Add to Home Screen&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="fintech-btn-primary w-full py-3 text-xs font-bold rounded-xl cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
