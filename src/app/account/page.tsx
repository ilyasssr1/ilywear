'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrency } from '@/context/CurrencyContext';
import { ShoppingBag, Package, Calendar, MapPin, User, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', city: '' });
  const [saving, setSaving] = useState(false);
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setEditForm({ 
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || '',
          city: session.user.user_metadata?.city || ''
        });
        
        const { data: userOrders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (!error) {
          setOrders(userOrders || []);
        }
      } else {
        window.location.href = '/login';
      }
      setLoading(false);
    }
    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    const { data, error } = await supabase.auth.updateUser({
      data: { 
        display_name: editForm.displayName,
        city: editForm.city 
      }
    });
    
    if (!error) {
      setUser(data.user);
      setIsEditing(false);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#0A0A0A] py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16 pb-12 border-b border-[#222]">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center text-secondary text-3xl font-impact tracking-wider shadow-2xl shadow-accent/20">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-4xl font-impact tracking-wider uppercase leading-none mb-2 text-white">
                    {user?.user_metadata?.display_name || user?.email?.split('@')[0]}
                  </h1>
                  <p className="text-gray-500 text-sm font-sans">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#111] border border-[#222] text-gray-400 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all font-impact text-sm uppercase tracking-widest group"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                {t('logout')}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Order History */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-[#111] border border-[#222] rounded-xl text-accent"><ShoppingBag className="w-5 h-5" /></div>
                  <h2 className="text-2xl font-impact uppercase tracking-wider text-white">{t('order_history')}</h2>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="group bg-[#111] border border-[#222] hover:border-[#333] rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5">
                        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 pb-6 border-b border-[#222]">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#1a1a1a] rounded-xl"><Package className="w-4 h-4 text-gray-500" /></div>
                            <div>
                              <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-0.5">Order ID</p>
                              <p className="text-sm font-impact tracking-wider text-white">#{order.id.toString().substring(0, 8)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#1a1a1a] rounded-xl"><Calendar className="w-4 h-4 text-gray-500" /></div>
                            <div>
                              <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-0.5">Date</p>
                              <p className="text-sm font-impact tracking-wider text-white">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-full font-impact text-xs uppercase tracking-widest ${
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                              order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                              'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-8">
                           {order.items?.map((item: any, idx: number) => (
                             <div key={idx} className="relative w-12 h-16 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#222]">
                               <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                             </div>
                           ))}
                           {order.items?.length > 4 && (
                             <div className="w-12 h-16 rounded-xl bg-[#222] flex items-center justify-center font-impact text-sm text-gray-400">
                               +{order.items.length - 4}
                             </div>
                           )}
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                          <p className="text-2xl font-impact text-accent tracking-widest">{formatPrice(order.total)}</p>
                          <Link 
                            href={`/track-order?id=${order.id}&phone=${order.customer_phone}`}
                            className="flex items-center gap-2 font-impact text-sm uppercase tracking-widest text-accent hover:text-white transition-colors"
                          >
                            Details <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#111] border border-dashed border-[#333] rounded-3xl py-24 text-center">
                    <ShoppingBag className="w-12 h-12 text-[#333] mx-auto mb-6" />
                    <p className="text-gray-500 text-sm font-sans mb-8">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="bg-accent text-secondary px-10 py-5 rounded-md font-impact text-lg uppercase tracking-wider hover:bg-white transition-all glow-effect inline-block">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>

              {/* Account Sidebar */}
              <div className="space-y-8">
                <div className="bg-[#111] border border-[#222] rounded-3xl p-10">
                  <h3 className="text-xl font-impact uppercase tracking-wider text-white mb-8">Account Info</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-xl text-gray-500"><User className="w-4 h-4" /></div>
                      <div className="flex-1">
                        <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-0.5">Display Name</p>
                        {isEditing ? (
                          <input 
                            value={editForm.displayName}
                            onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-2 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        ) : (
                          <p className="text-sm font-sans text-white">{user?.user_metadata?.display_name || user?.email?.split('@')[0]}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-xl text-gray-500"><MapPin className="w-4 h-4" /></div>
                      <div className="flex-1">
                        <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-0.5">Default City</p>
                        {isEditing ? (
                          <input 
                            value={editForm.city}
                            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                            className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-2 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        ) : (
                          <p className="text-sm font-sans text-white">{user?.user_metadata?.city || <span className="text-gray-600 italic">Not specified</span>}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex gap-4 mt-10">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 py-4 rounded-md bg-accent text-secondary font-impact text-lg uppercase tracking-wider hover:bg-white transition-all disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-4 rounded-xl border border-[#333] font-impact text-sm uppercase tracking-widest text-gray-500 hover:border-accent hover:text-accent transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full mt-10 py-4 rounded-xl border border-[#333] font-impact text-sm uppercase tracking-widest text-gray-500 hover:border-accent hover:text-accent transition-all"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="bg-[#111] border border-accent/20 rounded-3xl p-10 relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="text-xl font-impact uppercase tracking-wider text-white mb-4">Elite Membership</h3>
                      <p className="text-gray-400 text-xs font-sans leading-relaxed mb-8">
                        You are a valued member of the IlyWear community. Enjoy priority support and early access to new drops.
                      </p>
                      <Link href="/support" className="text-accent font-impact text-sm uppercase tracking-widest hover:text-white transition-colors">
                        Contact Support
                      </Link>
                   </div>
                   <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/10 blur-3xl rounded-full" />
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
