import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2,
  Send,
  Paperclip,
  MoreHorizontal,
  Clock,
  User,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Circle,
  Star,
  Flag,
  Archive,
  Zap,
  Globe,
  Languages,
  Settings,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';
import { 
  MultilingualMessage, 
  LanguageSettingsPanel, 
  LanguageDetectionBanner,
  QuickLanguageSwitcher,
  TranslationQualityIndicator 
} from './MultilingualComponents';
import translationService, { getLanguageByCode, getLanguageName, getLanguageFlag } from '../lib/translationService';
import ikunnectCrmService, { useIKunnectConversations, useIKunnectMessages, useIKunnectRealTime } from '../lib/ikunnectCrmService';
import { supabaseService } from '../lib/supabase-enhanced';
import { 
  useChatPriority, 
  useResponseTime, 
  useKeyboardShortcuts, 
  useDraftMessages 
} from '../hooks/useRealTimeFeatures.js';

const MultiChatManager = ({ onClose }) => {
  const [activeChats, setActiveChats] = useState([
    {
      id: 1,
      customerName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      status: 'active',
      lastMessage: 'Hi, I need help with my order',
      timestamp: new Date(Date.now() - 5 * 60000),
      unreadCount: 2,
      priority: 'high',
      channel: 'Live Chat',
      tags: ['VIP', 'Order Issue'],
      responseTime: 45,
      customerLanguage: 'en',
      agentLanguage: 'en',
      translationEnabled: false,
      messages: [
        { 
          id: 1, 
          sender: 'customer', 
          text: 'Hi, I need help with my order', 
          timestamp: new Date(Date.now() - 10 * 60000),
          original_language: 'en',
          original_content: 'Hi, I need help with my order',
          translated_content: {},
          auto_translated: false
        },
        { 
          id: 2, 
          sender: 'agent', 
          text: 'Hello Sarah! I\'d be happy to help you with your order. Can you provide me with your order number?', 
          timestamp: new Date(Date.now() - 8 * 60000),
          original_language: 'en',
          original_content: 'Hello Sarah! I\'d be happy to help you with your order. Can you provide me with your order number?',
          translated_content: {},
          auto_translated: false
        },
        { 
          id: 3, 
          sender: 'customer', 
          text: 'Yes, it\'s #ORD-12345', 
          timestamp: new Date(Date.now() - 6 * 60000),
          original_language: 'en',
          original_content: 'Yes, it\'s #ORD-12345',
          translated_content: {},
          auto_translated: false
        },
        { 
          id: 4, 
          sender: 'customer', 
          text: 'Hi, I need help with my order', 
          timestamp: new Date(Date.now() - 5 * 60000),
          original_language: 'en',
          original_content: 'Hi, I need help with my order',
          translated_content: {},
          auto_translated: false
        }
      ]
    },
    {
      id: 2,
      customerName: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '(555) 987-6543',
      status: 'waiting',
      lastMessage: '¿Puedes ayudarme con la facturación?',
      timestamp: new Date(Date.now() - 15 * 60000),
      unreadCount: 1,
      priority: 'urgent',
      channel: 'WhatsApp',
      tags: ['VIP', 'Billing'],
      responseTime: 120,
      customerLanguage: 'es',
      agentLanguage: 'en',
      translationEnabled: true,
      messages: [
        { 
          id: 1, 
          sender: 'customer', 
          text: 'Can you help me with billing?', 
          timestamp: new Date(Date.now() - 15 * 60000),
          original_language: 'es',
          original_content: '¿Puedes ayudarme con la facturación?',
          translated_content: { 'en': 'Can you help me with billing?' },
          auto_translated: true,
          translation_confidence: 0.95,
          translation_provider: 'onemeta'
        }
      ]
    },
    {
      id: 3,
      customerName: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '(555) 456-7890',
      status: 'active',
      lastMessage: 'Merci pour votre aide!',
      timestamp: new Date(Date.now() - 2 * 60000),
      unreadCount: 0,
      priority: 'medium',
      channel: 'SMS',
      tags: ['Returns'],
      responseTime: 30,
      customerLanguage: 'fr',
      agentLanguage: 'en',
      translationEnabled: true,
      messages: [
        { 
          id: 1, 
          sender: 'customer', 
          text: 'I have a question about returns', 
          timestamp: new Date(Date.now() - 20 * 60000),
          original_language: 'fr',
          original_content: 'J\'ai une question sur les retours',
          translated_content: { 'en': 'I have a question about returns' },
          auto_translated: true,
          translation_confidence: 0.92,
          translation_provider: 'onemeta'
        },
        { 
          id: 2, 
          sender: 'agent', 
          text: 'Je peux vous aider avec ça. Que souhaitez-vous retourner?', 
          timestamp: new Date(Date.now() - 18 * 60000),
          original_language: 'en',
          original_content: 'I can help you with that. What would you like to return?',
          translated_content: { 'fr': 'Je peux vous aider avec ça. Que souhaitez-vous retourner?' },
          auto_translated: true,
          translation_confidence: 0.94,
          translation_provider: 'onemeta'
        },
        { 
          id: 3, 
          sender: 'customer', 
          text: 'Thank you for your help!', 
          timestamp: new Date(Date.now() - 2 * 60000),
          original_language: 'fr',
          original_content: 'Merci pour votre aide!',
          translated_content: { 'en': 'Thank you for your help!' },
          auto_translated: true,
          translation_confidence: 0.98,
          translation_provider: 'onemeta'
        }
      ]
    },
    {
      id: 4,
      customerName: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      phone: '(555) 321-9876',
      status: 'waiting',
      lastMessage: 'Can you help me with billing?',
      timestamp: new Date(Date.now() - 25 * 60000),
      unreadCount: 3,
      priority: 'urgent',
      channel: 'Facebook',
      tags: ['Billing', 'VIP'],
      responseTime: 180,
      messages: [
        { id: 1, sender: 'customer', text: 'Can you help me with billing?', timestamp: new Date(Date.now() - 25 * 60000) },
        { id: 2, sender: 'customer', text: 'I was charged twice for my order', timestamp: new Date(Date.now() - 23 * 60000) },
        { id: 3, sender: 'customer', text: 'This is urgent, please respond', timestamp: new Date(Date.now() - 20 * 60000) }
      ]
    }
  ]);

  const [selectedChatId, setSelectedChatId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [minimizedChats, setMinimizedChats] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  
  // Multilingual state
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [languageDetectionBanner, setLanguageDetectionBanner] = useState(null);
  const [translatingMessages, setTranslatingMessages] = useState(new Set());
  const [agentLanguage, setAgentLanguage] = useState('en');
  const [recentLanguages, setRecentLanguages] = useState(['es', 'fr', 'de', 'zh']);

  const { sortChatsByPriority, getPriorityStyle } = useChatPriority();
  const { startTimer, stopTimer, formatResponseTime } = useResponseTime();
  const { saveDraft, getDraft, clearDraft } = useDraftMessages();

  const selectedChat = activeChats.find(chat => chat.id === selectedChatId);

  // Quick response templates
  const quickResponses = [
    "Thank you for contacting us. I'll be happy to help you today.",
    "I understand your concern. Let me look into this for you.",
    "I apologize for any inconvenience. Let me resolve this right away.",
    "Is there anything else I can help you with today?",
    "Thank you for your patience. I have the information you need.",
    "I've escalated your issue to our specialist team. You'll hear back within 24 hours."
  ];

  // Keyboard shortcuts
  useKeyboardShortcuts({
    sendMessage: () => handleSendMessage(new Event('submit')),
    switchToChat: (index) => {
      const sortedChats = getSortedAndFilteredChats();
      if (sortedChats[index]) {
        setSelectedChatId(sortedChats[index].id);
      }
    },
    closeCurrentChat: () => selectedChat && closeChat(selectedChat.id)
  });

  // Auto-save drafts
  useEffect(() => {
    if (selectedChat) {
      const draft = getDraft(selectedChat.id);
      if (draft && !newMessage) {
        setNewMessage(draft);
      }
    }
  }, [selectedChatId]);

  useEffect(() => {
    if (selectedChat && newMessage !== getDraft(selectedChat.id)) {
      saveDraft(selectedChat.id, newMessage);
    }
  }, [newMessage, selectedChatId]);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Circle className="w-3 h-3 text-green-500 fill-current" />;
      case 'waiting': return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'inactive': return <Circle className="w-3 h-3 text-gray-400" />;
      default: return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'WhatsApp': return '💬';
      case 'SMS': return '📱';
      case 'Facebook': return '📘';
      case 'Instagram': return '📷';
      case 'Email': return '📧';
      default: return '💻';
    }
  };

  const getSortedAndFilteredChats = () => {
    let filtered = activeChats;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(chat => chat.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by priority and timestamp
    return sortChatsByPriority(filtered);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now(),
      sender: 'agent',
      text: newMessage.trim(),
      timestamp: new Date()
    };

    setActiveChats(chats => 
      chats.map(chat => 
        chat.id === selectedChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, message],
              lastMessage: newMessage.trim(),
              timestamp: new Date(),
              status: 'active'
            }
          : chat
      )
    );

    // Clear draft and reset input
    clearDraft(selectedChatId);
    setNewMessage('');
    
    // Stop response timer
    stopTimer(selectedChatId);
  };

  const handleQuickResponse = (response) => {
    setNewMessage(response);
    setShowQuickResponses(false);
  };

  const toggleMinimizeChat = (chatId) => {
    setMinimizedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chatId)) {
        newSet.delete(chatId);
      } else {
        newSet.add(chatId);
      }
      return newSet;
    });
  };

  const closeChat = (chatId) => {
    setActiveChats(chats => chats.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId && activeChats.length > 1) {
      const remainingChats = activeChats.filter(chat => chat.id !== chatId);
      setSelectedChatId(remainingChats[0]?.id);
    }
  };

  const markAsUrgent = (chatId) => {
    setActiveChats(chats => 
      chats.map(chat => 
        chat.id === chatId ? { ...chat, priority: 'urgent' } : chat
      )
    );
  };

  const assignTag = (chatId, tag) => {
    setActiveChats(chats => 
      chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, tags: [...(chat.tags || []), tag] }
          : chat
      )
    );
  };

  const sortedChats = getSortedAndFilteredChats();

  return (
    <div className="h-full flex bg-gray-50">
      {/* Enhanced Chat List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header with Search and Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Active Chats</h2>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                {sortedChats.length}
              </span>
              <Filter className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {['all', 'active', 'waiting', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {sortedChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedChatId(chat.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm flex items-center space-x-2">
                      <span>{chat.customerName}</span>
                      <span className="text-xs">{getChannelIcon(chat.channel)}</span>
                    </div>
                    <div className="text-xs text-gray-500">{chat.channel}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(chat.status)}
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </span>
                  )}
                  {chat.priority === 'urgent' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              <div className="text-sm text-gray-600 truncate mb-2">
                {chat.lastMessage}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(chat.timestamp)}
                </span>
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={getPriorityStyle(chat.priority)}
                  >
                    {chat.priority}
                  </span>
                  {chat.responseTime > 60 && (
                    <span className="text-xs text-orange-600">
                      {formatResponseTime(chat.responseTime * 1000)}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              {chat.tags && chat.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {chat.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Enhanced Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center space-x-2">
                      <span>{selectedChat.customerName}</span>
                      <span className="text-sm">{getChannelIcon(selectedChat.channel)}</span>
                      {selectedChat.tags?.includes('VIP') && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{selectedChat.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{selectedChat.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(selectedChat.status)}
                        <span className="capitalize">{selectedChat.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => markAsUrgent(selectedChat.id)}
                    className="p-2 hover:bg-gray-100 rounded"
                    title="Mark as Urgent"
                  >
                    <Flag className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => toggleMinimizeChat(selectedChat.id)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Minimize2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => closeChat(selectedChat.id)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {!minimizedChats.has(selectedChat.id) && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'agent'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'agent' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  {/* Quick Responses */}
                  {showQuickResponses && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-2">Quick Responses:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {quickResponses.map((response, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickResponse(response)}
                            className="text-left text-sm p-2 hover:bg-gray-100 rounded border border-gray-200"
                          >
                            {response}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message... (Ctrl+Enter to send)"
                        rows={1}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowQuickResponses(!showQuickResponses)}
                      className={`p-2 hover:bg-gray-100 rounded-lg ${showQuickResponses ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
                      title="Quick Responses"
                    >
                      <Zap className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Keyboard shortcuts: Ctrl+Enter (send), Ctrl+1-9 (switch chats), Esc (close)
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Chat Selected</h3>
              <p className="text-gray-500">Select a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiChatManager;

