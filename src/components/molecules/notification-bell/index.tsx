import React from "react"
import BellIcon from "../../fundamentals/icons/bell-icon"
import BellNotiIcon from "../../fundamentals/icons/bell-noti-icon"
import Button from "../../fundamentals/button"

type NotificationBellProps = {
  hasNotifications: boolean
  onClick: () => void
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotifications = false,
  onClick = () => void 0
}) => {

  return <Button variant={"ghost"} onClick={onClick}>
    {hasNotifications
      ? <BellNotiIcon />
      : <BellIcon />
    }
  </Button>
}

export default NotificationBell
