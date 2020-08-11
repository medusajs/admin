import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"

import moment from "moment"

import testThumbnail from "./thumbnail-test.jpg"
import ReturnMenu from "./returns"
import RefundMenu from "./refund"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"

import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"

const LineItem = ({ lineItem, currency }) => (
  <Flex pl={3} pt={3} alignItems="center">
    <Flex flex="50% 0 0" alignItems="center" pr={3}>
      <Image
        src={testThumbnail}
        sx={{
          width: 50,
          height: 50,
        }}
      />
      <Text ml={3} mr={5}>
        <Box>{lineItem.title}</Box>
        <Box>{lineItem.content.variant.sku}</Box>
      </Text>
      <Text color="gray">
        {!Array.isArray(lineItem.content) && lineItem.content.unit_price}{" "}
        {currency}
      </Text>
      <Text px={2} color="gray">
        x
      </Text>
      <Text color="gray">
        {lineItem.returned_quantity ? (
          <>
            <strike>{lineItem.quantity}</strike>{" "}
            {lineItem.quantity - lineItem.returned_quantity}
          </>
        ) : (
          lineItem.quantity
        )}
      </Text>
    </Flex>
    <Flex flex="30% 0 0" px={3} py={3}>
      <Text pl={5}>
        {!Array.isArray(lineItem.content) &&
          lineItem.content.unit_price * lineItem.quantity}{" "}
        {currency}
      </Text>
    </Flex>
  </Flex>
)

