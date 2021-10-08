import React from "react"
import { Text } from "rebass"
import { Label } from "@rebass/forms"
import moment from "moment"
import SimpleEvent from "../timeline/simpleEvent"
import LineItem from "../line-item"

const FulfillmentTimelineItem = ({ fulfillment }) => {
  const fontColor = fulfillment.isLatest ? "#454B54" : "#89959C"

  if (fulfillment.shipped_at) {
    fulfillment.event = "Items Shipped"
  }

  const partialFulfillmentChild = !fulfillment.fulfilledAllItems ? (
    <>
      {fulfillment.items.map((lineItem, i) => (
        <LineItem
          key={i}
          currency={fulfillment.currency_code}
          lineItem={lineItem}
          taxRate={fulfillment.tax_rate}
        />
      ))}
    </>
  ) : (
    <></>
  )

  const shippedAtChild = fulfillment.shipped_at ? (
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

  const { time, ...rest } = fulfillment

  return (
    <>
      <SimpleEvent event={{ time: rest.shipped_at || time, ...rest }}>
        {partialFulfillmentChild}
        {shippedAtChild}
      </SimpleEvent>
    </>
  )
}

export default FulfillmentTimelineItem
