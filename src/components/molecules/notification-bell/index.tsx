import React from "react"
import BellIcon from "../../fundamentals/icons/bell-icon"
import BellNotiIcon from "../../fundamentals/icons/bell-noti-icon"
import Button, { ButtonProps } from "../../fundamentals/button"

type NotificationBellProps = ButtonProps & {
  hasNotifications?: boolean
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotifications = false,
    ...attributes
}) => {

  return <Button
    className="w-8 h-8 mr-3"
    size="small"
    {...attributes}
  >
    {hasNotifications
      ? <BellNotiIcon />
      : <BellIcon />
    }
  </Button>
}

export default NotificationBell
