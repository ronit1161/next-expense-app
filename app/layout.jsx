import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#F4F1FA',
};

export const metadata = {
  title: 'ExpenseWise — Digital Clay Finance Journal',
  description:
    'A delightfully tactile, high-fidelity personal finance journal for daily expense tracking, budget monitoring, and playful financial clarity.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ExpenseWise',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ExpenseWise" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('expensewise-theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] antialiased selection:bg-[#7C3AED] selection:text-white relative"
        suppressHydrationWarning
      >
        {/* Ambient Floating Clay Blobs */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/20 blur-3xl animate-clay-float" />
          <div className="absolute top-[30%] -right-[15%] h-[55vh] w-[55vh] rounded-full bg-[#EC4899]/15 dark:bg-[#EC4899]/20 blur-3xl animate-clay-float-delayed animation-delay-2000" />
          <div className="absolute -bottom-[10%] left-[25%] h-[50vh] w-[50vh] rounded-full bg-[#0EA5E9]/15 dark:bg-[#0EA5E9]/20 blur-3xl animate-clay-float-slow animation-delay-4000" />
          <div className="absolute top-[60%] left-[5%] h-[40vh] w-[40vh] rounded-full bg-[#10B981]/10 dark:bg-[#10B981]/15 blur-3xl animate-clay-breathe" />
        </div>

        <ThemeProvider>{children}</ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('ServiceWorker registration skipped:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
