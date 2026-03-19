import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import WhatsAppFloating from "@/components/WhatsAppFloating";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL('https://ilywear.shop'),
  title: "IlyWear | Modern Moroccan Fashion & Streetwear",
  description: "Explore the fusion of tradition and modernity with IlyWear. Premium Moroccan streetwear for women and men. Free shipping across Morocco.",
  openGraph: {
    title: "IlyWear | Streetwear Marocain Premium",
    description: "La nouvelle collection 2026 est disponible. Qualité premium, design unique.",
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "IlyWear",
    description: "Premium Moroccan Fashion",
  },
  icons: {
    icon: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable}`}>
        <Providers>
          {children}
          <WhatsAppFloating />
        </Providers>
      </body>
    </html>
  );
}
