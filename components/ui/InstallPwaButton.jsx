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
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          variant === 'header'
            ? 'neu-btn px-3 py-1.5 text-[#0047FF] hover:text-[#0038D1]'
            : 'neu-btn-blue px-4 py-2 text-white'
        } ${className}`}
      >
        <Download className="h-3.5 w-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-sm neu-card p-6 rounded-3xl space-y-4 text-center animate-scaleIn">
            <div className="flex justify-between items-center pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494]">
                Install ExpenseWise on iOS
              </span>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 text-[#7D8494] hover:text-[#1E2025] cursor-pointer neu-btn-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="h-12 w-12 mx-auto rounded-2xl neu-inset flex items-center justify-center text-[#0047FF]">
              <Smartphone className="h-6 w-6" />
            </div>

            <div className="space-y-2 text-left text-xs text-[#1E2025]">
              <div className="flex items-start gap-2.5 p-2 rounded-xl neu-inset">
                <span className="font-bold text-[#0047FF]">1.</span>
                <span>Tap the <strong>Share</strong> button at the bottom of Safari (the square with an arrow pointing up).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl neu-inset">
                <span className="font-bold text-[#0047FF]">2.</span>
                <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl neu-inset">
                <span className="font-bold text-[#0047FF]">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner to install.</span>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="neu-btn-blue w-full py-2.5 text-xs font-bold text-white cursor-pointer mt-2"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
