import React from "react"
import { OrderPlacedEvent } from "../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../utils/prices"
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
        {formatAmountWithSymbol({
          amount: event.amount,
          currency: event.currency_code,
        })}
      </div>
    ),
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default OrderPlaced
