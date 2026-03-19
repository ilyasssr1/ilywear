'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ShoppingBag, Heart, Menu, X, User, LogOut,
  Settings, Package, Search, ChevronRight,
  Truck, Sparkles, Phone, Globe, Languages, LayoutDashboard, ShieldCheck
} from 'lucide-react';
import SearchBar from './SearchBar';
import CartSidebar from './CartSidebar';
import WishlistSidebar from './WishlistSidebar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useLanguage, LANGUAGE_FLAGS } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import CurrencySwitcher from './CurrencySwitcher';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { ADMIN_EMAILS } from '@/lib/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { wishlistCount, setIsWishlistOpen, clearWishlist } = useWishlist();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearCart();
    clearWishlist();
    showToast(t('signed_out'), 'info');
  };

  return (
    <>
      {/* Marquee Banner */}
      <div className="bg-black text-white overflow-hidden whitespace-nowrap">
        <div className={`flex ${isRTL ? 'animate-marquee-rtl' : 'animate-marquee'} whitespace-nowrap py-2.5`}>
          <div className="flex items-center gap-2 mx-8">
            <Truck className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('free_shipping_morocco')}</span>
          </div>
          <div className="flex items-center gap-2 mx-8 text-accent">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('new_collection')}</span>
          </div>
          <div className="flex items-center gap-2 mx-8 uppercase">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('whatsapp_support_available')}</span>
          </div>
          <div className="flex items-center gap-2 mx-8 text-accent">
            <ShieldCheck className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('premium_quality_guaranteed')}</span>
          </div>
          {/* Repeat for continuous marquee */}
          <div className="flex items-center gap-2 mx-8">
            <Truck className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('free_shipping_morocco')}</span>
          </div>
          <div className="flex items-center gap-2 mx-8 text-accent">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('new_collection')}</span>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-lg shadow-black/[0.03]' 
          : 'bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative h-10 w-32 sm:w-40 transition-transform hover:scale-105 active:scale-95">
            <NextImage
              src="/logo-ilywear.png"
              alt="IlyWear Logo"
              fill
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center ${isRTL ? 'gap-12' : 'space-x-12'}`}>
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('home')}</Link>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('shop')}</Link>
            <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('about')}</Link>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('contact')}</Link>
            <Link href="/track-order" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('track_order')}</Link>
            <Link href="/shop?category=promotions" className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-yellow-600 transition-all underline decoration-accent/30 underline-offset-8">
              {t('promotions')}
            </Link>
          </nav>

          {/* Action Icons */}
          <div className={`flex items-center ${isRTL ? 'gap-1' : 'space-x-1'}`}>
            <SearchBar />

            {/* Language & Currency Switcher Group */}
            <div className="hidden lg:flex items-center gap-4 bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100 shadow-sm mr-4 transition-all">
              <CurrencySwitcher />
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1">
                {(['en', 'ar', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                    language === lang ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  <span className="text-[11px]">{LANGUAGE_FLAGS[lang]}</span>
                  {lang}
                </button>
              ))}
              </div>
            </div>

            <div className="relative group">
              {user ? (
                <button
                  className="text-primary hover:text-accent p-2.5 transition-all flex items-center gap-2"
                  aria-label="User Profile"
                >
                  <div className="w-7 h-7 bg-black text-accent rounded-full flex items-center justify-center text-[10px] font-black border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                    {user.email?.substring(0, 1).toUpperCase()}
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-primary hover:text-accent p-2.5 transition-all flex items-center gap-2"
                  aria-label="User Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
              
              {user && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300`}>
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 min-w-[200px] overflow-hidden">
                    <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all rounded-xl">
                    {t('my_account')}
                  </Link>
                  {user.email && ADMIN_EMAILS.includes(user.email) && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all rounded-xl">
                      {t('dashboard')}
                    </Link>
                  )}
                  <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="text-primary hover:text-accent p-2.5 transition-all relative hidden sm:block"
              aria-label="Wishlist"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              className="text-primary hover:text-accent p-2.5 transition-all relative"
              aria-label="Shopping Bag"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-white text-[7px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-primary p-2 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <WishlistSidebar />

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full h-[calc(100vh_-_4rem)] bg-white z-50 animate-fade-in overflow-y-auto border-t border-gray-100 shadow-2xl">
            <nav className="flex flex-col p-8 space-y-8 h-full bg-white">
              {[
                { key: 'home', href: '/' },
                { key: 'shop', href: '/shop' },
                { key: 'women', href: '/shop?category=women' },
                { key: 'men', href: '/shop?category=men' },
                { key: 'track_order', href: '/track-order' },
                { key: 'promotions', href: '/shop?category=promotions' },
              ].map((item, i) => (
                <Link 
                  key={item.key}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)} 
                  className={`text-4xl font-black uppercase tracking-tighter italic border-b border-gray-50 pb-4 ${item.key === 'promotions' ? 'text-accent' : 'text-primary'}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {t(item.key as any)}
                </Link>
              ))}

              {/* Mobile Lang & Currency Switchers */}
              <div className="flex flex-col gap-6 py-6 border-b border-gray-50">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Currency</p>
                    <CurrencySwitcher />
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Language</p>
                    <div className="flex gap-2">
                      {(['en', 'ar', 'fr'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                            language === lang 
                              ? 'bg-black text-white shadow-lg' 
                              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          <span className="text-base">{LANGUAGE_FLAGS[lang]}</span>
                          {lang}
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6 pt-4">
                {user ? (
                  <div className="space-y-4">
                    <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic text-primary">
                      <User className="w-5 h-5" /> {t('my_account')}
                    </Link>
                    {user.email && ADMIN_EMAILS.includes(user.email) && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic text-primary">
                        <LayoutDashboard className="w-5 h-5 text-accent" /> {t('dashboard')}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic text-red-500">
                      <LogOut className="w-5 h-5" /> {t('logout')}
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase tracking-widest italic">
                    <User className="w-5 h-5" /> {t('account')}
                  </Link>
                )}
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic text-red-500"
                >
                  <Heart className="w-5 h-5" /> {t('wishlist')} ({wishlistCount})
                </button>
              </div>

              <div className="mt-auto py-10 flex flex-col gap-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{t('connect_with_us')}</p>
                 <div className="flex gap-6">
                    <span className="text-xs font-bold uppercase tracking-widest">{t('instagram')}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-500">{t('whatsapp')}</span>
                 </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
