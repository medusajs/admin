import React, { useMemo } from "react"
import { Box, Flex, Text } from "rebass"
import Badge from "../../../../../components/fundamentals/badge"
import Dropdown from "../../../../../components/dropdown"
import { decideBadgeColor } from "../../../../../utils/decide-badge-color"
import LineItem from "../../line-item"
import SwapShippingInformation from "./shipping-information"
import SwapShippingMethods from "./shipping-methods"

const NewItemsInformation = ({ event, onFulfillSwap, order }) => {
  const fontColor = event.isLatest ? "medusa" : "inactive"
  const newStatusColors = decideBadgeColor(event.raw.fulfillment_status)

  const actions = useMemo(() => {
    let actions = []
    if (event.raw.fulfillment_status === "not_fulfilled") {
      actions.push({
        label: "Fulfill Swap",
        onClick: () => {
          onFulfillSwap(event.raw)
        },
      })
    }
    return actions
  }, [event, onFulfillSwap])

  return (
    <Box>
      <Flex mb={3} justifyContent="space-between">
        <Flex alignItems="center">
          <Text color={fontColor} mr={3} fontWeight={500}>
            New items
          </Text>
          <Badge color={newStatusColors.color} bg={newStatusColors.bgColor}>
            {event.raw.fulfillment_status}
          </Badge>
        </Flex>
        {actions.map(action => (
          <Dropdown
            key={action.label}
            topPlacement={5}
            minHeight="24px"
            width="28px"
            sx={{
              height: 0,
              padding: 0,
            }}
          >
            <Text color={fontColor} onClick={action.onClick}>
              {action.label}
            </Text>
          </Dropdown>
        ))}
      </Flex>
      {event.items.map(lineItem => (
        <LineItem
          fontColor={fontColor}
          key={lineItem.id}
          lineItem={lineItem}
          order={order}
        />
      ))}
      <Box color={fontColor} mt={3}>
        <SwapShippingInformation fontColor={fontColor} swap={event.raw} />
      </Box>
      <Box mt={3}>
        <Text color={fontColor} fontSize={12} mb={2} fontWeight={500}>
          Shipping Method(s)
        </Text>
        <SwapShippingMethods
          fontColor={fontColor}
          shipping_methods={event.raw?.shipping_methods}
          currency={order.currency_code}
          taxRate={order.tax_rate}
        />
      </Box>
    </Box>
  )
}

export default NewItemsInformation
