import React, { useState } from 'react';

const ModernDashboard = () => {
  const [filters, setFilters] = useState({
    division: 'all',
    channel: 'all',
    campaign: 'all',
    agent: 'all'
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      division: 'all',
      channel: 'all',
      campaign: 'all',
      agent: 'all'
    });
  };

  const filterOptions = {
    division: [
      { value: 'all', label: 'All Divisions' },
      { value: 'sales', label: 'Sales' },
      { value: 'support', label: 'Support' },
      { value: 'billing', label: 'Billing' },
      { value: 'technical', label: 'Technical' }
    ],
    channel: [
      { value: 'all', label: 'All Channels' },
      { value: 'voice', label: 'Voice' },
      { value: 'chat', label: 'Chat' },
      { value: 'email', label: 'Email' },
      { value: 'social', label: 'Social Media' }
    ],
    campaign: [
      { value: 'all', label: 'All Campaigns' },
      { value: 'summer2024', label: 'Summer 2024' },
      { value: 'blackfriday', label: 'Black Friday' },
      { value: 'newcustomer', label: 'New Customer' },
      { value: 'retention', label: 'Retention' }
    ],
    agent: [
      { value: 'all', label: 'All Agents' },
      { value: 'john', label: 'John Smith' },
      { value: 'sarah', label: 'Sarah Johnson' },
      { value: 'mike', label: 'Mike Wilson' },
      { value: 'emma', label: 'Emma Davis' }
    ]
  };

  const kpiData = [
    {
      title: 'Total Calls',
      value: 1247,
      target: 1200,
      trend: '+12%',
      trendUp: true,
      icon: '📞',
      color: 'blue'
    },
    {
      title: 'Avg Handle Time',
      value: '4:32',
      target: '5:00',
      trend: '-8%',
      trendUp: true,
      icon: '⏱️',
      color: 'green'
    },
    {
      title: 'First Call Resolution',
      value: '87%',
      target: '85%',
      trend: '+3%',
      trendUp: true,
      icon: '✅',
      color: 'green'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.8',
      target: '4.5',
      trend: '+0.2',
      trendUp: true,
      icon: '⭐',
      color: 'yellow'
    },
    {
      title: 'Queue Wait Time',
      value: '1:23',
      target: '2:00',
      trend: '-15%',
      trendUp: true,
      icon: '⏳',
      color: 'blue'
    },
    {
      title: 'Response Time',
      value: '0:45',
      target: '1:00',
      trend: '-12%',
      trendUp: true,
      icon: '⚡',
      color: 'green'
    }
  ];

  // Inline styles to ensure they work
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      backgroundColor: '#f8fafc'
    },
    filterSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    },
    filterHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      paddingBottom: '6px',
      borderBottom: '1px solid #f3f4f6'
    },
    filterTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      margin: '0'
    },
    clearBtn: {
      backgroundColor: '#f3f4f6',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: '500',
      color: '#374151',
      cursor: 'pointer'
    },
    filterGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '12px',
      alignItems: 'end'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px'
    },
    filterLabel: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '2px'
    },
    filterSelect: {
      backgroundColor: 'white',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      padding: '6px 8px',
      fontSize: '12px',
      color: '#111827',
      cursor: 'pointer'
    },
    kpiSection: {
      marginBottom: '20px'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px'
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginBottom: '20px'
    },
    kpiCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '14px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s ease'
    },
    kpiHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    },
    kpiIcon: {
      fontSize: '16px',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      borderRadius: '6px'
    },
    kpiTrend: {
      fontSize: '10px',
      fontWeight: '600',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    kpiValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827',
      lineHeight: '1.2',
      marginBottom: '2px'
    },
    kpiTitle: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '2px'
    },
    kpiTarget: {
      fontSize: '10px',
      color: '#9ca3af'
    },
    performanceSection: {
      marginTop: '20px'
    },
    performanceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%'
    },
    performanceCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      height: 'fit-content'
    },
    cardTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '12px'
    },
    channelList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    channelItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 0'
    },
    channelDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      flexShrink: 0
    },
    channelName: {
      flex: 1,
      fontSize: '12px',
      color: '#374151',
      fontWeight: '500'
    },
    channelPercentage: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#111827'
    },
    agentList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    agentItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 0'
    },
    agentAvatar: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      backgroundColor: '#3b82f6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: '600',
      flexShrink: 0
    },
    agentInfo: {
      flex: 1
    },
    agentName: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#111827',
      marginBottom: '1px'
    },
    agentStats: {
      fontSize: '10px',
      color: '#6b7280'
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 0'
    },
    activityIcon: {
      fontSize: '12px',
      width: '16px',
      textAlign: 'center',
      flexShrink: 0
    },
    activityText: {
      flex: 1,
      fontSize: '11px',
      color: '#374151'
    },
    activityTime: {
      fontSize: '10px',
      color: '#9ca3af',
      flexShrink: 0
    }
  };

  return (
    <div style={styles.container}>
      {/* Compact Professional Filter Bar */}
      <div style={styles.filterSection}>
        <div style={styles.filterHeader}>
          <h2 style={styles.filterTitle}>Filters</h2>
          <button 
            style={styles.clearBtn}
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        </div>
        
        <div style={styles.filterGrid}>
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType} style={styles.filterGroup}>
              <label style={styles.filterLabel}>
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </label>
              <select
                style={styles.filterSelect}
                value={filters[filterType]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={styles.kpiSection}>
        <h2 style={styles.sectionTitle}>Key Performance Indicators</h2>
        <div style={styles.kpiGrid}>
          {kpiData.map((kpi, index) => (
            <div key={index} style={styles.kpiCard}>
              <div style={styles.kpiHeader}>
                <span style={styles.kpiIcon}>{kpi.icon}</span>
                <span style={styles.kpiTrend}>
                  {kpi.trend}
                </span>
              </div>
              <div style={styles.kpiValue}>{kpi.value}</div>
              <div style={styles.kpiTitle}>{kpi.title}</div>
              <div style={styles.kpiTarget}>Target: {kpi.target}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Sections */}
      <div style={styles.performanceSection}>
        <div style={styles.performanceGrid}>
          {/* Channel Distribution */}
          <div style={styles.performanceCard}>
            <h3 style={styles.cardTitle}>Channel Distribution</h3>
            <div style={styles.channelList}>
              <div style={styles.channelItem}>
                <span style={{...styles.channelDot, backgroundColor: '#3b82f6'}}></span>
                <span style={styles.channelName}>Voice</span>
                <span style={styles.channelPercentage}>45%</span>
              </div>
              <div style={styles.channelItem}>
                <span style={{...styles.channelDot, backgroundColor: '#10b981'}}></span>
                <span style={styles.channelName}>Chat</span>
                <span style={styles.channelPercentage}>30%</span>
              </div>
              <div style={styles.channelItem}>
                <span style={{...styles.channelDot, backgroundColor: '#f59e0b'}}></span>
                <span style={styles.channelName}>Email</span>
                <span style={styles.channelPercentage}>20%</span>
              </div>
              <div style={styles.channelItem}>
                <span style={{...styles.channelDot, backgroundColor: '#8b5cf6'}}></span>
                <span style={styles.channelName}>Social</span>
                <span style={styles.channelPercentage}>5%</span>
              </div>
            </div>
          </div>

          {/* Top Agents */}
          <div style={styles.performanceCard}>
            <h3 style={styles.cardTitle}>Top Agents</h3>
            <div style={styles.agentList}>
              <div style={styles.agentItem}>
                <div style={styles.agentAvatar}>JS</div>
                <div style={styles.agentInfo}>
                  <div style={styles.agentName}>John Smith</div>
                  <div style={styles.agentStats}>98% CSAT • 247 calls</div>
                </div>
              </div>
              <div style={styles.agentItem}>
                <div style={styles.agentAvatar}>SJ</div>
                <div style={styles.agentInfo}>
                  <div style={styles.agentName}>Sarah Johnson</div>
                  <div style={styles.agentStats}>96% CSAT • 231 calls</div>
                </div>
              </div>
              <div style={styles.agentItem}>
                <div style={styles.agentAvatar}>MW</div>
                <div style={styles.agentInfo}>
                  <div style={styles.agentName}>Mike Wilson</div>
                  <div style={styles.agentStats}>94% CSAT • 218 calls</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.performanceCard}>
            <h3 style={styles.cardTitle}>Recent Activity</h3>
            <div style={styles.activityList}>
              <div style={styles.activityItem}>
                <span style={styles.activityIcon}>📞</span>
                <span style={styles.activityText}>New call assigned to John Smith</span>
                <span style={styles.activityTime}>2m ago</span>
              </div>
              <div style={styles.activityItem}>
                <span style={styles.activityIcon}>💬</span>
                <span style={styles.activityText}>Chat escalated to supervisor</span>
                <span style={styles.activityTime}>5m ago</span>
              </div>
              <div style={styles.activityItem}>
                <span style={styles.activityIcon}>📧</span>
                <span style={styles.activityText}>Email response sent</span>
                <span style={styles.activityTime}>8m ago</span>
              </div>
              <div style={styles.activityItem}>
                <span style={styles.activityIcon}>🎫</span>
                <span style={styles.activityText}>Ticket resolved by Sarah</span>
                <span style={styles.activityTime}>12m ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;

