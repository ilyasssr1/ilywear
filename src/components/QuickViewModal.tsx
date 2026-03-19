'use client';

import { X, ShoppingBag, Check, Ruler, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Product } from '@/services/products';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewProps) {
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [isAdded, setIsAdded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const images = product.images || [product.image];

  const handleNext = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button Mobile */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 backdrop-blur-sm rounded-xl md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Image Section */}
        <div className="md:w-1/2 relative bg-gray-50 h-[350px] md:h-auto">
          <Image 
            src={images[currentImageIndex]} 
            alt={product.title} 
            fill 
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
               <button onClick={handlePrev} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg"><ChevronLeft className="w-5 h-5" /></button>
               <button onClick={handleNext} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg"><ChevronRight className="w-5 h-5" /></button>
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === i ? 'bg-black w-4' : 'bg-black/20'}`} />
            ))}
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide flex flex-col">
          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 hidden md:block p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-8">
            <span className="text-accent text-[9px] font-black uppercase tracking-[0.3em] mb-2 inline-block">{product.category}</span>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic leading-tight text-primary">{product.title}</h2>
            <div className="text-2xl font-black italic mt-4">{formatPrice(product.price)}</div>
          </div>

          <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8 line-clamp-3">
            {product.description}
          </p>

          <div className="space-y-8 mb-10">
            {product.sizes && product.sizes.length > 0 && (
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{t('choose_size')}</p>
                 <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button 
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`h-11 px-6 rounded-xl border text-[10px] font-black transition-all ${selectedSize === s ? 'bg-black text-white border-black' : 'border-gray-100 hover:border-black'}`}
                      >
                        {s}
                      </button>
                    ))}
                 </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">{t('choose_color')}</p>
                 <div className="flex flex-wrap gap-3">
                    {product.colors.map(c => (
                      <button 
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-primary ring-2 ring-primary/20 ring-offset-2' : 'border-transparent shadow-sm'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                 </div>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-4 pt-8 border-t border-gray-50">
             <button 
              onClick={() => {
                addToCart(product, 1, selectedSize, selectedColor);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl ${
                isAdded ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-accent'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {isAdded ? t('added') : t('add_to_bag')}
            </button>
            <Link 
              href={`/product/${product.id}`}
              className="w-full py-2 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              {isRTL ? 'عرض تفاصيل المنتج' : 'View full details'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
