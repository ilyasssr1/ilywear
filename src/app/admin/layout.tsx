'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Menu, X, ChevronsRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { ADMIN_EMAILS } from '@/lib/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        showToast('Please sign in as admin', 'info');
        router.push('/login');
        return;
      }

      const userEmail = session.user?.email;
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        showToast('Access Denied: You are not an admin!', 'error');
        router.push('/');
        return;
      }

      setLoading(false);
    }
    checkAuth();
  }, [router, showToast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast('Signed out', 'info');
    router.push('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Products', icon: Package, href: '/admin/products' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Customers', icon: Users, href: '/admin/customers' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  const SidebarContent = () => (
    <>
      <div className="mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xl italic">I</div>
        <Link href="/" className="text-xl font-black uppercase tracking-tighter italic">
          Ily<span className="text-accent font-light not-italic">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive 
                ? 'bg-black text-white shadow-xl shadow-black/10' 
                : 'text-gray-400 hover:text-black hover:bg-gray-50'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-accent' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all mt-auto pt-8 border-t border-gray-50"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ChevronsRight className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-sm font-black uppercase tracking-widest italic">
            {menuItems.find(item => item.href === pathname)?.name || 'Admin'}
          </h1>
        </div>
        <Link href="/" className="text-lg font-black uppercase tracking-tighter italic">
          Ily<span className="text-accent font-light not-italic">Admin</span>
        </Link>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 flex-col p-8 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        >
          <aside 
            className="w-72 h-full bg-white p-8 flex flex-col shadow-2xl animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
