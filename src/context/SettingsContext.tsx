'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings, SiteSettings } from '@/services/settings';

interface SettingsContextType {
  settings: SiteSettings | null;
  whatsappNumber: string;
  storeName: string;
  contactEmail: string;
  loading: boolean;
}

const DEFAULT_WHATSAPP = '212650438029';
const DEFAULT_STORE_NAME = 'IlyWear';
const DEFAULT_EMAIL = 'contact@ilywear.shop';

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  whatsappNumber: DEFAULT_WHATSAPP,
  storeName: DEFAULT_STORE_NAME,
  contactEmail: DEFAULT_EMAIL,
  loading: true,
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const whatsappNumber = settings?.whatsapp_number?.replace(/[^0-9]/g, '') || DEFAULT_WHATSAPP;
  const storeName = settings?.store_name || DEFAULT_STORE_NAME;
  const contactEmail = settings?.contact_email || DEFAULT_EMAIL;

  return (
    <SettingsContext.Provider value={{ settings, whatsappNumber, storeName, contactEmail, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
