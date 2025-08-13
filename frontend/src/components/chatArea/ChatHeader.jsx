import React from 'react';
import { useSelector } from 'react-redux';
import './ChatHeader.css';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);

const VideoCallIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
  </svg>
);

const MoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
  </svg>
);

const ChatHeader = () => {
  const { activeConversation } = useSelector(state => state.conversations);
  
  if (!activeConversation) return null;
  
  const avatarSeed = activeConversation._id ? activeConversation._id.slice(-2) : '1';
  
  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <div className="chat-header-avatar">
          <img 
            src={`https://i.pravatar.cc/40?img=${parseInt(avatarSeed, 16) % 70 + 1}`}
            alt={activeConversation.userName || 'User'}
          />
        </div>
        <h3 className="chat-header-name">{activeConversation.userName || `User ${activeConversation._id.slice(-4)}`}</h3>
      </div>
      <div className="chat-header-right">
        <div className="chat-header-icon-wrapper">
          <VideoCallIcon />
        </div>
        <div className="chat-header-icon-wrapper">
          <SearchIcon />
        </div>
        <div className="chat-header-icon-wrapper">
          <MoreIcon />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;