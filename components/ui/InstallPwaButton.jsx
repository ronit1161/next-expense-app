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
        className={`inline-flex items-center justify-center gap-2 text-xs font-heading font-extrabold tracking-wide transition-all cursor-pointer ${
          variant === 'header'
            ? 'px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-white/10 text-charcoal hover:-translate-y-0.5 active:scale-95 shadow-sm'
            : 'clay-btn-secondary px-4 py-2.5 rounded-[20px]'
        } ${className}`}
      >
        <Download className="h-4 w-4 text-purple-600 dark:text-purple-400 stroke-[2.5]" />
        <span>Install App</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm clay-surface bg-white dark:bg-[#231D35] p-6 space-y-4 text-center rounded-[32px] shadow-2xl">
            <div className="flex justify-between items-center pb-2">
              <span className="font-heading text-xs font-black uppercase tracking-wider text-pencil">
                Install on iOS Safari
              </span>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center text-white clay-orb">
              <Smartphone className="h-7 w-7" />
            </div>

            <div className="space-y-2.5 text-left text-xs text-charcoal">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C]">
                <span className="font-heading font-black text-purple-600 text-sm">1.</span>
                <span>Tap the <strong>Share</strong> icon in Safari (the square with arrow pointing up).</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C]">
                <span className="font-heading font-black text-purple-600 text-sm">2.</span>
                <span>Scroll down and choose <strong>&quot;Add to Home Screen&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#EFEBF5] dark:bg-[#1C172C]">
                <span className="font-heading font-black text-purple-600 text-sm">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="clay-btn-primary w-full py-3.5 text-sm font-heading font-black rounded-2xl"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
