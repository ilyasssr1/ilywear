import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'IlyWear - Modern Moroccan Fashion',
  description: 'Premium Moroccan streetwear designed for the bold. Experience comfort without compromise.',
  keywords: ['fashion', 'moroccan', 'clothing', 'streetwear', 'men', 'women'],
  openGraph: {
    title: 'IlyWear - Modern Moroccan Fashion',
    description: 'Premium Moroccan streetwear designed for the bold.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-white`}>
        <ErrorBoundary>
          <LanguageProvider>
            <ToastProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                </WishlistProvider>
              </CartProvider>
            </ToastProvider>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
