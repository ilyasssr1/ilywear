'use client';

import { useState } from 'react';
import { Bell, X, Check, Phone } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { requestStockNotification } from '@/services/products';

interface StockNotifyModalProps {
  product: { id: string | number; title: string };
  selectedSize?: string;
  selectedColor?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockNotifyModal({ product, selectedSize, selectedColor, isOpen, onClose }: StockNotifyModalProps) {
  const { t, isRTL } = useLanguage();
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsSubmitting(true);
    setError('');

    const success = await requestStockNotification({
      product_id: product.id,
      phone,
      size: selectedSize,
      color: selectedColor
    });

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setPhone('');
      }, 3000);
    } else {
      setError(t('notify_failed'));
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-[#333] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className={`absolute ${isRTL ? 'left-6' : 'right-6'} top-6 p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#222]`}>
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="p-10">
          <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-8 mx-auto glow-effect">
            <Bell className="w-10 h-10 text-accent animate-bounce-slow" />
          </div>

          {!isSuccess ? (
            <>
              <h2 className="text-4xl font-impact tracking-wider uppercase text-white mb-2 text-center">
                {t('notify_me')}
              </h2>
              <p className="text-gray-400 text-sm font-sans mb-8 leading-relaxed text-center">
                {t('notify_me_desc')} {selectedSize && <span className="text-accent font-impact uppercase tracking-widest text-lg">({selectedSize})</span>}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500 block px-2">
                    {t('enter_phone_notify')}
                  </label>
                  <div className="relative">
                    <Phone className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500`} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 06..."
                      required
                      className={`w-full bg-[#111] border border-[#333] focus:bg-[#0A0A0A] focus:ring-2 focus:ring-accent focus:border-accent h-14 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl text-white text-sm font-sans transition-all outline-none placeholder:text-gray-600`}
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 font-impact tracking-widest uppercase mt-2 px-2">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-accent text-secondary rounded-md font-impact text-xl uppercase tracking-wider glow-effect hover:bg-white hover:text-secondary transition-all disabled:opacity-50"
                >
                  {isSubmitting ? t('processing') : t('notify_me')}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 glow-effect-green">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-impact tracking-wider uppercase text-white mb-4">
                {t('notify_success')}
              </h2>
              <p className="text-gray-400 text-sm font-sans">
                {t('notify_me_desc').replace('.','')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
