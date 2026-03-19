'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/services/products';
import QuickViewModal from '@/components/QuickViewModal';

interface QuickViewContextType {
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedProduct(null), 500); // Delayed to wait for closing animation
  };

  return (
    <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
      {children}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isOpen} 
        onClose={closeQuickView} 
      />
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return context;
}
