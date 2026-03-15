'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.error('Login error:', error);
      let message = error.message;
      
      if (message.toLowerCase().includes('invalid login credentials')) {
        message = 'Hada l-hissab makaynx awla l-password ghalat. (Account does not exist or wrong password)';
      } else if (message.toLowerCase().includes('confirm')) {
        message = 'Sir confirm l-email dyalk f-Supabase dashboard.';
      } else if (message.toLowerCase().includes('email logins are disabled')) {
        message = 'Email logins are disabled in Supabase. You need to enable them in Authentication > Providers.';
      }
      
      showToast(message, 'error');
      alert(message); // Force alert as requested
    } else {
      console.log('Login success!');
      showToast('Marhba bik! (Welcome back)', 'success');
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-black tracking-tighter uppercase italic inline-block mb-8">
            Ily<span className="text-accent font-light not-italic">Wear</span>
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-3">Welcome Back</h1>
          <p className="text-gray-400 text-sm font-medium">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-xs font-bold text-gray-400 hover:text-accent transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-xl shadow-black/10 flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-400 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-black font-bold hover:text-accent transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
