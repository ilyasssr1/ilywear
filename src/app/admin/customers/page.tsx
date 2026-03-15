'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Phone, MapPin, Mail, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');

      if (error) {
        showToast('Error loading customers', 'error');
      } else {
        // Unique customers by phone number
        const customerMap = new Map();
        orders?.forEach(order => {
          if (!customerMap.has(order.customer_phone)) {
            customerMap.set(order.customer_phone, {
              name: order.customer_name,
              phone: order.customer_phone,
              city: order.customer_city,
              lastOrderDate: order.created_at,
              orderCount: 1,
              totalSpent: Number(order.total)
            });
          } else {
            const existing = customerMap.get(order.customer_phone);
            existing.orderCount += 1;
            existing.totalSpent += Number(order.total);
            if (new Date(order.created_at) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = order.created_at;
            }
          }
        });
        setCustomers(Array.from(customerMap.values()));
      }
      setLoading(false);
    }
    loadCustomers();
  }, [showToast]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">User Management</h2>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Customers</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Search by name, phone, or city..." 
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 animate-pulse h-64" />
          ))
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer.phone} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-2xl font-black italic group-hover:bg-black group-hover:text-accent transition-colors duration-500">
                  {customer.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{customer.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent italic">{customer.city}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{customer.orderCount} Orders</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50 flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Spent</p>
                  <p className="text-xl font-black italic">{customer.totalSpent.toLocaleString()} MAD</p>
                </div>
                <div className="text-right text-[8px] font-black uppercase tracking-widest text-gray-300">
                  Since {new Date(customer.lastOrderDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-gray-50 rounded-[3rem] flex items-center justify-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
