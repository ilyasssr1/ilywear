'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Hammer, Clock, Instagram } from 'lucide-react';

export default function MaintenancePage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-[#111] border border-accent/20 rounded-[2.5rem] shadow-2xl relative group">
          <Hammer className="w-10 h-10 text-accent group-hover:rotate-12 transition-transform duration-500" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
        </div>

        <h1 className="text-6xl md:text-8xl font-impact uppercase tracking-tighter text-white mb-6 leading-none">
          {t('maintenance_title') || 'SITE EN MAINTENACE'}
        </h1>
        
        <p className="text-gray-400 font-sans text-lg md:text-xl leading-relaxed mb-12 max-w-lg mx-auto">
          {t('maintenance_subtitle') || "Nous mettons à jour IlyWear pour vous offrir la meilleure expérience possible. On revient très vite !"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-[#111] border border-[#222] p-8 rounded-[2rem] flex flex-col items-center group hover:border-accent/20 transition-colors">
            <Clock className="w-6 h-6 text-accent mb-4" />
            <span className="font-impact text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">{t('scheduled_return') || 'RETOUR PRÉVU'}</span>
            <span className="font-impact text-xl text-white tracking-widest">~ 2 HEURES</span>
          </div>
          <div className="bg-[#111] border border-[#222] p-8 rounded-[2rem] flex flex-col items-center group hover:border-accent/20 transition-colors">
            <Instagram className="w-6 h-6 text-accent mb-4" />
            <span className="font-impact text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">SUIVEZ-NOUS</span>
            <a href="https://instagram.com/ilywear" className="font-impact text-xl text-white tracking-widest hover:text-accent transition-colors">@ILYWEAR</a>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
           <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
           <div className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
           <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
        </div>
      </div>

      {/* Corporate Branding */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
         <h2 className="font-impact text-2xl uppercase tracking-[0.5em] text-white">ILYWEAR</h2>
      </div>
    </div>
  );
}
