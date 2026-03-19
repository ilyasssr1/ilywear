'use client';

import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      <div className="mb-8">
         <div className="text-9xl font-black tracking-tighter text-gray-100 italic leading-none mb-4">404</div>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">{t('page_not_found')}</h1>
      <p className="text-gray-400 text-sm font-medium max-w-sm mb-12 leading-relaxed">
        {t('page_not_found_desc')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/10 flex items-center gap-3"
        >
          <Home className="w-4 h-4" />
          {t('back_to_home')}
        </Link>
        <Link
          href="/shop"
          className="bg-white border border-gray-200 text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all duration-500 flex items-center gap-3"
        >
          <ShoppingBag className="w-4 h-4" />
          {t('shop')}
        </Link>
      </div>
    </div>
  );
}
