import React from "react"
import { Text, Box } from "rebass"
import moment from "moment"

import NotificationTimeline from "../notification/timeline"
import ClaimTimeline from "../claim/timeline"
import SwapTimeline from "../swap/timeline"
import ReturnTimeline from "../returns/timeline"
import NoteTimeline from "../notes/timeline"

import LineItem from "../line-item"
import SimpleEvent from "./simple-event"
import FulfillmentTimelineItem from "../fulfillment/timeline"
import Timeline from "../../../../components/timeline"

const getTimelineEvent = (event, rest) => {
  const {
    order,
    onResendNotification,
    onSaveClaim,
    onFulfillClaim,
    onFulfillSwap,
    onProcessSwapPayment,
    onReceiveReturn,
    onCancelReturn,
    onCancelClaim,
    onCancelSwap,
    onUpdateNotes,
    toaster,
  } = rest

  switch (event.type) {
    case "notification":
      return (
        <NotificationTimeline
          key={event.id}
          event={event}
          onResend={onResendNotification}
        />
      )
    case "note":
      return (
        <NoteTimeline
          key={event.id}
          event={event}
          toaster={toaster}
          onUpdateNotes={onUpdateNotes}
        />
      )
    case "return":
      return (
        <ReturnTimeline
          key={event.id}
          event={event}
          order={order}
          onReceiveReturn={onReceiveReturn}
          onCancelReturn={onCancelReturn}
          toaster={toaster}
        />
      )
    case "claim":
      return (
        <ClaimTimeline
          key={event.id}
          event={event}
          order={order}
          onSaveClaim={onSaveClaim}
          onFulfillClaim={onFulfillClaim}
          onReceiveReturn={onReceiveReturn}
          onCancelClaim={onCancelClaim}
        />
      )
    case "swap":
      return (
        <SwapTimeline
          key={event.id}
          event={event}
          order={order}
          onProcessPayment={onProcessSwapPayment}
          onFulfillSwap={onFulfillSwap}
          onReceiveReturn={onReceiveReturn}
          onCancelReturn={onCancelReturn}
          onCancelSwap={onCancelSwap}
        />
      )
    case "placed":
      return <SimpleEvent event={event}></SimpleEvent>

    case "fulfilled":
      return <FulfillmentTimelineItem fulfillment={event} order={order} />

    default:
      return (
        <Box key={event.id} sx={{ borderBottom: "hairline" }} pb={3} mb={3}>
          <Text
            ml={3}
            fontSize={1}
            color={event.isLatest ? "medusa" : "inactive"}
            fontWeight="500"
            mb={2}
          >
            {event.event} {event.type}
          </Text>
          <Text
            fontSize="11px"
            color={event.isLatest ? "medusa" : "inactive"}
            ml={3}
            mb={3}
          >
            {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
          </Text>
          {event.items.map((lineItem, i) => (
            <LineItem
              fontColor={event.isLatest ? "medusa" : "inactive"}
              key={i}
              lineItem={lineItem}
              order={order}
            />
          ))}
        </Box>
      )
  }
}

export default ({ events, ...rest }) => {
  return (
    <Timeline>
      {events.map((event, idx) => (
        <Timeline.Item isLast={events.length - 1 === idx}>
          {getTimelineEvent(event, rest)}
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
