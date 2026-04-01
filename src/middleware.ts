import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for middleware (Edge friendly)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. If keys are missing (during build or misconfiguration), skip maintenance check
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 2. Define paths that should ALWAYS be accessible
  const isPublicAsset = pathname.startsWith('/_next') || 
                        pathname.startsWith('/api') || 
                        pathname.includes('.') || // static files like images/favicons
                        pathname.startsWith('/admin') ||
                        pathname.startsWith('/login');

  const isMaintenancePage = pathname === '/maintenance';

  // 2. Optimization: Don't check DB for public assets or if already on maintenance page
  if (isPublicAsset || isMaintenancePage) {
    return NextResponse.next();
  }

  // 3. Check maintenance mode in Supabase
  try {
    const { data: settings } = await supabase
      .from('site_settings')
      .select('maintenance_mode')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();

    if (settings?.maintenance_mode) {
      // Redirect to maintenance page
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  } catch (error) {
    console.error('Middleware Maintenance Check Error:', error);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
