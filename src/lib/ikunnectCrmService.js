// iKunnect CRM Service - Frontend Integration
// This service communicates with your Digital Ocean proxy

const IKUNNECT_CRM_BASE_URL = import.meta.env.VITE_IKUNNECT_CRM_BASE_URL;
const IKUNNECT_CRM_API_KEY = import.meta.env.VITE_IKUNNECT_CRM_API_KEY;
const IKUNNECT_CRM_LOCATION_ID = import.meta.env.VITE_IKUNNECT_CRM_LOCATION_ID;

class IKunnectCrmService {
  constructor() {
    this.baseUrl = IKUNNECT_CRM_BASE_URL;
    this.apiKey = IKUNNECT_CRM_API_KEY;
    this.locationId = IKUNNECT_CRM_LOCATION_ID;
    this.requestQueue = [];
    this.isProcessing = false;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-Location-ID': this.locationId,
      ...options.headers
    };

    const requestOptions = {
      ...options,
      headers
    };

    try {
      console.log(`🔗 iKunnect CRM API: ${options.method || 'GET'} ${endpoint}`);
      
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`iKunnect CRM API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ iKunnect CRM API success: ${endpoint}`);
      return data;
    } catch (error) {
      console.error('❌ iKunnect CRM API error:', error);
      
      // Handle specific error cases
      if (error.message.includes('401')) {
        throw new Error('Invalid iKunnect CRM API key');
      } else if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('502') || error.message.includes('504')) {
        throw new Error('iKunnect CRM service temporarily unavailable');
      }
      
      throw error;
    }
  }

  // =====================================================
  // CONVERSATIONS API
  // =====================================================

  async getConversations(params = {}) {
    const defaultParams = {
      limit: 20,
      offset: 0,
      ...params
    };
    
    const queryString = new URLSearchParams(defaultParams).toString();
    return this.makeRequest(`/conversations?${queryString}`);
  }

  async getConversation(conversationId) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    return this.makeRequest(`/conversations/${conversationId}`);
  }

  async updateConversationStatus(conversationId, status) {
    return this.makeRequest(`/conversations/${conversationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async assignConversation(conversationId, agentId) {
    return this.makeRequest(`/conversations/${conversationId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId })
    });
  }

  // =====================================================
  // MESSAGES API
  // =====================================================

  async getMessages(conversationId, params = {}) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    const defaultParams = {
      limit: 50,
      offset: 0,
      ...params
    };
    
    const queryString = new URLSearchParams(defaultParams).toString();
    return this.makeRequest(`/conversations/${conversationId}/messages?${queryString}`);
  }

  async sendMessage(conversationId, messageData) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    
    if (!messageData.content) {
      throw new Error('Message content is required');
    }

    const payload = {
      content: messageData.content,
      type: messageData.type || 'SMS',
      contact_id: messageData.contact_id,
      agent_id: messageData.agent_id,
      original_language: messageData.original_language || 'en',
      translated_content: messageData.translated_content || {},
      auto_translated: messageData.auto_translated || false
    };

    return this.makeRequest(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async markMessageAsRead(conversationId, messageId) {
    return this.makeRequest(`/conversations/${conversationId}/messages/${messageId}/read`, {
      method: 'POST'
    });
  }

  // =====================================================
  // CONTACTS API
  // =====================================================

  async getContacts(params = {}) {
    const defaultParams = {
      limit: 20,
      offset: 0,
      ...params
    };
    
    const queryString = new URLSearchParams(defaultParams).toString();
    return this.makeRequest(`/contacts?${queryString}`);
  }

  async getContact(contactId) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }
    return this.makeRequest(`/contacts/${contactId}`);
  }

  async searchContacts(query) {
    if (!query) {
      throw new Error('Search query is required');
    }
    return this.makeRequest(`/contacts?search=${encodeURIComponent(query)}`);
  }

  async updateContact(contactId, contactData) {
    return this.makeRequest(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  }

  // =====================================================
  // ANALYTICS API
  // =====================================================

  async getConversationAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/analytics/conversations?${queryString}`);
  }

  async getAgentPerformance(agentId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/analytics/agents/${agentId}?${queryString}`);
  }

  async getLanguageAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/analytics/languages?${queryString}`);
  }

  // =====================================================
  // REAL-TIME FEATURES
  // =====================================================

  async subscribeToConversationUpdates(conversationId, callback) {
    // This would typically use WebSockets or Server-Sent Events
    // For now, we'll use polling
    const pollInterval = setInterval(async () => {
      try {
        const conversation = await this.getConversation(conversationId);
        callback(conversation);
      } catch (error) {
        console.error('Error polling conversation updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }

  async subscribeToNewMessages(conversationId, callback) {
    let lastMessageId = null;
    
    const pollInterval = setInterval(async () => {
      try {
        const messages = await this.getMessages(conversationId, { limit: 1 });
        if (messages.messages && messages.messages.length > 0) {
          const latestMessage = messages.messages[0];
          if (lastMessageId && latestMessage.id !== lastMessageId) {
            callback(latestMessage);
          }
          lastMessageId = latestMessage.id;
        }
      } catch (error) {
        console.error('Error polling new messages:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }

  // =====================================================
  // QUEUE MANAGEMENT
  // =====================================================

  async getQueueMetrics() {
    return this.makeRequest('/queue/metrics');
  }

  async getActiveAgents() {
    return this.makeRequest('/agents/active');
  }

  async updateAgentStatus(agentId, status) {
    return this.makeRequest(`/agents/${agentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // =====================================================
  // TRANSLATION INTEGRATION
  // =====================================================

  async translateMessage(messageId, targetLanguage) {
    return this.makeRequest(`/messages/${messageId}/translate`, {
      method: 'POST',
      body: JSON.stringify({ target_language: targetLanguage })
    });
  }

  async detectMessageLanguage(messageId) {
    return this.makeRequest(`/messages/${messageId}/detect-language`, {
      method: 'POST'
    });
  }

  async updateConversationLanguages(conversationId, customerLanguage, agentLanguage) {
    return this.makeRequest(`/conversations/${conversationId}/languages`, {
      method: 'PUT',
      body: JSON.stringify({
        customer_language: customerLanguage,
        agent_language: agentLanguage
      })
    });
  }

  // =====================================================
  // ERROR HANDLING & RETRY LOGIC
  // =====================================================

  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      }
    }
  }

  // =====================================================
  // HEALTH CHECK
  // =====================================================

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('iKunnect CRM health check failed:', error);
      return false;
    }
  }

  // =====================================================
  // CONFIGURATION
  // =====================================================

  getConfiguration() {
    return {
      baseUrl: this.baseUrl,
      locationId: this.locationId,
      hasApiKey: !!this.apiKey,
      isConfigured: !!(this.baseUrl && this.apiKey && this.locationId)
    };
  }

  updateConfiguration(config) {
    if (config.baseUrl) this.baseUrl = config.baseUrl;
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.locationId) this.locationId = config.locationId;
  }
}

// =====================================================
// EXPORT SINGLETON INSTANCE
// =====================================================

export const ikunnectCrmService = new IKunnectCrmService();
export default ikunnectCrmService;

// =====================================================
// REACT HOOKS FOR EASY INTEGRATION
// =====================================================

import { useState, useEffect } from 'react';

export const useIKunnectConversations = (params = {}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await ikunnectCrmService.getConversations(params);
        setConversations(data.conversations || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [JSON.stringify(params)]);

  return { conversations, loading, error, refetch: () => fetchConversations() };
};

export const useIKunnectMessages = (conversationId, params = {}) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await ikunnectCrmService.getMessages(conversationId, params);
        setMessages(data.messages || []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, JSON.stringify(params)]);

  return { messages, loading, error, refetch: () => fetchMessages() };
};

export const useIKunnectRealTime = (conversationId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    if (!conversationId) return;

    setIsConnected(true);
    
    const unsubscribe = ikunnectCrmService.subscribeToNewMessages(
      conversationId,
      (message) => {
        setLastUpdate(message);
      }
    );

    return () => {
      setIsConnected(false);
      unsubscribe();
    };
  }, [conversationId]);

  return { isConnected, lastUpdate };
};

