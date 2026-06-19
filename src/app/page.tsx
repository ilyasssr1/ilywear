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
            <h1 className="text-6xl sm:text-7xl lg:text-9xl font-impact tracking-normal text-white mb-8 uppercase leading-[0.8] animate-slide-up">
              {t('hero_title_1')} <br />
              <span className="text-accent">{t('hero_title_2')}</span> {t('hero_title_3')}
            </h1>
            <p className="text-lg sm:text-2xl text-gray-400 mb-12 max-w-2xl text-balance font-sans leading-relaxed animate-fade-in delay-200">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in delay-300">
              <Link
                href="/shop"
                className="bg-accent hover:bg-white text-secondary hover:text-secondary px-10 py-5 font-impact text-2xl uppercase tracking-wider transition-all duration-500 transform hover:scale-105 flex items-center justify-center glow-effect"
              >
                {t('shop_collection')}
              </Link>
              <Link
                href="/shop?category=promotions"
                className="bg-transparent hover:bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-5 font-impact text-2xl uppercase tracking-wider transition-all duration-500 transform hover:scale-105 flex items-center justify-center"
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

        {/* New Arrivals Section */}
        <section className="py-24 bg-secondary">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div className="max-w-xl">
                  <span className="text-accent text-sm font-impact uppercase tracking-widest mb-3 inline-block">{t('new_arrivals')}</span>
                  <h2 className="text-5xl lg:text-7xl font-impact uppercase leading-[0.9] text-white">{t('elite_pieces')} <br />{t('you_cant_miss')}</h2>
                </div>
                <Link href="/shop" className="group flex items-center gap-4 text-xl font-impact uppercase tracking-wider bg-white text-secondary px-8 py-4 hover:bg-accent transition-all duration-500">
                  {t('view_all_arrivals')}
                  <span className={`transition-transform text-2xl ${isRTL ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`}>&rarr;</span>
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

        {/* Categories Section */}
        <section className="py-24 bg-[#111111]">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="flex flex-col items-center mb-16">
                <span className="text-accent text-sm font-impact uppercase tracking-widest mb-3">{t('collections')}</span>
                <h2 className="text-6xl font-impact uppercase text-white">{t('shop_by_category')}</h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Women Category */}
              <ScrollReveal delay={100}>
                <Link href="/shop?category=women" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] flex items-end p-10 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80"
                    alt="Women Collection"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className={`relative z-10 w-full flex justify-between items-center transition-transform duration-500 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                    <div>
                      <h2 className="text-5xl font-impact text-white mb-2 uppercase">{t('women')}</h2>
                      <p className="text-gray-300 font-sans text-sm">{t('women_subtitle')}</p>
                    </div>
                    <div className="w-16 h-16 bg-accent flex items-center justify-center group-hover:bg-white transition-colors">
                      <span className={`text-secondary text-2xl font-black ${isRTL ? 'rotate-180' : ''}`}>&rarr;</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Men Category */}
              <ScrollReveal delay={200}>
                <Link href="/shop?category=men" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] flex items-end p-10 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80"
                    alt="Men Collection"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className={`relative z-10 w-full flex justify-between items-center transition-transform duration-500 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                    <div>
                      <h2 className="text-5xl font-impact text-white mb-2 uppercase">{t('men')}</h2>
                      <p className="text-gray-300 font-sans text-sm">{t('men_subtitle')}</p>
                    </div>
                    <div className="w-16 h-16 bg-accent flex items-center justify-center group-hover:bg-white transition-colors">
                      <span className={`text-secondary text-2xl font-black ${isRTL ? 'rotate-180' : ''}`}>&rarr;</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>

              {/* Boys Category */}
              <ScrollReveal delay={300}>
                <Link href="/shop?category=boys" className="group relative h-[500px] overflow-hidden rounded-[2.5rem] flex items-end p-10 shadow-2xl">
                  <Image
                    src="/images/boys-category.png"
                    alt="Boys Collection"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className={`relative z-10 w-full flex justify-between items-center transition-transform duration-500 ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                    <div>
                      <h2 className="text-5xl font-impact text-white mb-2 uppercase">{t('boys') || 'Boys'}</h2>
                      <p className="text-gray-300 font-sans text-sm">{t('boys_subtitle') || 'Youthful Style'}</p>
                    </div>
                    <div className="w-16 h-16 bg-accent flex items-center justify-center group-hover:bg-white transition-colors">
                      <span className={`text-secondary text-2xl font-black ${isRTL ? 'rotate-180' : ''}`}>&rarr;</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-[#0A0A0A] border-y border-[#333]">
          <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {benefits.map((benefit, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-[#111] border border-[#333] flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:border-accent transition-all duration-500">
                    <benefit.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-impact uppercase tracking-wide text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 font-sans text-sm">{benefit.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Promo Section */}
        <section className="py-32 relative overflow-hidden bg-black flex items-center justify-center border-y border-accent">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
              alt="Promo background"
              fill
              className="object-cover"
            />
          </div>
          <ScrollReveal className="relative z-10 container mx-auto px-6 max-w-4xl text-center flex flex-col items-center">
            <h2 className="text-7xl md:text-9xl font-impact mb-6 text-white uppercase leading-[0.8]">
              {t('sale_of')} <br /><span className="text-accent">{t('the_season')}</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 text-balance leading-relaxed font-sans">
              {t('promo_subtitle')}
            </p>
            <Link
              href="/shop?category=promotions"
              className="bg-accent text-secondary hover:bg-white hover:text-secondary px-12 py-5 font-impact text-2xl uppercase tracking-wider transition-all duration-500 glow-effect flex items-center gap-4"
            >
              {t('shop_the_sale')}
              <span className={isRTL ? 'rotate-180 text-3xl' : 'text-3xl'}>&rarr;</span>
            </Link>
          </ScrollReveal>
        </section>

      </main>
      <Footer />
    </>
  );
}
