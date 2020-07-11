import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"

import moment from "moment"

import testThumbnail from "./thumbnail-test.jpg"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"

import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"

const LineItem = ({ lineItem }) => (
  <Flex pl={3} pt={3} alignItems="center">
    <Flex alignItems="center" pr={3}>
      <Image
        src={testThumbnail}
        sx={{
          width: 50,
          height: 50,
        }}
      />
      <Text ml={3}>{lineItem.title}</Text>
    </Flex>
    <Flex px={3} py={3}>
      <Text color="gray">
        {!Array.isArray(lineItem.content) && lineItem.content.unit_price}
      </Text>
      <Text px={2} color="gray">
        {" "}
        x{" "}
      </Text>
      <Text color="gray">{lineItem.quantity}</Text>
      <Text pl={5}>
        {!Array.isArray(lineItem.content) &&
          lineItem.content.unit_price * lineItem.quantity}
      </Text>
    </Flex>
  </Flex>
)

const OrderDetails = ({ id }) => {
  const [isHandlingOrder, setIsHandlingOrder] = useState(false)
  const { order, isLoading, refresh } = useMedusa("orders", { id })

  const dropdownOptions = [
    { label: "lol", onClick: () => console.log("ROFLMAO") },
  ]

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
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
            {order.total} {order.region.currency_code}
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Date
            </Text>
            <Text>{moment(order.created).format("MMMM Do YYYY, h:mm:ss")}</Text>
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
        <Card.Header dropdownOptions={dropdownOptions}>Items</Card.Header>
        <Card.Body flexDirection="column">
          {order.items.map((lineItem, i) => (
            <LineItem key={i} lineItem={lineItem} />
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
          dropdownOptions={dropdownOptions}
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
              {order.shipping_address.postal_code} {order.shipping_address.city}
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
  )
}

export default OrderDetails
