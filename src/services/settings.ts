import { supabase } from '../lib/supabase';

export interface SiteSettings {
  id: string;
  store_name: string;
  contact_email: string;
  whatsapp_number: string;
  announcement_text: string;
  maintenance_mode: boolean;
  updated_at: string;
}

export const SETTINGS_ID = '00000000-0000-0000-0000-000000000000';

export async function fetchSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', SETTINGS_ID)
    .single();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }

  return data;
}

export async function updateSettings(settings: Partial<SiteSettings>): Promise<boolean> {
  const { error } = await supabase
    .from('site_settings')
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq('id', SETTINGS_ID);

  if (error) {
    console.error('Error updating settings:', error);
    return false;
  }

  return true;
}
