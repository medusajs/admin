import React from "react"
import { ItemsShippedEvent } from "../../../hooks/use-build-timeline"
import TruckIcon from "../../fundamentals/icons/truck-icon"
import EventContainer from "./event-container"
import EventItemContainer from "./event-item-container"

type ItemsShippedProps = {
  event: ItemsShippedEvent
}

const ItemsShipped: React.FC<ItemsShippedProps> = ({ event }) => {
  const args = {
    icon: <TruckIcon size={20} />,
    time: event.time,
    title: `${event.isExchangeFulfillment ? "Exchange " : ""}Items Shipped`,
    children: event.items.map((item) => <EventItemContainer item={item} />),
    noNotification: event.noNotification,
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default ItemsShipped
