import React from "react"
import BellIcon from "../fundamentals/icons/bell-icon"
import BellNotiIcon from "../fundamentals/icons/bell-noti-icon"

const NotificationBell = ({ hasNotifications }) => {
  return <button>{hasNotifications ? <BellNotiIcon /> : <BellIcon />}</button>
}

export default NotificationBell
