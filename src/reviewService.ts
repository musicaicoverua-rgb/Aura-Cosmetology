import { supabase } from '@/lib/supabase';
import type { Review } from '@/types';

export const reviewService = {
  async getAll() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });
    return { data: data as Review[] | null, error };
  },

  async getAllAdmin() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Review[] | null, error };
  },

  async getPending() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: false });
    return { data: data as Review[] | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Review | null, error };
  },

  async create(review: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...review, is_approved: false })
      .select()
      .single();
    return { data: data as Review | null, error };
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as Review | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    return { error };
  },

  async approve(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Review | null, error };
  },

  async getStats() {
    const { data: totalData, error: totalError } = await supabase
      .from('reviews')
      .select('id');
    
    const { data: pendingData, error: pendingError } = await supabase
      .from('reviews')
      .select('id')
      .eq('is_approved', false);

    const { data: avgData, error: avgError } = await supabase
      .from('reviews')
      .select('rating')
      .eq('is_approved', true);

    const avgRating = (avgData as Record<string, unknown>[])?.length 
      ? (avgData as Record<string, unknown>[]).reduce((sum, r) => sum + (r.rating as number), 0) / (avgData as Record<string, unknown>[]).length 
      : 0;

    return {
      data: {
        total: (totalData as Record<string, unknown>[])?.length || 0,
        pending: (pendingData as Record<string, unknown>[])?.length || 0,
        average: Math.round(avgRating * 10) / 10,
      },
      error: totalError || pendingError || avgError,
    };
  },
};