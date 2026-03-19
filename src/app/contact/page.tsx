'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, MessageCircle, Instagram, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import { fetchSettings, SiteSettings } from '@/services/settings';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { showToast } = useToast();
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    async function getSettings() {
      const data = await fetchSettings();
      if (data) setSettings(data);
    }
    getSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert([formData]);
    if (error) {
      showToast(t('message_failed'), 'error');
    } else {
      showToast(t('message_sent'), 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-black text-white py-24 md:py-32 rounded-b-[4rem] mb-20">
          <div className="container mx-auto px-6 text-center">
            <span className="text-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 inline-block">{t('support')}</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-6">{t('contact')} <span className="gradient-text">{t('contact') === 'Contact' ? 'Us' : ''}</span></h1>
            <p className="text-gray-400 text-sm font-medium max-w-xl mx-auto uppercase tracking-widest leading-loose">
              {t('contact_subtitle')}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-32">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
            {/* Info Cards */}
            <div className="lg:w-1/3 space-y-8">
              <div className="bg-[#FBFBFB] border border-gray-100 rounded-[2.5rem] p-10">
                <h3 className="text-xl font-black uppercase tracking-tight italic mb-8">{t('direct_channels')}</h3>
                <div className="space-y-10">
                   <a 
                    href={`https://wa.me/${settings?.whatsapp_number?.replace(/\s/g, '').replace('+', '') || '212600000000'}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-6 group"
                   >
                      <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-500 flex-shrink-0">
                         <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('whatsapp')}</p>
                        <p className="text-sm font-bold">{settings?.whatsapp_number || '+212 600-000000'}</p>
                      </div>
                   </a>
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 flex-shrink-0">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('email')}</p>
                        <p className="text-sm font-bold">{settings?.contact_email || 'support@ilywear.ma'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-black transition-all duration-500 flex-shrink-0">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{t('showroom')}</p>
                        <p className="text-sm font-bold">Agadir, Morocco</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-black text-white rounded-[2.5rem] p-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-accent mb-6 italic">{t('social_connect')}</h4>
                <div className="flex gap-4">
                  <a href="https://instagram.com" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 bg-white border border-gray-100 rounded-[3rem] p-8 md:p-16 shadow-sm self-start">
               <h3 className="text-3xl font-black uppercase tracking-tighter italic mb-10">{t('send_detailed_inquiry')}</h3>
               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t('your_name')}</label>
                      <input 
                        required
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                        placeholder={isRTL ? 'أدخل اسمك' : 'John Doe'}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t('email_address')}</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t('subject')}</label>
                    <input 
                      required
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all"
                      placeholder={t('subject_placeholder')}
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">{t('message_content')}</label>
                    <textarea 
                      required
                      className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:bg-white transition-all min-h-[200px]"
                      placeholder={t('message_placeholder')}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-accent transition-all duration-500 shadow-2xl shadow-black/10 disabled:opacity-50"
                  >
                    {loading ? t('sending_message') : t('send_message')}
                    <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
               </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
