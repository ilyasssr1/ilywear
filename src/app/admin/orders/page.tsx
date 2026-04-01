'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, Trash2, CheckCircle2, Clock, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      showToast('Error loading orders', 'error');
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      showToast(`Error: ${error.message}`, 'error');
    } else if (data && data.length === 0) {
      showToast('No permission to update orders. Check RLS policies.', 'error');
    } else {
      showToast('Order updated successfully', 'success');
      loadOrders();
    }
  };

  const deleteOrder = async (id: number) => {
    if (confirm('Delete this order?')) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        showToast('Error deleting order', 'error');
      } else {
        showToast('Order deleted', 'success');
        loadOrders();
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-accent font-impact text-sm uppercase tracking-[0.3em] mb-4">Sales Management</h2>
        <h1 className="text-5xl font-impact tracking-wider uppercase leading-none text-white">Orders</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-[#222] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            placeholder="Search by customer name or city..." 
            className="w-full bg-[#111] border border-[#222] rounded-xl py-4 pl-14 pr-6 text-xs text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0A0A0A] rounded-3xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#222] bg-[#111]">
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Order ID</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Customer</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Total</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Status</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Date</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {loading ? (
                <tr>
                   <td colSpan={6} className="p-20 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="font-impact text-xs uppercase tracking-widest text-gray-500">Loading orders...</p>
                   </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#111] transition-colors group">
                    <td className="p-8 font-impact text-sm tracking-wider text-accent">#{order.id}</td>
                    <td className="p-8">
                      <div>
                        <p className="font-impact text-sm uppercase tracking-wider text-white mb-1">{order.customer_name}</p>
                        <p className="text-xs text-gray-500 font-sans">{order.customer_phone}</p>
                        <p className="text-xs text-gray-600 font-sans">{order.customer_city}</p>
                      </div>
                    </td>
                    <td className="p-8 font-impact text-sm tracking-wider text-white">{order.total} MAD</td>
                    <td className="p-8">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`font-impact text-xs uppercase tracking-widest px-3 py-2 rounded-xl border appearance-none cursor-pointer transition-all bg-[#1a1a1a] ${
                          order.status === 'pending' ? 'text-yellow-500 border-yellow-500/20' :
                          order.status === 'processing' ? 'text-blue-500 border-blue-500/20' :
                          order.status === 'shipped' ? 'text-indigo-500 border-indigo-500/20' :
                          order.status === 'delivered' ? 'text-green-500 border-green-500/20' :
                          'text-red-500 border-red-500/20'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-8 text-xs text-gray-500 font-sans">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-8 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-3 rounded-xl hover:bg-[#222] transition-all text-gray-500 hover:text-accent"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                         <button 
                          onClick={() => deleteOrder(order.id)}
                          className="p-3 rounded-xl hover:bg-red-500/10 transition-all text-gray-500 hover:text-red-500"
                          title="Delete"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={6} className="p-20 text-center">
                    <p className="font-impact text-xs uppercase tracking-widest text-gray-500">No orders found.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-[#0A0A0A] w-full max-w-2xl rounded-3xl border border-[#222] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-[#222] flex justify-between items-center bg-[#0A0A0A] sticky top-0 z-10">
              <h2 className="text-3xl font-impact uppercase tracking-wider text-white">Order Detail</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 rounded-full hover:bg-[#111] transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="p-10 overflow-y-auto scrollbar-hide space-y-8">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-8 p-8 bg-[#111] rounded-3xl border border-[#222]">
                <div>
                   <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">Order ID</p>
                   <p className="font-impact text-sm tracking-wider text-accent">#{selectedOrder.id}</p>
                </div>
                <div>
                   <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">Date</p>
                   <p className="font-impact text-sm tracking-wider text-white">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-impact text-sm uppercase tracking-widest text-accent mb-6">Purchased Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items && Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-[#111] border border-[#222] rounded-3xl">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-[#1a1a1a] rounded-xl overflow-hidden relative border border-[#222]">
                             {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-impact text-sm uppercase tracking-wider text-white">{item.title}</p>
                            <p className="text-xs text-gray-500 font-sans mt-1">
                              {item.size} • {item.color} • Qty {item.quantity}
                            </p>
                          </div>
                       </div>
                       <p className="font-impact text-sm tracking-wider text-accent">{item.price} MAD</p>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-500 font-sans italic">No item data found in this order.</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-impact text-sm uppercase tracking-widest text-accent mb-6">Shipping Address</h3>
                <div className="p-8 bg-[#111] border border-[#222] text-white rounded-3xl">
                  <p className="text-sm font-sans mb-1">{selectedOrder.customer_name}</p>
                  <p className="text-xs text-gray-500 font-sans mb-1">{selectedOrder.customer_phone}</p>
                  <p className="text-xs text-gray-500 font-sans mb-4">{selectedOrder.customer_city}</p>
                  {selectedOrder.shipping_address && (
                    <p className="font-impact text-sm uppercase tracking-widest text-accent leading-relaxed">
                      {selectedOrder.shipping_address}
                    </p>
                  )}
                  {selectedOrder.notes && (
                    <div className="mt-6 pt-6 border-t border-[#222]">
                       <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-2">Order Notes</p>
                       <p className="text-sm text-gray-300 font-sans italic">&quot;{selectedOrder.notes}&quot;</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-[#222]">
                 <div>
                    <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">Total Amount</p>
                    <p className="text-3xl font-impact text-accent tracking-widest">{selectedOrder.total} MAD</p>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <p className="font-impact text-xs uppercase tracking-widest text-gray-500">Update Status</p>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => {
                        updateStatus(selectedOrder.id, e.target.value);
                        setSelectedOrder({...selectedOrder, status: e.target.value});
                      }}
                      className={`font-impact text-sm uppercase tracking-widest px-6 py-3 rounded-xl border appearance-none cursor-pointer transition-all bg-[#1a1a1a] ${
                        selectedOrder.status === 'pending' ? 'text-yellow-500 border-yellow-500/20' :
                        selectedOrder.status === 'processing' ? 'text-blue-500 border-blue-500/20' :
                        selectedOrder.status === 'shipped' ? 'text-indigo-500 border-indigo-500/20' :
                        selectedOrder.status === 'delivered' ? 'text-green-500 border-green-500/20' :
                        'text-red-500 border-red-500/20'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
