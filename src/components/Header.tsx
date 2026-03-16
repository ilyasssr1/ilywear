'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { ADMIN_EMAILS } from '@/lib/constants';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { cartCount, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { wishlistCount, setIsWishlistOpen, clearWishlist } = useWishlist();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearCart();
    clearWishlist();
    showToast('Signed out successfully', 'info');
  };

  return (
    <>
      {/* Marquee Banner */}
      <div className="bg-black text-white overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee whitespace-nowrap py-2">
          <div className="flex items-center gap-2 mx-8">
            <Truck className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Free Shipping Across Morocco</span>
          </div>
          <div className="flex items-center gap-2 mx-8 text-accent">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">New Collection 2026</span>
          </div>
          <div className="flex items-center gap-2 mx-8 uppercase">
            <Phone className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">WhatsApp Support Available</span>
          </div>
          <div className="flex items-center gap-2 mx-8 text-accent">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Premium Quality Guaranteed</span>
          </div>
          {/* Repeat for continuous marquee */}
          <div className="flex items-center gap-2 mx-8">
            <Truck className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Free Shipping Across Morocco</span>
          </div>
          <div className="flex items-center gap-2 mx-8 text-accent">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">New Collection 2026</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-primary uppercase italic">
            Ily<span className="text-accent font-light not-italic">Wear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-12">
            <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('home')}</Link>
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('shop')}</Link>
            <Link href="/about" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('about')}</Link>
            <Link href="/contact" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('contact')}</Link>
            <Link href="/track-order" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all hover:translate-y-[-1px]">{t('track_order')}</Link>
            <Link href="/shop?category=promotions" className="text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:text-yellow-600 transition-all underline decoration-accent/30 underline-offset-8">
              Promotions
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1">
            <SearchBar />

            {/* Language Switcher */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
              {(['en', 'ar', 'fr'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    language === lang ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {lang}
                </button>
              ))}
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
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 min-w-[200px] overflow-hidden">
                    <Link href="/account" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all rounded-xl">
                    My Account
                  </Link>
                  {user.email && ADMIN_EMAILS.includes(user.email) && (
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all rounded-xl">
                      Dashboard
                    </Link>
                  )}
                  <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-[10px] font-black uppercase tracking-widest text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
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
              {['Home', 'Shop', 'Women', 'Men', 'Track Order', 'Promotions'].map((item, i) => (
                <Link 
                  key={item}
                  href={
                    item === 'Home' ? '/' : 
                    item === 'Shop' ? '/shop' : 
                    item === 'Track Order' ? '/track-order' :
                    `/shop?category=${item.toLowerCase()}`
                  } 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`text-4xl font-black uppercase tracking-tighter italic border-b border-gray-50 pb-4 ${item === 'Promotions' ? 'text-accent' : 'text-primary'}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {item === 'Track Order' ? t('track_order') : item}
                </Link>
              ))}

              
              <div className="flex flex-col gap-6 pt-4">
                {user ? (
                  <div className="space-y-4">
                    {user.email && ADMIN_EMAILS.includes(user.email) && (
                      <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic">
                        <LayoutDashboard className="w-5 h-5 text-accent" /> Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic text-red-500">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-black uppercase tracking-widest italic">
                    <User className="w-5 h-5" /> Account
                  </Link>
                )}
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsWishlistOpen(true);
                  }}
                  className="flex items-center gap-3 text-lg font-black uppercase tracking-widest italic text-red-500"
                >
                  <Heart className="w-5 h-5" /> Wishlist ({wishlistCount})
                </button>
              </div>

              <div className="mt-auto py-10 flex flex-col gap-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Connect with us</p>
                 <div className="flex gap-6">
                    <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-500">WhatsApp</span>
                 </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
