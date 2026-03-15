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
        <h2 className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">Sales Management</h2>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Orders</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Search by customer name or city..." 
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan={6} className="p-20 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading orders...</p>
                   </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-8 text-xs font-black italic">#{order.id}</td>
                    <td className="p-8">
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight text-primary mb-1">{order.customer_name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.customer_phone}</p>
                        <p className="text-[9px] text-gray-400 font-medium">{order.customer_city}</p>
                      </div>
                    </td>
                    <td className="p-8 text-xs font-black italic">{order.total} MAD</td>
                    <td className="p-8">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-2 rounded-xl border appearance-none cursor-pointer transition-all ${
                          order.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100' :
                          order.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' :
                          order.status === 'shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' :
                          order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' :
                          'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-8 text-[10px] font-medium text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-8 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-3 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-black"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                         <button 
                          onClick={() => deleteOrder(order.id)}
                          className="p-3 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-red-500"
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No orders found.</p>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">Order Detail</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 overflow-y-auto scrollbar-hide space-y-8">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-8 p-8 bg-gray-50 rounded-[2.5rem]">
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                   <p className="text-sm font-black italic">#{selectedOrder.id}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Date</p>
                   <p className="text-sm font-black italic">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-6">Purchased Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items && Array.isArray(selectedOrder.items) ? selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-16 bg-gray-50 rounded-xl overflow-hidden relative">
                             {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight">{item.title}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                              {item.size} • {item.color} • Qty {item.quantity}
                            </p>
                          </div>
                       </div>
                       <p className="text-xs font-black italic">{item.price} MAD</p>
                    </div>
                  )) : (
                    <p className="text-[9px] text-gray-400 font-medium italic">No item data found in this order.</p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-accent mb-6">Shipping Address</h3>
                <div className="p-8 bg-black text-white rounded-[2.5rem] shadow-xl">
                  <p className="text-sm font-medium mb-1">{selectedOrder.customer_name}</p>
                  <p className="text-[11px] text-gray-400 mb-1">{selectedOrder.customer_phone}</p>
                  <p className="text-[11px] text-gray-400 mb-4">{selectedOrder.customer_city}</p>
                  {selectedOrder.shipping_address && (
                    <p className="text-[11px] text-accent font-black uppercase tracking-widest leading-relaxed">
                      {selectedOrder.shipping_address}
                    </p>
                  )}
                  {selectedOrder.notes && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                       <p className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Order Notes</p>
                       <p className="text-[10px] italic">"{selectedOrder.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Amount</p>
                    <p className="text-3xl font-black italic">{selectedOrder.total} MAD</p>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Update Status</p>
                    <select 
                      value={selectedOrder.status}
                      onChange={(e) => {
                        updateStatus(selectedOrder.id, e.target.value);
                        setSelectedOrder({...selectedOrder, status: e.target.value});
                      }}
                      className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border appearance-none cursor-pointer transition-all ${
                        selectedOrder.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100' :
                        selectedOrder.status === 'processing' ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' :
                        selectedOrder.status === 'shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' :
                        selectedOrder.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' :
                        'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
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
