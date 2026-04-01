'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageMagnifier from './ImageMagnifier';
import { Product } from '@/services/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSettings } from '@/context/SettingsContext';
import ProductReviews from './ProductReviews';
import SizeGuide from './SizeGuide';
import PromoCountdown from './PromoCountdown';
import StockNotifyModal from './StockNotifyModal';
import { ChevronLeft, ChevronRight, ShoppingBag, Truck, RotateCcw, ShieldCheck, MessageCircle, Check, Star, Ruler, Bell } from 'lucide-react';

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const { whatsappNumber } = useSettings();
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const images = product.images || [product.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const selectedImage = images[currentImageIndex];
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const whatsappMessage = encodeURIComponent(
    `Hello IlyWear! I want to order this product:\n\n*Product*: ${product.title}\n*Price*: ${product.price} MAD\n*Product ID*: ${product.id}\n${selectedSize ? `*Size*: ${selectedSize}\n` : ''}${selectedColor ? `*Color*: ${selectedColor}\n` : ''}*Link*: https://ilywear.shop/product/${product.id}`
  );
  const waLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-12 lg:gap-x-16">
      {/* Image Section */}
      <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-4 items-center md:items-start self-start">
        <div className="relative group aspect-[4/5] md:aspect-[3/4] w-full max-w-[450px] bg-[#111111] rounded-2xl border border-[#333] p-2 sm:p-0">
          <ImageMagnifier src={selectedImage} alt={product.title} />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#111]/80 backdrop-blur-sm border border-[#333] flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-secondary`}
              >
                <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={handleNextImage}
                className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#111]/80 backdrop-blur-sm border border-[#333] flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-secondary`}
              >
                <ChevronRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </>
          )}
        </div>
        
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide justify-center sm:justify-start min-w-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-24 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx ? 'border-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-[#0A0A0A]' : 'border-transparent hover:border-[#333]'
                }`}
              >
                <Image src={img} alt={`${product.title} - Image ${idx + 1}`} fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="md:col-span-7 lg:col-span-7 flex flex-col md:row-span-2">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-accent text-sm font-impact uppercase tracking-widest inline-block">{product.category}</span>
            {product.category === 'promotions' && (
              <PromoCountdown 
                endDate={product.promo_end_date || "2026-05-01T00:00:00Z"} 
                className="py-1 px-3 !rounded-lg text-xs font-impact !bg-red-500/10 !text-red-500 !shadow-none border border-red-500/10" 
              />
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-impact tracking-normal text-white uppercase leading-[0.9]">{product.title}</h1>
        </div>

        <div className="text-5xl font-impact tracking-wide text-accent mb-10 flex items-baseline gap-2">
          {formatPrice(product.price)}
        </div>

        <div className="mb-10 p-8 bg-[#111111] rounded-[2rem] border border-[#333]">
          <h3 className="text-sm font-impact uppercase tracking-widest text-gray-500 mb-4">{t('description')}</h3>
          <p className="text-gray-300 text-sm leading-relaxed font-sans">{product.description}</p>
        </div>

        {/* Options */}
        <div className="border border-[#333] rounded-[2rem] p-8 mb-10 bg-[#0A0A0A] shadow-[0_20px_40px_-20px_rgba(204,255,0,0.05)]">
          <h3 className="font-impact text-sm uppercase tracking-widest mb-8 text-white border-b border-[#333] pb-6">{t('product_options')}</h3>
          <div className="flex flex-wrap gap-10">
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex-1 min-w-[150px]">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-bold font-sans text-gray-300">{t('choose_size')}</p>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-xs font-impact uppercase tracking-widest text-accent flex items-center gap-2 hover:underline"
                  >
                    <Ruler className="w-4 h-4" /> {t('size_guide')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-[3rem] px-5 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
                        selectedSize === size 
                          ? 'border-accent bg-accent text-secondary shadow-[0_0_15px_rgba(204,255,0,0.3)]' 
                          : 'border-[#333] text-gray-400 hover:border-accent/50 hover:bg-[#111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="flex-1 min-w-[150px]">
                <p className="text-sm font-bold font-sans text-gray-300 mb-3">{t('choose_color')} <span className="text-accent">*</span></p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border border-[#333] transition-all ${
                        selectedColor === color 
                          ? 'scale-110 shadow-[0_0_15px_rgba(204,255,0,0.3)] ring-2 ring-accent ring-offset-2 ring-offset-[#0A0A0A] border-transparent' 
                          : 'hover:scale-105 hover:border-gray-500 shadow-sm'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Actions */}
        <div className="flex flex-col gap-4 mt-2 border-t border-[#333] pt-8">
          <h3 className="font-impact text-sm uppercase tracking-widest text-gray-500 mb-2">{t('shopping_options')}</h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (product.stock === 0) {
                  setIsNotifyModalOpen(true);
                  return;
                }
                addToCart(product, 1, selectedSize, selectedColor);
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }}
              disabled={product.stock === 0 && !isNotifyModalOpen}
              className={`flex-1 flex items-center justify-center gap-4 py-5 px-8 rounded-xl font-impact text-xl uppercase tracking-wider transition-all duration-500 glow-effect ${
                product.stock === 0
                ? 'bg-[#222] text-gray-500 cursor-not-allowed border border-[#333]'
                : isAdded 
                ? 'bg-accent text-secondary' 
                : 'bg-accent text-secondary hover:bg-white hover:-translate-y-1'
              }`}
            >
              {product.stock === 0 ? <Bell className="w-5 h-5" /> : isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              <span>{product.stock === 0 ? t('notify_me') : isAdded ? t('added_to_bag') : t('add_to_bag')}</span>
            </button>

            {product.stock !== 0 && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-4 py-5 px-8 rounded-xl bg-transparent border-2 border-[#25D366] text-[#25D366] font-impact text-xl uppercase tracking-wider transition-all duration-500 hover:bg-[#25D366] hover:text-white hover:-translate-y-1 shadow-[0_0_15px_rgba(37,211,102,0.1)]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('order_on_whatsapp')}</span>
              </a>
            )}
            
            {product.stock === 0 && (
               <button
                  onClick={() => setIsNotifyModalOpen(true)}
                  className="flex-1 flex items-center justify-center gap-4 py-5 px-8 rounded-xl bg-accent text-secondary font-impact text-xl uppercase tracking-wider transition-all duration-500 hover:bg-white hover:-translate-y-1 glow-effect"
                >
                  <Bell className="w-5 h-5" />
                  <span>{t('notify_me')}</span>
                </button>
            )}
          </div>
          
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 text-gray-500 hover:text-gray-400 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
            <span className="text-sm font-impact uppercase tracking-widest">{t('ask_about')}</span>
          </a>
          <p className="text-xs text-center text-gray-500 font-impact uppercase tracking-widest mt-2">{t('instant_response')}</p>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 bg-[#111111] p-6 rounded-2xl border border-[#333]">
          <div className="flex flex-col items-center text-center">
            <Truck className="w-8 h-8 text-accent mb-2" />
            <span className="text-sm font-impact uppercase tracking-wider text-white">{t('free_delivery')}</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">{t('everywhere_morocco')}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-8 h-8 text-accent mb-2" />
            <span className="text-sm font-impact uppercase tracking-wider text-white">{t('premium_quality')}</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">{t('verified_products')}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <RotateCcw className="w-8 h-8 text-accent mb-2" />
            <span className="text-sm font-impact uppercase tracking-wider text-white">{t('easy_returns_label')}</span>
            <span className="text-xs text-gray-400 mt-1 font-sans">{t('within_7_days')}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="md:col-span-12 lg:col-span-12 mt-10 md:mt-20">
        <ProductReviews productId={product.id} />
      </div>

      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <StockNotifyModal 
        isOpen={isNotifyModalOpen} 
        onClose={() => setIsNotifyModalOpen(false)} 
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />

      {/* Sticky Mobile Add to Bag */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-[#333] p-4 pb-8 transition-transform duration-500 flex gap-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => {
            if (product.stock === 0) {
              setIsNotifyModalOpen(true);
              return;
            }
            addToCart(product, 1, selectedSize, selectedColor);
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
          }}
          className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-impact text-xl uppercase tracking-wider transition-all duration-500 glow-effect ${
            product.stock === 0 
            ? 'bg-[#222] text-gray-500 border border-[#333]'
            : isAdded ? 'bg-accent text-secondary' : 'bg-accent text-secondary shadow-xl'
          }`}
        >
          {product.stock === 0 ? <Bell className="w-4 h-4" /> : isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {product.stock === 0 ? t('notify_me') : isAdded ? t('added') : t('add_to_bag')}
        </button>
        {product.stock !== 0 && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        )}
        {product.stock === 0 && (
          <button
            onClick={() => setIsNotifyModalOpen(true)}
            className="w-14 h-14 rounded-xl bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20 active:scale-95 transition-transform"
          >
            <Bell className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
