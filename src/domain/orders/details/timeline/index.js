import React from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"

import ClaimTimeline from "../claim/timeline"
import SwapTimeline from "../swap/timeline"
import ReturnTimeline from "../returns/timeline"
import Typography from "../../../../components/typography"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ lineItem, currency, taxRate }) => {
  const productId = lineItem.variant.product_id

  return (
    <Flex pl={3} alignItems="center">
      <Flex pr={3}>
        <Box alignSelf={"center"} minWidth={"35px"}>
          {lineItem.quantity} x
        </Box>
        <Box mx={2}>
          <Image
            src={lineItem.thumbnail || ""}
            sx={{
              objectFit: "contain",
              objectPosition: "center",
              width: 35,
              height: 35,
            }}
          />
        </Box>
        <Box>
          <LineItemLabel
            ml={2}
            mr={5}
            onClick={() => navigate(`/a/products/${productId}`)}
          >
            {lineItem.title}
            <br /> {lineItem.variant.sku}
            <br />
            {(1 + taxRate / 100) * (lineItem.unit_price / 100)} {currency}
          </LineItemLabel>
        </Box>
      </Flex>
    </Flex>
  )
}

export default ({
  events,
  order,
  onSaveClaim,
  onFulfillClaim,
  onFulfillSwap,
  onProcessSwapPayment,
  onReceiveReturn,
}) => {
  return (
    <Box>
      {events.map(event => {
        switch (event.type) {
          case "return":
            return (
              <ReturnTimeline
                key={event.id}
                event={event}
                order={order}
                onReceiveReturn={onReceiveReturn}
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
              />
            )
          default:
            return (
              <Box
                key={event.id}
                sx={{ borderBottom: "hairline" }}
                pb={3}
                mb={3}
              >
                <Text ml={3} fontSize={1} color="grey" fontWeight="500" mb={2}>
                  {event.event}
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
