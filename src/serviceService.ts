import { supabase } from '@/lib/supabase';
import type { Service } from '@/types';

export const serviceService = {
  async getAll() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data: data as Service[] | null, error };
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Service[] | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Service | null, error };
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    return { data: data as Service[] | null, error };
  },

  async create(service: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();
    return { data: data as Service | null, error };
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Service | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    return { error };
  },

  async toggleActive(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('services')
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Service | null, error };
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `services/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  },
};