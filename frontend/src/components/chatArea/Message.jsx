import React from 'react'

const Message = ({ message }) => {
  const isOutgoing = message.direction === 'outbound'
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return (
          <svg className="status-sent" viewBox="0 0 16 15" width="16" height="15">
            <path fill="currentColor" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
          </svg>
        )
      case 'delivered':
        return (
          <svg className="status-delivered" viewBox="0 0 16 15" width="16" height="15">
            <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-1.692-1.543a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l2.258 2.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
          </svg>
        )
      case 'read':
        return (
          <svg className="status-read" viewBox="0 0 16 15" width="16" height="15">
            <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-1.692-1.543a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l2.258 2.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
          </svg>
        )
      default:
        return null
    }
  }
  
  return (
    <div className={`message ${isOutgoing ? 'message--outgoing' : 'message--incoming'}`}>
      <div className={`message-bubble ${isOutgoing ? 'message-bubble--outgoing' : 'message-bubble--incoming'}`}>
        <p className="message-content">{message.messageBody}</p>
        <div className="message-info">
          <span className="message-time">{formatTime(message.timestamp)}</span>
          {isOutgoing && (
            <div className="message-status">
              {getStatusIcon(message.status)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message