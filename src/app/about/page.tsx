'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Heart, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-black">
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1445205170230-053b830c6039?w=1600&q=80')] bg-cover bg-center" />
             <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-6 inline-block animate-fade-in">Our Story</span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none animate-slide-up">
              Redefining <br /> <span className="text-accent">Moroccan</span> Style
            </h1>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-32 container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-8">The Philosophy</h2>
                <p className="text-gray-600 text-lg leading-relaxed font-medium mb-8">
                  IlyWear was born from a simple yet powerful vision: to bridge the gap between traditional Moroccan craftsmanship and the dynamic world of global streetwear.
                </p>
                <p className="text-gray-500 leading-relaxed mb-10">
                  We believe that fashion is a language which should speak of both heritage and future. Every piece we create is a tribute to the vibrant streets of Casablanca and the timeless elegance of Moroccan textures.
                </p>
                <Link href="/shop" className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary">
                   Explore the Collection
                   <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                     <ArrowRight className="w-4 h-4" />
                   </div>
                </Link>
              </div>
              <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
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
        <section className="bg-gray-50 py-32 rounded-[4rem] mx-4 mb-32">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Our Core Values</h2>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-bold">What makes IlyWear different</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "Authentic Design",
                  desc: "Unique silhouettes that you won't find anywhere else, designed right here in Morocco."
                },
                {
                  icon: <ShieldCheck className="w-8 h-8" />,
                  title: "Premium Quality",
                  desc: "We source only the finest fabrics to ensure every piece feels as good as it looks."
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: "Local Impact",
                  desc: "Proudly supporting local artisans and manufacturers across the kingdom."
                }
              ].map((value, idx) => (
                <div key={idx} className="bg-white p-12 rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="text-accent mb-8">{value.icon}</div>
                  <h3 className="text-xl font-black uppercase tracking-tight italic mb-4">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-32 container mx-auto px-6 text-center">
          <div className="bg-black text-white p-20 rounded-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
               <Sparkles className="w-32 h-32 text-accent" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-8 leading-none">
              Join the <br /> <span className="text-accent italic">Elite</span> Movement
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Be part of the community that is redefining style in the Maghreb.
            </p>
            <Link href="/register" className="bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all inline-block shadow-2xl shadow-white/5">
              Create an Account
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
