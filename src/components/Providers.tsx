'use client';

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { ToastProvider } from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { QuickViewProvider } from "@/context/QuickViewContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { SettingsProvider } from "@/context/SettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <QuickViewProvider>
                  {children}
                </QuickViewProvider>
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}
