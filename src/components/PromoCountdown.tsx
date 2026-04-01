'use client';

import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PromoCountdownProps {
  endDate: string; // ISO format or something parseable
  className?: string;
}

export default function PromoCountdown({ endDate, className = "" }: PromoCountdownProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTime = () => {
      const target = new Date(endDate).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((distance / (1000 * 60 * 60))),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    // Set immediately
    setTimeLeft(calculateTime());

    const timer = setInterval(() => {
      const newTime = calculateTime();
      setTimeLeft(newTime);
      if (newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!isMounted) {
     return <div className={`flex items-center gap-3 bg-red-500 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-red-500/20 opacity-50 ${className}`}>
                 <Timer className="w-4 h-4 animate-pulse-slow" />
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest">{t('sale_ends_in') || 'Ends in'}:</span>
                   <div className="flex gap-1.5 font-black italic text-xs tabular-nums text-transparent">--:--:--</div>
                 </div>
            </div>;
  }

  return (
    <div className={`flex items-center gap-3 bg-red-500 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-red-500/20 ${className}`}>
      <Timer className="w-4 h-4 animate-pulse-slow" />
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest">{t('sale_ends_in') || 'Ends in'}:</span>
        <div className="flex gap-1.5 font-black italic text-xs tabular-nums">
          <div className="bg-white/20 px-1.5 rounded-lg border border-white/10">{String(timeLeft.hours).padStart(2, '0')}h</div>
          <span className="opacity-50">:</span>
          <div className="bg-white/20 px-1.5 rounded-lg border border-white/10">{String(timeLeft.minutes).padStart(2, '0')}m</div>
          <span className="opacity-50">:</span>
          <div className="bg-white/20 px-1.5 rounded-lg border border-white/10 text-accent">{String(timeLeft.seconds).padStart(2, '0')}s</div>
        </div>
      </div>
    </div>
  );
}
