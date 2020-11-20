import React, { useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"

import { decideBadgeColor } from "../../../../utils/decide-badge-color"
import Typography from "../../../../components/typography"
import Badge from "../../../../components/badge"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ lineItem, currency, taxRate }) => {
  const productId = Array.isArray(lineItem.content)
    ? lineItem.content[0].product._id
    : lineItem.content.product._id

  return (
    <Flex alignItems="center">
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
    </Flex>
  )
}

export default ({
  event,
  order,
  onCapturePayment,
  onFulfillSwap,
  onReceiveReturn,
  onCancelSwap,
}) => {
  const payStatusColors = decideBadgeColor(event.raw.payment_status)
  const returnStatusColors = decideBadgeColor(event.raw.return.status)
  const fulfillStatusColors = decideBadgeColor(event.raw.fulfillment_status)

  const actions = []
  if (event.raw.payment_status !== "captured") {
    actions.push({
      label: "Capture Payment",
      onClick: () => onCapturePayment(event.raw._id),
    })
  }

  if (event.raw.fulfillment_status === "not_fulfilled") {
    actions.push({
      label: "Fulfill Swap...",
      onClick: () => {
        console.log(event.raw.additional_items)
        onFulfillSwap(event.raw)
      },
    })
  }

  if (event.raw.return.status === "requested") {
    actions.push({
      label: "Receive Return...",
      onClick: () =>
        onReceiveReturn({
          ...event.raw.return,
          swap_id: event.raw._id,
          is_swap: true,
        }),
    })
  }

  if (event.raw.status === "pending") {
    actions.push({
      label: "Cancel swap",
      variant: "danger",
      onClick: onCancelSwap,
    })
  }

  return (
    <Flex>
      <Box width={"100%"} sx={{ borderBottom: "hairline" }} pb={3} mb={3}>
        <Flex mb={3} px={3} width={"100%"} justifyContent="space-between">
          <Box>
            <Flex mb={2}>
              <Text mr={3} fontSize={1} color="grey">
                Swap
              </Text>
              <Badge color={payStatusColors.color} bg={payStatusColors.bgColor}>
                {event.raw.payment_status}
              </Badge>
            </Flex>
            <Text fontSize="11px" color="grey">
              {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
            </Text>
          </Box>
          <Dropdown>
            {actions.map(o => (
              <Text color={o.variant} onClick={o.onClick}>
                {o.label}
              </Text>
            ))}
          </Dropdown>
        </Flex>
        <Flex mx={3} justifyContent="space-between" alignItems="center">
          <Box>
            <Flex mb={2}>
              <Text mr={2}>Return items</Text>
              <Badge
                color={returnStatusColors.color}
                bg={returnStatusColors.bgColor}
              >
                {event.raw.return.status}
              </Badge>
            </Flex>
            {event.return_lines.map((lineItem, i) => (
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
        </Flex>
        <Flex mx={3} justifyContent="space-between" alignItems="center">
          <Box>
            <Flex mt={3} mb={2}>
              <Text mr={2}>New items</Text>
              <Badge
                color={fulfillStatusColors.color}
                bg={fulfillStatusColors.bgColor}
              >
                {event.raw.fulfillment_status}
              </Badge>
            </Flex>
            {event.items.map((lineItem, i) => (
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
        </Flex>
      </Box>
    </Flex>
  )
}
