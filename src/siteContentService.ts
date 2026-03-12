import { supabase } from '@/lib/supabase';
import type { SiteContent } from '@/types';

export const siteContentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section', { ascending: true });
    return { data: data as SiteContent[] | null, error };
  },

  async getBySection(section: string) {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section);
    return { data: data as SiteContent[] | null, error };
  },

  async getByKey(key: string) {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('key', key)
      .single();
    return { data: data as SiteContent | null, error };
  },

  async create(content: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('site_content')
      .insert(content)
      .select()
      .single();
    return { data: data as SiteContent | null, error };
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('site_content')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as SiteContent | null, error };
  },

  async updateByKey(key: string, value: Record<string, string>) {
    const { data, error } = await supabase
      .from('site_content')
      .update({ 
        value_uk: value.uk,
        value_en: value.en,
        value_ru: value.ru,
        value_es: value.es,
        value_fr: value.fr,
        value_de: value.de,
        value_pl: value.pl,
        value_cs: value.cs,
        updated_at: new Date().toISOString(),
      })
      .eq('key', key)
      .select()
      .single();
    return { data: data as SiteContent | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', id);
    return { error };
  },

  async getContactInfo() {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .in('key', ['phone', 'email', 'address', 'working_hours']);
    
    if (error) return { data: null, error };

    const result: Record<string, Record<string, string>> = {};
    (data as Record<string, unknown>[])?.forEach((item) => {
      result[item.key as string] = {
        uk: item.value_uk as string,
        en: item.value_en as string,
        ru: item.value_ru as string,
        es: item.value_es as string,
        fr: item.value_fr as string,
        de: item.value_de as string,
        pl: item.value_pl as string,
        cs: item.value_cs as string,
      };
    });

    return { data: result, error: null };
  },
};