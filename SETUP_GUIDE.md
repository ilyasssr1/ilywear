# IlyWear - Quick Start Guide

## Prerequisites

- Node.js 18+ or newer
- npm or yarn package manager
- A Supabase account (https://supabase.com)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository (or extract the project)
cd IlyWear

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Create a free account at https://supabase.com
2. Create a new project
3. Copy your **Project URL** and **Anon Key**
4. Create these environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set Up Database

1. Go to Supabase dashboard → SQL Editor
2. Run this SQL to create the products table:

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  image VARCHAR(500),
  images TEXT[],
  colors TEXT[],
  sizes TEXT[],
  stock INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_email VARCHAR(255),
  customer_city VARCHAR(100),
  customer_address TEXT,
  items JSONB,
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Project Structure Overview

- `src/app/` - Page components and layouts
- `src/components/` - React components (UI + business logic)
- `src/context/` - React Context providers (state management)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities, helpers, and configurations
- `src/services/` - API and database services
- `public/` - Static files (images, icons)

---

## Key Features to Try

### 1. Shopping Cart

- Click "Add to Bag" on any product
- Open cart sidebar (shopping bag icon)
- Adjust quantities or remove items
- Proceed to checkout

### 2. Wishlist

- Click heart icon on products
- View wishlist from header

### 3. Product Filtering

- Use category filters in shop
- Search products using the search bar

### 4. Authentication (if configured)

- Sign up for a new account
- Login with email and password
- Your cart persists across sessions

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types (if available)
```

---

## Customization

### Change Site Name & Branding

Edit `src/lib/config.ts` and `src/app/layout.tsx`

### Modify Colors

Edit `tailwind.config.ts` for color variables

### Add New Pages

Create new files in `src/app/` following the directory structure

### Add Products

1. Go to Supabase dashboard
2. Navigate to products table
3. Insert new product records

---

## Troubleshooting

### Port 3000 Already in Use

```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Environment Variables Not Loading

1. Delete `.next` folder
2. Restart the dev server
3. Check `.env.local` file exists

### Supabase Connection Issues

1. Verify your URL and key are correct
2. Check Supabase project is not paused
3. Test connection in browser console:

```javascript
import { supabase } from "@/lib/supabase";
const { data, error } = await supabase.from("products").select("*").limit(5);
console.log(data, error);
```

### CSS Not Loading

1. Clear `.next` cache
2. Reinstall dependencies: `npm install`
3. Restart dev server

---

## Performance Tips

1. **Image Optimization**: Images are automatically optimized by Next.js
2. **Lazy Loading**: Components load on demand
3. **Caching**: Enable browser caching for static assets
4. **API Calls**: Debounced search and filtered queries

---

## Security Best Practices

1. **Never commit** `.env.local` file
2. **Use Supabase Row Level Security** for database
3. **Validate** all user input on client and server
4. **Use HTTPS** in production
5. **Keep dependencies** updated regularly

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy to Other Platforms

- Netlify
- Railway
- Render
- AWS/Azure/Google Cloud

---

## Support & Resources

- Documentation: See `PROJECT_DOCUMENTATION.md`
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Supabase Docs: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

---

## Next Steps

1. ✅ Customize branding and colors
2. ✅ Add your products to database
3. ✅ Set up payment processing
4. ✅ Configure email notifications
5. ✅ Deploy to production
6. ✅ Set up analytics and monitoring

---

Enjoy building with IlyWear! 🎉
