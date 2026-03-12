import { supabase } from '@/lib/supabase';
import type { Client } from '@/types';

export const clientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data as Client[] | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Client | null, error };
  },

  async getByPhone(phone: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('phone', phone)
      .single();
    return { data: data as Client | null, error };
  },

  async create(client: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    return { data: data as Client | null, error };
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Client | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    return { error };
  },

  async search(query: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name', { ascending: true });
    return { data: data as Client[] | null, error };
  },

  async getVipClients() {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_vip', true)
      .order('name', { ascending: true });
    return { data: data as Client[] | null, error };
  },

  async toggleVip(id: string, isVip: boolean) {
    const { data, error } = await supabase
      .from('clients')
      .update({ is_vip: isVip, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Client | null, error };
  },

  async addNote(id: string, note: string) {
    const { data: client } = await this.getById(id);
    if (!client) return { data: null, error: new Error('Client not found') };
    
    const currentNotes = client.notes || '';
    const newNote = `${new Date().toLocaleDateString()}: ${note}\n${currentNotes}`;
    
    return this.update(id, { notes: newNote });
  },

  async getStats() {
    const { data: totalData, error: totalError } = await supabase
      .from('clients')
      .select('id');
    
    const { data: vipData, error: vipError } = await supabase
      .from('clients')
      .select('id')
      .eq('is_vip', true);

    return {
      data: {
        total: (totalData as Record<string, unknown>[])?.length || 0,
        vip: (vipData as Record<string, unknown>[])?.length || 0,
      },
      error: totalError || vipError,
    };
  },
};