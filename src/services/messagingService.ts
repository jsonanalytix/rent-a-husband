import { supabase, EDGE_FUNCTIONS, getAuthHeaders } from '../lib/supabase';
import type { Database } from '../types/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

export interface Conversation {
  conversation_id: string;
  participants: string[];
  task_id: string | null;
  last_message_at: string | null;
  message_count: number;
  unread_count: number;
  other_user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  task?: {
    id: string;
    title: string;
  };
}

export interface MessageWithSender extends Message {
  sender?: {
    name: string;
    avatar_url: string | null;
  };
}

class MessagingService {
  private messageChannels: Map<string, RealtimeChannel> = new Map();

  // Send a message
  async sendMessage(
    recipientId: string,
    content: string,
    taskId?: string,
    attachments?: any[]
  ): Promise<{ data: Message | null; error: string | null }> {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS.messaging}/send`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({
          recipient_id: recipientId,
          content,
          task_id: taskId,
          attachments
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error: any) {
      console.error('Error sending message:', error);
      return { data: null, error: error.message || 'Failed to send message' };
    }
  }

  // Get user's conversations
  async getConversations(): Promise<{ data: Conversation[] | null; error: string | null }> {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS.messaging}/conversations`, {
        method: 'GET',
        headers: await getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const conversations = await response.json();

      // Enrich conversations with user and task details
      const enrichedConversations = await Promise.all(
        conversations.map(async (conv: any) => {
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          const otherUserId = conv.participants.find((id: string) => id !== currentUser?.id);

          // Get other user's profile
          const { data: otherUserProfile } = await supabase
            .from('profiles')
            .select('user_id, name, avatar_url')
            .eq('user_id', otherUserId)
            .single();

          // Get task details if conversation is related to a task
          let taskDetails = null;
          if (conv.task_id) {
            const { data: task } = await supabase
              .from('tasks')
              .select('id, title')
              .eq('id', conv.task_id)
              .single();
            taskDetails = task;
          }

          return {
            ...conv,
            other_user: otherUserProfile ? {
              id: otherUserProfile.user_id,
              name: otherUserProfile.name,
              avatar_url: otherUserProfile.avatar_url
            } : undefined,
            task: taskDetails
          };
        })
      );

      return { data: enrichedConversations, error: null };
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      return { data: null, error: error.message || 'Failed to fetch conversations' };
    }
  }

  // Get messages in a conversation
  async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ data: MessageWithSender[] | null; error: string | null }> {
    try {
      const response = await fetch(
        `${EDGE_FUNCTIONS.messaging}/conversation/${conversationId}?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: await getAuthHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const messages = await response.json();

      // Enrich messages with sender details
      const enrichedMessages = await Promise.all(
        messages.map(async (message: Message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender: senderProfile || undefined
          };
        })
      );

      return { data: enrichedMessages, error: null };
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      return { data: null, error: error.message || 'Failed to fetch messages' };
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch(`${EDGE_FUNCTIONS.messaging}/mark-read`, {
        method: 'POST',
        headers: await getAuthHeaders(),
        body: JSON.stringify({ conversation_id: conversationId })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: error.message || 'Failed to mark messages as read' };
    }
  }

  // Subscribe to new messages in a conversation
  subscribeToConversation(
    conversationId: string,
    onMessage: (message: Message) => void
  ): RealtimeChannel {
    // Unsubscribe from existing channel if any
    this.unsubscribeFromConversation(conversationId);

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Enrich the message with sender details
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('user_id', payload.new.sender_id)
            .single();

          const enrichedMessage = {
            ...payload.new,
            sender: senderProfile || undefined
          } as MessageWithSender;

          onMessage(enrichedMessage);
        }
      )
      .subscribe();

    this.messageChannels.set(conversationId, channel);
    return channel;
  }

  // Unsubscribe from a conversation
  unsubscribeFromConversation(conversationId: string) {
    const channel = this.messageChannels.get(conversationId);
    if (channel) {
      channel.unsubscribe();
      this.messageChannels.delete(conversationId);
    }
  }

  // Subscribe to all new messages for the user
  subscribeToNewMessages(onMessage: (message: Message) => void): RealtimeChannel {
    return supabase
      .channel('new-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          
          // Only notify if the message is for the current user
          if (payload.new.recipient_id === user?.id) {
            onMessage(payload.new as Message);
          }
        }
      )
      .subscribe();
  }

  // Get unread message count
  async getUnreadCount(): Promise<{ count: number; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { count: 0, error: 'User not authenticated' };
      }

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      return { count: 0, error: error.message || 'Failed to fetch unread count' };
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.messageChannels.forEach(channel => channel.unsubscribe());
    this.messageChannels.clear();
  }
}

export const messagingService = new MessagingService(); 