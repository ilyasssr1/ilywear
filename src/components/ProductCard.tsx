'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { Product } from '@/services/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
    showToast(`${product.title} added to bag`);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', wishlisted ? 'info' : 'success');
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 hover:-translate-y-2">
      {/* Product Image */}
      <Link href={`/product/${product.id}`} className="aspect-[3/4] overflow-hidden bg-[#F5F5F5] relative w-full block">
        {/* Badges */}
        {product.category === 'promotions' && (
          <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
            -40%
          </div>
        )}
        {Number(product.id) % 2 !== 0 && product.category !== 'promotions' && (
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            New
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
            product.category === 'promotions' ? 'top-14' : ''
          } ${
            wishlisted
              ? 'bg-red-500 text-white scale-110'
              : 'bg-white/90 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-1000 ease-out"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 shadow-xl ${
                isAdding
                  ? 'bg-green-500 text-white'
                  : 'bg-black text-white hover:bg-accent'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {isAdding ? (
                <span className="flex items-center gap-2">
                  Added <Check className="w-4 h-4" />
                </span>
              ) : 'Add to Bag'}
            </button>
            <Link
              href={`/product/${product.id}`}
              className="w-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:bg-white transition-all"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </Link>
          </div>
        </div>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Product Info */}
      <div className="flex flex-col p-5 flex-grow">
        <div className="mb-2 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-black">
          {product.category}
        </div>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-bold text-primary line-clamp-1 mb-3 group-hover:text-accent transition-colors duration-300">
            {product.title}
          </h3>
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-black italic text-primary">
            {product.price} <span className="text-[10px] text-gray-400 font-bold not-italic uppercase tracking-widest">MAD</span>
          </p>
          {product.colors && product.colors.length > 0 && (
            <div className="flex -space-x-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
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
