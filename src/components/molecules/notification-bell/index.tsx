import React from "react"
import BellIcon from "../../fundamentals/icons/bell-icon"
import BellNotiIcon from "../../fundamentals/icons/bell-noti-icon"

type NotificationBellProps = {
  hasNotifications: boolean
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotifications = false,
}) => {
  return <button>{hasNotifications ? <BellNotiIcon /> : <BellIcon />}</button>
}

export default NotificationBell
