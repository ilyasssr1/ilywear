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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-xs font-sans text-gray-500 hover:text-accent transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-impact tracking-wider uppercase inline-block mb-8 text-white">
            Ily<span className="text-accent">Wear</span>
          </Link>
          <h1 className="text-4xl font-impact tracking-wider uppercase text-white mb-3">Forgot Password</h1>
          <p className="text-gray-500 text-sm font-sans">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-[#111] border border-[#222] rounded-3xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-impact uppercase tracking-wider text-white mb-3">Check Your Inbox</h3>
            <p className="text-gray-400 text-sm font-sans mb-6">
              We&apos;ve sent a password reset link to <br /><span className="font-impact text-accent tracking-wider">{email}</span>
            </p>
            <p className="text-xs text-gray-500 font-sans">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                placeholder="contact@ilywear.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-accent text-secondary py-5 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-white transition-all duration-500 shadow-xl shadow-accent/10 flex items-center justify-center gap-3 disabled:opacity-50 glow-effect"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-secondary border-t-transparent rounded-full" />
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
