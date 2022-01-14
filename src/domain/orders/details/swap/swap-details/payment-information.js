import React, { useMemo } from "react"
import { Box, Flex, Text } from "rebass"
import Badge from "../../../../../components/fundamentals/badge"
import CopyToClipboard from "../../../../../components/copy-to-clipboard"
import Divider from "../../../../../components/divider"
import Dropdown from "../../../../../components/dropdown"
import useMedusa from "../../../../../hooks/use-medusa"
import { decideBadgeColor } from "../../../../../utils/decide-badge-color"
import {
  computeShippingTotal,
  computeSubtotal,
} from "../../../../../utils/totals"

const AlignedDecimal = ({ value, currency }) => {
  const fixed = (value / 100).toFixed(2)
  const [numPart, decimalPart] = fixed.split(".")

  return (
    <Flex>
      <Box flex={1} textAlign="right">
        {numPart}
      </Box>
      .<div>{decimalPart}</div>
      <Box ml={2}>{currency.toUpperCase()}</Box>
    </Flex>
  )
}

const PaymentBreakdown = ({ swap, order, cart }) => {
  const returnShippingTotal = computeShippingTotal(
    swap.return_order.shipping_methods
  )
  const newItemsTotal = computeSubtotal(swap.additional_items)

  return (
    <>
      <Flex>
        <Box flex="1" pr={5}>
          <Text color="gray">Return total</Text>
          <Text pt={1} color="gray">
            Return shipping
          </Text>
          <Text pt={1} color="gray">
            Total for new items
          </Text>
          {cart.discount_total > 0 && (
            <Text pt={1} color="gray">
              Discount
            </Text>
          )}
          {cart.gift_card_total > 0 && (
            <Text pt={1} color="gray">
              Gift card(s)
            </Text>
          )}
          <Text pt={1} color="gray">
            Shipping
          </Text>
        </Box>
        <Box px={3}>
          <Text>
            <AlignedDecimal
              currency={order.currency_code}
              value={
                -swap.return_order.refund_amount * (1 + order.tax_rate / 100)
              }
            />
          </Text>
          <Text pt={1}>
            <AlignedDecimal
              currency={order.currency_code}
              value={returnShippingTotal * (1 + order.tax_rate / 100)}
            />
          </Text>
          <Text pt={1}>
            <AlignedDecimal
              currency={order.currency_code}
              value={newItemsTotal * (1 + order.tax_rate / 100)}
            />
          </Text>
          {cart.discount_total > 0 && (
            <Text pt={1}>
              <AlignedDecimal
                currency={order.currency_code}
                value={-cart.discount_total * (1 + order.tax_rate / 100)}
              />
            </Text>
          )}
          {cart.gift_card_total > 0 && (
            <Text pt={1}>
              <AlignedDecimal
                currency={order.currency_code}
                value={-cart.gift_card_total * (1 + order.tax_rate / 100)}
              />
            </Text>
          )}
          <Text pt={1}>
            <AlignedDecimal
              currency={order.currency_code}
              value={cart.shipping_total * (1 + order.tax_rate / 100)}
            />
          </Text>
        </Box>
      </Flex>
      <Box>
        <Divider my={2} />
        <Flex>
          <Box flex="1" pr={5}>
            <Text color="gray">Difference</Text>
          </Box>
          <Box px={3}>
            <Text>
              <AlignedDecimal
                currency={order.currency_code}
                value={cart.total}
              />
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box mt={3}>
        {swap.payment ? `Processed through ${swap.payment.provider_id}` : ""}
      </Box>
    </>
  )
}

const PaymentInformation = ({
  event,
  onProcessPayment,
  swap,
  order,
  paymentLink,
}) => {
  const paymentStatusColors = decideBadgeColor(event.raw.payment_status)

  const actions = useMemo(() => {
    let actions = []
    if (
      event.raw.payment_status !== "captured" &&
      event.raw.payment_status !== "difference_refunded" &&
      event.raw.canceled_at === null &&
      event.raw.difference_due !== 0
    ) {
      actions.push({
        label:
          event.raw.difference_due > 0
            ? "Capture Payment"
            : "Refund Difference",
        onClick: () => onProcessPayment(event.raw.id),
      })
    }
    return actions
  }, [event, onProcessPayment])

  return (
    <Box flexDirection="column">
      <Flex mb={3} justifyContent="space-between">
        <Flex alignItems="center">
          <Text mr={3} fontWeight={500}>
            Payment
          </Text>

          <Badge
            color={paymentStatusColors.color}
            bg={paymentStatusColors.bgColor}
          >
            {swap?.payment_status}
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
      <Box mb={2}>
        <CopyToClipboard
          label="Copy payment link"
          tooltipText={paymentLink}
          copyText={paymentLink}
        />
      </Box>
      <Box>
        <PaymentBreakdown order={order} swap={swap} cart={swap?.cart} />
      </Box>
    </Box>
  )
}

export default PaymentInformation
