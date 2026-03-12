import { supabase } from '@/lib/supabase';
import type { GalleryItem } from '@/types';

export const galleryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as GalleryItem[] | null, error };
  },

  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    return { data: data as GalleryItem[] | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as GalleryItem | null, error };
  },

  async create(item: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('gallery')
      .insert(item)
      .select()
      .single();
    return { data: data as GalleryItem | null, error };
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as GalleryItem | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    return { error };
  },

  async uploadImage(file: File, type: 'before' | 'after') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `gallery/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('gallery')
      .select('category');
    
    if (error) return { data: null, error };
    
    const categories = [...new Set((data as Record<string, unknown>[])?.map((item) => item.category as string) || [])];
    return { data: categories, error: null };
  },
};