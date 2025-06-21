import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Users,
  Clock,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  MoreHorizontal,
  Settings
} from 'lucide-react';

const SLAScrollingCards = () => {
  const [isDesignerMode, setIsDesignerMode] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState({
    slaHeader: { visible: true, collapsed: false },
    routeStatus: { visible: true, collapsed: false },
    slaCards: { visible: true, collapsed: false }
  });

  // Mock SLA data for scrolling cards
  const slaMetrics = [
    { type: 'Voice', value: '2m 15s', label: 'Avg Wait', status: 'good', trend: 'down' },
    { type: 'Chat', value: '45s', label: 'Response', status: 'good', trend: 'up' },
    { type: 'Email', value: '4h 20m', label: 'Resolution', status: 'warning', trend: 'down' },
    { type: 'Tickets', value: '92%', label: 'SLA Met', status: 'good', trend: 'up' },
    { type: 'Calls', value: '98.5%', label: 'Answered', status: 'good', trend: 'up' },
    { type: 'Queue', value: '1m 30s', label: 'Hold Time', status: 'warning', trend: 'down' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll SLA cards
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slaMetrics.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused, slaMetrics.length]);

  const toggleDesignerMode = () => {
    setIsDesignerMode(!isDesignerMode);
  };

  const togglePanelVisibility = (panelKey) => {
    setLayoutConfig(prev => ({
      ...prev,
      [panelKey]: {
        ...prev[panelKey],
        collapsed: !prev[panelKey].collapsed
      }
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // DIRECT INLINE STYLE APPROACH FOR SCROLLING
  const getScrollTransform = () => {
    const cardHeight = 78; // Height of each card + gap
    return {
      transform: `translateY(-${currentIndex * cardHeight}px)`,
      transition: 'transform 0.5s ease'
    };
  };

  const DraggablePanel = ({ children, title, panelKey, className = "" }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
      if (!isDesignerMode) return;
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !isDesignerMode) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging]);

    return (
      <div 
        className={`${className} ${isDesignerMode ? 'designer-panel' : ''} ${isDragging ? 'dragging' : ''}`}
        style={isDesignerMode ? { transform: `translate(${position.x}px, ${position.y}px)` } : {}}
      >
        {isDesignerMode && (
          <div className="panel-header">
            <div className="drag-handle" onMouseDown={handleMouseDown}>
              <MoreHorizontal className="w-3 h-3" />
              <span className="panel-title">{title}</span>
            </div>
            <div className="panel-controls">
              <button 
                className="panel-control-btn"
                onClick={() => togglePanelVisibility(panelKey)}
              >
                {layoutConfig[panelKey]?.collapsed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}
        <div className={`panel-content ${layoutConfig[panelKey]?.collapsed ? 'hidden' : ''}`}>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="customizable-workspace">
      {/* SLA Header Panel */}
      <DraggablePanel title="SLA Header" panelKey="slaHeader" className="sla-header-panel">
        <div className="sla-scrolling-container">
          {/* Voice SLA Metrics */}
          <div className="sla-channel-section">
            <div className="sla-channel-header">
              <div className="sla-channel-title">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="sla-channel-name">Voice</span>
                <span className="sla-channel-subtitle">SLA Metrics</span>
              </div>
              <div className="sla-status-indicators">
                <div className="sla-status-item good">
                  <div className="status-dot"></div>
                  <span>On Track</span>
                </div>
                <div className="sla-status-item warning">
                  <div className="status-dot"></div>
                  <span>At Risk</span>
                </div>
                <div className="sla-status-item critical">
                  <div className="status-dot"></div>
                  <span>Breached</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Status */}
          <div className="route-status-section">
            <h3 className="route-status-title">Route Status</h3>
            <div className="route-status-grid">
              <div className="route-status-card">
                <div className="status-icon">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="route-status-number">12</div>
                <div className="route-status-label">In Queue</div>
              </div>
              <div className="route-status-card">
                <div className="status-icon">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <div className="route-status-number green">8</div>
                <div className="route-status-label">Active</div>
              </div>
              <div className="route-status-card">
                <div className="status-icon">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="route-status-number gray">3</div>
                <div className="route-status-label">Inactive</div>
              </div>
              <div className="route-status-card">
                <div className="status-icon">
                  <UserCheck className="w-4 h-4 text-green-600" />
                </div>
                <div className="route-status-number green">5</div>
                <div className="route-status-label">Agents Available</div>
              </div>
            </div>
          </div>

          {/* FIXED: Scrolling SLA Cards with INLINE STYLES */}
          <div className="sla-cards-section">
            <div 
              className="sla-cards-container"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                position: 'relative',
                width: '220px',
                height: '120px',
                overflow: 'hidden',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              <div 
                className="sla-cards-track"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  ...getScrollTransform() // DIRECT INLINE TRANSFORM
                }}
              >
                {slaMetrics.map((metric, index) => (
                  <div 
                    key={index} 
                    className={`sla-metric-card ${getStatusColor(metric.status)}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'white',
                      border: index === currentIndex ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      minHeight: '70px',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                      opacity: index === currentIndex ? 1 : 0.7,
                      transform: index === currentIndex ? 'scale(1)' : 'scale(0.95)',
                      borderLeft: metric.status === 'good' ? '3px solid #059669' : 
                                 metric.status === 'warning' ? '3px solid #d97706' : '3px solid #dc2626'
                    }}
                  >
                    <div className="sla-card-header">
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {metric.type}
                      </div>
                      <div className="sla-trend">
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                      </div>
                    </div>
                    <div className="sla-card-content" style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                        {metric.value}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {metric.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                className="sla-cards-indicators"
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginTop: '8px',
                  justifyContent: 'center'
                }}
              >
                {slaMetrics.map((_, index) => (
                  <div 
                    key={index} 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: index === currentIndex ? '#3b82f6' : '#cbd5e1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
                    }}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DraggablePanel>

      {/* Rest of component remains the same... */}
      <div className="ikunnect-chat-container-with-language">
        {/* Call Controls Panel */}
        <DraggablePanel title="Call Controls" panelKey="callControls" className="ikunnect-conversation-list">
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

          <div className="call-controls-grid">
            <button className="control-btn">
              <Phone className="w-4 h-4" />
              <span>Hold</span>
            </button>
            <button className="control-btn">
              <PhoneCall className="w-4 h-4" />
              <span>Transfer</span>
            </button>
            <button className="control-btn">
              <Users className="w-4 h-4" />
              <span>3-way call</span>
            </button>
            <button className="control-btn">
              <Eye className="w-4 h-4" />
              <span>Lookup</span>
            </button>
            <button className="control-btn">
              <Settings className="w-4 h-4" />
              <span>Keypad</span>
            </button>
            <button className="control-btn">
              <Mic className="w-4 h-4" />
              <span>Record</span>
            </button>
          </div>

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

        {/* Customer Information Panel */}
        <DraggablePanel title="Customer Information" panelKey="customerInfo" className="ikunnect-main-chat-area">
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
                <input type="text" value="87394870" readOnly />
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
                <input type="text" value="5000001" />
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

        {/* Language Intelligence Panel */}
        <DraggablePanel title="Language Intelligence" panelKey="languagePanel" className="ikunnect-language-panel">
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
            <h4 className="section-title">Agent Native Input</h4>
            <div className="input-container">
              <textarea 
                placeholder="Type a message"
                className="agent-input"
                rows="3"
              ></textarea>
              <div className="input-actions">
                <button className="input-action-btn">
                  <Mic className="w-4 h-4" />
                </button>
                <button className="input-action-btn">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="transcripts-section">
            <div className="section-header">
              <h4 className="section-title">Agent transcripts</h4>
              <button className="section-action">
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <div className="transcripts-content">
              {/* Transcripts content would go here */}
            </div>
          </div>
        </DraggablePanel>
      </div>
    </div>
  );
};

export default SLAScrollingCards;

