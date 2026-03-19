'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'MAD' | 'EUR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number) => string;
  rates: Record<Currency, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Taux de change fixes (approximatifs pour la démo)
const RATES = {
  MAD: 1,
  EUR: 0.092, // 1 MAD = 0.092 EUR
  USD: 0.098, // 1 MAD = 0.098 USD
};

const SYMBOLS = {
  MAD: 'MAD',
  EUR: '€',
  USD: '$',
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('MAD');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ilywear_currency') as Currency;
    if (saved && (saved === 'MAD' || saved === 'EUR' || saved === 'USD')) {
      setCurrency(saved);
    }
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('ilywear_currency', c);
  };

  const formatPrice = (priceInMAD: number) => {
    const converted = priceInMAD * RATES[currency];
    const rounded = Math.round(converted * 100) / 100;

    if (currency === 'MAD') {
      return `${priceInMAD.toLocaleString()} MAD`;
    }
    
    return `${SYMBOLS[currency]}${rounded.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice, rates: RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
