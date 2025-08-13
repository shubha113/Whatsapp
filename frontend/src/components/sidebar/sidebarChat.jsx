import React from 'react';

const normalizeTimestamp = (timestamp) => {
  if (!timestamp) return Date.now();
  
  const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  
  if (ts > 1000000000000) {
    return ts; 
  }
  
  return ts * 1000; 
};

const formatSidebarTime = (date) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date >= today) {
    // If today, show time
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  } else if (date >= yesterday) {
    // If yesterday
    return 'Yesterday';
  } else {
    // Otherwise, show the date
    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
};

const SidebarChat = ({ conversation, isActive, onClick }) => {
  const avatarSeed = conversation.waId ? conversation.waId.slice(-4) : '1';
  
  const hasUnread = conversation.unreadCount > 0;
  
  const lastMessageTimestamp = conversation.lastMessageTimestamp;
  const normalizedTime = normalizeTimestamp(lastMessageTimestamp || conversation.createdAt);
  const formattedTime = formatSidebarTime(new Date(normalizedTime));

  return (
    <div 
      className={`sidebar-chat ${isActive ? 'sidebar-chat--active' : ''}`}
      onClick={onClick}
    >
      <div className="sidebar-chat-avatar">
        <img 
          src={`https://i.pravatar.cc/49?img=${parseInt(avatarSeed, 16) % 70 + 1}`}
          alt={conversation.userName || 'User'}
        />
      </div>
      <div className="sidebar-chat-info">
        <div className="sidebar-chat-header">
          <h3>{conversation.userName || `User ${conversation.waId.slice(-4)}`}</h3>
          <div className="sidebar-chat-meta">
            <span className={`sidebar-chat-time ${hasUnread ? 'sidebar-chat-time--unread' : ''}`}>
              {formattedTime}
            </span>
          </div>
        </div>
        <div className="sidebar-chat-message-container">
          <div className="sidebar-chat-status">
            <p className={`sidebar-chat-message ${hasUnread ? 'sidebar-chat-message--unread' : ''}`}>
              {conversation.lastMessage || 'No messages yet'}
            </p>
          </div>
          {hasUnread && (
            <span className="sidebar-chat-unread">
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarChat;