'use client';

import { useState } from 'react';
import { Save, Bell, Smartphone, Palette, Globe, Shield } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    storeName: 'IlyWear',
    whatsappNumber: '+212 6XXXXXXXX',
    announcementText: 'Free Shipping Across Morocco • New Collection 2026',
    contactEmail: 'contact@ilywear.ma',
    currency: 'MAD',
    maintenanceMode: false
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      showToast('Settings saved successfully', 'success');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4">Store Configuration</h2>
        <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Settings</h1>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-8">
          {/* General Section */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-gray-50 rounded-2xl">
                  <Globe className="w-5 h-5 text-primary" />
               </div>
               <h3 className="text-lg font-black uppercase tracking-tight">General Store Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Name</label>
                  <input 
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    value={settings.storeName}
                    onChange={e => setSettings({...settings, storeName: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Email</label>
                  <input 
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    value={settings.contactEmail}
                    onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Announcement Banner Text</label>
               <input 
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                value={settings.announcementText}
                onChange={e => setSettings({...settings, announcementText: e.target.value})}
               />
            </div>
          </section>

          {/* Social & Contact */}
          <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-green-50 rounded-2xl">
                  <Smartphone className="w-5 h-5 text-green-600" />
               </div>
               <h3 className="text-lg font-black uppercase tracking-tight">Contact & Social</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp Number</label>
                  <input 
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    value={settings.whatsappNumber}
                    onChange={e => setSettings({...settings, whatsappNumber: e.target.value})}
                  />
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Status Card */}
          <section className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <Shield className="w-10 h-10 text-accent mb-6" />
                <h3 className="text-xl font-black italic mb-4 uppercase tracking-tighter">Site Status</h3>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                   <span className="text-xs font-bold uppercase tracking-widest">Maintenance Mode</span>
                   <button 
                    type="button"
                    onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-accent' : 'bg-gray-700'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </section>

          {/* Save Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/20 group hover:-translate-y-1"
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