const OrderDetails = ({ id }) => {
  const [showRefund, setShowRefund] = useState(false)
  const [showReturnMenu, setShowReturnMenu] = useState(false)
  const [isHandlingOrder, setIsHandlingOrder] = useState(false)
  const {
    order,
    capturePayment,
    return: returnOrder,
    refund,
    isLoading,
    refresh,
  } = useMedusa("orders", {
    id,
  })

  const dropdownOptions = [
    { label: "lol", onClick: () => console.log("ROFLMAO") },
  ]

  const itemOptions = [
    { label: "Register returns...", onClick: () => setShowReturnMenu(true) },
  ]

  const paymentOptions = []

  if (!isLoading && order) {
    if (order.payment_status !== "captured") {
      paymentOptions.push({
        label: "Capture Payment",
        onClick: () => capturePayment(),
      })
    } else {
      paymentOptions.push({
        label: "Create Refund...",
        onClick: () => setShowRefund(true),
      })
    }
  }

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  const returns = order.returns.map(r => {
    const items = r.items.map(i => {
      const line = order.items.find(({ _id }) => i.item_id === _id)
      return {
        item: line,
        quantity: i.quantity,
      }
    })
    return {
      items,
      refund_amount: r.refund_amount,
    }
  })

  return (
    <>
      <Flex flexDirection="column" mb={5}>
        <Card mb={2}>
          <Card.Header
            badge={{ label: order.status }}
            dropdownOptions={dropdownOptions}
            action={
              order.status !== "archived" && {
                type: "",
                label: order.status === "completed" ? "Archive" : "Complete",
                onClick: () => {
                  setIsHandlingOrder(true)
                  if (order.status === "completed") {
                    Medusa.orders.archive(order._id).then(refresh)
                  } else if (order.status === "pending") {
                    Medusa.orders.complete(order._id).then(refresh)
                  }
                  setIsHandlingOrder(false)
                },
                isLoading: isHandlingOrder,
              }
            }
          >
            {order._id}
          </Card.Header>
          <Box>
            <Text p={3} fontWeight="bold">
              {order.refunded_total ? (
                <>
                  <strike>
                    {order.total} {order.region.currency_code}
                  </strike>{" "}
                  {order.total - order.refunded_total} {order.currency_code}
                </>
              ) : (
                <>
                  {order.total} {order.region.currency_code}
                </>
              )}
            </Text>
          </Box>
          <Card.Body>
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Date
              </Text>
              <Text>
                {moment(order.created).format("MMMM Do YYYY, h:mm:ss")}
              </Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Customer
              </Text>
              <Text>{order.email}</Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Payment
              </Text>
              <Text>{order.payment_method.provider_id}</Text>
            </Box>
          </Card.Body>
        </Card>
        {/* Line items */}
        <Card mb={2}>
          <Card.Header dropdownOptions={itemOptions}>Items</Card.Header>
          <Card.Body flexDirection="column">
            {order.items.map((lineItem, i) => (
              <LineItem
                key={i}
                currency={order.currency_code}
                lineItem={lineItem}
              />
            ))}
            {returns.map(r => (
              <Flex flexDirection="column" width={1}>
                <Box
                  px={3}
                  mx={2}
                  my={3}
                  sx={{ borderRight: "hairline" }}
                  height={30}
                  width={"1px"}
                />
                <Box px={3}>Return</Box>
                <Flex pl={3} mt={3} width={1}>
                  <Flex flex="50% 0 0" pr={3}>
                    <Image
                      src={testThumbnail}
                      sx={{
                        width: 50,
                        height: 50,
                      }}
                    />
                    <Box ml={3} mr={5}>
                      {r.items.map(i => (
                        <>
                          <Box>
                            {i.quantity} x {i.item.title}
                          </Box>
                          <Box>{i.item.content.variant.sku}</Box>
                        </>
                      ))}
                    </Box>
                  </Flex>
                  <Flex flex="30% 0 0" px={3} py={3}>
                    <Text pl={5}>
                      {r.refund_amount} {order.currency_code}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            ))}
            <Flex px={3} pt={3}>
              <Text pr={5}>Total</Text>
              <Text>
                {order.subtotal} {order.region.currency_code}
              </Text>
            </Flex>
          </Card.Body>
        </Card>
        {/* PAYMENT */}
        <Card mb={2}>
          <Card.Header
            badge={{ label: order.payment_status }}
            dropdownOptions={paymentOptions}
          >
            Payment
          </Card.Header>
          <Card.Body>
            <Box pl={3} pr={5}>
              <Text color="gray">Subtotal</Text>
              <Text pt={1} color="gray">
                Shipping
              </Text>
              <Text pt={1} color="gray">
                Tax
              </Text>
              <Text pt={2}>Total</Text>
              {order.refunded_total > 0 && <Text pt={2}>Refunded</Text>}
            </Box>
            <Box px={3}>
              <Text>
                {order.subtotal} {order.region.currency_code}
              </Text>
              <Text pt={1}>
                {order.shipping_total} {order.region.currency_code}
              </Text>
              <Text pt={1}>
                {order.tax_total} {order.region.currency_code}
              </Text>
              <Text pt={2}>
                {order.total} {order.region.currency_code}
              </Text>
              {order.refunded_total > 0 && (
                <Text pt={2}>
                  {order.refunded_total} {order.currency_code}
                </Text>
              )}
            </Box>
          </Card.Body>
        </Card>
        {/* FULFILLMENT */}
        <Card mb={2}>
          <Card.Header
            badge={{ label: order.fulfillment_status }}
            dropdownOptions={dropdownOptions}
          >
            Fulfillment
          </Card.Header>
          <Card.Body>
            <Box pl={3} pr={5}>
              <Text pt={1} color="gray">
                Tracking #
              </Text>
              <Text pt={1} color="gray">
                Method
              </Text>
            </Box>
            <Box px={3}>
              <Text pt={1}>123456789</Text>
              <Text pt={1}>GLS Express</Text>
            </Box>
          </Card.Body>
        </Card>
        {/* CUSTOMER */}
        <Card mr={3} width="100%">
          <Card.Header dropdownOptions={dropdownOptions}>Customer</Card.Header>
          <Card.Body>
            <Box px={3}>
              <Text color="gray">Contact</Text>
              <Text pt={3}>
                {order.first_name} {order.last_name}
              </Text>
              <Text pt={2}>{order.email}</Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box px={3}>
              <Text color="gray">Shipping</Text>
              <Text pt={3}>{order.shipping_address.address_1}</Text>
              <Text pt={2}>
                {order.shipping_address.postal_code}{" "}
                {order.shipping_address.city}
              </Text>
              <Text pt={2}>{order.shipping_address.country}</Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box px={3}>
              <Text color="gray">Billing</Text>
              <Text pt={3}>{order.billing_address.address_1}</Text>
              <Text pt={2}>
                {order.billing_address.postal_code} {order.billing_address.city}
              </Text>
              <Text pt={2}>{order.billing_address.country}</Text>
            </Box>
          </Card.Body>
        </Card>
      </Flex>
      {showReturnMenu && (
        <ReturnMenu
          onReturn={returnOrder}
          order={order}
          onDismiss={() => setShowReturnMenu(false)}
        />
      )}
      {showRefund && (
        <RefundMenu
          onRefund={refund}
          order={order}
          onDismiss={() => setShowRefund(false)}
        />
      )}
    </>
  )
}

export default OrderDetails
