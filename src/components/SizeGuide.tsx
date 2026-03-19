'use client';

import { X, Ruler } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SizeGuide({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  
  if (!isOpen) return null;

  const sizes = [
    { name: 'S', waist: '28-30', hip: '34-36', length: '38' },
    { name: 'M', waist: '30-32', hip: '36-38', length: '39' },
    { name: 'L', waist: '32-34', hip: '38-40', length: '40' },
    { name: 'XL', waist: '34-36', hip: '40-42', length: '41' },
    { name: 'XXL', waist: '36-38', hip: '42-44', length: '42' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Ruler className="w-5 h-5 text-accent" />
             <h2 className="text-xl font-black uppercase tracking-tight italic">{t('size_guide_title')}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">{t('measurements')}</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 text-[9px] font-black uppercase tracking-widest text-primary">{t('size')}</th>
                  <th className="py-4 text-[9px] font-black uppercase tracking-widest text-primary">{t('waist')}</th>
                  <th className="py-4 text-[9px] font-black uppercase tracking-widest text-primary">{t('hip')}</th>
                  <th className="py-4 text-[9px] font-black uppercase tracking-widest text-primary">{t('length')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sizes.map((s) => (
                  <tr key={s.name} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-xs font-black uppercase italic text-accent">{s.name}</td>
                    <td className="py-4 text-sm font-medium text-gray-500">{s.waist}</td>
                    <td className="py-4 text-sm font-medium text-gray-500">{s.hip}</td>
                    <td className="py-4 text-sm font-medium text-gray-500">{s.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
             <p className="text-[10px] text-gray-400 font-bold uppercase leading-relaxed text-center">
               {t('size_guide_note')}
             </p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-8 bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent transition-all"
          >
            {t('got_it')}
          </button>
        </div>
      </div>
    </div>
  );
}
