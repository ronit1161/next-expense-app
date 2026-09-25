import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-[#090A0F] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md fintech-card p-8 sm:p-10 text-center space-y-6 rounded-3xl relative z-10 shadow-xl">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-md">
          <Compass className="h-8 w-8 text-teal-400 dark:text-teal-600 animate-spin" style={{ animationDuration: '12s' }} />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold">
            404 • Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Lost in Space?
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            The account page or transaction path you are looking for does not exist or has been shifted.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="fintech-btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
