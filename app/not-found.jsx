import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md clay-card p-8 sm:p-10 text-center space-y-6 rounded-[36px] animate-scaleIn">
        <div className="h-20 w-20 mx-auto rounded-3xl bg-gradient-to-br from-violet-400 to-indigo-600 clay-orb flex items-center justify-center text-white shadow-xl">
          <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <div>
          <span className="clay-badge-pill bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-bold">
            404 • Page Not Found
          </span>
          <h1
            className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-3"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            Lost in Zero Gravity
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
            The page or ledger entry you are looking for does not exist or has been shifted.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="clay-btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-bold text-white cursor-pointer"
            style={{ fontFamily: 'Nunito, sans-serif' }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
