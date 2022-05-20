import React from "react"
import { RefundEvent } from "../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../utils/prices"
import BackIcon from "../../fundamentals/icons/back-icon"
import EventContainer from "./event-container"

type RefundEventProps = {
  event: RefundEvent
}

const Refund: React.FC<RefundEventProps> = ({ event }) => {
  const args = {
    icon: <BackIcon size={20} />,
    title: "Refund",
    time: event.time,
    topNode: getAmount(event),
    midNode: (
      <span className="text-grey-50">{`${event.reason
        .slice(0, 1)
        .toUpperCase()}${event.reason.slice(1)}`}</span>
    ),
    children: event.note && (
      <div className="rounded-2xl px-base py-base bg-grey-5">{event.note}</div>
    ),
  }

  return <EventContainer {...args} />
}

function getAmount(event: RefundEvent) {
  const formattedAmount = formatAmountWithSymbol({
    amount: event.amount,
    currency: event.currencyCode,
  })

  return <span className="inter-small-semibold">{formattedAmount}</span>
}

export default Refund
