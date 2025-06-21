// Enhanced Supabase integration for iKunnect workspace
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced Supabase service class
class SupabaseService {
  constructor() {
    this.supabase = supabase;
  }

  // Real-time subscription management
  async subscribeToConversations(callback) {
    try {
      const subscription = this.supabase
        .channel('conversations')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'conversations' }, 
          callback
        )
        .subscribe();
      
      return { subscription, error: null };
    } catch (error) {
      console.error('Error subscribing to conversations:', error);
      return { subscription: null, error };
    }
  }

  async subscribeToMessages(callback) {
    try {
      const subscription = this.supabase
        .channel('messages')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'messages' }, 
          callback
        )
        .subscribe();
      
      return { subscription, error: null };
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      return { subscription: null, error };
    }
  }

  // SLA Metrics
  async getSLAMetrics(channel = null) {
    try {
      let query = this.supabase.from('sla_metrics').select('*');
      
      if (channel) {
        query = query.eq('channel', channel);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching SLA metrics:', error);
      return { data: [], error };
    }
  }

  // Dashboard Metrics
  async getDashboardMetrics() {
    try {
      const { data, error } = await this.supabase
        .from('dashboard_metrics')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      return { data: [], error };
    }
  }

  // Performance Indicators
  async getPerformanceIndicators() {
    try {
      const { data, error } = await this.supabase
        .from('performance_indicators')
        .select('*')
        .order('category');
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching performance indicators:', error);
      return { data: [], error };
    }
  }

  // Tickets
  async getTickets(filters = {}) {
    try {
      let query = this.supabase
        .from('ticket_summary')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return { data: [], error };
    }
  }

  async createTicket(ticketData) {
    try {
      const { data, error } = await this.supabase
        .from('tickets')
        .insert([ticketData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating ticket:', error);
      return { data: null, error };
    }
  }

  // Activity Feed
  async getActivityFeed(limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('activity_feed')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      return { data: [], error };
    }
  }

  // Agent Performance
  async getAgentPerformance() {
    try {
      const { data, error } = await this.supabase
        .from('agent_performance')
        .select('*')
        .order('efficiency_score', { ascending: false });
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching agent performance:', error);
      return { data: [], error };
    }
  }

  // Queue Metrics
  async getQueueMetrics() {
    try {
      const { data, error } = await this.supabase
        .from('real_time_metrics')
        .select('*');
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching queue metrics:', error);
      return { data: [], error };
    }
  }

  // Conversations
  async getConversations(agentId = null, status = null) {
    try {
      let query = this.supabase
        .from('conversations')
        .select(`
          *,
          customers (name, email, phone),
          agents (name)
        `)
        .order('updated_at', { ascending: false });
      
      if (agentId) {
        query = query.eq('assigned_agent_id', agentId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { data: [], error };
    }
  }

  // Messages
  async getMessages(conversationId) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { data: [], error };
    }
  }

  async sendMessage(messageData) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }
  }

  // Unread count
  async getUnreadCount(agentId) {
    try {
      const { data, error } = await this.supabase
        .from('messages')
        .select('conversation_id', { count: 'exact' })
        .eq('is_read', false)
        .eq('sender_type', 'customer')
        .in('conversation_id', 
          this.supabase
            .from('conversations')
            .select('id')
            .eq('assigned_agent_id', agentId)
        );

      if (error) throw error;
      return { data: data?.length || 0, error: null };
    } catch (error) {
      console.error('Error getting unread count:', error);
      return { data: 0, error };
    }
  }
}

// Export the service instance
export const supabaseService = new SupabaseService();
