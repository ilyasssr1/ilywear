'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Heart, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t, isRTL } = useLanguage();

  const values = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('authentic_design'),
      desc: t('authentic_design_desc')
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: t('premium_quality_value'),
      desc: t('premium_quality_value_desc')
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('local_impact'),
      desc: t('local_impact_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black">
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1445205170230-053b830c6039?w=1600&q=80')] bg-cover bg-center" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="text-accent font-impact text-sm uppercase tracking-[0.4em] mb-6 inline-block animate-fade-in">{t('our_story')}</span>
            <h1 className="text-6xl md:text-8xl font-impact text-white tracking-wider uppercase leading-none animate-slide-up">
              {t('redefining')} <br /> <span className="text-accent">{t('moroccan')}</span> {t('style')}
            </h1>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-32 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-impact uppercase tracking-wider text-white mb-8">{t('philosophy')}</h2>
                <p className="text-gray-300 text-lg leading-relaxed font-sans mb-8">
                  {t('philosophy_text_1')}
                </p>
                <p className="text-gray-500 leading-relaxed font-sans mb-10">
                  {t('philosophy_text_2')}
                </p>
                <Link href="/shop" className="group flex items-center gap-4 font-impact text-sm uppercase tracking-widest text-white">
                   {t('explore_collection')}
                   <div className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center group-hover:bg-accent group-hover:text-secondary group-hover:border-accent transition-all">
                     <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                   </div>
                </Link>
              </div>
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700 border border-[#222]">
                <Image 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" 
                  alt="Craftsmanship" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="bg-[#111] py-32 rounded-[4rem] mx-4 mb-32 border border-[#222]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-impact uppercase tracking-wider text-white mb-4">{t('core_values')}</h2>
              <p className="text-gray-500 text-sm font-impact uppercase tracking-widest">{t('what_makes_different')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="bg-[#1a1a1a] p-12 rounded-3xl border border-[#222] hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-2 transition-all duration-500">
                  <div className="text-accent mb-8">{value.icon}</div>
                  <h3 className="text-xl font-impact uppercase tracking-wider text-white mb-4">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-sans">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-32 container mx-auto px-6 text-center">
          <div className="bg-[#111] border border-[#222] text-white p-20 rounded-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <Sparkles className="w-32 h-32 text-accent" />
            </div>
            <h2 className="text-5xl md:text-7xl font-impact uppercase tracking-wider mb-8 leading-none text-white">
              {t('join_elite')} <br /> <span className="text-accent">{t('elite')}</span> {t('movement')}
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto font-sans">
              {t('elite_subtitle')}
            </p>
            <Link href="/register" className="bg-accent text-secondary px-12 py-6 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-white transition-all inline-block shadow-2xl shadow-accent/10 glow-effect">
              {t('create_account')}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
