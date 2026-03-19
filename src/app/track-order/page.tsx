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
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">{t('order_lookup')}</span>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-6">{t('track_your_order')}</h1>
            <p className="text-gray-400 text-sm font-medium">{t('track_subtitle')}</p>
          </div>

          {/* Search Box */}
          <div className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-sm">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest text-gray-400 ${isRTL ? 'mr-4' : 'ml-4'} flex items-center gap-2`}>
                   <Package className="w-3 h-3" /> {t('order_id')}
                </label>
                <div className="relative">
                  <Search className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                  <input 
                    required
                    placeholder="e.g. 12345678" 
                    className={`w-full bg-white border border-gray-100 rounded-2xl py-6 ${isRTL ? 'pr-16 pl-6' : 'pl-16 pr-6'} text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm`}
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest text-gray-400 ${isRTL ? 'mr-4' : 'ml-4'} flex items-center gap-2`}>
                   <Phone className="w-3 h-3" /> {t('whatsapp_phone')}
                </label>
                <div className="relative">
                  <Phone className={`absolute ${isRTL ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} />
                  <input 
                    required
                    type="tel"
                    placeholder="e.g. 06..." 
                    className={`w-full bg-white border border-gray-100 rounded-2xl py-6 ${isRTL ? 'pr-16 pl-6' : 'pl-16 pr-6'} text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all shadow-sm`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-xl shadow-black/10 disabled:opacity-50"
              >
                {loading ? t('searching') : t('track_delivery')}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-600 mb-12 animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </div>
          )}

          {order && (
            <div className="space-y-8 animate-slide-up">
              {/* Status Progress */}
              <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('current_status')}</p>
                     <p className="text-2xl font-black italic uppercase text-primary">
                        {t(`status_${order.status}` as any) || order.status}
                     </p>
                   </div>
                   <div className={isRTL ? 'text-left' : 'text-right'}>
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('expected_delivery')}</p>
                     <p className="text-sm font-bold">{t('business_days')}</p>
                   </div>
                </div>

                <div className="relative h-1 bg-gray-100 rounded-full mb-12">
                    <div 
                     className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} h-full transition-all duration-1000 ease-out rounded-full ${order.status === 'cancelled' ? 'bg-red-500 w-full' : 'bg-accent'}`}
                     style={{ width: order.status === 'cancelled' ? '100%' : `${(getStatusStep(order.status) + 1) * 25}%` }}
                    />
                    <div className="absolute top-0 left-0 w-full flex justify-between -translate-y-1/2">
                       {order.status === 'cancelled' ? (
                          <div className="flex flex-col items-center w-full">
                             <div className="w-4 h-4 rounded-full border-4 border-white shadow-md bg-red-500" />
                             <span className="text-[8px] font-black uppercase tracking-widest mt-4 text-red-500">{t('status_cancelled')}</span>
                          </div>
                       ) : (
                          ['pending', 'processing', 'shipped', 'delivered'].map((step, i) => (
                            <div key={step} className="flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full border-4 border-white shadow-md transition-colors duration-500 ${getStatusStep(order.status) >= i ? 'bg-accent' : 'bg-gray-200'}`} />
                              <span className={`text-[8px] font-black uppercase tracking-widest mt-4 ${getStatusStep(order.status) >= i ? 'text-black' : 'text-gray-300'}`}>
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
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                     <MapPin className="w-3 h-3" /> {t('shipping_to')}
                   </p>
                   <h3 className="text-sm font-bold mb-1">{order.customer_name}</h3>
                   <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                     {order.customer_address}, {order.customer_city}
                   </p>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                     <Package className="w-3 h-3" /> {t('order_details')}
                   </p>
                   <p className="text-[11px] font-bold mb-1">{t('placed_on')} {new Date(order.created_at).toLocaleDateString()}</p>
                   <p className="text-[11px] text-gray-400 font-medium">
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
