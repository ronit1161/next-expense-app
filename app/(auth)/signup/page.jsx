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
    <div className="flex min-h-screen items-center justify-center bg-[#EAE6DF] px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Editorial Header */}
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0047FF]"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7D8494]">ExpenseWise</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E2025]">
            Create your journal
          </h1>
          <p className="text-xs text-[#7D8494] mt-1">
            Begin tracking daily expenses with precision and ease.
          </p>
        </div>

        {/* Form Container */}
        <div className="neu-card p-6 sm:p-7">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-rose-100/70 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-xs font-bold text-[#1E2025] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Mercer"
                className="neu-input block w-full py-2 px-3 text-xs focus:outline-none"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2025] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="neu-input block w-full py-2 px-3 text-xs focus:outline-none"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2025] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="neu-input block w-full py-2 pl-3 pr-9 text-xs focus:outline-none"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#7D8494] hover:text-[#1E2025] transition-colors cursor-pointer"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E2025] mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="neu-input block w-full py-2 px-3 text-xs focus:outline-none"
                suppressHydrationWarning
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neu-btn-blue flex w-full justify-center items-center gap-2 py-2.5 px-4 text-xs font-bold cursor-pointer disabled:opacity-50 mt-3"
              suppressHydrationWarning
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Initialize Journal</span>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#7D8494] border-t border-[#DFDBD3]/40 pt-4">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-bold text-[#0047FF] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
