'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, MapPin, Phone, User, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { fetchProducts, createOrder } from '@/services/products';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', address: '' });
  const [user, setUser] = useState<any>(null);
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (cart.length === 0 && !isSubmitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-white flex flex-col items-center justify-center py-32 px-6">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-8">
            <ShoppingBag className="w-8 h-8 text-gray-200" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">{t('your_bag_empty')}</h1>
          <p className="text-gray-400 text-sm font-medium mb-10">{t('add_premium')}</p>
          <Link href="/shop" className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/10">
            {t('go_to_shop')}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const generateWhatsAppMessage = () => {
    let message = `*NEW ORDER - IlyWear*\n\n`;
    message += `*CUSTOMER DETAILS:*\n`;
    message += `Name: ${formData.name}\n`;
    message += `Phone: ${formData.phone}\n`;
    message += `City: ${formData.city}\n`;
    message += `Address: ${formData.address}\n\n`;
    message += `*ORDER SUMMARY:*\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   Size: ${item.selectedSize || 'N/A'} | Color: ${item.selectedColor || 'N/A'}\n`;
      message += `   Qty: ${item.quantity} x ${item.price} MAD\n\n`;
    });
    message += `*TOTAL AMOUNT:* ${cartTotal} MAD\n`;
    message += `*SHIPPING:* FREE\n\n`;
    message += `_Please confirm my order. Thank you!_`;
    return encodeURIComponent(message);
  };

  const [loading, setLoading] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_city: formData.city,
        customer_address: formData.address,
        items: cart,
        total: cartTotal,
        user_id: user?.id
      };

      const result = await createOrder(orderData);
      if (!result) throw new Error('Failed to save order to database');

      setLastOrderId(result.id.toString());
      
      const adminPhone = "+212600000000"; 
      const apiKey = "123456"; 
      const notificationText = `🚀 *New Order Alert!*%0A%0A*Order ID:* ${result.id}%0A*Customer:* ${formData.name}%0A*Total:* ${cartTotal} MAD%0A%0A_Check dashboard for details._`;
      
      try {
        fetch(`https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${notificationText}&apikey=${apiKey}`, { mode: 'no-cors' });
      } catch (e) {}

      setIsSubmitted(true);
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert(t('something_wrong'));
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-white flex flex-col items-center justify-center py-24 px-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-8 animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic mb-4">{t('order_received')}</h1>
          <p className="text-gray-400 text-center text-sm font-medium max-w-md mb-8">
            {t('order_thanks')}
          </p>
          
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 mb-12 w-full max-w-sm text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{t('your_order_id')}</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-lg font-black tracking-widest text-primary bg-white px-4 py-2 rounded-xl border border-gray-100">
                {lastOrderId?.substring(0, 8)}
              </code>
              <button 
                onClick={() => {
                  if (lastOrderId) navigator.clipboard.writeText(lastOrderId);
                  alert(t('order_id_copied'));
                }}
                className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline"
              >
                {t('copy')}
              </button>
            </div>
            <p className="mt-4 text-[11px] font-black text-primary uppercase italic">Total: {formatPrice(cartTotal)}</p>
            <p className="mt-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
              {t('use_id_tracking')} <Link href="/track-order" className="text-primary underline">{t('tracking_page')}</Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/track-order" className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/10 flex items-center gap-2">
              {t('track_order_now')}
            </Link>
            <Link href="/" className="bg-white border border-gray-100 text-primary px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-50 transition-all duration-500">
              {t('return_home')}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
            
            {/* Left: Form */}
            <div className="flex-1">
              <div className="mb-12">
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">{t('final_step')}</span>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none mb-6">{t('complete_order')}</h1>
                <p className="text-gray-400 text-sm font-medium">{t('checkout_subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <User className="w-3 h-3" /> {t('full_name')}
                    </label>
                    <input
                      required
                      placeholder={isRTL ? 'مثال: ياسين إيلي' : 'e.g. Yassine Ily'}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <Phone className="w-3 h-3" /> {t('whatsapp_phone_label')}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 06..."
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> {t('city')}
                    </label>
                    <input
                      required
                      placeholder={isRTL ? 'مثال: الدار البيضاء' : 'e.g. Casablanca'}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> {t('shipping_address')}
                    </label>
                    <input
                      required
                      placeholder={isRTL ? 'اسم الشارع، الشقة، المنطقة...' : 'Street name, apartment, area...'}
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                   <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-between px-10 hover:bg-accent transition-all duration-500 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        {t('processing')}
                      </span>
                    ) : (
                      <>
                        {t('confirm_send')}
                        <ArrowRight className={`w-5 h-5 group-hover:translate-x-2 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-6 mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('ssl_secure')}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-gray-200" />
                    <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                      <Truck className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('fast_shipping')}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-gray-200" />
                    <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('premium_quality')}</span>
                    </div>
                  </div>

                  <p className="text-center text-[10px] font-black italic text-accent uppercase tracking-widest mt-6">
                    {t('payment_cod')}
                  </p>
                </div>
              </form>
            </div>

            {/* Right: Summary */}
            <div className="lg:w-[400px]">
              <div className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-10 sticky top-32">
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">{t('order_summary')}</h3>
                
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black uppercase tracking-tight text-primary leading-tight mb-1">{item.title}</h4>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          {item.selectedSize} | {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">{t('subtotal')}</span>
                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-medium">{t('shipping')}</span>
                    <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">{t('free')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('total_to_pay')}</span>
                    <span className="text-3xl font-black italic">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-100">
                   <p className="text-[10px] text-green-700 font-bold flex items-center gap-2">
                     <CheckCircle2 className="w-3 h-3" /> {t('fast_shipping')}
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
