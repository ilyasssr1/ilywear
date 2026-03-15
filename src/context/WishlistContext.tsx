'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/services/products';
import { supabase } from '@/lib/supabase';

interface WishlistContextType {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string | number) => boolean;
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [userId, setUserId] = useState<string | 'guest'>('guest');

  // 1. Initial Identity Check & Auth Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUserId(session?.user?.id || 'guest');
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || 'guest');
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Load wishlist when identity changes
  useEffect(() => {
    const storageKey = `ilywear-wishlist-${userId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        setWishlist([]);
      }
    } else {
      setWishlist([]); 
    }
  }, [userId]);

  // 3. Save wishlist to specific user storage
  useEffect(() => {
    localStorage.setItem(`ilywear-wishlist-${userId}`, JSON.stringify(wishlist));
  }, [wishlist, userId]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id.toString() === product.id.toString());
      if (exists) {
        return prev.filter((item) => item.id.toString() !== product.id.toString());
      }
      return [...prev, product];
    });
  }, []);

  const isWishlisted = useCallback((productId: string | number) => {
    return wishlist.some((item) => item.id.toString() === productId.toString());
  }, [wishlist]);

  const clearWishlist = useCallback(() => setWishlist([]), []);

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      toggleWishlist, 
      isWishlisted, 
      wishlistCount: wishlist.length,
      isWishlistOpen,
      setIsWishlistOpen,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
