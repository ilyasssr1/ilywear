'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { Product } from '@/services/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import { useQuickView } from '@/context/QuickViewContext';
import { useCurrency } from '@/context/CurrencyContext';
import PromoCountdown from './PromoCountdown';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { openQuickView } = useQuickView();
  const { formatPrice } = useCurrency();
  const { showToast } = useToast();
  const { t, isRTL } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const hasOptions = (product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (hasOptions) {
      openQuickView(product);
      return;
    }

    setIsAdding(true);
    addToCart(product, 1);
    showToast(`${product.title} ${t('added_to_bag').toLowerCase()}`);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(wishlisted ? t('removed_from_wishlist') : t('added_to_wishlist'), wishlisted ? 'info' : 'success');
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
    showToast(t('quick_view'), 'info');
  };

  return (
    <div className="group relative flex flex-col overflow-hidden bg-[#111111] border border-[#333] shadow-sm hover:shadow-2xl hover:shadow-accent/5 transition-all duration-700 hover:-translate-y-2">
      <Link href={`/product/${product.id}`} className="aspect-[3/4] overflow-hidden bg-[#F5F5F5] relative w-full block">
        {product.category === 'promotions' && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white font-impact text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5 shadow-xl">
            SALE
          </div>
        )}

        {product.badge === 'new' && (
          <div className="absolute top-4 left-4 z-10 bg-accent text-secondary font-impact text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5 shadow-xl">
            {t('new') || 'NEW'}
          </div>
        )}

        {product.badge === 'hot' && (
          <div className="absolute top-4 left-4 z-10 bg-orange-500 text-white font-impact text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5 shadow-xl animate-pulse">
            {t('hot') || 'HOT'}
          </div>
        )}

        {product.badge === 'limited' && (
          <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white font-impact text-[10px] uppercase tracking-[0.2em] px-2.5 py-1.5 shadow-xl">
            {t('limited') || 'LIMITED'}
          </div>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center transition-all duration-500 shadow-lg ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-[#0A0A0A]/90 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {product.stock === 0 && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-6">
            <div className="bg-red-500 text-white font-impact text-xl uppercase tracking-wider px-6 py-2 shadow-2xl rotate-[-5deg]">
              {t('out_of_stock')}
            </div>
          </div>
        )}

        <Image
          src={product.image}
          alt={product.title}
          fill
          className={`object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out ${product.stock === 0 ? 'grayscale' : ''}`}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        />

        {product.stock !== 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full lg:group-hover:translate-y-0 lg:transition-transform lg:duration-500 z-10 sm:translate-y-0">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-impact text-lg uppercase tracking-wider transition-all duration-500 shadow-xl ${
                  isAdding
                    ? 'bg-green-500 text-white'
                    : 'bg-accent text-secondary hover:bg-white'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {isAdding ? (
                  <span className="flex items-center gap-2">
                    {t('added')} <Check className="w-5 h-5" />
                  </span>
                ) : (
                  <span>{hasOptions ? t('choose_options') || 'OPTIONS' : t('add_to_bag')}</span>
                )}
              </button>
              <button
                onClick={handleQuickView}
                className="w-14 flex items-center justify-center bg-[#111]/90 backdrop-blur-sm shadow-xl hover:bg-[#222] transition-all group/quick"
                title={t('quick_view')}
              >
                <Eye className="w-5 h-5 text-gray-400 group-hover/quick:scale-125 transition-transform" />
              </button>
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="flex flex-col p-5 flex-grow">
        <div className="mb-2 font-impact text-sm uppercase tracking-wider text-gray-500">
          {product.category}
        </div>
        {product.category === 'promotions' && (
          <PromoCountdown 
            endDate={product.promo_end_date || "2026-05-01T00:00:00Z"}
            className="mb-4 py-1.5 px-4 !rounded-xl !bg-red-500/10 !text-red-500 !shadow-none border border-red-500/20" 
          />
        )}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className={`font-impact text-2xl tracking-wide text-white line-clamp-1 mb-2 group-hover:text-accent transition-colors duration-300 ${product.stock === 0 ? 'opacity-50' : ''}`}>
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <p className={`font-impact text-3xl text-accent tracking-widest ${product.stock === 0 ? 'opacity-50' : ''}`}>
            {formatPrice(product.price)}
          </p>
          {product.colors && product.colors.length > 0 && (
            <div className={`flex -space-x-1 ${product.stock === 0 ? 'opacity-30' : ''}`}>
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border-2 border-[#333] shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
