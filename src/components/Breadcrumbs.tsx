'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface BreadcrumbsProps {
  items: {
    label: string;
    href?: string;
  }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { t, isRTL } = useLanguage();

  return (
    <nav className="flex mb-8 overflow-x-auto whitespace-nowrap no-scrollbar py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 md:space-x-4">
        <li>
          <Link href="/" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 font-impact text-xs uppercase tracking-widest">
            <Home className="w-3 h-3" />
            <span className="hidden sm:inline">{t('home') || 'HOME'}</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2 md:space-x-4">
            <ChevronRight className={`w-3 h-3 text-gray-700 ${isRTL ? 'rotate-180' : ''}`} />
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-white transition-colors font-impact text-xs uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-accent font-impact text-xs uppercase tracking-widest underline decoration-accent/30 underline-offset-4">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
