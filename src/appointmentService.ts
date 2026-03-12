import { supabase } from '@/lib/supabase';
import type { Appointment } from '@/types';

export const appointmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true });
    return { data: data as Appointment[] | null, error };
  },

  async getByDate(date: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', date)
      .order('time', { ascending: true });
    return { data: data as Appointment[] | null, error };
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });
    return { data: data as Appointment[] | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as Appointment | null, error };
  },

  async create(appointment: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    return { data: data as Appointment | null, error };
  },

  async update(id: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data: data as Appointment | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    return { error };
  },

  async getAvailableSlots(date: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select('time')
      .eq('date', date)
      .not('status', 'eq', 'cancelled');
    
    if (error) return { data: null, error };
    
    const bookedSlots = (data as Record<string, unknown>[])?.map((a) => a.time as string) || [];
    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
      '18:00', '18:30', '19:00', '19:30'
    ];
    
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));
    return { data: availableSlots, error: null };
  },

  async getStats() {
    const today = new Date().toISOString().split('T')[0];
    const { data: todayData, error: todayError } = await supabase
      .from('appointments')
      .select('id')
      .eq('date', today);
    
    const { data: pendingData, error: pendingError } = await supabase
      .from('appointments')
      .select('id')
      .eq('status', 'pending');
    
    const { data: totalData, error: totalError } = await supabase
      .from('appointments')
      .select('id');

    return {
      data: {
        today: (todayData as Record<string, unknown>[])?.length || 0,
        pending: (pendingData as Record<string, unknown>[])?.length || 0,
        total: (totalData as Record<string, unknown>[])?.length || 0,
      },
      error: todayError || pendingError || totalError,
    };
  },
};