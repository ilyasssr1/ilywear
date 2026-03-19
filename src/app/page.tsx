'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchProducts, Product } from '@/services/products';
import { useLanguage } from '@/context/LanguageContext';
import { Instagram, Truck, Sparkles, Phone, RefreshCcw } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    async function load() {
      const products = await fetchProducts();
      setFeaturedProducts(products.slice(0, 4));
    }
    load();
  }, []);

  const benefits = [
    { title: t('free_shipping'), desc: t('free_shipping_desc'), icon: Truck },
    { title: t('premium_quality'), desc: t('premium_quality_desc'), icon: Sparkles },
    { title: t('whatsapp_support'), desc: t('whatsapp_support_desc'), icon: Phone },
    { title: t('easy_returns'), desc: t('easy_returns_desc'), icon: RefreshCcw }
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[700px] w-full bg-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
              alt="Fashion Hero Background"
              fill
              className="object-cover object-center opacity-70 scale-105 animate-pulse-slow"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
            <div className="inline-block mb-6 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] animate-fade-in animate-glow">
              {t('new_collection')}
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-8 uppercase tracking-tighter leading-[0.9] animate-slide-up">
              {t('hero_title_1')} <br />
              <span className="gradient-text italic font-light">{t('hero_title_2')}</span> {t('hero_title_3')}
            </h1>
            <p className="text-base sm:text-xl text-gray-300 mb-12 max-w-2xl text-balance font-light leading-relaxed animate-fade-in delay-200">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
              <Link 
                href="/shop" 
                className="bg-accent hover:bg-white text-primary px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-500 transform hover:scale-105 shadow-[0_15px_30px_-10px_rgba(212,175,55,0.5)] flex items-center justify-center"
              >
                {t('shop_collection')}
              </Link>
              <Link 
                href="/shop?category=promotions" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-500 transform hover:scale-105 flex items-center justify-center"
              >
                {t('view_offers')}
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer">
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center mb-16">
                <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3">{t('collections')}</span>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">{t('shop_by_category')}</h2>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Women Category */}
              <ScrollReveal delay={100}>
                <Link href="/shop?category=women" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] flex items-end p-10 shadow-2xl block">
                  <Image
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                    alt="Women Collection"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className={`relative z-10 w-full flex justify-between items-center transition-transform duration-500 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">{t('women')}</h2>
                      <p className="text-gray-300 text-sm font-medium">{t('women_subtitle')}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center group-hover:bg-accent transition-colors shadow-xl">
                      <span className={`text-black text-xl font-bold ${isRTL ? 'rotate-180' : ''}`}>&rarr;</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Men Category */}
              <ScrollReveal delay={200}>
                <Link href="/shop?category=men" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] flex items-end p-10 shadow-2xl block">
                  <Image
                    src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80"
                    alt="Men Collection"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className={`relative z-10 w-full flex justify-between items-center transition-transform duration-500 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter italic">{t('men')}</h2>
                      <p className="text-gray-300 text-sm font-medium">{t('men_subtitle')}</p>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center group-hover:bg-accent transition-colors shadow-xl">
                      <span className={`text-black text-xl font-bold ${isRTL ? 'rotate-180' : ''}`}>&rarr;</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-[#F9F9F9] border-y border-gray-100">
          <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest mb-2">{benefit.title}</h3>
                  <p className="text-gray-500 text-xs font-medium">{benefit.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                  <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-3 inline-block">{t('trending_now')}</span>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-tight">{t('elite_pieces')} <br />{t('you_cant_miss')}</h2>
                </div>
                <Link href="/shop" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest bg-black text-white px-10 py-5 rounded-full hover:bg-accent transition-all duration-500 shadow-xl shadow-black/10">
                  {t('view_all_arrivals')}
                  <span className={`transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`}>&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredProducts.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center mb-16 text-center">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4">#IlyWearStyle</span>
                <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-[1.1] max-w-xl">
                  {t('community_title')} <br />{t('community_subtitle')}
                </h2>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
                "https://images.unsplash.com/photo-1529139513402-f20a02ad475e?w=500&q=80",
                "https://images.unsplash.com/photo-1539109132314-347551cd9913?w=500&q=80",
                "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=500&q=80",
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80",
                "https://images.unsplash.com/photo-1537824598504-48d0aba493df?w=500&q=80"
              ].map((img, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className={`relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl group ${i % 2 !== 0 ? 'md:translate-y-6' : ''}`}>
                    <Image
                      src={img}
                      alt={`Style lookup ${i}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Instagram className="text-white w-6 h-6" />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Section */}
        <section className="py-32 relative overflow-hidden bg-black flex items-center justify-center">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
              alt="Promo background"
              fill
              className="object-cover"
            />
          </div>
          <ScrollReveal className="relative z-10 container mx-auto px-6 max-w-4xl text-center flex flex-col items-center">
            <div className="w-20 h-[1px] bg-accent mb-8" />
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white uppercase tracking-tighter leading-tight">
              {t('sale_of')} <br /><span className="gradient-text italic font-light">{t('the_season')}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-12 text-balance leading-relaxed font-light">
              {t('promo_subtitle')}
            </p>
            <Link 
              href="/shop?category=promotions" 
              className="bg-accent text-white hover:bg-white hover:text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl shadow-accent/20 flex items-center gap-3"
            >
              {t('shop_the_sale')}
              <span className={isRTL ? 'rotate-180' : ''}>&rarr;</span>
            </Link>
          </ScrollReveal>
        </section>

      </main>
      <Footer />
    </>
  );
}
