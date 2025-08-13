import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import { setActiveConversation } from '../../redux/conversationSlice/conversationSlice'
import { fetchMessages } from '../../redux/messageSlice/messageSlice'
import SidebarHeader from './SidebarHeader'
import SidebarSearch from './SidebarSearch'
import SidebarChat from './SidebarChat'
import './Sidebar.css'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { conversations, loading, activeConversation } = useSelector(state => state.conversations)
  const [activeTab, setActiveTab] = useState('All')
  const [isMobile, setIsMobile] = useState(false)

  const tabs = ['All', 'Unread', 'Favourites', 'Groups']

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleChatClick = (conversation) => {
    dispatch(setActiveConversation(conversation))
    dispatch(fetchMessages(conversation._id))
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Yesterday'
    } else {
      const daysDiff = Math.floor((today.getTime() - messageDate.getTime()) / (24 * 60 * 60 * 1000))
      if (daysDiff < 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' })
      }
      return date.toLocaleDateString('en-US', { 
        month: 'numeric', 
        day: 'numeric',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  // Filter conversations based on active tab
  const filterConversations = () => {
    switch (activeTab) {
      case 'Unread':
        return conversations.filter(conv => conv.unreadCount > 0)
      case 'Favourites':
        return conversations.filter(conv => conv.isFavourite)
      case 'Groups':
        return conversations.filter(conv => conv.isGroup)
      default:
        return conversations
    }
  }

  const filteredConversations = filterConversations()

  if (loading) {
    return (
      <div className="sidebar">
        <SidebarHeader />
        <SidebarSearch />
        <div className="sidebar-tabs">
          {tabs.map((tab) => (
            <div 
              key={tab}
              className={`sidebar-tab ${activeTab === tab ? 'sidebar-tab--active' : ''}`}
            >
              {tab}
            </div>
          ))}
        </div>
        <div className="sidebar-loading">Loading conversations...</div>
      </div>
    )
  }

  return (
    <div className="sidebar">
      <SidebarHeader />
      <SidebarSearch />
      
      {/* Navigation Tabs */}
      <div className="sidebar-tabs">
        {tabs.map((tab) => (
          <div 
            key={tab}
            className={`sidebar-tab ${activeTab === tab ? 'sidebar-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Archive section */}
      <div className="sidebar-archive">
        <svg className="sidebar-archive-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="m3 21 1.9-7.1c.1-.4.4-.6.8-.6h12.5c.4 0 .8.2.9.6L21 21H3zm1.4-8L6 7.1c.1-.4.4-.6.8-.6h10.4c.4 0 .8.2.9.6L19.6 13H4.4zM12 15.5l3.5-2.5-7 0L12 15.5z"/>
        </svg>
        <span className="sidebar-archive-text">Archived</span>
        <span className="sidebar-archive-count">3</span>
      </div>

      {/* Chat List */}
      <div className="sidebar-chats">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <SidebarChat
              key={conversation._id}
              conversation={conversation}
              isActive={activeConversation?._id === conversation._id}
              onClick={() => handleChatClick(conversation)}
              time={formatTime(conversation.lastTimestamp)}
            />
          ))
        ) : (
          <div className="sidebar-loading">
            {activeTab === 'All' ? 'No conversations yet' : `No ${activeTab.toLowerCase()} conversations`}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar