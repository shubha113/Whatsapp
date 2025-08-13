import React from 'react'

const SidebarHeader = () => {
  return (
    <div className="sidebar-header">
      <div className="sidebar-header-avatar">
        <img 
          src="https://i.pravatar.cc/40?img=1" 
          alt="User Avatar"
        />
      </div>
      <div className="sidebar-header-right">
        {/* New Chat Icon */}
        <svg 
          className="sidebar-header-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V9h2v2zm0-4h-2V5h2v2z"/>
        </svg>
        
        {/* Menu Icon */}
        <svg 
          className="sidebar-header-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>
    </div>
  )
}

export default SidebarHeader