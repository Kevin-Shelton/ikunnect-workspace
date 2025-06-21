import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LayoutDashboard, 
  Phone, 
  MessageSquare, 
  Ticket, 
  Menu,
  PhoneCall,
  PhoneForwarded,
  Users,
  Search,
  Keyboard,
  RotateCcw,
  Volume2,
  Mic,
  Settings,
  HelpCircle,
  User,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  GripVertical,
  Eye,
  EyeOff,
  ChevronLeft,
  Move
} from 'lucide-react';
import MultiChatManager from './MultiChatManager.jsx';
import ModernDashboard from './ModernDashboard.jsx';
import TicketingSystem from './TicketingSystem.jsx';
import SLAScrollingCards from './SLAScrollingCards.jsx';
import PersistentCallHeader from './PersistentCallHeader.jsx';
import { useQueueMetrics } from '../hooks/useRealTimeFeatures.js';
import '../App.css';

// Layout Context for managing panel states
const LayoutContext = React.createContext();

// Custom hook for layout management
const useLayout = () => {
  const [layout, setLayout] = useState(() => {
    // Load saved layout from localStorage or use default
    const saved = localStorage.getItem('ikunnect-workspace-layout');
    return saved ? JSON.parse(saved) : {
      panels: {
        sidebar: { visible: true, collapsed: false, order: 1, position: { x: 0, y: 0 } },
        slaHeader: { visible: true, collapsed: false, order: 2, position: { x: 0, y: 0 } },
        callControls: { visible: true, collapsed: false, order: 3, position: { x: 0, y: 0 } },
        customerInfo: { visible: true, collapsed: false, order: 4, position: { x: 0, y: 0 } },
        languagePanel: { visible: true, collapsed: false, order: 5, position: { x: 0, y: 0 } },
        chatArea: { visible: true, collapsed: false, order: 6, position: { x: 0, y: 0 } }
      },
      mode: 'normal' // normal, designer
    };
  });

  const updateLayout = useCallback((newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('ikunnect-workspace-layout', JSON.stringify(newLayout));
  }, []);

  const togglePanel = useCallback((panelId) => {
    setLayout(prev => ({
      ...prev,
      panels: {
        ...prev.panels,
        [panelId]: {
          ...prev.panels[panelId],
          visible: !prev.panels[panelId].visible
        }
      }
    }));
  }, []);

  const collapsePanel = useCallback((panelId) => {
    setLayout(prev => ({
      ...prev,
      panels: {
        ...prev.panels,
        [panelId]: {
          ...prev.panels[panelId],
          collapsed: !prev.panels[panelId].collapsed
        }
      }
    }));
  }, []);

  const resetLayout = useCallback(() => {
    const defaultLayout = {
      panels: {
        sidebar: { visible: true, collapsed: false, order: 1, position: { x: 0, y: 0 } },
        slaHeader: { visible: true, collapsed: false, order: 2, position: { x: 0, y: 0 } },
        callControls: { visible: true, collapsed: false, order: 3, position: { x: 0, y: 0 } },
        customerInfo: { visible: true, collapsed: false, order: 4, position: { x: 0, y: 0 } },
        languagePanel: { visible: true, collapsed: false, order: 5, position: { x: 0, y: 0 } },
        chatArea: { visible: true, collapsed: false, order: 6, position: { x: 0, y: 0 } }
      },
      mode: 'normal'
    };
    updateLayout(defaultLayout);
  }, [updateLayout]);

  const toggleDesignerMode = useCallback(() => {
    setLayout(prev => ({
      ...prev,
      mode: prev.mode === 'normal' ? 'designer' : 'normal'
    }));
  }, []);

  return {
    layout,
    updateLayout,
    togglePanel,
    collapsePanel,
    resetLayout,
    toggleDesignerMode
  };
};

