import React from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"
import ImagePlaceholder from "../../../../assets/svg/image-placeholder.svg"
import Typography from "../../../../components/typography"

import NotificationTimeline from "../notification/timeline"
import ClaimTimeline from "../claim/timeline"
import SwapTimeline from "../swap/timeline"
import ReturnTimeline from "../returns/timeline"
import NoteTimeline from "../notes/timeline"

import LineItem from "../line-item"
import SimpleEvent from "./simpleEvent"
import FulfillmentTimelineItem from "../fulfillment/timeline"

export default ({
  events,
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
}) => {
  return (
    <Box>
      {events.map(event => {
        console.log(event.type)
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
            return <SimpleEvent event={event} />
          case "fulfilled":
            return <FulfillmentTimelineItem fulfillment={event} />
          default:
            return (
              <Box
                key={event.id}
                sx={{ borderBottom: "hairline" }}
                pb={3}
                mb={3}
              >
                <Text ml={3} fontSize={1} color="grey" fontWeight="500" mb={2}>
                  {event.event} {event.type}
                </Text>
                <Text fontSize="11px" color="grey" ml={3} mb={3}>
                  {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
                </Text>
                {event.items.map((lineItem, i) => (
                  <LineItem
                    key={i}
                    currency={order.currency_code}
                    lineItem={lineItem}
                    taxRate={order.tax_rate}
                  />
                ))}
              </Box>
            )
        }
      })}
    </Box>
  )
}
