'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      console.error('Password reset error:', error);
      showToast(error.message, 'error');
    } else {
      setIsSuccess(true);
      showToast('Reset link sent to your email', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-black transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic inline-block mb-8">
            Ily<span className="text-accent font-light not-italic">Wear</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-3">Forgot Password</h1>
          <p className="text-gray-400 text-sm font-medium">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Mail className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Check Your Inbox</h3>
            <p className="text-gray-500 text-sm mb-6">
              We've sent a password reset link to <br /><span className="font-bold text-black">{email}</span>
            </p>
            <p className="text-xs text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-black"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
