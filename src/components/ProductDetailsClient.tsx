'use client';

import { useState } from 'react';
import Image from 'next/image';
import ImageMagnifier from './ImageMagnifier';
import { Product } from '@/services/products';
import { useCart } from '@/context/CartContext';
import ProductReviews from './ProductReviews';
import SizeGuide from './SizeGuide';
import { ChevronLeft, ChevronRight, ShoppingBag, Truck, RotateCcw, ShieldCheck, MessageCircle, Check, Star, Ruler } from 'lucide-react';

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
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
    `Hello IlyWear! I want to order this product:\n\n*Product*: ${product.title}\n*Price*: ${product.price} MAD\n*Product ID*: ${product.id}\n${selectedSize ? `*Size*: ${selectedSize}\n` : ''}${selectedColor ? `*Color*: ${selectedColor}\n` : ''}*Link*: https://ilywear.vercel.app/product/${product.id}`
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-12 lg:gap-x-16">
      {/* Image Section */}
      <div className="md:col-span-5 lg:col-span-5 flex flex-col gap-4 items-center md:items-start self-start">
        {/* Main Image Carousel */}
        <div className="relative group aspect-[4/5] md:aspect-[3/4] w-full max-w-[450px] bg-gray-50 rounded-2xl border border-gray-100 p-2 sm:p-0">
          <ImageMagnifier src={selectedImage} alt={product.title} />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 flex items-center justify-center text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnails Under Main Image */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide justify-center sm:justify-start min-w-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-24 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx ? 'border-primary ring-2 ring-primary/30 ring-offset-2' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} - Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="md:col-span-7 lg:col-span-7 flex flex-col md:row-span-2">
        <div className="mb-8">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4 inline-block">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary uppercase italic leading-none">{product.title}</h1>
        </div>

        <div className="text-4xl font-black text-primary mb-10 flex items-baseline gap-2 italic">
          {product.price} <span className="text-lg text-gray-400 font-medium not-italic">MAD</span>
        </div>

        <div className="mb-10 p-8 bg-[#FBFBFB] rounded-[2rem] border border-gray-100">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Description</h3>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">{product.description}</p>
        </div>

        {/* Options */}
        <div className="border border-gray-100 rounded-[2rem] p-8 mb-10 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
          <h3 className="font-black text-xs uppercase tracking-widest mb-8 text-primary border-b border-gray-50 pb-6">Product Options</h3>
          <div className="flex flex-wrap gap-10">
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex-1 min-w-[150px]">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-gray-700">Choisir la taille</p>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2 hover:underline"
                  >
                    <Ruler className="w-3 h-3" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-12 min-w-[3rem] px-5 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
                        selectedSize === size 
                          ? 'border-primary bg-primary text-white shadow-md shadow-primary/20' 
                          : 'border-gray-200 text-gray-600 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex-1 min-w-[150px]">
                <p className="text-sm font-medium text-gray-700 mb-3">Choisir la couleur <span className="text-red-500">*</span></p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border border-gray-200 transition-all ${
                        selectedColor === color 
                          ? 'scale-110 shadow-md ring-2 ring-primary ring-offset-2 border-transparent' 
                          : 'hover:scale-105 shadow-sm'
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

        {/* Order Action */}
        <div className="flex flex-col gap-4 mt-2 border-t border-gray-50 pt-8">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-400 mb-2">Shopping Options</h3>
          <button
            onClick={() => {
              addToCart(product, 1, selectedSize, selectedColor);
              setIsAdded(true);
              setTimeout(() => setIsAdded(false), 2000);
            }}
            className={`w-full flex items-center justify-center gap-4 py-6 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl ${
              isAdded 
              ? 'bg-green-500 text-white shadow-green-500/20' 
              : 'bg-black text-white hover:bg-accent hover:-translate-y-1 shadow-black/30'
            }`}
          >
            {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            <span>{isAdded ? 'Added to Bag' : 'Add to Bag'}</span>
          </button>
          
          <a
            href={`https://wa.me/212600000000?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-4 text-gray-500 hover:text-black transition-colors group"
          >
            <MessageCircle className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Ask about this piece</span>
          </a>
          <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest mt-2">Instant Response Guaranteed</p>
        </div>

        {/* Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex flex-col items-center text-center">
            <Truck className="w-6 h-6 text-primary mb-2" />
            <span className="text-sm font-bold text-gray-800">Livraison Gratuite</span>
            <span className="text-xs text-gray-500 mt-1">Partout au Maroc</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-primary mb-2" />
            <span className="text-sm font-bold text-gray-800">Qualité Premium</span>
            <span className="text-xs text-gray-500 mt-1">Produits vérifiés</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <RotateCcw className="w-6 h-6 text-primary mb-2" />
            <span className="text-sm font-bold text-gray-800">Retours Faciles</span>
            <span className="text-xs text-gray-500 mt-1">Sous 7 jours</span>
          </div>
        </div>
      </div>

      {/* Reviews Section mapped to full width */}
      <div className="md:col-span-12 lg:col-span-12 mt-10 md:mt-20">
        <ProductReviews productId={product.id} />
      </div>

      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
