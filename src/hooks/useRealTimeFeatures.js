import React, { useState, useEffect } from 'react';

// Real-time queue management hook
export const useQueueMetrics = () => {
  const [metrics, setMetrics] = useState({
    inQueue: 12,
    active: 8,
    inactive: 3,
    agentsAvailable: 5,
    totalChats: 23
  });

  const [chatCount, setChatCount] = useState(7);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        inQueue: Math.max(0, prev.inQueue + Math.floor(Math.random() * 3) - 1),
        active: Math.max(0, prev.active + Math.floor(Math.random() * 3) - 1),
        inactive: Math.max(0, prev.inactive + Math.floor(Math.random() * 2) - 1),
        agentsAvailable: Math.max(1, Math.min(10, prev.agentsAvailable + Math.floor(Math.random() * 3) - 1))
      }));

      setChatCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { metrics, chatCount };
};

// Chat notification management
export const useChatNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (chatId, customerName, message) => {
    const notification = {
      id: Date.now(),
      chatId,
      customerName,
      message,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10

    // Auto-remove after 10 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 10000);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    clearAll,
    unreadCount: notifications.filter(n => !n.read).length
  };
};

// Agent status management
export const useAgentStatus = () => {
  const [status, setStatus] = useState('available'); // available, busy, away, offline
  const [statusDuration, setStatusDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const updateStatus = (newStatus) => {
    setStatus(newStatus);
    setStatusDuration(0);
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    status,
    statusDuration: formatDuration(statusDuration),
    updateStatus,
    isAvailable: status === 'available',
    isBusy: status === 'busy'
  };
};

// Chat priority management
export const useChatPriority = () => {
  const priorityLevels = {
    urgent: { color: 'red', weight: 4, label: 'Urgent' },
    high: { color: 'orange', weight: 3, label: 'High' },
    medium: { color: 'yellow', weight: 2, label: 'Medium' },
    low: { color: 'green', weight: 1, label: 'Low' }
  };

  const sortChatsByPriority = (chats) => {
    return [...chats].sort((a, b) => {
      const aPriority = priorityLevels[a.priority]?.weight || 0;
      const bPriority = priorityLevels[b.priority]?.weight || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      // If same priority, sort by timestamp (oldest first)
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  };

  const getPriorityStyle = (priority) => {
    const level = priorityLevels[priority];
    if (!level) return { color: 'gray', backgroundColor: '#f3f4f6' };
    
    return {
      color: level.color === 'red' ? '#dc2626' : 
             level.color === 'orange' ? '#ea580c' :
             level.color === 'yellow' ? '#ca8a04' : '#16a34a',
      backgroundColor: level.color === 'red' ? '#fef2f2' : 
                      level.color === 'orange' ? '#fff7ed' :
                      level.color === 'yellow' ? '#fefce8' : '#f0fdf4'
    };
  };

  return {
    priorityLevels,
    sortChatsByPriority,
    getPriorityStyle
  };
};

// Response time tracking
export const useResponseTime = () => {
  const [responseTimes, setResponseTimes] = useState({});

  const startTimer = (chatId) => {
    setResponseTimes(prev => ({
      ...prev,
      [chatId]: {
        startTime: Date.now(),
        isActive: true
      }
    }));
  };

  const stopTimer = (chatId) => {
    setResponseTimes(prev => {
      const timer = prev[chatId];
      if (!timer || !timer.isActive) return prev;

      const responseTime = Date.now() - timer.startTime;
      return {
        ...prev,
        [chatId]: {
          ...timer,
          isActive: false,
          lastResponseTime: responseTime,
          averageResponseTime: timer.averageResponseTime 
            ? (timer.averageResponseTime + responseTime) / 2 
            : responseTime
        }
      };
    });
  };

  const getAverageResponseTime = (chatId) => {
    const timer = responseTimes[chatId];
    return timer?.averageResponseTime || 0;
  };

  const formatResponseTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  return {
    startTimer,
    stopTimer,
    getAverageResponseTime,
    formatResponseTime,
    responseTimes
  };
};

// Keyboard shortcuts for agent productivity
export const useKeyboardShortcuts = (callbacks) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Enter to send message
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        callbacks.sendMessage?.();
      }
      
      // Ctrl/Cmd + 1-9 to switch between chats
      if ((event.ctrlKey || event.metaKey) && /^[1-9]$/.test(event.key)) {
        event.preventDefault();
        const chatIndex = parseInt(event.key) - 1;
        callbacks.switchToChat?.(chatIndex);
      }
      
      // Ctrl/Cmd + Shift + A to set status to available
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        callbacks.setStatusAvailable?.();
      }
      
      // Ctrl/Cmd + Shift + B to set status to busy
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
        event.preventDefault();
        callbacks.setStatusBusy?.();
      }
      
      // Escape to close current chat
      if (event.key === 'Escape') {
        event.preventDefault();
        callbacks.closeCurrentChat?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
};

// Auto-save draft messages
export const useDraftMessages = () => {
  const [drafts, setDrafts] = useState({});

  const saveDraft = (chatId, message) => {
    if (message.trim()) {
      setDrafts(prev => ({
        ...prev,
        [chatId]: message
      }));
      
      // Save to localStorage for persistence
      localStorage.setItem(`chat_draft_${chatId}`, message);
    } else {
      clearDraft(chatId);
    }
  };

  const getDraft = (chatId) => {
    // Try memory first, then localStorage
    return drafts[chatId] || localStorage.getItem(`chat_draft_${chatId}`) || '';
  };

  const clearDraft = (chatId) => {
    setDrafts(prev => {
      const newDrafts = { ...prev };
      delete newDrafts[chatId];
      return newDrafts;
    });
    localStorage.removeItem(`chat_draft_${chatId}`);
  };

  return {
    saveDraft,
    getDraft,
    clearDraft,
    hasDraft: (chatId) => Boolean(getDraft(chatId))
  };
};

export default {
  useQueueMetrics,
  useChatNotifications,
  useAgentStatus,
  useChatPriority,
  useResponseTime,
  useKeyboardShortcuts,
  useDraftMessages
};

