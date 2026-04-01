'use client';

import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '@/services/products';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal';
import { useLanguage } from '@/context/LanguageContext';

import { Suspense } from 'react';

function ShopContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const query = searchParams.get('q')?.toLowerCase() || '';
  const { t, isRTL } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let data = await fetchProducts();
      
      if (category) data = data.filter(p => p.category === category);
      if (query) data = data.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      
      // Advanced Filters
      if (selectedSize) data = data.filter(p => p.sizes?.includes(selectedSize));
      if (selectedColor) data = data.filter(p => p.colors?.includes(selectedColor));
      if (inStockOnly) data = data.filter(p => p.stock !== 0);

      if (priceRange === '0-200') data = data.filter(p => p.price <= 200);
      else if (priceRange === '200-500') data = data.filter(p => p.price > 200 && p.price <= 500);
      else if (priceRange === '500+') data = data.filter(p => p.price > 500);
      
      if (sort === 'price-asc') data = [...data].sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') data = [...data].sort((a, b) => b.price - a.price);
      else if (sort === 'name') data = [...data].sort((a, b) => a.title.localeCompare(b.title));
      
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [category, sort, query, priceRange, selectedSize, selectedColor, inStockOnly]);

  const categoryLabels: Record<string, string> = {
    women: t('women'),
    men: t('men'),
    boys: t('boys'),
    promotions: t('promotions'),
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#0A0A0A] min-h-screen">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col gap-12 mb-16">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-accent text-sm font-impact uppercase tracking-widest mb-3 inline-block">{t('explore')}</span>
                  <h1 className="text-6xl md:text-8xl font-impact tracking-normal text-white uppercase leading-[0.9]">
                    {category ? categoryLabels[category] || category : t('the_collection')}
                  </h1>
                </div>
                <p className="text-gray-400 text-sm max-w-xs font-medium">
                  {t('showing_pieces').replace('{count}', products.length.toString())}
                </p>
              </div>
            </ScrollReveal>
            
            <div className="flex flex-wrap gap-6 items-start border-b border-[#333] pb-10">
              <div className="flex-1 min-w-[300px]">
                <span className="text-sm font-impact uppercase tracking-widest text-gray-500 mb-4 block">{t('collections')}</span>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {[
                    { label: t('all_items'), href: '/shop' },
                    { label: t('women'), href: '/shop?category=women' },
                    { label: t('men'), href: '/shop?category=men' },
                    { label: t('boys'), href: '/shop?category=boys' },
                    { label: t('promotions'), href: '/shop?category=promotions', accent: true }
                  ].map((filter) => (
                    <Link 
                      key={filter.href}
                      href={filter.href} 
                      className={`px-8 py-3 rounded-md text-sm uppercase font-impact tracking-wider transition-all border whitespace-nowrap glow-effect ${
                        (!category && filter.label === t('all_items')) || category === filter.href.split('=')[1]
                        ? 'bg-accent text-secondary border-accent shadow-2xl scale-105' 
                        : filter.accent && category === 'promotions'
                        ? 'bg-accent text-secondary border-accent shadow-2xl scale-105'
                        : filter.accent
                        ? 'text-accent border-accent/20 hover:bg-accent hover:text-secondary'
                        : 'text-gray-400 border-[#333] hover:border-accent hover:text-white'
                      }`}
                    >
                      {filter.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-auto">
                <span className="text-sm font-impact uppercase tracking-widest text-gray-500 mb-4 block">{t('sort_by')}</span>
                <div className="flex gap-2">
                  {[
                    { label: t('price_low_high'), value: 'price-asc' },
                    { label: t('price_high_low'), value: 'price-desc' },
                    { label: t('name_az'), value: 'name' }
                  ].map((s) => (
                    <Link
                      key={s.value}
                      href={`/shop?${category ? `category=${category}&` : ''}${query ? `q=${query}&` : ''}sort=${s.value}`}
                      className={`px-6 py-3 rounded-md text-sm font-impact uppercase tracking-wider border transition-all whitespace-nowrap ${
                        sort === s.value 
                        ? 'bg-white text-secondary border-white shadow-lg' 
                        : 'bg-transparent text-gray-500 border-[#333] hover:border-white hover:text-white'
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-12 gap-y-8">
              {/* Price Filter */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm font-impact uppercase tracking-widest">{t('price_range')}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { label: t('all_prices'), value: 'all' },
                    { label: t('under_200'), value: '0-200' },
                    { label: t('range_200_500'), value: '200-500' },
                    { label: t('above_500'), value: '500+' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={`px-5 py-2.5 rounded-md text-sm font-impact uppercase tracking-wider border transition-all whitespace-nowrap ${
                        priceRange === range.value
                        ? 'bg-accent text-secondary border-accent shadow-lg glow-effect'
                        : 'bg-transparent text-gray-500 border-[#333] hover:border-accent hover:text-accent'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm font-impact uppercase tracking-widest">{t('size')}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                      className={`w-10 h-10 rounded-md text-sm font-impact border transition-all ${
                        selectedSize === size
                        ? 'bg-accent text-secondary border-accent shadow-lg glow-effect'
                        : 'bg-transparent text-gray-500 border-[#333] hover:border-white hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm font-impact uppercase tracking-widest">{t('color')}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['#000000', '#FFFFFF', '#D4AF37', '#94A3B8'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color
                        ? 'scale-125 border-accent shadow-lg ring-2 ring-accent/20 ring-offset-2 ring-offset-[#0A0A0A]'
                        : 'border-[#333] shadow-sm hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm font-impact uppercase tracking-widest">{t('availability')}</span>
                </div>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className={`w-10 h-6 rounded-full p-1 transition-all duration-300 ${inStockOnly ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${inStockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <span className={`text-sm font-impact uppercase tracking-widest transition-colors ${inStockOnly ? 'text-green-500' : 'text-gray-500 group-hover:text-white'}`}>
                    {t('in_stock_only')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse flex flex-col overflow-hidden bg-[#111111] border border-[#333] rounded-3xl">
                  <div className="aspect-[3/4] bg-[#222222]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 bg-[#333] rounded" />
                    <div className="h-4 w-32 bg-[#333] rounded" />
                    <div className="h-5 w-20 bg-[#333] rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {products.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 80}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center flex flex-col items-center bg-[#111111] rounded-[2rem] border border-dashed border-[#333]">
              <div className="w-20 h-20 rounded-full bg-[#222] flex items-center justify-center shadow-sm mb-6">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-4xl font-impact tracking-wider uppercase text-white mb-3">{t('no_pieces_found')}</h3>
              <p className="text-gray-400 font-sans max-w-xs mx-auto text-sm leading-relaxed">{t('no_pieces_desc')}</p>
              <button
                onClick={() => {
                  setPriceRange('all');
                  setSelectedSize('');
                  setSelectedColor('');
                  setInStockOnly(false);
                }}
                className="mt-8 bg-accent text-secondary px-10 py-4 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-white hover:text-secondary transition-all glow-effect"
              >
                {t('reset_filters')}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
