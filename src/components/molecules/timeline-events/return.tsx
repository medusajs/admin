import clsx from "clsx"
import React from "react"
import { ReturnEvent } from "../../../hooks/use-build-timeline"
import Button from "../../fundamentals/button"
import AlertIcon from "../../fundamentals/icons/alert-icon"
import CancelIcon from "../../fundamentals/icons/cancel-icon"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import { ActionType } from "../actionables"
import EventActionables from "./event-actionables"
import EventContainer from "./event-container"
import EventItemContainer from "./event-item-container"

type ReturnRequestedProps = {
  event: ReturnEvent
}

const Return: React.FC<ReturnRequestedProps> = ({ event }) => {
  const args = buildReturn(event)

  return <EventContainer {...args} />
}

function buildReturn(event: ReturnEvent) {
  let title: string = "Return"
  let icon: React.ReactNode
  let button: React.ReactNode
  let actions: ActionType[] = []

  switch (event.status) {
    case "requested":
      title = "Return Requested"
      icon = <AlertIcon size={20} className="text-orange-40" />
      button = (
        <Button
          variant="secondary"
          size="small"
          disabled={event.currentStatus && event.currentStatus !== "requested"}
          className={clsx("mt-large", {
            ["pointer-events-none opacity-50"]:
              event.currentStatus !== event.status,
          })}
        >
          Receive Return
        </Button>
      )
      break
    case "received":
      title = "Return Received"
      icon = <CheckCircleIcon size={20} className="text-emerald-40" />
      break
    case "canceled":
      title = "Return Canceled"
      icon = <CancelIcon size={20} className="text-rose-50" />
      break
    case "requires_action":
      title = "Return Requires Action"
      icon = icon = <AlertIcon size={20} className="text-rose-50" />
      break
    default:
      break
  }

  return {
    title,
    icon,
    time: event.time,
    topNode: <EventActionables actions={actions} />,
    noNotification: event.noNotification,
    children: [
      event.items.map((i) => {
        return <EventItemContainer item={i} />
      }),
      button,
    ],
  }
}

export default Return
