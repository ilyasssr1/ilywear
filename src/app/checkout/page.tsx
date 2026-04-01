'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, MapPin, Phone, User, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { createOrder } from '@/services/products';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useSettings } from '@/context/SettingsContext';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: '', address: '' });
  const [user, setUser] = useState<any>(null);
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const { whatsappNumber } = useSettings();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  if (cart.length === 0 && !isSubmitted) {
    return (
      <>
        <Header />
        <main className="flex-1 bg-[#0A0A0A] flex flex-col items-center justify-center py-32 px-6">
          <div className="w-24 h-24 rounded-full bg-[#111111] border border-[#333] flex items-center justify-center mb-8">
            <ShoppingBag className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-impact text-4xl uppercase tracking-wider text-white mb-4">{t('your_bag_empty')}</h1>
          <p className="text-gray-400 font-sans text-sm font-medium mb-10">{t('add_premium')}</p>
          <Link href="/shop" className="bg-accent text-secondary px-10 py-5 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-white transition-all duration-500 glow-effect block">
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
  const [lastTotal, setLastTotal] = useState<number>(0);

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
      setLastTotal(cartTotal);
      
      const notificationText = `🚀 *New Order Alert!*%0A%0A*Order ID:* ${result.id}%0A*Customer:* ${formData.name}%0A*Total:* ${cartTotal} MAD%0A%0A_Check dashboard for details._`;
      
      try {
        fetch(`https://api.callmebot.com/whatsapp.php?phone=+${whatsappNumber}&text=${notificationText}&apikey=123456`, { mode: 'no-cors' });
      } catch (e) {}

      // Fire Pixel Tracking Events
      if (typeof window !== 'undefined') {
        const w = window as any;
        if (w.fbq) {
          w.fbq('track', 'Purchase', {
            value: cartTotal,
            currency: 'MAD',
            contents: cart.map(item => ({ id: item.id, quantity: item.quantity })),
            content_type: 'product'
          });
        }
        if (typeof w.ttq !== 'undefined' && w.ttq.track) {
          w.ttq.track('CompletePayment', {
            value: cartTotal,
            currency: 'MAD',
            contents: cart.map(item => ({ content_id: item.id.toString(), quantity: item.quantity, price: item.price })),
            content_type: 'product'
          });
        }
      }

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
        <main className="flex-1 bg-[#0A0A0A] flex flex-col items-center justify-center py-24 px-6">
          <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 animate-scale-in glow-effect-green">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="font-impact text-5xl md:text-6xl text-white uppercase tracking-wider mb-4">{t('order_received')}</h1>
          <p className="text-gray-400 font-sans text-center text-sm max-w-md mb-8">
            {t('order_thanks')}
          </p>
          
          <div className="bg-[#111111] border border-[#333] rounded-3xl p-8 mb-12 w-full max-w-sm text-center">
            <p className="font-impact text-sm uppercase tracking-widest text-gray-500 mb-2">{t('your_order_id')}</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-xl font-impact tracking-widest text-white bg-[#222] px-6 py-3 rounded-xl border border-[#333]">
                {lastOrderId?.substring(0, 8)}
              </code>
              <button 
                onClick={() => {
                  if (lastOrderId) navigator.clipboard.writeText(lastOrderId);
                  alert(t('order_id_copied'));
                }}
                className="font-impact text-sm uppercase tracking-widest text-accent hover:underline hover:text-white"
              >
                {t('copy')}
              </button>
            </div>
            <p className="mt-6 font-impact text-2xl text-accent uppercase tracking-wider">Total: {formatPrice(lastTotal)}</p>
            <p className="mt-8 font-sans text-xs text-gray-400 leading-relaxed">
              {t('use_id_tracking')} <Link href="/track-order" className="text-white font-bold hover:text-accent transition-colors">{t('tracking_page')}</Link>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-[400px]">
            <Link href="/track-order" className="flex-1 bg-accent text-secondary px-8 py-5 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-white transition-all duration-500 glow-effect flex items-center justify-center text-center">
              {t('track_order_now')}
            </Link>
            <Link href="/" className="flex-1 bg-transparent border border-[#333] text-gray-400 px-8 py-5 rounded-md font-impact text-xl uppercase tracking-wider hover:bg-[#111] hover:text-white transition-all duration-500 flex justify-center text-center items-center">
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
      <main className="flex-1 bg-[#0A0A0A] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
            
            {/* Left: Form */}
            <div className="flex-1">
              <div className="mb-12">
                <span className="text-accent text-sm font-impact uppercase tracking-widest mb-4 inline-block">{t('final_step')}</span>
                <h1 className="text-6xl md:text-8xl font-impact tracking-normal text-white uppercase leading-[0.9] mb-6">{t('complete_order')}</h1>
                <p className="text-gray-400 font-sans text-sm">{t('checkout_subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-impact text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <User className="w-4 h-4" /> {t('full_name')}
                    </label>
                    <input
                      required
                      placeholder={isRTL ? 'مثال: ياسين إيلي' : 'e.g. Yassine Ily'}
                      className="w-full bg-[#111111] border border-[#333] rounded-xl py-4 px-6 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-impact text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <Phone className="w-4 h-4" /> {t('whatsapp_phone_label')}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 06..."
                      className="w-full bg-[#111111] border border-[#333] rounded-xl py-4 px-6 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-impact text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <MapPin className="w-4 h-4" /> {t('city')}
                    </label>
                    <input
                      required
                      placeholder={isRTL ? 'مثال: الدار البيضاء' : 'e.g. Casablanca'}
                      className="w-full bg-[#111111] border border-[#333] rounded-xl py-4 px-6 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="font-impact text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
                       <MapPin className="w-4 h-4" /> {t('shipping_address')}
                    </label>
                    <input
                      required
                      placeholder={isRTL ? 'اسم الشارع، الشقة، المنطقة...' : 'Street name, apartment, area...'}
                      className="w-full bg-[#111111] border border-[#333] rounded-xl py-4 px-6 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-[#333]">
                   <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-secondary py-6 rounded-md font-impact text-2xl uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-white transition-all duration-500 glow-effect group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <div className="animate-spin w-5 h-5 border-2 border-secondary border-t-transparent rounded-full" />
                        {t('processing')}
                      </span>
                    ) : (
                      <>
                        {t('confirm_send')}
                        <ArrowRight className={`w-6 h-6 group-hover:translate-x-2 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-6 mt-8 p-6 bg-[#111111] rounded-2xl border border-[#333]">
                    <div className="flex items-center gap-2 transition-all">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                      <span className="font-impact text-xs uppercase tracking-widest text-gray-400 hidden sm:inline-block">{t('ssl_secure')}</span>
                    </div>
                    <div className="w-[1px] h-6 bg-[#333]" />
                    <div className="flex items-center gap-2 transition-all">
                      <Truck className="w-6 h-6 text-accent" />
                      <span className="font-impact text-xs uppercase tracking-widest text-gray-400 hidden sm:inline-block">{t('fast_shipping')}</span>
                    </div>
                    <div className="w-[1px] h-6 bg-[#333]" />
                    <div className="flex items-center gap-2 transition-all">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                      <span className="font-impact text-xs uppercase tracking-widest text-gray-400 hidden sm:inline-block">{t('premium_quality')}</span>
                    </div>
                  </div>

                  <p className="text-center font-impact text-sm text-accent uppercase tracking-widest mt-6 bg-[#111] py-3 rounded-lg border border-accent/20 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
                    {t('payment_cod')}
                  </p>
                </div>
              </form>
            </div>

            {/* Right: Summary */}
            <div className="lg:w-[400px]">
              <div className="bg-[#111111] border border-[#333] rounded-3xl p-10 sticky top-32">
                <h3 className="font-impact text-3xl uppercase tracking-wider text-white mb-8">{t('order_summary')}</h3>
                
                <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-[#222] flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-impact text-lg uppercase tracking-wide text-white leading-tight mb-2">{item.title}</h4>
                        <p className="font-sans text-xs font-medium text-gray-500 mb-1">
                          {item.selectedSize} | Qty: {item.quantity}
                        </p>
                        <p className="font-impact text-xl text-accent">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-[#333]">
                  <div className="flex justify-between items-center text-sm font-impact text-gray-400 uppercase tracking-widest">
                    <span>{t('subtotal')}</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-impact text-gray-400 uppercase tracking-widest">
                    <span>{t('shipping')}</span>
                    <span className="text-accent">{t('free')}</span>
                  </div>
                  <div className="flex justify-between items-end pt-6 border-t border-[#333]">
                    <span className="font-impact text-lg text-white uppercase tracking-wider">{t('total_to_pay')}</span>
                    <span className="font-impact text-4xl text-accent">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-accent/10 rounded-xl border border-accent/20">
                   <p className="text-xs text-accent font-impact uppercase tracking-widest flex items-center justify-center gap-2">
                     <CheckCircle2 className="w-4 h-4" /> {t('fast_shipping')}
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
