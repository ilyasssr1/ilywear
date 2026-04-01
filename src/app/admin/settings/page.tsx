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
        <h2 className="text-accent font-impact text-sm uppercase tracking-[0.3em] mb-4">Store Configuration</h2>
        <h1 className="text-5xl font-impact tracking-wider uppercase leading-none text-white">Settings</h1>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-8">
          {/* General Section */}
          <section className="bg-[#0A0A0A] p-10 rounded-3xl border border-[#222] space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-[#1a1a1a] rounded-2xl">
                  <Globe className="w-5 h-5 text-accent" />
               </div>
               <h3 className="text-lg font-impact uppercase tracking-wider text-white">General Store Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Store Name</label>
                  <input 
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    value={settings.store_name}
                    onChange={e => setSettings({...settings, store_name: e.target.value})}
                  />
               </div>
               <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Contact Email</label>
                  <input 
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    value={settings.contact_email}
                    onChange={e => setSettings({...settings, contact_email: e.target.value})}
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="font-impact text-sm uppercase tracking-widest text-gray-500">Announcement Banner Text</label>
               <input 
                className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                value={settings.announcement_text}
                onChange={e => setSettings({...settings, announcement_text: e.target.value})}
               />
            </div>
          </section>

          {/* Social & Contact */}
          <section className="bg-[#0A0A0A] p-10 rounded-3xl border border-[#222] space-y-8">
            <div className="flex items-center gap-4 mb-2">
               <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl">
                  <Smartphone className="w-5 h-5 text-green-500" />
               </div>
               <h3 className="text-lg font-impact uppercase tracking-wider text-white">Contact & Social</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="font-impact text-sm uppercase tracking-widest text-gray-500">WhatsApp Number</label>
                  <input 
                    className="w-full bg-[#111] border border-[#222] rounded-xl py-4 px-6 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                    value={settings.whatsapp_number}
                    onChange={e => setSettings({...settings, whatsapp_number: e.target.value})}
                  />
               </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Status Card */}
          <section className="bg-[#0A0A0A] border border-accent/20 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <Shield className="w-10 h-10 text-accent mb-6" />
                <h3 className="text-xl font-impact text-white mb-4 uppercase tracking-wider">Site Status</h3>
                <div className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-[#222]">
                   <span className="text-xs font-impact uppercase tracking-widest text-white">Maintenance Mode</span>
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
            className="w-full bg-accent text-secondary py-8 rounded-xl font-impact text-xl uppercase tracking-wider flex items-center justify-center gap-4 hover:bg-white transition-all duration-500 shadow-2xl shadow-accent/20 group hover:-translate-y-1 glow-effect"
          >
            {saving ? (
              <div className="animate-spin w-5 h-5 border-2 border-secondary border-t-transparent rounded-full" />
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
