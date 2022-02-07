import React, { useMemo } from "react"
import { Box, Flex, Text } from "rebass"
import Badge from "../../../../../components/fundamentals/badge"
import Dropdown from "../../../../../components/dropdown"
import { decideBadgeColor } from "../../../../../utils/decide-badge-color"
import LineItem from "../../line-item"

import SwapShippingMethods from "./shipping-methods"

const ReturnOrderInformation = ({ event, onReceiveReturn, order }) => {
  const fontColor = event.isLatest ? "medusa" : "inactive"
  const returnStatusColors = decideBadgeColor(
    event.raw.return_order && event.raw.return_order.status
  )

  const actions = useMemo(() => {
    let actions = []
    if (event.raw.return_order.status === "requested") {
      actions.push({
        label: "Receive Return",
        onClick: () =>
          onReceiveReturn({
            ...event.raw.return_order,
            swap_id: event.raw.id,
            is_swap: true,
          }),
      })
    }
    return actions
  }, [event, onReceiveReturn])

  return (
    <Box>
      <Flex mb={3} justifyContent="space-between">
        <Flex alignItems="center">
          <Text color={fontColor} mr={3} fontWeight={500}>
            Return items
          </Text>
          <Badge
            color={returnStatusColors.color}
            bg={returnStatusColors.bgColor}
          >
            {event.raw.return_order.status}
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
            <Text onClick={action.onClick}>{action.label}</Text>
          </Dropdown>
        ))}
      </Flex>
      {event.return_lines.map((lineItem, i) => (
        <LineItem
          fontColor={fontColor}
          key={lineItem.id}
          order={order}
          lineItem={lineItem}
        />
      ))}
      <Box mt={3}>
        <Text color={fontColor} fontSize={12} mb={2} fontWeight={500}>
          Return Method(s)
        </Text>
        <SwapShippingMethods
          shipping_methods={event.raw.return_order?.shipping_methods}
          currency={order.currency_code}
          taxRate={order.tax_rate}
          fontColor={fontColor}
        />
      </Box>
    </Box>
  )
}

export default ReturnOrderInformation
