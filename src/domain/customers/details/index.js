import React from "react"
import { Text, Flex, Box } from "rebass"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"

import useMedusa from "../../../hooks/use-medusa"

const CustomerDetail = ({ id }) => {
  const { customer, isLoading } = useMedusa("customers", { id })

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
        <Card.Header>{customer._id}</Card.Header>
        <Box>
          <Text p={3} fontWeight="bold">
            {customer.email}
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              First name
            </Text>
            <Text pt={1} width="100%">
              {customer.first_name}
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Last name
            </Text>
            <Text pt={1} width="100%">
              {customer.last_name}
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default CustomerDetail
