import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"

import testThumbnail from "./thumbnail-test.jpg"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"

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
  const { order, isLoading } = useMedusa("orders", { id })

  const dropdownOptions = [
    { label: "lol", onClick: () => console.log("ROFLMAO") },
  ]

  if (isLoading) {
    return (
      <Flex flexDirection="column" mb={5}>
        <Spinner dark />
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" mb={5}>
      <Card mb={2}>
        <Card.Header
          badge={{ label: "Pending" }}
          dropdownOptions={dropdownOptions}
          action={{
            label: "Complete Order",
            onClick: () => {
              console.log("complete")
            },
          }}
        >
          {order._id}
        </Card.Header>
        <Box>
          <Text p={3} fontWeight="bold">
            3000 DKK (ADD TOTAL HERE)
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Date
            </Text>
            <Text>Thursday, 25 June 2020 at 11.52</Text>
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
            <Text>4.485 DKK (ADD SUBTOTAL HERE)</Text>
          </Flex>
        </Card.Body>
      </Card>
      {/* PAYMENT */}
      <Card mb={2}>
        <Card.Header
          badge={{ label: "Awaiting" }}
          action={{
            label: "Capture",
            type: "primary",
            onClick: () => console.log("Capture"),
          }}
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
            <Text>4485.00 DKK</Text>
            <Text pt={1}>FREE</Text>
            <Text pt={1}>846.25 DKK</Text>
            <Text pt={2}>4485.00 DKK</Text>
          </Box>
        </Card.Body>
      </Card>
      {/* FULFILLMENT */}
      <Card mb={2}>
        <Card.Header
          badge={{ label: "Not fulfilled" }}
          action={{
            label: "Fulfill",
            type: "primary",
            onClick: () => console.log("Fulfill"),
          }}
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
            <Text pt={3}>Oliver Juhl</Text>
            <Text pt={2}>oliver@medusa.com</Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box px={3}>
            <Text color="gray">Shipping</Text>
            <Text pt={3}>Att.: Tekla</Text>
            <Text pt={2}>Frederiksholm Kanal 4</Text>
            <Text pt={2}>1220 Copenhagen</Text>
            <Text pt={2}>Denmark</Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box px={3}>
            <Text color="gray">Billing</Text>
            <Text pt={3}>Oliver Windall Juhl</Text>
            <Text pt={2}>Faksegade 7, 5. th</Text>
            <Text pt={2}>2100 Copenhagen</Text>
            <Text pt={2}>Denmark</Text>
          </Box>
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default OrderDetails
