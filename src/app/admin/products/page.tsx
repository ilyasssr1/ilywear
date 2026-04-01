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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'men',
    description: '',
    image: '',
    sizes: 'S,M,L,XL',
    colors: '#000000,#ffffff',
    is_in_stock: true,
    promo_end_date: '',
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
      sizes: newProduct.sizes.split(','),
      colors: newProduct.colors.split(','),
      stock: newProduct.is_in_stock ? 1 : 0,
      promo_end_date: newProduct.promo_end_date || undefined,
      image: newProduct.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
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
      is_in_stock: true,
      promo_end_date: '',
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
      is_in_stock: product.stock !== 0,
      promo_end_date: product.promo_end_date || '',
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
          <h2 className="text-accent font-impact text-sm uppercase tracking-[0.3em] mb-4">Inventory Management</h2>
          <h1 className="text-5xl font-impact tracking-wider uppercase leading-none text-white">Products</h1>
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
              is_in_stock: true,
              promo_end_date: '',
            });
            setIsModalOpen(true);
          }}
          className="bg-accent text-secondary px-8 py-4 rounded-xl font-impact text-lg uppercase tracking-wider flex items-center gap-3 hover:bg-white transition-all duration-500 shadow-xl shadow-accent/10 group glow-effect"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-[#222] flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#111] border border-[#222] rounded-xl py-4 pl-14 pr-6 text-xs text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-xs font-impact uppercase tracking-widest text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">All Categories</option>
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="boys">Boys</option>
            <option value="promotions">Promotions</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-[#0A0A0A] rounded-3xl border border-[#222] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#222] bg-[#111]">
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Product</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Category</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Price</th>
                <th className="p-8 font-impact text-xs uppercase tracking-widest text-gray-500">Status</th>
                <th className="p-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {loading ? (
                <tr>
                   <td colSpan={5} className="p-20 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="font-impact text-xs uppercase tracking-widest text-gray-500">Loading catalog...</p>
                   </td>
                </tr>
              ) : products
                  .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm))
                  .filter(p => selectedCategory ? p.category === selectedCategory : true)
                  .map((product) => (
                <tr key={product.id} className="hover:bg-[#111] transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="relative w-16 h-20 rounded-2xl overflow-hidden bg-[#1a1a1a] flex-shrink-0 border border-[#222] group-hover:scale-105 transition-transform">
                        <Image src={product.image} alt={product.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-impact text-sm uppercase tracking-wider text-white mb-1">{product.title}</p>
                        <p className="text-xs text-gray-500 font-sans">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="font-impact text-xs uppercase tracking-widest px-3 py-1 bg-[#1a1a1a] border border-[#222] rounded-lg text-gray-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-8">
                    <p className="font-impact text-sm tracking-wider text-accent">{product.price} MAD</p>
                  </td>
                  <td className="p-8">
                    <button 
                      onClick={async () => {
                         const { updateProduct } = await import('@/services/products');
                         await updateProduct(product.id, { stock: product.stock === 0 ? 1 : 0 });
                         loadProducts();
                      }}
                      className={`px-4 py-2 rounded-xl font-impact text-xs uppercase tracking-widest transition-all border ${
                        product.stock !== 0 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                      }`}
                    >
                      {product.stock !== 0 ? 'Available' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="p-8 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                        onClick={() => handleEditClick(product)}
                        className="p-3 rounded-xl hover:bg-[#222] transition-all text-gray-500 hover:text-accent"
                       >
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 rounded-xl hover:bg-red-500/10 transition-all text-gray-500 hover:text-red-500"
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
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setEditingProduct(null); }} />
          <div className="relative bg-[#0A0A0A] w-full max-w-2xl rounded-3xl border border-[#222] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-10 border-b border-[#222] flex justify-between items-center bg-[#0A0A0A] sticky top-0 z-10">
              <h2 className="text-3xl font-impact uppercase tracking-wider text-white">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                className="p-3 rounded-full hover:bg-[#111] transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-10 overflow-y-auto scrollbar-hide space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Product Name</label>
                  <input
                    required
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    placeholder="e.g. Vintage Denim Jacket"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Price (MAD)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    placeholder="e.g. 299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Category</label>
                  <select
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm font-impact uppercase tracking-widest text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="boys">Boys</option>
                    <option value="promotions">Promotions</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Main Image URL</label>
                  <input
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    placeholder="https://..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Description</label>
                <textarea
                  className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[100px] placeholder:text-gray-600"
                  placeholder="Tell us about the piece..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Sizes (comma separated)</label>
                  <input
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    placeholder="S,M,L,XL"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500 block px-2">Availability</label>
                  <label className="relative inline-flex items-center cursor-pointer group px-2">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={newProduct.is_in_stock}
                      onChange={(e) => setNewProduct({ ...newProduct, is_in_stock: e.target.checked })}
                    />
                    <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[10px] after:bg-white after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-accent transition-all duration-300"></div>
                    <span className="ms-4 font-impact text-sm uppercase tracking-wider text-white">
                      {newProduct.is_in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Colors (hex codes)</label>
                <input
                  className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                  placeholder="#000000,#ffffff"
                  value={newProduct.colors}
                  onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
                />
              </div>

              {newProduct.category === 'promotions' && (
                <div className="space-y-2 p-6 bg-red-500/10 rounded-3xl border border-red-500/20 animate-in fade-in slide-in-from-top-4 duration-500">
                   <label className="font-impact text-sm uppercase tracking-widest text-red-400">Promotion End Date & Time</label>
                   <input
                     required={newProduct.category === 'promotions'}
                     type="datetime-local"
                     className="w-full bg-[#1a1a1a] border border-red-500/20 rounded-xl py-4 px-6 text-sm text-red-400 font-sans focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all"
                     value={newProduct.promo_end_date}
                     onChange={(e) => setNewProduct({ ...newProduct, promo_end_date: e.target.value })}
                   />
                   <p className="text-xs font-sans text-red-400/60 px-2">The countdown timer in the store will end exactly at this time.</p>
                </div>
              )}

              <div className="pt-8 border-t border-[#222] sticky bottom-0 bg-[#0A0A0A]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-secondary py-6 rounded-xl font-impact text-xl uppercase tracking-wider flex items-center justify-center gap-4 hover:bg-white transition-all duration-500 shadow-2xl shadow-accent/20 glow-effect"
                >
                  {isSubmitting ? (
                    <div className="animate-spin w-5 h-5 border-2 border-secondary border-t-transparent rounded-full" />
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
