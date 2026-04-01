'use client';

import { useState, useEffect } from 'react';
import { Heart, X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistSidebar() {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const { t, isRTL } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isWishlistOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isWishlistOpen]);

  if (!isMounted) return null;
  if (!shouldRender) return null;

  const handleAddToBag = (product: any) => {
    addToCart(product, 1);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="relative z-[100]">
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsWishlistOpen(false)}
      />
      <div 
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full sm:w-[400px] bg-[#111111] shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
          isWishlistOpen 
            ? 'translate-x-0' 
            : isRTL ? '-translate-x-full' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#111111', height: '100vh' }}
      >
        <div className="p-6 border-b border-[#333] flex items-center justify-between bg-[#111111] flex-shrink-0">
          <div>
            <h2 className="font-impact text-3xl uppercase tracking-wider text-white">{t('wishlist_title')}</h2>
            <p className="font-impact text-xs text-gray-500 uppercase tracking-widest mt-1">
               {wishlist.length} {wishlist.length === 1 ? t('item_saved') : t('items_saved')}
            </p>
          </div>
          <button 
            onClick={() => setIsWishlistOpen(false)}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#222] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-[#111111]">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-[#111111]">
              <div className="w-24 h-24 rounded-full bg-[#222] flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="font-impact text-2xl uppercase tracking-wider text-white mb-2">{t('wishlist_empty')}</h3>
              <p className="text-gray-400 font-sans text-xs mb-8">{t('save_favorites')}</p>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="bg-accent text-secondary px-10 py-4 rounded-md font-impact text-xl uppercase tracking-widest hover:bg-white hover:text-secondary transition-all glow-effect"
              >
                {t('go_to_shop')}
              </button>
            </div>
          ) : (
            <div className="space-y-4 bg-[#111111]">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-[#0A0A0A] border border-[#333] rounded-2xl p-4 flex gap-4 items-center min-h-[120px]">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                    <div className="flex justify-between items-start">
                       <Link 
                        href={`/product/${item.id}`} 
                        onClick={() => setIsWishlistOpen(false)}
                        className="font-impact text-lg uppercase tracking-wide text-white hover:text-accent transition-colors truncate pr-2"
                      >
                        {item.title}
                      </Link>
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="font-impact text-xl text-accent">{item.price} MAD</div>
                    <button 
                      onClick={() => handleAddToBag(item)}
                      className="w-full mt-2 bg-accent text-secondary py-3 rounded-md font-impact text-sm uppercase tracking-wider hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-2 glow-effect"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {t('add_to_bag')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="p-8 border-t border-[#333] bg-[#0A0A0A] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex-shrink-0">
            <button 
              onClick={() => setIsWishlistOpen(false)}
              className="w-full bg-accent text-secondary py-5 px-8 rounded-md font-impact text-2xl uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-secondary transition-all glow-effect"
            >
              {t('continue_shopping')}
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
