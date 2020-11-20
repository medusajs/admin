import React, { useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"

import Typography from "../../../../components/typography"
import Button from "../../../../components/button"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({
  lineItem,
  currency,
  taxRate,
  onReceiveReturn,
  rawEvent,
}) => {
  const productId = Array.isArray(lineItem.content)
    ? lineItem.content[0].product._id
    : lineItem.content.product._id

  return (
    <Flex px={3} alignItems="center">
      <Flex flex={1} alignItems="center">
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
            <br /> {lineItem.content.variant.sku}
            <br />
            {(1 + taxRate) * lineItem.content.unit_price} {currency}
          </LineItemLabel>
        </Box>
      </Flex>
      {rawEvent.status !== "received" && (
        <Flex>
          <Button onClick={() => onReceiveReturn(rawEvent)} variant={"primary"}>
            Receive return
          </Button>
        </Flex>
      )}
    </Flex>
  )
}

export default ({ event, order, onReceiveReturn }) => {
  return (
    <Box sx={{ borderBottom: "hairline" }} pb={3} mb={3}>
      <Text ml={3} fontSize={1} color="grey">
        Return {event.status}
      </Text>
      <Text fontSize="11px" color="grey" ml={3} mb={3}>
        {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
      </Text>
      {event.items.map(lineItem => (
        <LineItem
          key={lineItem._id}
          currency={order.currency_code}
          lineItem={lineItem}
          taxRate={order.region.tax_rate}
          onReceiveReturn={onReceiveReturn}
          rawEvent={event.raw}
        />
      ))}
    </Box>
  )
}
