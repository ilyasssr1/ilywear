'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchProducts } from '@/services/products';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '0 MAD', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Active Products', value: '0', icon: Package, color: 'text-purple-500' },
    { label: 'Total Customers', value: '0', icon: Users, color: 'text-orange-500' },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      setLoading(true);
      try {
        // 1. Fetch Orders for Revenue and Order Count
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        // 2. Fetch Products for Active Count
        const products = await fetchProducts();

        // 3. Fetch Customers (unique phones/emails from orders)
        const uniquePhones = new Set(orders?.map(o => o.customer_phone) || []);

        if (ordersError) throw ordersError;

        const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
        
        setStats([
          { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} MAD`, icon: TrendingUp, color: 'text-green-500' },
          { label: 'Total Orders', value: String(orders?.length || 0), icon: ShoppingBag, color: 'text-blue-500' },
          { label: 'Active Products', value: String(products.length), icon: Package, color: 'text-purple-500' },
          { label: 'Total Customers', value: String(uniquePhones.size), icon: Users, color: 'text-orange-500' },
        ]);

        // Process data for chart (Revenue last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
           const d = new Date();
           d.setDate(d.getDate() - i);
           return d.toISOString().split('T')[0];
        }).reverse();

        const revenueData = last7Days.map(date => {
           const dayTotal = orders
             ?.filter(o => o.created_at.startsWith(date) && o.status !== 'cancelled')
             .reduce((sum, o) => sum + Number(o.total), 0) || 0;
           return {
              name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
              revenue: dayTotal
           };
        });
        
        setChartData(revenueData);
        setRecentOrders(orders?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">Overview</h2>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-black transition-colors duration-500`}>
                <stat.icon className={`w-5 h-5 ${stat.color} group-hover:text-white`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-2 py-1 rounded-lg">+0%</span>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black italic">{loading ? '...' : stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Revenue Analytics Chart */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase tracking-tighter italic">Revenue Over Time</h3>
            <select className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
              <option>Last 7 Days</option>
            </select>
         </div>
         <div className="h-[300px] w-full">
            {loading ? (
               <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse flex items-end gap-2 h-full w-full opacity-20">
                     {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                        <div key={i} className="flex-1 bg-accent rounded-t-xl" style={{ height: `${h}%` }} />
                     ))}
                  </div>
               </div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} dx={-10} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '12px' }}
                     itemStyle={{ color: '#000' }}
                   />
                   <Area type="monotone" dataKey="revenue" stroke="#FACC15" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                 </AreaChart>
               </ResponsiveContainer>
            )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Recent Orders</h3>
          <div className="space-y-6">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-2xl" />)}
              </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                      {order.customer_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{order.items?.length || 0} Items • {order.customer_city}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black italic">{order.total} MAD</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      order.status === 'pending' ? 'text-yellow-500 bg-yellow-50' : 'text-green-500 bg-green-50'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm font-medium py-10">No orders yet.</p>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-black p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8 text-accent">Admin Tips</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xs font-bold leading-relaxed">
                  Always confirm orders via WhatsApp before shipping. This helps reduce returns and ensures the customer is ready for delivery.
                </p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                <p className="text-xs font-bold leading-relaxed">
                  Updating your product images frequently can increase seasonal sales by up to 30%.
                </p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
