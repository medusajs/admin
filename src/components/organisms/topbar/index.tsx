import React from "react"
import Avatar from "../../atoms/avatar"
import NotificationBell from "../../molecules/notification-bell"
import SearchBar from "../../molecules/search-bar"

const Topbar: React.FC = () => {
  return (
    <div className="w-full min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-b border-grey-20 sticky top-0 flex items-center justify-between z-40">
      <SearchBar />
      <div className="flex items-center">
        <NotificationBell hasNotifications={false} />
        <div className="ml-large">
          <Avatar />
        </div>
      </div>
    </div>
  )
}

export default Topbar
