import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/messageSlice/messageSlice';

// Using inline SVGs for cleaner, more scalable icons
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
  </svg>
);

const EmojiIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10,10-4.477,10-10S17.523,2,12,2Zm0,18c-4.411,0-8-3.589-8-8s3.589-8,8-8,8,3.589,8,8-3.589,8-8,8ZM8.5,10.5a1.5,1.5,0,1,0,0-3,1.5,1.5,0,0,0,0,3Zm7,0a1.5,1.5,0,1,0,0-3,1.5,1.5,0,0,0,0,3ZM12,17.5a4.5,4.5,0,0,1-4.5-4.5h9a4.5,4.5,0,0,1-4.5,4.5Z" />
  </svg>
);

const MicrophoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5l.01 6c0 1.66 1.33 3 2.99 3zm5.3-3c0 3.53-2.64 6.4-6.3 6.93V21h3v2H8v-2h3v-3.07C7.35 14.41 4.7 11.53 4.7 8H6c0 3.53 2.64 6.13 6 6.55V8H17.3v3z"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const MessageInput = () => {
  const [messageText, setMessageText] = useState('');
  const dispatch = useDispatch();
  const { activeConversation } = useSelector(state => state.conversations);
  const { sendingMessage } = useSelector(state => state.messages);

  const handleSendMessage = () => {
    if (messageText.trim() && activeConversation && !sendingMessage) {
      dispatch(sendMessage({
        waId: activeConversation._id,
        messageBody: messageText.trim(),
        userName: activeConversation.userName
      }));
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
  };

  return (
    <div className="message-input-bar">
      <div className="input-field-content">
        <div className="input-icon-wrapper">
          <PlusIcon />
        </div>
        <div className="input-icon-wrapper">
          <EmojiIcon />
        </div>
        
        <textarea
          className="message-input-field"
          placeholder="Type a message"
          value={messageText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows="1"
          disabled={sendingMessage}
        />
         {messageText.trim() ? (
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={sendingMessage}
        >
          <SendIcon />
        </button>
      ) : (
        <div className="input-icon-wrapper">
          <MicrophoneIcon />
        </div>
      )}
      </div>
    </div>
  );
};

export default MessageInput;