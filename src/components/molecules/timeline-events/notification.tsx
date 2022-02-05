import { useAdminResendNotification } from "medusa-react"
import React from "react"
import { NotificationEvent } from "../../../hooks/use-build-timeline"
import useToaster from "../../../hooks/use-toaster"
import ArrowRightIcon from "../../fundamentals/icons/arrow-right-icon"
import MailIcon from "../../fundamentals/icons/mail-icon"
import SendIcon from "../../fundamentals/icons/send-icon"
import EventActionables from "./event-actionables"
import EventContainer from "./event-container"

type NotificationProps = {
  event: NotificationEvent
}

const notificationTitleMap = {
  "order.placed": "Order Confirmation Sent",
  "order.shipment_created": "Shipment Confirmation Sent",
}

const Notification: React.FC<NotificationProps> = ({ event }) => {
  const toaster = useToaster()
  const resendNotification = useAdminResendNotification(event.id)

  const handleResend = () => {
    resendNotification.mutate(
      { to: event.to },
      {
        onSuccess: () =>
          toaster(`Notification re-send to ${event.to}`, "success"),
      }
    )
  }

  const actions = (
    <EventActionables
      actions={[
        {
          label: "Re-Send Mail",
          icon: <SendIcon size={20} />,
          onClick: () => handleResend(),
        },
      ]}
    />
  )
  return (
    <EventContainer
      icon={<MailIcon size={20} />}
      title={notificationTitleMap[event.title] || event.title}
      time={event.time}
      topNode={actions}
      midNode={<ReceiverNode email={event.to} />}
    />
  )
}

const ReceiverNode: React.FC<{ email: string }> = ({ email }) => {
  return (
    <div className="flex items-center">
      <div className="text-grey-40 mr-2xsmall">
        <ArrowRightIcon size={16} />
      </div>
      <span>{email}</span>
    </div>
  )
}

export default Notification
