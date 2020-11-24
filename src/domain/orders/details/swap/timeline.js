import React, { useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"
import ReactTooltip from "react-tooltip"

import { decideBadgeColor } from "../../../../utils/decide-badge-color"
import Typography from "../../../../components/typography"
import Badge from "../../../../components/badge"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"

import useMedusa from "../../../../hooks/use-medusa"

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
  const { store, isLoading, toaster } = useMedusa("store")

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
        <Flex mb={4} px={3} width={"100%"} justifyContent="space-between">
          <Box>
            <Flex mb={2}>
              <Text mr={100} fontSize={1} color="grey">
                Swap Requested
              </Text>
              <Box>
                {!isLoading && store.swap_link_template && (
                  <Text
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      var tempInput = document.createElement("input")
                      tempInput.value = store.swap_link_template.replace(
                        /\{cart_id\}/,
                        event.raw.cart_id
                      )
                      document.body.appendChild(tempInput)

                      tempInput.select()
                      document.execCommand("copy")
                      document.body.removeChild(tempInput)
                      toaster("Link copied to clipboard", "success")
                    }}
                    color="grey"
                    data-for={event.raw.cart_id}
                    data-tip={store.swap_link_template.replace(
                      /\{cart_id\}/,
                      event.raw.cart_id
                    )}
                  >
                    <ReactTooltip
                      id={event.raw.cart_id}
                      place="top"
                      effect="solid"
                    />
                    Copy Payment Link
                  </Text>
                )}
              </Box>
            </Flex>
            <Text fontSize="11px" color="grey">
              {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
            </Text>
            <Flex mt={4}>
              <Text mr={2} fontSize={1} color="grey">
                Payment Status
              </Text>
              <Badge
                mr={4}
                color={payStatusColors.color}
                bg={payStatusColors.bgColor}
              >
                {event.raw.is_paid ? event.raw.payment_status : "not_paid"}
              </Badge>
              <Text mr={2} fontSize={1} color="grey">
                Return Status
              </Text>
              <Badge
                mr={4}
                color={returnStatusColors.color}
                bg={returnStatusColors.bgColor}
              >
                {event.raw.return.status}
              </Badge>
              <Text mr={2} fontSize={1} color="grey">
                Fulfillment Status
              </Text>
              <Badge
                color={fulfillStatusColors.color}
                bg={fulfillStatusColors.bgColor}
              >
                {event.raw.fulfillment_status}
              </Badge>
            </Flex>
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
