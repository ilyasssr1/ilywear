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
        className={`fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full sm:w-[400px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${
          isWishlistOpen 
            ? 'translate-x-0' 
            : isRTL ? '-translate-x-full' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#ffffff', height: '100vh' }}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight italic">{t('wishlist_title')}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
               {wishlist.length} {wishlist.length === 1 ? t('item_saved') : t('items_saved')}
            </p>
          </div>
          <button 
            onClick={() => setIsWishlistOpen(false)}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-white">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight italic mb-2">{t('wishlist_empty')}</h3>
              <p className="text-gray-400 text-[11px] font-medium max-w-[180px] mb-8">{t('save_favorites')}</p>
              <button 
                onClick={() => setIsWishlistOpen(false)}
                className="bg-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all"
              >
                {t('go_to_shop')}
              </button>
            </div>
          ) : (
            <div className="space-y-4 bg-white">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center min-h-[120px]">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                    <div className="flex justify-between items-start">
                       <Link 
                        href={`/product/${item.id}`} 
                        onClick={() => setIsWishlistOpen(false)}
                        className="text-[11px] font-black uppercase tracking-tight text-primary hover:text-accent transition-colors truncate pr-2"
                      >
                        {item.title}
                      </Link>
                      <button 
                        onClick={() => toggleWishlist(item)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs font-black italic">{item.price} MAD</div>
                    <button 
                      onClick={() => handleAddToBag(item)}
                      className="w-full bg-white border border-gray-200 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      {t('add_to_bag')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.03)] flex-shrink-0">
            <button 
              onClick={() => setIsWishlistOpen(false)}
              className="w-full bg-black text-white py-5 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-accent hover:text-black transition-all shadow-xl shadow-black/10"
            >
              {t('continue_shopping')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
