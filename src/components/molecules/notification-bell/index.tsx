import React from "react"
import BellIcon from "../../fundamentals/icons/bell-icon"
import BellNotiIcon from "../../fundamentals/icons/bell-noti-icon"

type NotificationBellProps = {
  hasNotifications: boolean
  onClick: () => void
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotifications = false,
  onClick = () => void 0
}) => {
  return <button onClick={onClick}>{hasNotifications ? <BellNotiIcon /> : <BellIcon />}</button>
}

export default NotificationBell
