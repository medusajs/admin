import React from "react"
import { ItemsFulfilledEvent } from "../../../hooks/use-build-timeline"
import PackageIcon from "../../fundamentals/icons/package-icon"
import EventContainer from "./event-container"
import EventItemContainer from "./event-item-container"

type ItemsFulfilledProps = {
  event: ItemsFulfilledEvent
}

const ItemsFulfilled: React.FC<ItemsFulfilledProps> = ({ event }) => {
  const args = {
    icon: <PackageIcon size={20} />,
    time: event.time,
    title: `${event.isExchangeFulfillment ? "Exchange " : ""}Items Fulfilled`,
    children: event.items.map((item) => <EventItemContainer item={item} />),
    noNotification: event.noNotification,
    isFirst: event.first,
  }
  return <EventContainer {...args} />
}

export default ItemsFulfilled
