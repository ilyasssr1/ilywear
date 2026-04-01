'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  ShoppingBag, Heart, Menu, X, User, LogOut,
  Settings, Package, Search, ChevronRight, ChevronDown,
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
          ? 'bg-[#0A0A0A]/90 backdrop-blur-2xl border-b border-[#333] shadow-lg shadow-black/[0.1]' 
          : 'bg-[#0A0A0A]/80 backdrop-blur-2xl border-b border-[#333] shadow-sm'
      }`}>
        <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 transition-transform hover:scale-102 active:scale-98 group">
            <div className={`relative h-10 w-10 sm:h-12 sm:w-12 transition-all duration-500 group-hover:rotate-[360deg] ${isRTL ? 'ml-1' : 'mr-0'}`}>
              <NextImage
                src="/logo-ilywear.png"
                alt="IlyWear Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-2xl sm:text-3xl font-impact tracking-normal text-white uppercase">
                Ily<span className="text-accent">Wear</span>
              </span>
              <span className="text-[7px] sm:text-[8px] font-sans font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">
                Luxury Moroccan Streetwear
              </span>
            </div>
          </Link>

          <nav className={`hidden lg:flex items-center ${isRTL ? 'gap-10' : 'space-x-10'}`}>
            <Link href="/" className="text-sm font-impact uppercase tracking-widest text-gray-400 hover:text-white transition-all hover:translate-y-[-1px]">{t('home')}</Link>
            <Link href="/shop" className="text-sm font-impact uppercase tracking-widest text-gray-400 hover:text-white transition-all hover:translate-y-[-1px]">{t('shop')}</Link>
            <Link href="/track-order" className="text-sm font-impact uppercase tracking-widest text-gray-400 hover:text-white transition-all hover:translate-y-[-1px]">{t('track_order')}</Link>
            
            {/* More Dropdown */}
            <div className="relative group flex items-center h-full cursor-pointer">
              <span className="text-sm font-impact uppercase tracking-widest text-gray-400 group-hover:text-white flex items-center gap-1.5 transition-colors">
                {t('more' as any)} <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50`}>
                <div className="bg-[#111] border border-[#333] rounded-md shadow-2xl p-3 min-w-[180px] overflow-hidden">
                  <Link href="/about" className="flex items-center gap-3 px-4 py-3 text-sm font-impact uppercase tracking-wider text-gray-400 hover:text-white hover:bg-[#222] transition-all rounded-md">
                    {t('about')}
                  </Link>
                  <div className="h-px bg-[#333] mx-2" />
                  <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-sm font-impact uppercase tracking-wider text-gray-400 hover:text-white hover:bg-[#222] transition-all rounded-md">
                    {t('contact')}
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/shop?category=promotions" className="text-sm font-impact uppercase tracking-widest text-accent hover:text-white transition-all underline decoration-accent/30 underline-offset-8">
              {t('promotions')}
            </Link>
          </nav>

          {/* Action Icons */}
          <div className={`flex items-center ${isRTL ? 'gap-1' : 'space-x-1'}`}>
            <SearchBar />

            {/* Language & Currency Switcher Group */}
            <div className="hidden lg:flex items-center gap-4 bg-[#111]/80 p-1.5 rounded-lg border border-[#333] shadow-sm mr-4 transition-all">
              <CurrencySwitcher />
              <div className="w-px h-6 bg-[#333] mx-1" />
              <div className="flex items-center gap-1">
                {(['en', 'ar', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-impact uppercase tracking-widest transition-all flex items-center gap-1.5 ${
                    language === lang ? 'bg-accent text-secondary shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs">{lang.toUpperCase()}</span>
                </button>
              ))}
              </div>
            </div>

            <div className="relative group">
              {user ? (
                <button
                  className="text-white hover:text-accent p-2.5 transition-all flex items-center gap-2"
                  aria-label="User Profile"
                >
                  <div className="w-8 h-8 bg-accent text-secondary rounded-full flex items-center justify-center text-sm font-impact shadow-sm group-hover:scale-110 transition-transform">
                    {user.email?.substring(0, 1).toUpperCase()}
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-white hover:text-accent p-2.5 transition-all flex items-center gap-2"
                  aria-label="User Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
              
              {user && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300`}>
                  <div className="bg-[#111] border border-[#333] rounded-md shadow-2xl p-4 min-w-[200px] overflow-hidden">
                    <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-xs font-impact uppercase tracking-wider text-gray-400 hover:text-white hover:bg-[#222] transition-all rounded-md">
                    {t('my_account')}
                  </Link>
                  {user.email && ADMIN_EMAILS.includes(user.email) && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-impact uppercase tracking-wider text-gray-400 hover:text-white hover:bg-[#222] transition-all rounded-md">
                      {t('dashboard')}
                    </Link>
                  )}
                  <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-black text-xs font-impact uppercase tracking-wider text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="text-white hover:text-accent p-2.5 transition-all relative hidden sm:block"
              aria-label="Wishlist"
              onClick={() => setIsWishlistOpen(true)}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              className="text-white hover:text-accent p-2.5 transition-all relative"
              aria-label="Shopping Bag"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-accent text-secondary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-white hover:text-accent p-2 transition-colors focus:outline-none"
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
          <div className="lg:hidden absolute top-full left-0 w-full h-[calc(100vh_-_4rem)] bg-[#0A0A0A] z-50 animate-fade-in overflow-y-auto border-t border-[#333] shadow-2xl">
            <nav className="flex flex-col p-8 space-y-8 h-full bg-[#0A0A0A]">
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
                  className={`text-5xl font-impact uppercase tracking-wider border-b border-[#333] pb-4 ${item.key === 'promotions' ? 'text-accent' : 'text-white hover:text-accent transition-colors'}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {t(item.key as any)}
                </Link>
              ))}

              {/* Mobile Lang & Currency Switchers */}
              <div className="flex flex-col gap-6 py-6 border-b border-[#333]">
                 <div className="flex items-center justify-between">
                    <p className="text-xs font-impact uppercase tracking-widest text-gray-500">Currency</p>
                    <CurrencySwitcher />
                 </div>
                 <div className="space-y-4">
                    <p className="text-xs font-impact uppercase tracking-widest text-gray-500">Language</p>
                    <div className="flex gap-2">
                      {(['en', 'ar', 'fr'] as const).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`px-4 py-2.5 rounded-md text-sm font-impact uppercase tracking-wider transition-all flex items-center gap-2 ${
                            language === lang 
                              ? 'bg-accent text-secondary shadow-lg' 
                              : 'bg-[#111] text-gray-400 hover:bg-[#222]'
                          }`}
                        >
                          <span className="text-sm font-bold">{lang.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6 pt-4">
                {user ? (
                  <div className="space-y-4">
                    <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-xl font-impact uppercase tracking-widest text-white">
                      <User className="w-5 h-5 text-accent" /> {t('my_account')}
                    </Link>
                    {user.email && ADMIN_EMAILS.includes(user.email) && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-xl font-impact uppercase tracking-widest text-white">
                        <LayoutDashboard className="w-5 h-5 text-accent" /> {t('dashboard')}
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 text-xl font-impact uppercase tracking-widest text-red-500">
                      <LogOut className="w-5 h-5" /> {t('logout')}
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-xl font-impact uppercase tracking-widest text-white">
                    <User className="w-5 h-5 text-accent" /> {t('account')}
                  </Link>
                )}
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center gap-3 text-xl font-impact uppercase tracking-widest text-red-500"
                >
                  <Heart className="w-5 h-5" /> {t('wishlist')} ({wishlistCount})
                </button>
              </div>

              <div className="mt-auto py-10 flex flex-col gap-4">
                 <p className="text-xs font-impact uppercase tracking-widest text-gray-500">{t('connect_with_us')}</p>
                 <div className="flex gap-6">
                    <span className="text-sm font-impact uppercase tracking-widest text-white">{t('instagram')}</span>
                    <span className="text-sm font-impact uppercase tracking-widest text-accent">{t('whatsapp')}</span>
                 </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
