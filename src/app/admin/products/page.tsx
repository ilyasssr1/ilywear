'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload, Check } from 'lucide-react';
import { fetchProducts, addProduct, deleteProduct, Product } from '@/services/products';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'men',
    description: '',
    image: '',
    sizes: 'S,M,L,XL',
    colors: '#000000,#ffffff',
  });

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const productData = {
      title: newProduct.title,
      price: Number(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
      sizes: newProduct.sizes.split(','),
      colors: newProduct.colors.split(','),
      images: [newProduct.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80']
    };

    if (editingProduct) {
      const { updateProduct } = await import('@/services/products');
      await updateProduct(editingProduct.id, productData);
      showToast('Product updated successfully', 'success');
    } else {
      await addProduct(productData);
      showToast('Product added successfully', 'success');
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    setEditingProduct(null);
    setNewProduct({
      title: '',
      price: '',
      category: 'men',
      description: '',
      image: '',
      sizes: 'S,M,L,XL',
      colors: '#000000,#ffffff',
    });
    loadProducts();
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      sizes: product.sizes?.join(',') || 'S,M,L,XL',
      colors: product.colors?.join(',') || '#000000,#ffffff',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">Inventory Management</h2>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Products</h1>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setNewProduct({
              title: '',
              price: '',
              category: 'men',
              description: '',
              image: '',
              sizes: 'S,M,L,XL',
              colors: '#000000,#ffffff',
            });
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-accent transition-all duration-500 shadow-xl shadow-black/10 group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Search by name, ID, or category..." 
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-6 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-xs font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20">
            <option>All Categories</option>
            <option>Women</option>
            <option>Men</option>
            <option>Promotions</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                   <td colSpan={5} className="p-20 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading catalog...</p>
                   </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-tight text-primary mb-1">{product.title}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-lg text-gray-500 italic">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-8">
                    <p className="text-xs font-black italic">{product.price} MAD</p>
                  </td>
                  <td className="p-8">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                      Active
                    </span>
                  </td>
                  <td className="p-8 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => handleEditClick(product)}
                        className="p-3 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-black"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 rounded-xl hover:bg-white hover:shadow-md transition-all text-gray-400 hover:text-red-500"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                className="p-3 rounded-full hover:bg-gray-50 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-10 overflow-y-auto scrollbar-hide space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Product Name</label>
                  <input
                    required
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    placeholder="e.g. Vintage Denim Jacket"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price (MAD)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    placeholder="e.g. 299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                  <select
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-bold uppercase tracking-widest text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="promotions">Promotions</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Main Image URL</label>
                  <input
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    placeholder="https://..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Description</label>
                <textarea
                  className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all min-h-[100px]"
                  placeholder="Tell us about the piece..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sizes (comma separated)</label>
                  <input
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    placeholder="S,M,L,XL"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Colors (hex codes)</label>
                  <input
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    placeholder="#000000,#ffffff"
                    value={newProduct.colors}
                    onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 sticky bottom-0 bg-white">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/20"
                >
                  {isSubmitting ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      {editingProduct ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

