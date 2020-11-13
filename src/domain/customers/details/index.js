import React from "react"
import { navigate } from "gatsby"
import { Text, Flex, Box } from "rebass"
import styled from "@emotion/styled"
import ReactJson from "react-json-view"
import moment from "moment"
import _ from "lodash"

import Card from "../../../components/card"
import Badge from "../../../components/badge"
import Spinner from "../../../components/spinner"

import useMedusa from "../../../hooks/use-medusa"

const OrderNumLink = styled(Text)`
  color: #006fbb;
  z-index: 1000;
  cursor: pointer;
  width: 100px;

  &:hover {
    text-decoration: underline;
  }
`

const CustomerDetail = ({ id }) => {
  const { customer, isLoading } = useMedusa("customers", { id })

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
        <Card.Header>{customer._id}</Card.Header>
        <Box>
          <Text p={3} fontWeight="bold">
            {customer.email}
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Registered
              <Badge ml={3} color="#4f566b" bg="#e3e8ee">
                {`${customer.has_account}`}
              </Badge>
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
        </Card.Body>
      </Card>
      <Card mr={3} mb={2} width="100%">
        <Card.Header>Orders</Card.Header>
        <Card.Body flexDirection="column">
          {_.sortBy(customer.orders, "created")
            .reverse()
            .map(order => (
              <Flex pl={3} pr={2} py={2} display="flex">
                <OrderNumLink
                  onClick={() => navigate(`/a/orders/${order._id}`)}
                >
                  Order #{order.display_id}
                </OrderNumLink>
                <Card.VerticalDivider mx={3} />
                <Flex width="100px" justifyContent="center">
                  <Text ml={2}>{parseInt(order.total).toFixed(2)}</Text>
                  <Box ml="auto" />
                  <Text mr={2}>{order.currency_code}</Text>
                </Flex>
                <Card.VerticalDivider mx={3} />
                <Text>
                  {moment(order.created).format("MMMM Do YYYY HH:mm a")}
                </Text>
              </Flex>
            ))}
        </Card.Body>
      </Card>
      <Card mr={3} mb={2} width="100%">
        <Card.Header>Shipping addresses</Card.Header>
        <Card.Body>
          {customer.shipping_addresses.map(sa => (
            <Box px={3}>
              <Text pt={2}>
                {sa.first_name} {sa.last_name}
              </Text>
              <Text pt={2}>{sa.address_1}</Text>
              {sa.address_2 && <Text pt={2}>{sa.address_2}</Text>}
              <Text pt={2}>
                {sa.postal_code} {sa.city}, {sa.country_code}
              </Text>
              <Text pt={2}>{sa.country}</Text>
            </Box>
          ))}
        </Card.Body>
      </Card>
      {/* METADATA */}
      <Card mr={3} width="100%">
        <Card.Header>Raw customer</Card.Header>
        <Card.Body>
          <ReactJson
            name={false}
            collapsed={true}
            src={customer}
            style={{ marginLeft: "20px" }}
          />
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default CustomerDetail
