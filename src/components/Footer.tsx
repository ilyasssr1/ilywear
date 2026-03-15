'use client';

import Link from 'next/link';
import { Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 text-center md:text-left">
        <div className="md:col-span-4 max-w-sm mx-auto md:mx-0">
          <Link href="/" className="text-3xl font-black tracking-tighter mb-6 block hover:scale-105 transition-transform origin-center md:origin-left">
            Ily<span className="text-accent italic font-light">Wear</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {t('philosophy')}
          </p>
          <div className="flex space-x-5 justify-center md:justify-start">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all group">
              <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all group">
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-accent">Collections</h4>
          <ul className="space-y-4">
            <li><Link href="/shop?category=women" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">Women's Elite</Link></li>
            <li><Link href="/shop?category=men" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">Men's Streetwear</Link></li>
            <li><Link href="/shop?category=promotions" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1 underline decoration-accent/30 underline-offset-4">Seasonal Sales</Link></li>
            <li><Link href="/shop" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">Exclusive Drops</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-accent">Support</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">{t('about')}</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">{t('contact')}</Link></li>
            <li><Link href="/track-order" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">{t('track_order')}</Link></li>
            <li><Link href="/account" className="text-gray-400 hover:text-white transition-all text-sm font-medium inline-block hover:translate-x-1">{t('my_account')}</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-4 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm self-start">
          <h4 className="text-sm font-bold mb-4 text-white">Join the Community</h4>
          <p className="text-gray-400 text-xs mb-6 leading-relaxed">
            Be the first to know about new drops and exclusive WhatsApp-only offers.
          </p>
          <div className="flex flex-col gap-3 items-center md:items-stretch">
            <Link href="/shop" className="w-full max-w-[200px] md:max-w-none bg-white text-black py-3 rounded-xl font-bold text-xs text-center hover:bg-accent transition-colors">
              Browse New Drops
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest text-center md:text-left">
          &copy; {new Date().getFullYear()} IlyWear. Redefining Moroccan Style.
        </p>
        <div className="flex gap-8 justify-center">
           <span className="text-gray-600 text-[10px] uppercase font-bold tracking-widest">Designed for Morocco</span>
        </div>
      </div>
    </footer>
  );
}
