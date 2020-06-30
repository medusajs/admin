import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { Text, Flex, Box, Image } from "rebass"

import { ReactComponent as Ellipsis } from "../../../assets/svg/ellipsis.svg"
import testThumbnail from "./thumbnail-test.jpg"

import Dropdown from "../../../components/dropdown"
import Card from "../../../components/card"
import Cta from "../../../components/cta"
import Button from "../../../components/button"
import Typography from "../../../components/typography"
import Badge from "../../../components/badge"

const LineItem = () => (
  <Flex pl={3} pt={3} alignItems="center">
    <Flex alignItems="center" pr={3}>
      <Image
        src={testThumbnail}
        sx={{
          width: 50,
          height: 50,
        }}
      />
      <Text ml={3}>Lavender / Duvet / 220x180</Text>
    </Flex>
    <Flex px={3} py={3}>
      <Text color="gray">1495 DKK</Text>
      <Text px={2} color="gray">
        {" "}
        x{" "}
      </Text>
      <Text color="gray"> 1 </Text>
      <Text pl={5}>1495 DKK</Text>
    </Flex>
  </Flex>
)

const OrderDetails = () => {
  const dropdownOptions = [
    { label: "lol", onClick: () => console.log("ROFLMAO") },
  ]
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
          #42
        </Card.Header>
        <Box>
          <Text p={3} fontWeight="bold">
            4485.00 DKK
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
            <Text>oliver@medusa.com</Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Payment
            </Text>
            <Text>Stripe</Text>
          </Box>
        </Card.Body>
      </Card>
      {/* Line items */}
      <Card mb={2}>
        <Card.Header dropdownOptions={dropdownOptions}>Items</Card.Header>
        <Card.Body flexDirection="column">
          {Array(3)
            .fill(0)
            .map(lineItem => (
              <LineItem />
            ))}

          <Flex px={3} pt={3}>
            <Text pr={5}>Total</Text>
            <Text>4.485 DKK</Text>
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
