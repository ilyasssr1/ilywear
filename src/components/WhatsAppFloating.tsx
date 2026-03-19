'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState, useEffect } from 'react';

export default function WhatsAppFloating() {
  const { isRTL, t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const whatsappNumber = "212600000000"; // Remplacez par votre vrai numéro si besoin
  const message = encodeURIComponent("Hello IlyWear! J'ai une question concernant un de vos articles.");

  return (
    <div 
      className={`fixed bottom-8 z-[100] transition-all duration-700 ${
        isRTL ? 'left-8' : 'right-8'
      } ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-50 pointer-events-none'}`}
    >
      <div className="group relative flex items-center justify-center">
        {/* Tooltip */}
        <div 
          className={`absolute bottom-full mb-4 px-5 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl whitespace-nowrap pointer-events-none ${
            isRTL ? 'left-0 origin-bottom-left' : 'right-0 origin-bottom-right'
          }`}
        >
          {t('support_whatsapp')}
          {/* Arrow */}
          <div className={`absolute top-full w-2 h-2 bg-black rotate-45 ${isRTL ? 'left-4' : 'right-4'} -translate-y-1/2`} />
        </div>

        {/* Pulsing ring background */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20 group-hover:opacity-40" />
        
        {/* Main Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_15px_35px_-10px_rgba(37,211,102,0.6)] hover:scale-110 hover:shadow-[0_20px_45px_-10px_rgba(37,211,102,0.8)] transition-all duration-500 hover:-rotate-12"
          aria-label="WhatsApp Support"
        >
          <MessageCircle className="w-8 h-8 fill-current" />
        </a>
      </div>
    </div>
  );
}
