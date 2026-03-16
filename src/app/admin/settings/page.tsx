'use client';

import { useState, useEffect } from 'react';
import { Save, Bell, Smartphone, Palette, Globe, Shield } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { fetchSettings, updateSettings, SiteSettings } from '@/services/settings';

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    store_name: '',
    whatsapp_number: '',
    announcement_text: '',
    contact_email: '',
    maintenance_mode: false
  });

  useEffect(() => {
    async function loadSettings() {
      const data = await fetchSettings();
      if (data) {
        setSettings(data);
      } else {
        showToast('Failed to load settings from database. Please ensure the site_settings table exists.', 'error');
      }
      setLoading(false);
    }
    loadSettings();
  }, [showToast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const success = await updateSettings(settings);
    
    if (success) {
      showToast('Settings saved successfully', 'success');
    } else {
      showToast('Failed to save settings. Please check your permissions.', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

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
                    value={settings.store_name}
                    onChange={e => setSettings({...settings, store_name: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Email</label>
                  <input 
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                    value={settings.contact_email}
                    onChange={e => setSettings({...settings, contact_email: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Announcement Banner Text</label>
               <input 
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                value={settings.announcement_text}
                onChange={e => setSettings({...settings, announcement_text: e.target.value})}
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
                    value={settings.whatsapp_number}
                    onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
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
                    onClick={() => setSettings({...settings, maintenance_mode: !settings.maintenance_mode})}
                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenance_mode ? 'bg-accent' : 'bg-gray-700'}`}
                   >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenance_mode ? 'left-7' : 'left-1'}`} />
                   </button>
                </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </section>

          {/* Save Button */}
          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/20 group hover:-translate-y-1"
          >
            {saving ? (
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
