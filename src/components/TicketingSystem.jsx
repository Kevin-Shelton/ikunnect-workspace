import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Phone,
  Mail,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  Trash2,
  Send,
  Paperclip,
  Star,
  Flag,
  Users,
  TrendingUp,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const ModernTicketingSystem = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // Mock ticket data with realistic content
  const tickets = [
    {
      id: 'TKT-001',
      title: 'Login Issues - Customer Cannot Access Account',
      description: 'Customer reports being unable to log into their account despite correct credentials. Error message appears: "Invalid username or password" even with correct information.',
      category: 'Technical Support',
      priority: 'High',
      status: 'Open',
      assignee: 'John Smith',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567'
      },
      created: '2025-06-18T10:30:00Z',
      updated: '2025-06-18T14:15:00Z',
      dueDate: '2025-06-19T17:00:00Z',
      tags: ['login', 'authentication', 'urgent'],
      comments: 3,
      satisfaction: null
    },
    {
      id: 'TKT-002',
      title: 'Billing Inquiry - Incorrect Charge',
      description: 'Customer disputes a charge on their monthly bill. Claims they were charged for premium features they never activated.',
      category: 'Billing',
      priority: 'Medium',
      status: 'In Progress',
      assignee: 'Sarah Johnson',
      customer: {
        name: 'Mike Wilson',
        email: 'mike.wilson@email.com',
        phone: '+1 (555) 234-5678'
      },
      created: '2025-06-18T04:15:00Z',
      updated: '2025-06-18T11:30:00Z',
      dueDate: '2025-06-20T17:00:00Z',
      tags: ['billing', 'dispute', 'premium'],
      comments: 5,
      satisfaction: null
    },
    {
      id: 'TKT-003',
      title: 'Feature Request - Mobile App Enhancement',
      description: 'Customer suggests adding dark mode to the mobile application for better user experience during night usage.',
      category: 'Feature Request',
      priority: 'Low',
      status: 'Open',
      assignee: 'Mike Wilson',
      customer: {
        name: 'Lisa Brown',
        email: 'lisa.brown@email.com',
        phone: '+1 (555) 345-6789'
      },
      created: '2025-06-17T11:20:00Z',
      updated: '2025-06-17T11:20:00Z',
      dueDate: '2025-06-24T17:00:00Z',
      tags: ['enhancement', 'mobile', 'ui'],
      comments: 1,
      satisfaction: 5
    },
    {
      id: 'TKT-004',
      title: 'Order Issue - Missing Items',
      description: 'Customer received incomplete order, missing 2 items from their purchase. Order #12345 was supposed to include 5 items but only 3 were delivered.',
      category: 'Order Management',
      priority: 'High',
      status: 'Resolved',
      assignee: 'Lisa Brown',
      customer: {
        name: 'David Chen',
        email: 'david.chen@email.com',
        phone: '+1 (555) 456-7890'
      },
      created: '2025-06-17T09:00:00Z',
      updated: '2025-06-18T16:45:00Z',
      dueDate: '2025-06-18T17:00:00Z',
      tags: ['order', 'shipping', 'missing'],
      comments: 8,
      satisfaction: 4
    }
  ];

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    overdue: tickets.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Resolved').length
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = activeFilter === 'all' || 
      ticket.status.toLowerCase().replace(' ', '-') === activeFilter ||
      (activeFilter === 'overdue' && new Date(ticket.dueDate) < new Date() && ticket.status !== 'Resolved');
    
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status !== 'Resolved';
  };

  return (
    <div className="modern-ticketing">
      {/* Header */}
      <div className="tickets-header">
        <div className="tickets-header-content">
          <div>
            <h1 className="tickets-title">Support Tickets</h1>
            <p className="tickets-subtitle">Manage and track customer support requests</p>
          </div>
          <div className="tickets-actions">
            <button className="btn btn-secondary">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="btn btn-secondary">
              <Users className="w-4 h-4" />
              Assign
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewTicketModal(true)}
            >
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="tickets-controls">
          <div className="search-container">
            <Search className="search-icon w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="control-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="created">Sort by Created</option>
              <option value="updated">Sort by Updated</option>
              <option value="priority">Sort by Priority</option>
              <option value="status">Sort by Status</option>
            </select>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Tickets', count: ticketStats.total },
            { key: 'open', label: 'Open', count: ticketStats.open },
            { key: 'in-progress', label: 'In Progress', count: ticketStats.inProgress },
            { key: 'resolved', label: 'Resolved', count: ticketStats.resolved },
            { key: 'overdue', label: 'Overdue', count: ticketStats.overdue }
          ].map(filter => (
            <button
              key={filter.key}
              className={`filter-tab ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
              <span className="filter-count">{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="tickets-stats">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{ticketStats.total}</div>
            <div className="stat-label">Total Tickets</div>
          </div>
        </div>
        
        <div className="stat-card stat-open">
          <div className="stat-icon">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{ticketStats.open}</div>
            <div className="stat-label">Open</div>
          </div>
        </div>
        
        <div className="stat-card stat-progress">
          <div className="stat-icon">
            <Clock className="w-5 h-5" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{ticketStats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        
        <div className="stat-card stat-resolved">
          <div className="stat-icon">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{ticketStats.resolved}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>
        
        {ticketStats.overdue > 0 && (
          <div className="stat-card stat-overdue">
            <div className="stat-icon">
              <Flag className="w-5 h-5" />
            </div>
            <div className="stat-content">
              <div className="stat-number">{ticketStats.overdue}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        )}
      </div>

      {/* Tickets Grid/List */}
      <div className="tickets-content">
        <div className={`tickets-container ${viewMode}`}>
          {filteredTickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className={`ticket-card ${selectedTicket?.id === ticket.id ? 'selected' : ''} ${isOverdue(ticket.dueDate, ticket.status) ? 'overdue' : ''}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="ticket-header">
                <div className="ticket-id-section">
                  <span className="ticket-id">{ticket.id}</span>
                  {isOverdue(ticket.dueDate, ticket.status) && (
                    <Flag className="w-3 h-3 text-red-500" />
                  )}
                </div>
                <div className="ticket-badges">
                  <span className={`badge priority ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`badge status ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <div className="ticket-content">
                <h3 className="ticket-title">{ticket.title}</h3>
                <p className="ticket-description">{ticket.description}</p>
                
                <div className="ticket-tags">
                  {ticket.tags.map((tag, index) => (
                    <span key={index} className="ticket-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ticket-footer">
                <div className="ticket-customer">
                  <User className="w-4 h-4" />
                  <span>{ticket.customer.name}</span>
                </div>
                
                <div className="ticket-meta">
                  <div className="ticket-assignee">
                    <span>Assigned to {ticket.assignee}</span>
                  </div>
                  <div className="ticket-time">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(ticket.updated)}</span>
                  </div>
                </div>
              </div>

              <div className="ticket-actions">
                <div className="action-group">
                  <button className="action-btn">
                    <MessageSquare className="w-4 h-4" />
                    <span>{ticket.comments}</span>
                  </button>
                  {ticket.satisfaction && (
                    <div className="satisfaction">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{ticket.satisfaction}/5</span>
                    </div>
                  )}
                </div>
                <button className="action-btn more">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="empty-state">
            <Ticket className="w-16 h-16 text-gray-300" />
            <h3 className="empty-title">No tickets found</h3>
            <p className="empty-description">
              {searchTerm ? 'Try adjusting your search terms' : 'No tickets match the current filter'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTicketingSystem;

