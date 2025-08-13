import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MessageInput from './MessageInput';
import './ChatBody.css';

// SVG for different message statuses
const MessageStatusIcon = ({ status }) => {
  switch (status) {
    case 'sent':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#667781">
          <path d="M9,17.17L4.83,13l-1.42,1.41L9,20L21,8l-1.41-1.41L9,17.17z"/>
        </svg>
      );
    case 'delivered':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#667781">
          <path d="M18.8,5.1l-8,8l-4,-4l-1.4,1.4l5.4,5.4l9.4,-9.4L18.8,5.1z"/>
          <path d="M21.2,7.5l-9.4,9.4l-3,-3l-1.4,1.4l4.4,4.4l10.8,-10.8L21.2,7.5z"/>
        </svg>
      );
    case 'read':
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#53bdeb">
          <path d="M18.8,5.1l-8,8l-4,-4l-1.4,1.4l5.4,5.4l9.4,-9.4L18.8,5.1z"/>
          <path d="M21.2,7.5l-9.4,9.4l-3,-3l-1.4,1.4l4.4,4.4l10.8,-10.8L21.2,7.5z"/>
        </svg>
      );
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#667781">
          <circle cx="12" cy="12" r="2"/>
        </svg>
      );
  }
};

// Helper to format the timestamp for individual messages
const formatMessageTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return date.toLocaleTimeString('en-US', options);
};

// Helper to format the date for a date separator
const formatDateSeparator = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

const ChatBody = () => {
  const { currentMessages, loading } = useSelector(state => state.messages);
  const { activeConversation } = useSelector(state => state.conversations);
  const messagesEndRef = useRef(null);
  
  const myBusinessNumber = "918329446654"; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);
  
  if (loading) {
    return (
      <div className="chat-body">
        <div className="chat-body-messages">
          <div className="chat-loading">Loading messages...</div>
        </div>
      </div>
    );
  }

  // Helper function to normalize timestamp
  const normalizeTimestamp = (timestamp) => {
    if (!timestamp) return Date.now();
    
    const ts = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    
    // Check if timestamp is in milliseconds (13 digits) or seconds (10 digits)
    if (ts > 1000000000000) {
      return ts; // Return milliseconds
    }
    
    return ts * 1000; // Convert seconds to milliseconds
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    const sortedMessages = [...messages].sort((a, b) => {
      const timestampA = normalizeTimestamp(a.timestamp || a.createdAt);
      const timestampB = normalizeTimestamp(b.timestamp || b.createdAt);
      return timestampA - timestampB;
    });

    sortedMessages.forEach(message => {
      const normalizedTimestamp = normalizeTimestamp(message.timestamp || message.createdAt);
      const date = new Date(normalizedTimestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(currentMessages);
  
  return (
    <div className="chat-body">
      <div className="chat-body-messages">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            <div className="date-separator">
              <span className="date-text">{formatDateSeparator(new Date(date))}</span>
            </div>
            {messages.map((message) => {
              if (!message.messageBody) return null;
              
              // **Correct Logic for Outbound vs. Inbound:**
              const isOutbound = message.from === myBusinessNumber;
              
              const normalizedTimestamp = normalizeTimestamp(message.timestamp || message.createdAt);

              return (
                <div key={message._id || message.id || Math.random()} 
                     className={`message message--${isOutbound ? 'outbound' : 'inbound'}`}>
                  <div className="message-bubble">
                    <p className="message-text">{message.messageBody}</p>
                    <div className="message-meta">
                      <span className="message-time">{formatMessageTime(new Date(normalizedTimestamp))}</span>
                      {isOutbound && (
                        <div className="message-status">
                          <MessageStatusIcon status={message.status || 'sent'} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatBody;