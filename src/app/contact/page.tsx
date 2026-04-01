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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#0A0A0A] text-white py-24 md:py-32 border-b border-[#222] mb-20">
          <div className="container mx-auto px-6 text-center">
            <span className="text-accent font-impact text-sm uppercase tracking-[0.4em] mb-4 inline-block">{t('support')}</span>
            <h1 className="text-5xl md:text-7xl font-impact tracking-wider uppercase leading-none mb-6 text-white">{t('contact')} <span className="text-accent">{t('contact') === 'Contact' ? 'Us' : ''}</span></h1>
            <p className="text-gray-500 text-sm font-sans max-w-xl mx-auto uppercase tracking-widest leading-loose">
              {t('contact_subtitle')}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-6 pb-32">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">
            {/* Info Cards */}
            <div className="lg:w-1/3 space-y-8">
              <div className="bg-[#111] border border-[#222] rounded-3xl p-10">
                <h3 className="text-xl font-impact uppercase tracking-wider text-white mb-8">{t('direct_channels')}</h3>
                <div className="space-y-10">
                   <a 
                    href={`https://wa.me/${settings?.whatsapp_number?.replace(/\s/g, '').replace('+', '') || '212600000000'}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-6 group"
                   >
                      <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-500 flex-shrink-0">
                         <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">{t('whatsapp')}</p>
                        <p className="text-sm font-sans text-white">{settings?.whatsapp_number || '+212 600-000000'}</p>
                      </div>
                   </a>
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 flex-shrink-0">
                         <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">{t('email')}</p>
                        <p className="text-sm font-sans text-white">{settings?.contact_email || 'support@ilywear.ma'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-secondary transition-all duration-500 flex-shrink-0">
                         <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-impact text-xs uppercase tracking-widest text-gray-500 mb-1">{t('showroom')}</p>
                        <p className="text-sm font-sans text-white">Agadir, Morocco</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-[#111] border border-[#222] text-white rounded-3xl p-10">
                <h4 className="font-impact text-sm uppercase tracking-widest text-accent mb-6">{t('social_connect')}</h4>
                <div className="flex gap-4">
                  <a href="https://instagram.com" className="w-12 h-12 bg-white/5 border border-[#333] rounded-xl flex items-center justify-center hover:bg-accent hover:text-secondary hover:border-accent transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/5 border border-[#333] rounded-xl flex items-center justify-center hover:bg-accent hover:text-secondary hover:border-accent transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 bg-[#111] border border-[#222] rounded-3xl p-8 md:p-16 self-start">
               <h3 className="text-3xl font-impact uppercase tracking-wider text-white mb-10">{t('send_detailed_inquiry')}</h3>
               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="font-impact text-sm uppercase tracking-widest text-gray-500 ml-2">{t('your_name')}</label>
                      <input 
                        required
                        className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl py-5 px-8 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                        placeholder={isRTL ? 'أدخل اسمك' : 'Hassan Alaoui'}
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="font-impact text-sm uppercase tracking-widest text-gray-500 ml-2">{t('email_address')}</label>
                      <input 
                        required
                        type="email"
                        className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl py-5 px-8 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                        placeholder="contact@ilywear.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="font-impact text-sm uppercase tracking-widest text-gray-500 ml-2">{t('subject')}</label>
                    <input 
                      required
                      className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl py-5 px-8 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-gray-600"
                      placeholder={t('subject_placeholder')}
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="font-impact text-sm uppercase tracking-widest text-gray-500 ml-2">{t('message_content')}</label>
                    <textarea 
                      required
                      className="w-full bg-[#1a1a1a] border border-[#222] rounded-xl py-5 px-8 text-sm text-white font-sans focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all min-h-[200px] placeholder:text-gray-600"
                      placeholder={t('message_placeholder')}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent text-secondary py-6 rounded-md font-impact text-xl uppercase tracking-wider flex items-center justify-center gap-4 hover:bg-white transition-all duration-500 shadow-2xl shadow-accent/10 disabled:opacity-50 glow-effect"
                  >
                    {loading ? t('sending_message') : t('send_message')}
                    <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
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
