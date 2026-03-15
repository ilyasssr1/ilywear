'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchModal from './SearchModal';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  // Allow Cmd+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button 
        aria-label="Search" 
        className="text-primary hover:text-accent transition-all flex items-center justify-center p-2.5 rounded-full border border-transparent hover:border-gray-200 group"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-5 w-5" />
        <span className="hidden lg:flex items-center gap-1 ml-2 text-[8px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 group-hover:bg-white group-hover:text-black transition-all">
          <span className="text-[10px]">⌘</span> K
        </span>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
