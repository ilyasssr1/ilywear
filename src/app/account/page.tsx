'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Package, Truck, Calendar, ChevronRight, Clock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/lib/translations';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch orders for this user
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (!error) {
          setOrders(ordersData || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-20 flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-6 py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-8 h-8 text-gray-200" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-4">Please log in</h1>
          <p className="text-gray-400 mb-10">You need to be logged in to view your order history.</p>
          <Link href="/login" className="bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-accent transition-all">
            Login Now
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 inline-block">Welcome back</span>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{user.email?.split('@')[0]}</h1>
                <p className="text-gray-400 text-sm font-medium mt-4">{user.email}</p>
              </div>
              <Link href="/track-order" className="text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20 px-6 py-3 rounded-xl hover:bg-accent hover:text-black transition-all">
                Track an Order
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Orders */}
            <section className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase tracking-tight italic">Order History</h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orders.length} Total Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-[2.5rem] p-16 text-center border border-gray-100">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-6" />
                  <h3 className="text-lg font-black uppercase tracking-tight italic mb-2">No orders found</h3>
                  <p className="text-gray-400 text-sm mb-8">You haven't placed any orders yet.</p>
                  <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-8 py-4 rounded-xl hover:bg-accent hover:text-black transition-all">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 group">
                      <div className="p-8">
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                          <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                              <p className="text-lg font-black uppercase tracking-tight italic">#{order.id.toString().substring(0, 8)}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-8">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Date
                              </p>
                              <p className="text-xs font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 flex items-center gap-2">
                                <Clock className="w-3 h-3" /> Status
                              </p>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                order.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                order.status === 'shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                                'bg-red-50 text-red-600 border-red-100'
                              }`}>
                                {t(`status_${order.status}` as keyof typeof translations['en']) || order.status}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total</p>
                            <p className="text-2xl font-black italic">{order.total} MAD</p>
                          </div>
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                          {order.items?.map((item: any, idx: number) => (
                            <div key={idx} className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Right: Settings */}
            <section className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-gray-100 pt-12 lg:pt-0 lg:pl-12">
              <h2 className="text-xl font-black uppercase tracking-tight italic mb-8">Personal Info</h2>
              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates = {
                  data: {
                    full_name: formData.get('fullName'),
                    phone: formData.get('phone')
                  }
                };
                const { error } = await supabase.auth.updateUser(updates);
                if (!error) {
                  const { data } = await supabase.auth.getSession();
                  if (data.session) setUser(data.session.user);
                  alert('Profile updated successfully!');
                } else {
                  alert('Error updating profile: ' + error.message);
                }
              }}>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    defaultValue={user.user_metadata?.full_name || ''}
                    placeholder="E.g. Mohammed A." 
                    className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    defaultValue={user.user_metadata?.phone || ''}
                    placeholder="+212 6..." 
                    className="w-full bg-gray-50 border border-transparent rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email (Read Only)</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="w-full bg-gray-100 border border-transparent rounded-xl px-4 py-4 text-sm font-medium text-gray-400 cursor-not-allowed"
                  />
                </div>
                <button type="submit" className="w-full bg-black text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-black transition-all">
                  Save Changes
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
