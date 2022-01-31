import React from "react"
import { ExchangeEvent } from "../../../hooks/use-build-timeline"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import { FulfillmentStatus, PaymentStatus, ReturnStatus } from "../order-status"
import EventContainer, { EventIconColor } from "./event-container"
import EventItemContainer from "./event-item-container"

type ExchangeProps = {
  event: ExchangeEvent
}

const ExchangeStatus: React.FC<ExchangeProps> = ({ event }) => {
  const divider = <div className="h-11 w-px bg-grey-20" />

  return (
    <div className="flex items-center inter-small-regular gap-x-base truncate">
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Payment:</span>
        <PaymentStatus paymentStatus={event.paymentStatus} />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Return:</span>
        <ReturnStatus returnStatus={event.returnStatus} />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Fulfillment:</span>
        <FulfillmentStatus fulfillmentStatus={event.fulfillmentStatus} />
      </div>
    </div>
  )
}

const Exchange: React.FC<ExchangeProps> = ({ event }) => {
  const returnItems = (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">Return Items</span>
      <div>
        {event.returnItems.map((i) => (
          <EventItemContainer item={{ ...i, quantity: i.requestedQuantity }} />
        ))}
      </div>
    </div>
  )

  console.log(event.newItems)

  const newItems = (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">New Items</span>
      <div>
        {event.newItems.map((i) => (
          <EventItemContainer item={i} />
        ))}
      </div>
    </div>
  )

  const args = {
    title: "Exchange Requested",
    icon: <RefreshIcon size={20} />,
    iconColor: EventIconColor.ORANGE,
    time: event.time,
    children: [
      <div className="flex flex-col gap-y-base">
        <ExchangeStatus event={event} />
        {returnItems}
        {newItems}
      </div>,
    ],
  }
  return <EventContainer {...args} />
}

export default Exchange
