'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t, isRTL } = useLanguage();
  return (
    <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 border-t border-[#333]">
      <div className={`container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
        <div className="md:col-span-3 max-w-sm mx-auto md:mx-0 flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center gap-4 group mb-8">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 transition-transform group-hover:scale-110 duration-500">
              <NextImage
                src="/logo-ilywear.png"
                alt="IlyWear Logo"
                fill
                className="object-contain grayscale brightness-200 group-hover:grayscale-0 group-hover:brightness-100 transition-all"
              />
            </div>
            <div className={`flex flex-col items-start leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-4xl sm:text-5xl font-impact tracking-normal text-white uppercase">
                Ily<span className="text-accent">Wear</span>
              </span>
              <span className="text-xs sm:text-sm font-impact uppercase tracking-widest text-accent mt-2">
                Elite Moroccan Style
              </span>
            </div>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {t('philosophy')}
          </p>
          <div className={`flex space-x-5 ${isRTL ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition-all group">
              <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all group">
              <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-xl font-impact uppercase tracking-wider mb-6 text-white">{t('collections')}</h4>
          <ul className="space-y-4">
            <li><Link href="/shop?category=women" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('womens_elite')}</Link></li>
            <li><Link href="/shop?category=men" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('mens_streetwear')}</Link></li>
            <li><Link href="/shop?category=boys" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('boys_style')}</Link></li>
            <li><Link href="/shop?category=promotions" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block underline decoration-accent/30 underline-offset-4 ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('seasonal_sales')}</Link></li>
            <li><Link href="/shop" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('exclusive_drops')}</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-xl font-impact uppercase tracking-wider mb-6 text-white">{t('support')}</h4>
          <ul className="space-y-4">
            <li><Link href="/about" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('about')}</Link></li>
            <li><Link href="/faq" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>FAQ / Aide</Link></li>
            <li><Link href="/contact" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('contact')}</Link></li>
            <li><Link href="/track-order" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('track_order')}</Link></li>
            <li><Link href="/account" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>{t('my_account')}</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="text-xl font-impact uppercase tracking-wider mb-6 text-white">Légal</h4>
          <ul className="space-y-4">
            <li><Link href="/terms" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>CGV</Link></li>
            <li><Link href="/privacy" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>Confidentialité</Link></li>
            <li><Link href="/returns" className={`text-gray-400 hover:text-white transition-all text-sm font-medium inline-block ${isRTL ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}>Retours & Échanges</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-3 bg-[#111111] p-8 rounded-[2rem] border border-[#333] shadow-xl relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 text-center md:text-left">
            <h4 className="text-3xl font-impact uppercase tracking-wider mb-2 text-white italic">{t('newsletter_title')}</h4>
            <p className="text-gray-400 text-xs mb-8 leading-relaxed max-w-[280px] mx-auto md:mx-0">
              {t('newsletter_desc')}
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
               <div className="relative">
                 <input 
                  type="email" 
                  placeholder={t('email_placeholder')}
                  className="w-full bg-black border border-[#222] rounded-xl py-4 px-6 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                />
               </div>
               <button className="w-full bg-accent text-secondary py-4 font-impact text-xl uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                 {t('subscribe')}
               </button>
            </form>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        </div>
      </div>
      
      <div className={`container mx-auto px-6 border-t border-[#333] pt-12 flex flex-col md:flex-row justify-between items-center gap-6`}>
        <p className={`text-gray-500 text-xs font-impact uppercase tracking-widest text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
          &copy; {new Date().getFullYear()} IlyWear. {t('redefining_moroccan')}
        </p>
        <div className="flex gap-8 justify-center">
           <span className="text-gray-600 text-xs font-impact uppercase tracking-widest">{t('designed_for_morocco')}</span>
        </div>
      </div>
    </footer>
  );
}
