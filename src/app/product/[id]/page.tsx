import { fetchProductById } from '@/services/products';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await fetchProductById(params.id);

  if (!product) {
    return {
      title: 'Produit Introuvable | IlyWear',
    };
  }

  const title = `${product.title} | IlyWear`;
  const description = product.description.substring(0, 150) + '...';
  const imageUrl = product.image;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await fetchProductById(params.id);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'IlyWear',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'MAD',
      availability: product.stock && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-[#0A0A0A] min-h-[80vh]">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <Breadcrumbs 
            items={[
              { label: 'Shop', href: '/shop' },
              { label: product.category, href: `/shop?category=${product.category}` },
              { label: product.title }
            ]} 
          />

          <ProductDetailsClient product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
