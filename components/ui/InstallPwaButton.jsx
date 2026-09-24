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
        className={`inline-flex items-center justify-center gap-1.5 border-2 border-black dark:border-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
          variant === 'header'
            ? 'px-2 py-1 bg-white text-black hover:bg-black hover:text-white dark:bg-black dark:text-white'
            : 'swiss-btn-black px-4 py-2'
        } ${className}`}
      >
        <Download className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>INSTALL APP</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4 animate-fadeIn">
          <div className="w-full max-w-sm border-4 border-black dark:border-white bg-[var(--bg-surface)] p-6 space-y-4 text-center animate-scaleIn">
            <div className="flex justify-between items-center pb-2 border-b-2 border-black dark:border-white/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-pencil">
                INSTALL ON IOS
              </span>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 border border-black dark:border-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-12 w-12 mx-auto border-2 border-black dark:border-white flex items-center justify-center text-[#FF3000]">
              <Smartphone className="h-6 w-6" />
            </div>

            <div className="space-y-2 text-left text-xs text-charcoal">
              <div className="flex items-start gap-2.5 p-2 border border-black dark:border-white/20 bg-[var(--bg-subtle)]">
                <span className="font-black text-[#FF3000]">1.</span>
                <span>Tap the <strong>Share</strong> button at the bottom of Safari (the square with an arrow pointing up).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 border border-black dark:border-white/20 bg-[var(--bg-subtle)]">
                <span className="font-black text-[#FF3000]">2.</span>
                <span>Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 border border-black dark:border-white/20 bg-[var(--bg-subtle)]">
                <span className="font-black text-[#FF3000]">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="swiss-btn-accent w-full py-2.5 text-xs font-black"
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </>
  );
}