// Draggable Panel Component
const DraggablePanel = ({ id, title, children, className = "" }) => {
  const context = React.useContext(LayoutContext);
  
  // Fallback if context is not available
  if (!context) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  const { layout, updateLayout, collapsePanel } = context;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  const isDesignerMode = layout.mode === 'designer';
  const panelState = layout.panels[id] || { visible: true, collapsed: false, position: { x: 0, y: 0 } };

  const handleMouseDown = useCallback((e) => {
    if (!isDesignerMode) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (panelState.position?.x || 0),
      y: e.clientY - (panelState.position?.y || 0)
    });
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDesignerMode, panelState.position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    updateLayout(prev => ({
      ...prev,
      panels: {
        ...prev.panels,
        [id]: {
          ...prev.panels[id],
          position: newPosition
        }
      }
    }));
  }, [isDragging, dragStart, id, updateLayout]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  if (!panelState.visible) return null;

  const panelStyle = isDesignerMode && panelState.position ? {
    transform: `translate(${panelState.position.x}px, ${panelState.position.y}px)`,
    position: 'relative',
    zIndex: isDragging ? 1000 : 'auto'
  } : {};

  return (
    <div 
      ref={panelRef}
      className={`${className} ${isDesignerMode ? 'designer-panel' : ''} ${isDragging ? 'dragging' : ''}`}
      style={panelStyle}
    >
      {isDesignerMode && (
        <div className="panel-header">
          <div 
            className="drag-handle"
            onMouseDown={handleMouseDown}
            style={{ cursor: 'grab' }}
          >
            <GripVertical className="w-3 h-3" />
            <span className="panel-title">{title}</span>
          </div>
          <div className="panel-controls">
            <button 
              className="panel-control-btn"
              onClick={() => collapsePanel(id)}
              title={panelState.collapsed ? "Expand panel" : "Collapse panel"}
            >
              {panelState.collapsed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
          </div>
        </div>
      )}
      <div className={`panel-content ${panelState.collapsed ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

const IKunnectWorkspace = () => {
  const [activeTab, setActiveTab] = useState('calls');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const layoutManager = useLayout();
  const { layout, toggleDesignerMode, resetLayout } = layoutManager;

  const isDesignerMode = layout.mode === 'designer';

  // Simulate call state - randomly start a call for demo purposes
  useEffect(() => {
    // Randomly activate a call after 2-5 seconds for demo
    const timeout = setTimeout(() => {
      setIsCallActive(true);
    }, Math.random() * 3000 + 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calls', label: 'Calls', icon: Phone },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: 4 },
    { id: 'tickets', label: 'Tickets', icon: Ticket }
  ];

  // Call control buttons
  const callControls = [
    { id: 'hold', label: 'Hold', icon: PhoneCall },
    { id: 'transfer', label: 'Transfer', icon: PhoneForwarded },
    { id: 'threeway', label: '3-way call', icon: Users },
    { id: 'lookup', label: 'Lookup', icon: Search },
    { id: 'keypad', label: 'Keypad', icon: Keyboard },
    { id: 'record', label: 'Record', icon: Mic }
  ];

  const handleReturnToCall = () => {
    setActiveTab('calls');
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Optionally reset call data or perform cleanup
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <ModernDashboard />;
    }

    if (activeTab === 'chat') {
      return <MultiChatManager />;
    }

    if (activeTab === 'tickets') {
      return <TicketingSystem />;
    }

    if (activeTab === 'calls') {
      return (
        <LayoutContext.Provider value={layoutManager}>
          <div className={`ikunnect-workspace ${isDesignerMode ? 'designer-mode' : ''}`}>
            {/* Designer Mode Instructions */}
            {isDesignerMode && (
              <div className="designer-instructions">
                <div className="designer-help-text">
                  <strong>Designer Mode:</strong> Drag panels using the grip handles • Click eye icons to collapse panels • Use Reset to restore defaults
                </div>
              </div>
            )}

            {/* SLA Header */}
            <DraggablePanel 
              id="slaHeader" 
              title="SLA Metrics"
              className="sla-header-panel"
            >
              <SLAScrollingCards activeChannel="voice" sidebarCollapsed={sidebarCollapsed} />
            </DraggablePanel>

            {/* Main Content Area */}
            <div className="ikunnect-chat-container-with-language">
              {/* Left Panel - Call Controls */}
              <DraggablePanel 
                id="callControls" 
                title="Call Controls"
                className="ikunnect-conversation-list"
              >
                <div className="call-controls-header">
                  <div className="route-info">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="route-title">Inbound Route</div>
                      <div className="route-subtitle">Voice - Luxury Hold...</div>
                    </div>
                  </div>
                  <div className="call-timer">
                    <div className="timer-display">00:01:45</div>
                    <div className="caller-number">(406) 555-0120</div>
                  </div>
                </div>

                {/* Call Control Buttons */}
                <div className="call-controls-grid">
                  {callControls.map((control) => {
                    const IconComponent = control.icon;
                    return (
                      <button key={control.id} className="control-btn">
                        <IconComponent className="w-4 h-4" />
                        <span>{control.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Audio Controls */}
                <div className="audio-controls">
                  <button className="audio-btn">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button className="audio-btn primary">
                    <PhoneCall className="w-5 h-5" />
                  </button>
                  <button className="audio-btn">
                    <Mic className="w-5 h-5" />
                  </button>
                </div>

                {/* Disposition Section */}
                <div className="disposition-section">
                  <h4 className="disposition-title">DISPOSITION</h4>
                  <label className="disposition-label">Disposition Code</label>
                  <select className="disposition-select">
                    <option>Not Answered</option>
                    <option>Completed</option>
                    <option>Transferred</option>
                    <option>Voicemail</option>
                  </select>
                  <button className="update-btn">Update</button>
                </div>
              </DraggablePanel>

              {/* Center Panel - Customer Information */}
              <DraggablePanel 
                id="customerInfo" 
                title="Customer Information"
                className="ikunnect-main-chat-area"
              >
                <div className="customer-header">
                  <div className="customer-avatar">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="customer-details">
                    <h3 className="customer-name">Abrielle Leblanc</h3>
                    <div className="customer-contact">
                      <span>abrielleblanc@gmail.com</span>
                      <span>(406) 555-0120</span>
                    </div>
                  </div>
                </div>

                <div className="customer-tabs">
                  <button className="tab active">Sales</button>
                  <button className="tab">Return</button>
                  <button className="tab">Project Management</button>
                  <button className="tab">History</button>
                </div>

                <div className="customer-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Caller ID</label>
                      <input type="text" defaultValue="87394870" readOnly />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Address 1</label>
                      <input type="text" placeholder="Address line 1" />
                    </div>
                    <div className="form-group">
                      <label>Address 2</label>
                      <input type="text" placeholder="Address line 2" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" placeholder="City" />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" placeholder="State" />
                    </div>
                    <div className="form-group">
                      <label>Zip Code</label>
                      <input type="text" defaultValue="5000001" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea placeholder="Notes" rows="4"></textarea>
                  </div>

                  <div className="form-footer">
                    <span className="character-count">31 / 50</span>
                  </div>
                </div>
              </DraggablePanel>

              {/* Right Panel - Language Intelligence */}
              <DraggablePanel 
                id="languagePanel" 
                title="Language Intelligence"
                className="ikunnect-language-panel"
              >
                <div className="language-header">
                  <h3 className="language-title">Language Intelligence</h3>
                  <div className="language-controls">
                    <button className="language-btn">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="language-btn">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="participants-section">
                  <div className="participant">
                    <div className="participant-avatar orange">OG</div>
                    <div className="participant-info">
                      <div className="participant-name">Orville George</div>
                      <div className="participant-details">Lorem ipsum is a dummy or placeholder...</div>
                      <div className="participant-status">ACTIVE</div>
                    </div>
                  </div>
                  <div className="participant">
                    <div className="participant-avatar blue">JD</div>
                    <div className="participant-info">
                      <div className="participant-name">John Doe</div>
                      <div className="participant-details">Lorem ipsum is a dummy or placeholder...</div>
                    </div>
                  </div>
                </div>

                <div className="agent-input-section">
                  <h4 className="input-title">Agent Native Input</h4>
                  <div className="input-container">
                    <input 
                      type="text" 
                      placeholder="Type a message"
                      className="agent-input"
                    />
                    <div className="input-controls">
                      <button className="input-btn">
                        <Mic className="w-4 h-4" />
                      </button>
                      <button className="input-btn">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="transcripts-section">
                  <div className="transcripts-header">
                    <h4 className="transcripts-title">Agent transcripts</h4>
                    <button className="transcripts-btn">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </DraggablePanel>
            </div>
          </div>
        </LayoutContext.Provider>
      );
    }

    return null;
  };

  return (
    <div className="ikunnect-main-layout">
      {/* Persistent Call Header - Shows on all pages when call is active */}
      <PersistentCallHeader 
        isCallActive={isCallActive}
        onReturnToCall={handleReturnToCall}
        onEndCall={handleEndCall}
      />

      {/* Sidebar */}
      <div className={`ikunnect-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isCallActive ? 'with-call-header' : ''}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </div>
        
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">iK</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-lg font-bold text-gray-900">iKunnect</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`ikunnect-nav-item w-full ${activeTab === item.id ? 'active' : ''}`}
                >
                  <div className="relative">
                    <IconComponent className="w-5 h-5" />
                    {item.badge && item.badge > 0 && (
                      <span className="ikunnect-chat-counter">{item.badge}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
            
            {/* Customize Layout Button - Only show on Calls page */}
            {activeTab === 'calls' && (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <button
                  onClick={toggleDesignerMode}
                  className={`ikunnect-nav-item w-full customize-layout-btn ${isDesignerMode ? 'active' : ''}`}
                  title={isDesignerMode ? 'Exit customization mode' : 'Customize workspace layout'}
                >
                  <div className="relative">
                    <Move className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <span>{isDesignerMode ? 'Exit' : 'Customize'}</span>
                  )}
                </button>
                
                {/* Reset Button - Only show in designer mode */}
                {isDesignerMode && !sidebarCollapsed && (
                  <button
                    onClick={resetLayout}
                    className="ikunnect-nav-item w-full reset-layout-btn"
                    title="Reset layout to defaults"
                  >
                    <div className="relative">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <span>Reset</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <div className="text-sm font-medium text-gray-900">John Smith</div>
                <div className="text-xs text-gray-600">Agent</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`ikunnect-main-content ${isCallActive ? 'with-call-header' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default IKunnectWorkspace;

