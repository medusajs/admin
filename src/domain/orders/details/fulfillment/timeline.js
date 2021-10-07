import React from "react"
import { Text } from "rebass"
import { Label } from "@rebass/forms"
import moment from "moment"
import SimpleEvent from "../timeline/simpleEvent"

const FulfillmentTimelineItem = ({ fulfillment }) => {
  const fontColor = fulfillment.isLatest ? "#454B54" : "grey"

  if (fulfillment.shipped_at) {
    fulfillment.event = "Items Shipped"
  }

  const child = fulfillment.shipped_at ? (
    <Label pt={1}>
      <Text fontSize="11px" fontWeight="bold" color={fontColor} ml={3} mb={3}>
        Fulfilled at:
      </Text>
      <Text fontSize="11px" color={fontColor} ml={3} mb={3}>
        {moment(fulfillment.time).format("MMMM Do YYYY, H:mm:ss")}
      </Text>
    </Label>
  ) : (
    <></>
  )

  return (
    <>
      <SimpleEvent event={{ time: fulfillment.shipped_at, ...fulfillment }}>
        {child}
      </SimpleEvent>
    </>
  )
}

export default FulfillmentTimelineItem
