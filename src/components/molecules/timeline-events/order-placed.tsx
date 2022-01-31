import React from "react"
import { OrderPlacedEvent } from "../../../hooks/use-build-timeline"
import { stringDisplayPrice } from "../../../utils/prices"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import EventContainer, { EventIconColor } from "./event-container"

type OrderPlacedProps = {
  event: OrderPlacedEvent
}

const OrderPlaced: React.FC<OrderPlacedProps> = ({ event }) => {
  const args = {
    icon: <CheckCircleIcon size={20} />,
    iconColor: EventIconColor.GREEN,
    time: event.time,
    title: "Order Placed",
    topNode: (
      <div className="inter-small-semibold">
        {stringDisplayPrice({
          currencyCode: event.currency_code,
          amount: event.amount,
        })}
      </div>
    ),
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default OrderPlaced
