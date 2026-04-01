'use client';

import { useCurrency } from '@/context/CurrencyContext';
import { DollarSign, Euro, Wallet } from 'lucide-react';
import { useState } from 'react';

const options: { label: string; value: 'MAD' | 'EUR' | 'USD'; icon: any }[] = [
  { label: 'MAD', value: 'MAD', icon: Wallet },
  { label: 'EUR', value: 'EUR', icon: Euro },
  { label: 'USD', value: 'USD', icon: DollarSign },
];

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#111] border border-[#333] rounded-xl hover:bg-[#222] text-gray-400 hover:text-white transition-all duration-500 group"
      >
        <span className="text-[10px] font-black uppercase tracking-widest">{currency}</span>
        <div className={`w-1 h-1 rounded-full bg-accent group-hover:animate-ping`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 right-0 bg-[#111] border border-[#333] p-2 rounded-2xl shadow-2xl z-50 min-w-[120px] animate-scale-in">
             <div className="space-y-1">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setCurrency(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      currency === opt.value ? 'bg-accent text-secondary shadow-lg' : 'text-gray-400 hover:bg-[#222] hover:text-white'
                    }`}
                  >
                    {opt.label}
                    <opt.icon className={`w-3 h-3 ${currency === opt.value ? 'text-secondary' : ''}`} />
                  </button>
                ))}
             </div>
          </div>
        </>
      )}
    </div>
  );
}
