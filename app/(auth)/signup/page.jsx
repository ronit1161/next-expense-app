'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { registerAction } from '@/actions/auth-actions';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await registerAction({ name, email, password });
      if (result.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(result.error || 'Failed to create account.');
      }
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] px-4 py-12 swiss-grid-pattern">
      <div className="w-full max-w-md space-y-4">
        {/* Architectural Header */}
        <div className="border-b-4 border-black dark:border-white/30 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-3.5 w-3.5 bg-[#FF3000]"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3000]">
              00. REGISTRATION // NEW ACCOUNT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-charcoal">
            INITIALIZE JOURNAL
          </h1>
          <p className="text-xs font-mono text-pencil mt-1 uppercase">
            ESTABLISH INDIVIDUAL FINANCIAL IDENTITY
          </p>
        </div>

        {/* Form Container - Swiss Heavy Card */}
        <div className="border-4 border-black dark:border-white/30 bg-[var(--bg-surface)] p-6 sm:p-8">
          {error && (
            <div className="mb-6 flex items-start gap-2.5 border-2 border-[#FF3000] bg-[#FF3000]/10 p-3 text-xs text-[#FF3000] font-black uppercase">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-charcoal mb-1.5">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="FIRST LAST"
                className="swiss-input block w-full py-2.5 px-3 text-xs font-mono"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-charcoal mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER@EXPENSEWISE.COM"
                className="swiss-input block w-full py-2.5 px-3 text-xs font-mono"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-charcoal mb-1.5">
                PASSWORD (MIN 6 CHARS)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="swiss-input block w-full py-2.5 pl-3 pr-10 text-xs font-mono"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-pencil hover:text-charcoal transition-colors cursor-pointer"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-charcoal mb-1.5">
                CONFIRM PASSWORD
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="swiss-input block w-full py-2.5 px-3 text-xs font-mono"
                suppressHydrationWarning
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="swiss-btn-accent flex w-full justify-center items-center gap-2 py-3 px-4 text-xs font-black uppercase tracking-wider cursor-pointer disabled:opacity-50 mt-4"
              suppressHydrationWarning
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>INITIALIZING...</span>
                </>
              ) : (
                <span>CREATE ACCOUNT // &rarr;</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-pencil border-t-2 border-black dark:border-white/20 pt-4 uppercase font-bold">
            ALREADY REGISTERED?{' '}
            <Link
              href="/login"
              className="font-black text-[#FF3000] hover:underline"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
