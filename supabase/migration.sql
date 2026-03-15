-- =============================================
-- IlyWear Database Schema
-- Run this in the Supabase SQL Editor
-- =============================================

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'men',
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Anyone can read products
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- 5. Policies: Authenticated users can insert/update/delete products
CREATE POLICY "Authenticated users can insert products" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete products" ON products
  FOR DELETE USING (true);

-- 6. Policies: Anyone can create orders
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders viewable by everyone" ON orders
  FOR SELECT USING (true);

-- 7. Seed Initial Products
INSERT INTO products (title, price, description, category, image, images, colors, sizes) VALUES
  ('Classic White Tee', 149, 'Premium cotton t-shirt.', 'men', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80'], ARRAY['#ffffff', '#000000'], ARRAY['S', 'M', 'L', 'XL']),
  ('Summer Floral Dress', 399, 'Lightweight summer dress.', 'women', 'https://images.unsplash.com/photo-1515347619152-16692cb58eb1?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1515347619152-16692cb58eb1?w=500&q=80', 'https://images.unsplash.com/photo-1572804013309-82a891488ebb?w=500&q=80'], ARRAY['#ff0000', '#00ff00', '#0000ff'], ARRAY['M', 'L', 'XL', 'XXL']),
  ('Denim Jacket', 599, 'Vintage wash denim jacket.', 'men', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80'], ARRAY['#1e3a8a', '#000000'], ARRAY['M', 'L']),
  ('Elegant Evening Gown', 899, 'Perfect for special occasions.', 'women', 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500&q=80'], ARRAY['#000000', '#16a34a', '#0d9488', '#dc2626', '#a21caf'], ARRAY['M', 'L', 'XL', 'XXL']),
  ('Streetwear Hoodie', 349, 'Oversized comfort hoodie.', 'promotions', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80', 'https://images.unsplash.com/photo-1556821839-a72bb794da83?w=500&q=80'], ARRAY['#000000', '#ffffff', '#9ca3af'], ARRAY['M', 'L', 'XL']),
  ('Tailored Trousers', 450, 'Smart casual trousers.', 'men', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80'], ARRAY['#1f2937', '#e5e7eb'], ARRAY['30', '32', '34', '36']),
  ('Silk Blouse', 299, 'Smooth silk blend blouse.', 'women', 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500&q=80'], ARRAY['#ffffff', '#fecdd3'], ARRAY['M', 'L', 'XL', 'XXL']),
  ('Casual Sneakers', 499, 'Everyday lifestyle sneakers.', 'promotions', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80', ARRAY['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80'], ARRAY['#ffffff', '#000000'], ARRAY['40', '41', '42', '43', '44']),
  ('Kardiguan Velour', 199, 'Magnifique kardiguan en velours bleu.', 'women', '/kardiguan.jpg', ARRAY['/kardiguan.jpg', '/kardiguan2.jpg', '/kardiguan3.jpg', '/kardiguan4.jpg', '/kardiguan5.jpg'], ARRAY['#000000', '#16a34a', '#0d9488', '#dc2626', '#a21caf'], ARRAY['M', 'L', 'XL', 'XXL']);
