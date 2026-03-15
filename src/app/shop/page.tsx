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

export default function ShopPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const query = searchParams.get('q')?.toLowerCase() || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      let data = await fetchProducts();

      if (category) {
        data = data.filter(p => p.category === category);
      }

      if (query) {
        data = data.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      }

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
  }, [category, sort, query, priceRange]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white min-h-screen">
        <div className="container mx-auto px-6 py-12">
          {/* Header & Filters */}
          <div className="flex flex-col gap-12 mb-16">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 inline-block">Explore</span>
                  <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                    {category ? `${category}` : 'The Collection'}
                  </h1>
                </div>
                <p className="text-gray-400 text-sm max-w-xs font-medium">
                  Showing {products.length} artisan-selected pieces.
                </p>
              </div>
            </ScrollReveal>
            
            <div className="flex flex-wrap gap-6 items-start border-b border-gray-100 pb-10">
              <div className="flex-1 min-w-[300px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Collections</span>
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {[
                    { label: 'All Items', href: '/shop' },
                    { label: 'Women', href: '/shop?category=women' },
                    { label: 'Men', href: '/shop?category=men' },
                    { label: 'Promotions', href: '/shop?category=promotions', accent: true }
                  ].map((filter) => (
                    <Link 
                      key={filter.label}
                      href={filter.href} 
                      className={`px-8 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all border ${
                        (!category && filter.label === 'All Items') || category === filter.label.toLowerCase() 
                        ? 'bg-black text-white border-black shadow-2xl shadow-black/20 scale-105' 
                        : filter.accent && category === 'promotions'
                        ? 'bg-accent text-white border-accent shadow-2xl shadow-accent/20 scale-105'
                        : filter.accent
                        ? 'text-accent border-accent/20 hover:bg-accent hover:text-white'
                        : 'text-gray-400 border-gray-100 hover:border-black hover:text-black'
                      }`}
                    >
                      {filter.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-auto">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 block">Sort By</span>
                <div className="flex gap-2">
                  {[
                    { label: 'Price: Low-High', value: 'price-asc' },
                    { label: 'Price: High-Low', value: 'price-desc' },
                    { label: 'A-Z', value: 'name' }
                  ].map((s) => (
                    <Link
                      key={s.value}
                      href={`/shop?${category ? `category=${category}&` : ''}${query ? `q=${query}&` : ''}sort=${s.value}`}
                      className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        sort === s.value 
                        ? 'bg-primary text-white border-primary shadow-lg' 
                        : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Price Range</span>
              </div>
              <div className="flex gap-2">
                {[
                  { label: 'All Prices', value: 'all' },
                  { label: 'Under 200 MAD', value: '0-200' },
                  { label: '200–500 MAD', value: '200-500' },
                  { label: '500+ MAD', value: '500+' },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value)}
                    className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                      priceRange === range.value
                      ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse rounded-3xl overflow-hidden">
                  <div className="aspect-[3/4] bg-gray-100 rounded-3xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 w-16 bg-gray-100 rounded" />
                    <div className="h-4 w-32 bg-gray-100 rounded" />
                    <div className="h-5 w-20 bg-gray-100 rounded" />
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
            <div className="py-32 text-center flex flex-col items-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                <Search className="w-8 h-8 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black tracking-tighter uppercase italic text-primary mb-3">No Pieces Found</h3>
              <p className="text-gray-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">We couldn't find any items matching your current selection. Try a different category or price range.</p>
              <button
                onClick={() => setPriceRange('all')}
                className="mt-8 bg-black text-white px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
