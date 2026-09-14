import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAE6DF] px-4 py-12">
      <div className="w-full max-w-md neu-card p-8 text-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-2xl neu-inset flex items-center justify-center text-[#0047FF]">
          <Compass className="h-8 w-8 animate-pulse" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494]">
            404 • Page Uncharted
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2025] mt-1">
            Ledger Entry Not Found
          </h1>
          <p className="text-xs text-[#7D8494] mt-2 leading-relaxed">
            The page you are looking for doesn't exist or has been archived.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="neu-btn-blue inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold cursor-pointer"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
