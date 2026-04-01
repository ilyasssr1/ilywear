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
        <h2 className="text-accent font-impact text-sm uppercase tracking-[0.3em] mb-4">User Management</h2>
        <h1 className="text-5xl font-impact tracking-wider uppercase leading-none text-white">Customers</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-[#222] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            placeholder="Search by name, phone, or city..." 
            className="w-full bg-[#111] border border-[#222] rounded-xl py-4 pl-14 pr-6 text-xs text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-[#0A0A0A] p-8 rounded-3xl border border-[#222] animate-pulse h-64" />
          ))
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div key={customer.phone} className="bg-[#0A0A0A] p-8 rounded-3xl border border-[#222] hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-2 transition-all duration-500 group">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-[#111] border border-[#222] rounded-2xl flex items-center justify-center text-2xl font-impact text-accent group-hover:bg-accent group-hover:text-secondary transition-colors duration-500">
                  {customer.name.substring(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-impact uppercase tracking-wider text-white">{customer.name}</h3>
                  <p className="font-impact text-sm uppercase tracking-widest text-accent">{customer.city}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-xs font-sans text-gray-300">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="text-xs font-sans text-gray-300">{customer.orderCount} Orders</span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#222] flex justify-between items-end">
                <div>
                  <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">Total Spent</p>
                  <p className="text-xl font-impact text-accent tracking-widest">{customer.totalSpent.toLocaleString()} MAD</p>
                </div>
                <div className="text-right font-impact text-xs uppercase tracking-widest text-gray-600">
                  Since {new Date(customer.lastOrderDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 bg-[#0A0A0A] rounded-3xl border border-[#222] flex items-center justify-center">
             <p className="font-impact text-xs uppercase tracking-widest text-gray-500">No customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
