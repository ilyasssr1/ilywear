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
      alert(message);
    } else {
      console.log('Login success!');
      showToast('Marhba bik! (Welcome back)', 'success');
      window.location.href = '/admin';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="text-3xl font-impact tracking-wider uppercase inline-block mb-8 text-white">
            Ily<span className="text-accent">Wear</span>
          </Link>
          <h1 className="text-4xl font-impact tracking-wider uppercase text-white mb-3">Welcome Back</h1>
          <p className="text-gray-500 text-sm font-sans">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div className="space-y-2">
            <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 pr-12 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-accent transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-end pt-1">
              <Link href="/forgot-password" className="text-xs font-sans text-gray-500 hover:text-accent transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-secondary py-5 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-white transition-all duration-500 shadow-xl shadow-accent/10 flex items-center justify-center gap-3 glow-effect"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-secondary border-t-transparent rounded-full" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-sans">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent font-impact uppercase tracking-wider hover:text-white transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
