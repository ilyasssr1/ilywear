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
        className="text-gray-400 hover:text-white transition-all flex items-center justify-between p-2 lg:px-4 lg:py-2 rounded-xl border border-transparent lg:border-[#333] lg:bg-[#111] lg:hover:border-[#555] group lg:w-[240px]"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 lg:h-4 lg:w-4 text-gray-400 group-hover:text-white transition-colors" />
          <span className="hidden lg:block text-xs font-sans text-gray-500 group-hover:text-gray-400 transition-colors">
            Search product...
          </span>
        </div>
        <span className="hidden lg:flex items-center gap-1 ml-2 text-[8px] font-black uppercase tracking-widest text-gray-500 bg-[#222] px-2 py-1 rounded-md border border-[#333] group-hover:text-white transition-all">
          <span className="text-[10px]">⌘</span> K
        </span>
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
