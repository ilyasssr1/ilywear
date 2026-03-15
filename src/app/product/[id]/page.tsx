import { fetchProductById } from '@/services/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductDetailsClient from '@/components/ProductDetailsClient';

export const revalidate = 3600;

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await fetchProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-white min-h-[80vh]">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex space-x-2 text-sm text-gray-500 mb-8 overflow-x-auto pb-2">
            <Link href="/" className="hover:text-primary whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary whitespace-nowrap">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="capitalize hover:text-primary whitespace-nowrap">{product.category}</Link>
            <span>/</span>
            <span className="text-primary font-medium truncate max-w-[200px]">{product.title}</span>
          </div>

          <ProductDetailsClient product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
