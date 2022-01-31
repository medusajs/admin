import React from "react"
import { ExchangeEvent } from "../../../hooks/use-build-timeline"
import StatusIndicator from "../../fundamentals/status-indicator"
import EventContainer from "./event-container"

type ExchangeProps = {
  event: ExchangeEvent
}

const ExchangeStatus = (event: ExchangeEvent) => {
  const { paymentStatus, fulfillmentStatus, returnStatus } = event

  const divider = <div className="h-11 w-px bg-grey-20" />

  return (
    <div className="flex items-center inter-small-regular">
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Payment:</span>
        <StatusIndicator
          title={formatStatus(paymentStatus)}
          variant="success"
        />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Return:</span>
        <StatusIndicator title={formatStatus(returnStatus)} variant="success" />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Fulfillment:</span>
        <StatusIndicator
          title={formatStatus(fulfillmentStatus)}
          variant="success"
        />
      </div>
    </div>
  )
}

const Exchange: React.FC<ExchangeProps> = ({}) => {
  return <EventContainer />
}

function formatStatus(status: string) {
  const split = status.split("_")
  return split.map((c) => c[0].toUpperCase() + c.slice(1)).join(" ")
}

export default Exchange
