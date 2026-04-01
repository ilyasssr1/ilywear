'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Package, Truck, Calendar, MapPin, CheckCircle2, Clock, AlertCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phoneNumber) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('customer_phone', phoneNumber)
        .single();

      if (fetchError || !data) {
        setError(t('order_not_found'));
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError(t('error_occurred'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const idx = steps.indexOf(status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-sm font-impact uppercase tracking-widest mb-4 inline-block">{t('order_lookup')}</span>
            <h1 className="text-6xl md:text-8xl font-impact tracking-normal text-white uppercase leading-[0.9] mb-6">{t('track_your_order')}</h1>
            <p className="text-gray-400 font-sans text-sm">{t('track_subtitle')}</p>
          </div>

          {/* Search Box */}
          <div className="bg-[#111111] border border-[#333] rounded-3xl p-8 md:p-12 mb-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <label className={`font-impact text-sm uppercase tracking-widest text-gray-500 ${isRTL ? 'mr-4' : 'ml-4'} flex items-center gap-2`}>
                   <Package className="w-4 h-4" /> {t('order_id')}
                </label>
                <div className="relative">
                  <Search className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
                  <input 
                    required
                    placeholder="e.g. 12345678" 
                    className={`w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl py-6 ${isRTL ? 'pr-16 pl-6' : 'pl-16 pr-6'} text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600`}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`font-impact text-sm uppercase tracking-widest text-gray-500 ${isRTL ? 'mr-4' : 'ml-4'} flex items-center gap-2`}>
                   <Phone className="w-4 h-4" /> {t('whatsapp_phone')}
                </label>
                <div className="relative">
                  <Phone className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`} />
                  <input 
                    required
                    type="tel"
                    placeholder="e.g. 06..." 
                    className={`w-full bg-[#0A0A0A] border border-[#333] text-white rounded-xl py-6 ${isRTL ? 'pr-16 pl-6' : 'pl-16 pr-6'} text-sm font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-secondary mt-8 py-5 rounded-md font-impact text-2xl uppercase tracking-wider hover:bg-white transition-all duration-500 glow-effect disabled:opacity-50"
              >
                {loading ? t('searching') : t('track_delivery')}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl flex items-center gap-4 text-red-500 mb-12 animate-fade-in">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p className="font-impact text-xl uppercase tracking-wider">{error}</p>
            </div>
          )}

          {order && (
            <div className="space-y-8 animate-slide-up">
              {/* Status Progress */}
              <div className="bg-[#111111] border border-[#333] rounded-3xl p-10 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <div>
                     <p className="font-impact text-sm uppercase tracking-widest text-gray-500 mb-1">{t('current_status')}</p>
                     <p className="font-impact text-4xl text-accent uppercase">
                        {t(`status_${order.status}` as any) || order.status}
                     </p>
                   </div>
                   <div className={isRTL ? 'text-left' : 'text-right'}>
                     <p className="font-impact text-sm uppercase tracking-widest text-gray-500 mb-1">{t('expected_delivery')}</p>
                     <p className="font-impact text-2xl text-white">{t('business_days')}</p>
                   </div>
                </div>

                <div className="relative h-2 bg-[#222] rounded-full mb-12">
                    <div 
                     className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} h-full transition-all duration-1000 ease-out rounded-full ${order.status === 'cancelled' ? 'bg-red-500 w-full glow-effect-red' : 'bg-accent glow-effect'}`}
                     style={{ width: order.status === 'cancelled' ? '100%' : `${(getStatusStep(order.status) + 1) * 25}%` }}
                    />
                    <div className="absolute top-[1px] left-0 w-full flex justify-between -translate-y-1/2">
                       {order.status === 'cancelled' ? (
                          <div className="flex flex-col items-center w-full">
                             <div className="w-5 h-5 rounded-full border-4 border-[#111] shadow-md bg-red-500 glow-effect-red" />
                             <span className="font-impact text-xs uppercase tracking-widest mt-4 text-red-500">{t('status_cancelled')}</span>
                          </div>
                       ) : (
                          ['pending', 'processing', 'shipped', 'delivered'].map((step, i) => (
                            <div key={step} className="flex flex-col items-center">
                              <div className={`w-5 h-5 rounded-full border-4 border-[#111] shadow-md transition-all duration-500 ${getStatusStep(order.status) >= i ? 'bg-accent glow-effect' : 'bg-[#333]'}`} />
                              <span className={`font-impact text-[10px] sm:text-xs uppercase tracking-widest mt-4 ${getStatusStep(order.status) >= i ? 'text-white' : 'text-gray-600'}`}>
                                {t(`status_${step}` as any)}
                              </span>
                            </div>
                          ))
                       )}
                    </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#111111] border border-[#333] rounded-3xl p-8 shadow-sm">
                   <p className="font-impact text-sm uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                     <MapPin className="w-4 h-4" /> {t('shipping_to')}
                   </p>
                   <h3 className="font-impact text-2xl text-white mb-2">{order.customer_name}</h3>
                   <p className="font-sans text-xs text-gray-400 leading-relaxed">
                     {order.customer_address}, {order.customer_city}
                   </p>
                </div>
                <div className="bg-[#111111] border border-[#333] rounded-3xl p-8 shadow-sm">
                   <p className="font-impact text-sm uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                     <Package className="w-4 h-4" /> {t('order_details')}
                   </p>
                   <p className="font-impact text-lg text-white mb-2">{t('placed_on')} {new Date(order.created_at).toLocaleDateString()}</p>
                   <p className="font-sans text-xs text-gray-400">
                     {order.items?.length} {t('items_count')} • {formatPrice(order.total)}
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
