import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"

import useMedusa from "../../../hooks/use-medusa"
import Badge from "../../../components/badge"

const DiscountDetails = ({ id }) => {
  const { discount, isLoading } = useMedusa("discounts", { id })

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
          action={{
            label: "Disable",
            onClick: () => {
              console.log("complete")
            },
          }}
        >
          {discount._id}
        </Card.Header>
        <Box>
          <Text p={3} fontWeight="bold">
            {discount.code}
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Disabled
            </Text>
            <Text pt={1} width="100%" textAlign="center">
              <Badge width="100%" color="#4f566b" bg="#e3e8ee">
                {`${discount.disabled}`}
              </Badge>
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Valid regions
            </Text>
            {discount.regions.map(r => (
              <Text pt={1}>{r}</Text>
            ))}
          </Box>
          <Card.VerticalDivider mx={3} />
        </Card.Body>
      </Card>
      <Card mb={2}>
        <Card.Header>Discount rule</Card.Header>
        <Card.Body>
          <Box pl={3} pr={5}>
            <Text color="gray">Description</Text>
            <Text pt={1} color="gray">
              Type
            </Text>
            <Text pt={1} color="gray">
              Value
            </Text>
            <Text pt={1} color="gray">
              Allocation method
            </Text>
          </Box>
          <Box px={3}>
            <Text>{discount.discount_rule.description}</Text>
            <Text pt={1}>{discount.discount_rule.type}</Text>
            <Text pt={1}>{discount.discount_rule.value}</Text>
            <Text pt={1}>{discount.discount_rule.allocation}</Text>
          </Box>
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default DiscountDetails
