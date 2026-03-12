import { supabase } from '@/lib/supabase';
import type { Message } from '@/types';

export const messageService = {
  async getAll() {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    return { data: data as Message[] | null, error };
  },

  async getConversation(userId1: string, userId2: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true });
    return { data: data as Message[] | null, error };
  },

  async getUnreadCount(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .eq('receiver_id', userId)
      .eq('is_read', false);
    return { count: (data as Record<string, unknown>[])?.length || 0, error };
  },

  async getConversationsList(adminId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${adminId},receiver_id.eq.${adminId}`)
      .order('created_at', { ascending: false });
    
    if (error) return { data: null, error };

    const conversations = new Map();
    (data as Record<string, unknown>[])?.forEach((msg) => {
      const senderId = msg.sender_id as string;
      const receiverId = msg.receiver_id as string;
      const partnerId = senderId === adminId ? receiverId : senderId;
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partnerId,
          lastMessage: msg,
          unreadCount: receiverId === adminId && !msg.is_read ? 1 : 0,
        });
      } else if (receiverId === adminId && !msg.is_read) {
        const conv = conversations.get(partnerId);
        conv.unreadCount++;
      }
    });

    return { data: Array.from(conversations.values()), error: null };
  },

  async create(message: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();
    return { data: data as Message | null, error };
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();
    return { data: data as Message | null, error };
  },

  async markConversationAsRead(senderId: string, receiverId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', receiverId)
      .eq('is_read', false);
    return { error };
  },

  subscribeToMessages(userId: string, callback: (message: Message) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();
  },
};