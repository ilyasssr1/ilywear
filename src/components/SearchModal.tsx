import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchProducts } from '@/services/products';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      setLoading(true);
      fetchProducts().then(data => {
        setAllProducts(data);
        setLoading(false);
      });
    }
  }, [isOpen, allProducts.length]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const q = query.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.title?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
      setResults(filtered.slice(0, 5)); // Show top 5
    }
  }, [query, allProducts]);

  // Handle Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : isOpen = true; // State is managed by parent, but we handle the event here if needed
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 sm:pt-32 px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-4 p-6 border-b border-gray-50">
            <Search className="w-6 h-6 text-accent" />
            <input 
              autoFocus
              placeholder="Search for premium products..."
              className="flex-1 text-lg font-medium outline-none placeholder:text-gray-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-50">
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-300 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
               <span>ESC</span>
            </div>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 scrollbar-hide">
            {loading && allProducts.length === 0 ? (
               <div className="p-8 text-center text-gray-400">
                  <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Loading Catalog</p>
               </div>
            ) : query.trim() !== '' && results.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                <p className="text-sm font-medium">No results found for "{query}"</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Products</p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      onClose();
                      router.push(`/shop/${product.id}`);
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors group text-left"
                  >
                    <div className="flex items-center gap-4">
                       <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.imageUrls?.[0] ? (
                            <Image src={product.imageUrls[0]} alt={product.title} fill className="object-cover" />
                          ) : (
                             <div className="w-full h-full bg-gray-200" />
                          )}
                       </div>
                       <div>
                         <h4 className="text-sm font-black uppercase tracking-tight">{product.title}</h4>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-black italic text-gray-500">{product.price} MAD</span>
                       <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                  Try searching for "Jellaba", "Caftan", or specific colors.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
