import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { Text, Flex, Box, Card, Image } from "rebass"

import { ReactComponent as Ellipsis } from "../../../assets/svg/ellipsis.svg"
import testThumbnail from "./thumbnail-test.jpg"

import Dropdown from "../../../components/dropdown"
import Cta from "../../../components/cta"
import Button from "../../../components/button"
import Typography from "../../../components/typography"
import Badge from "../../../components/badge"

const StyledCard = styled(Card)`
  ${Typography.Base}

  box-shadow: 0 7px 20px 0 rgba(60,66,87,.08), 0 3px 6px 0 rgba(0,0,0,.12);
  border-radius: 5px;
  height: 100%;
`

const HorizontalDivider = styled(Box)`
  box-shadow: inset 0 -1px #e3e8ee;
  height: 1px;
`

const VerticalDivider = styled(Box)`
  box-shadow: inset -1px 0 #e3e8ee;
  width: 1px;
`

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
  return (
    <Flex flexDirection="column" mb={5}>
      <StyledCard mb={2}>
        <Flex alignItems="center">
          <Text p={3} fontWeight="bold">
            #42
          </Text>
          <Box>
            <Badge color="#4f566b" bg="#e3e8ee">
              Pending
            </Badge>
          </Box>
          <Box ml="auto" />
          <Cta mr={3} variant="cta">
            Complete order
          </Cta>
          <Dropdown>
            <Text>Lol</Text>
          </Dropdown>
        </Flex>
        <Box>
          <Text p={3} fontWeight="bold">
            4485.00 DKK
          </Text>
        </Box>
        <Flex pb={3}>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Date
            </Text>
            <Text>Thursday, 25 June 2020 at 11.52</Text>
          </Box>
          <VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Customer
            </Text>
            <Text>oliver@medusa.com</Text>
          </Box>
          <VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Payment
            </Text>
            <Text>Stripe</Text>
          </Box>
        </Flex>
      </StyledCard>
      {/* Line items */}
      <StyledCard mb={2}>
        <Flex alignItems="center">
          <Text p={3} fontWeight="bold">
            Items
          </Text>
          <Box ml="auto" />
          <Dropdown>
            <Text>Lol</Text>
          </Dropdown>
        </Flex>
        <HorizontalDivider />
        {Array(3)
          .fill(0)
          .map(lineItem => (
            <LineItem />
          ))}

        <Flex px={3} pt={3} pb={3}>
          <Text pr={5}>Total</Text>
          <Text>4.485 DKK</Text>
        </Flex>
      </StyledCard>
      {/* PAYMENT */}
      <StyledCard mb={2}>
        <Flex alignItems="center">
          <Text p={3} fontWeight="bold">
            Payment
          </Text>
          <Box>
            <Badge color="#4f566b" bg="#e3e8ee">
              Awaiting
            </Badge>
          </Box>
          <Box ml="auto" />
          <Flex>
            <Button
              mr={3}
              px={1}
              variant="primary"
              height="20px"
              lineHeight="1"
              fontSize={0}
              width="75px"
            >
              Capture
            </Button>
            <Dropdown>
              <Text>Lol</Text>
            </Dropdown>
          </Flex>
        </Flex>
        <HorizontalDivider />
        <Flex>
          <Box pl={3} py={3} pr={5}>
            <Text color="gray">Subtotal</Text>
            <Text pt={1} color="gray">
              Shipping
            </Text>
            <Text pt={1} color="gray">
              Tax
            </Text>
            <Text pt={2}>Total</Text>
          </Box>
          <Box px={3} py={3}>
            <Text>4485.00 DKK</Text>
            <Text pt={1}>FREE</Text>
            <Text pt={1}>846.25 DKK</Text>
            <Text pt={2}>4485.00 DKK</Text>
          </Box>
        </Flex>
      </StyledCard>
      {/* FULFILLMENT */}
      <StyledCard mb={2}>
        <Flex alignItems="center">
          <Text p={3} fontWeight="bold">
            Fulfillment
          </Text>
          <Box>
            <Badge color="#4f566b" bg="#e3e8ee">
              Not fulfilled
            </Badge>
          </Box>
          <Box ml="auto" />
          <Flex>
            <Button
              mr={3}
              px={1}
              variant="primary"
              height="20px"
              lineHeight="1"
              fontSize={0}
              width="75px"
            >
              Fulfill
            </Button>
            <Dropdown>
              <Text>Lol</Text>
            </Dropdown>
          </Flex>
        </Flex>
        <HorizontalDivider />
        <Flex>
          <Box pl={3} py={3} pr={5}>
            <Text pt={1} color="gray">
              Tracking #
            </Text>
            <Text pt={1} color="gray">
              Method
            </Text>
          </Box>
          <Box px={3} py={3}>
            <Text pt={1}>123456789</Text>
            <Text pt={1}>GLS Express</Text>
          </Box>
        </Flex>
      </StyledCard>
      {/* CUSTOMER */}
      <StyledCard mr={3} width="100%">
        <Flex alignItems="center">
          <Text p={3} fontWeight="bold">
            Customer
          </Text>
          <Box ml="auto" />
          <Dropdown>
            <Text>Lol</Text>
          </Dropdown>
        </Flex>
        <HorizontalDivider />
        <Flex>
          <Box>
            <Text px={3} pt={3} color="gray">
              Contact
            </Text>
            <Text px={3} pt={3}>
              Oliver Juhl
            </Text>
            <Text pb={3} px={3} pt={2}>
              oliver@medusa.com
            </Text>
          </Box>
          <VerticalDivider mt={3} mb={3} mx={3} />
          <Box>
            <Text px={3} pt={3} color="gray">
              Shipping
            </Text>
            <Text px={3} pt={3}>
              Att.: Tekla
            </Text>
            <Text px={3} pt={2}>
              Frederiksholm Kanal 4
            </Text>
            <Text px={3} pt={2}>
              1220 Copenhagen
            </Text>
            <Text pb={3} px={3} pt={2}>
              Denmark
            </Text>
          </Box>
          <VerticalDivider mt={3} mb={3} mx={3} />
          <Box>
            <Text px={3} pt={3} color="gray">
              Billing
            </Text>
            <Text px={3} pt={3}>
              Oliver Windall Juhl
            </Text>
            <Text px={3} pt={2}>
              Faksegade 7, 5. th
            </Text>
            <Text px={3} pt={2}>
              2100 Copenhagen
            </Text>
            <Text pb={3} px={3} pt={2}>
              Denmark
            </Text>
          </Box>
        </Flex>
      </StyledCard>
    </Flex>
  )
}

export default OrderDetails
