import React from "react"
import { RefundEvent } from "../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../utils/prices"
import RefundIcon from "../../fundamentals/icons/refund"
import EventContainer from "./event-container"

type RefundEventProps = {
  event: RefundEvent
}

const Refund: React.FC<RefundEventProps> = ({ event }) => {
  const args = {
    icon: <RefundIcon size={20} />,
    title: "Refund",
    time: event.time,
    midNode: (
      <span className="inter-small-regular text-grey-50">
        {formatAmountWithSymbol({
          amount: event.amount,
          currency: event.currencyCode,
        })}
      </span>
    ),
    children: (
      <div className="flex w-full flex-col gap-y-xsmall">
        {event.reason && (
          <span className="text-grey-50">{`${event.reason
            .slice(0, 1)
            .toUpperCase()}${event.reason.slice(1)}`}</span>
        )}
        {event.note && (
          <div className="rounded-2xl bg-grey-5 px-base py-base">
            Note: {event.note}
          </div>
        )}
      </div>
    ),
  }

  return <EventContainer {...args} />
}

export default Refund
