'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Eye, EyeOff, Sparkles, Lock, Mail } from 'lucide-react';
import { loginAction } from '@/actions/auth-actions';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await loginAction({ email, password });
      if (result.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(result.error || 'Failed to authenticate.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4 py-12 relative overflow-hidden">
      {/* Floating Decorative Orbs */}
      <div className="absolute top-12 left-12 w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-30 blur-xl animate-clay-float" />
      <div className="absolute bottom-16 right-16 w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-30 blur-xl animate-clay-float-delayed" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Clay Header with 3D Icon */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br from-violet-400 via-purple-600 to-pink-500 text-white clay-orb shadow-xl mb-1">
            <Sparkles className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-charcoal bg-gradient-to-r from-purple-800 via-purple-600 to-pink-600 dark:from-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-sm font-medium text-pencil">
            Sign in to track your expenses with tactile delight
          </p>
        </div>

        {/* Form Container - 4-Layer Floating Clay Card */}
        <div className="clay-card p-8 sm:p-10 rounded-[36px]">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-600 dark:text-rose-400 font-heading font-extrabold">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" suppressHydrationWarning>
            <div>
              <label className="block font-heading text-xs font-black uppercase tracking-wider text-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="clay-input block w-full h-14 pl-11 pr-4 text-sm font-medium rounded-2xl"
                  suppressHydrationWarning
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil" />
              </div>
            </div>

            <div>
              <label className="block font-heading text-xs font-black uppercase tracking-wider text-charcoal mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="clay-input block w-full h-14 pl-11 pr-11 text-sm font-medium rounded-2xl"
                  suppressHydrationWarning
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-pencil" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-pencil hover:text-charcoal cursor-pointer"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="clay-btn-primary flex w-full justify-center items-center gap-2 h-14 text-sm font-heading font-black tracking-wide rounded-2xl cursor-pointer disabled:opacity-50 mt-2 shadow-lg"
              suppressHydrationWarning
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In &rarr;</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-pencil border-t border-purple-500/10 pt-5 font-medium">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="font-heading font-black text-purple-600 dark:text-purple-400 hover:underline"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
