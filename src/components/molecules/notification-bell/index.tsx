import React from "react"
import BellIcon from "../../fundamentals/icons/bell-icon"
import BellNotiIcon from "../../fundamentals/icons/bell-noti-icon"
import Button, { ButtonProps } from "../../fundamentals/button"

type NotificationBellProps = ButtonProps & {
  hasNotifications?: boolean
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotifications = false,
  onClick = () => void 0
}) => {

  return <Button
    onClick={onClick}
    size="small"
    variant="ghost"
    className="w-8 h-8 mr-3"
  >
    {hasNotifications
      ? <BellNotiIcon />
      : <BellIcon />
    }
  </Button>
}

export default NotificationBell
