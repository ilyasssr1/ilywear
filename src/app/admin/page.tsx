'use client';

import { useState, useEffect } from 'react';
import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, MoreHorizontal, Calendar, PieChart as PieChartIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchProducts } from '@/services/products';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#000000', '#FACC15', '#94A3B8', '#E2E8F0'];

interface StatItem {
  label: string;
  value: string;
  icon: any;
  color: string;
  growth: number;
  trend: 'up' | 'down' | 'neutral';
}

interface OrderItem {
  id: string | number;
  customer_name: string;
  customer_phone: string;
  customer_city: string;
  total: number | string;
  status: string;
  created_at: string;
  items?: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStats() {
      setLoading(true);
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        const orders = (ordersData as OrderItem[]) || [];
        const products = await fetchProducts();
        if (ordersError) throw ordersError;

        // Calculate Revenue and Growth
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const currentWeekOrders = orders.filter(o => new Date(o.created_at) >= sevenDaysAgo);
        const previousWeekOrders = orders.filter(o => {
          const d = new Date(o.created_at);
          return d >= fourteenDaysAgo && d < sevenDaysAgo;
        });

        const currentRevenue = currentWeekOrders.reduce((acc, o) => acc + Number(o.total), 0);
        const previousRevenue = previousWeekOrders.reduce((acc, o) => acc + Number(o.total), 0);
        
        const revenueGrowth = previousRevenue === 0 ? 100 : Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100);
        const ordersGrowth = previousWeekOrders.length === 0 ? 100 : Math.round(((currentWeekOrders.length - previousWeekOrders.length) / previousWeekOrders.length) * 100);

        const totalRevenue = orders?.reduce((acc, order) => acc + Number(order.total), 0) || 0;
        const uniquePhones = new Set(orders?.map(o => o.customer_phone) || []);

        setStats([
          { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} MAD`, icon: TrendingUp, color: 'text-green-500', growth: revenueGrowth, trend: revenueGrowth >= 0 ? 'up' : 'down' },
          { label: 'Total Orders', value: String(orders?.length || 0), icon: ShoppingBag, color: 'text-blue-500', growth: ordersGrowth, trend: ordersGrowth >= 0 ? 'up' : 'down' },
          { label: 'Active Products', value: String(products.length), icon: Package, color: 'text-purple-500', growth: 0, trend: 'neutral' },
          { label: 'Total Customers', value: String(uniquePhones.size), icon: Users, color: 'text-orange-500', growth: 5, trend: 'up' },
        ]);

        // Category breakdown for Pie Chart
        const categories = products.reduce((acc: any, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {});
        
        setCategoryData(Object.keys(categories).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: categories[key]
        })));

        // Process data for AreaChart (Daily Revenue)
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
        setRecentOrders(orders?.slice(0, 6) || []);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-3 inline-block">Intelligence Center</span>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-primary">Admin <span className="text-gray-300">Overview</span></h1>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm transition-all">
           <div className="p-3 bg-gray-50 rounded-xl"><Calendar className="w-4 h-4 text-gray-400" /></div>
           <div className="pr-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Today's Date</p>
              <p className="text-xs font-black italic text-primary">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-700 group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-gray-50 group-hover:bg-black group-hover:rotate-6 transition-all duration-500">
                  <stat.icon className={`w-5 h-5 ${stat.color} group-hover:text-white`} />
                </div>
                {stat.trend !== 'neutral' && (
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.growth}%
                  </div>
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black italic text-primary">{loading ? '...' : stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Revenue Performance</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Earnings across the last 7 business days</p>
              </div>
              <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors"><MoreHorizontal className="w-5 h-5 text-gray-300" /></button>
           </div>
           <div className="h-[350px] w-full">
              {loading ? (
                 <div className="w-full h-full flex items-center justify-center animate-pulse bg-gray-50 rounded-3xl" />
              ) : (
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#000', opacity: 0.4 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#000', opacity: 0.4 }} dx={-10} />
                     <Tooltip 
                       cursor={{ stroke: '#000', strokeWidth: 1 }}
                       contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', fontWeight: 900, fontSize: '14px', background: '#000', color: '#fff' }}
                       itemStyle={{ color: '#FACC15' }}
                     />
                     <Area type="monotone" dataKey="revenue" stroke="#000" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                   </AreaChart>
                 </ResponsiveContainer>
              )}
           </div>
        </div>

        {/* Category Breakdown (Pie Chart) */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
           <div className="mb-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PieChartIcon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Stock Distribution</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Product split by category</p>
           </div>
           <div className="h-[250px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontWeight: 900, fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    content={({ payload }) => (
                      <div className="flex flex-wrap justify-center gap-4 mt-6">
                        {(payload as any[] | undefined)?.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders List */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black uppercase tracking-tighter italic text-primary">Latest Shipments</h3>
             <Link href="/admin/orders" className="text-[9px] font-black uppercase tracking-widest text-accent hover:underline">View All Orders</Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-50 rounded-3xl" />)}
              </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="group bg-gray-50 hover:bg-black transition-all duration-500 p-6 rounded-[2rem] flex items-center justify-between border border-transparent hover:border-black">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black text-xs italic group-hover:scale-110 transition-transform">
                      {order.customer_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-tight group-hover:text-accent transition-colors">{order.customer_name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{order.customer_city} • {order.items?.length || 0} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black italic group-hover:text-white transition-colors">{order.total} MAD</p>
                    <div className={`mt-1 inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                 <ShoppingBag className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                 <p className="text-gray-400 text-xs font-black uppercase tracking-widest">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* Global Strategy Card */}
        <div className="bg-[#0A0A0A] p-10 rounded-[3rem] shadow-2xl shadow-black/30 relative overflow-hidden flex flex-col justify-center border border-white/5">
           <div className="relative z-10">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-8 border border-accent/20">
                 <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white mb-6">Growth <span className="text-accent">Strategy</span></h3>
              <div className="space-y-6">
                 <div className="flex items-start gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black font-black text-[10px] flex-shrink-0 group-hover:rotate-12 transition-transform">01</div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                       Focus on <span className="text-white font-bold">TikTok Organic</span> marketing this week. Moroccan streetwear trends are peaking.
                    </p>
                 </div>
                 <div className="flex items-start gap-4 p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 group-hover:rotate-12 transition-transform">02</div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                       Update <span className="text-white font-bold">Women's Collection</span> imagery. Data shows high interest but lower conversion in this category.
                    </p>
                 </div>
              </div>
           </div>
           {/* Abstract Design Elements */}
           <div className="absolute top-0 right-0 p-10 opacity-20"><TrendingUp className="w-40 h-40 text-accent rotate-12" /></div>
           <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
