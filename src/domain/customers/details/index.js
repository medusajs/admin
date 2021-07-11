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
  z-index: 1000;
  cursor: pointer;
  font-weight: 500;
  display: flex;

  align-items: center;

  &:hover {
    color: #454b54;
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

  const phone = customer.phone
    ? customer.phone
    : customer.shipping_addresses && customer?.shipping_addresses[0]
    ? customer?.shipping_addresses[0].phone
    : "N / A"

  return (
    <Flex flexDirection="column" mb={5} pt={5}>
      <Card mb={2}>
        <Card.Header>{customer.id}</Card.Header>
        <Box>
          <Text p={3} fontWeight="bold">
            {customer.email}
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Registered user
            </Text>
            <Badge ml={3} color="#4f566b" bg="#e3e8ee">
              {`${customer.has_account}`}
            </Badge>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Phone
            </Text>
            <Text pb={1}>{phone}</Text>
          </Box>
        </Card.Body>
      </Card>
      <Card mr={3} mb={2} width="100%">
        <Card.Header>Orders</Card.Header>
        <Card.Body flexDirection="column">
          {customer.orders.map(order => (
            <Flex pl={3} pr={2} py={2}>
              <OrderNumLink
                onClick={() => navigate(`/a/orders/${order.id}`)}
                color={"link"}
              >
                Order #{order.display_id}
              </OrderNumLink>
              <Card.VerticalDivider mx={3} />
              <Flex justifyContent="space-evenly">
                <Text>
                  {moment(order.created_at).format("MMMM Do YYYY HH:mm a")}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Card.Body>
      </Card>
      <Card mr={3} mb={2} width="100%">
        <Card.Header>Shipping addresses</Card.Header>
        <Card.Body flexDirection="column">
          {_.uniqBy(customer.shipping_addresses, val =>
            [val.address_1, val.first_name, val.last_name].join()
          ).map(sa => (
            <Flex pl={3} pr={2} py={2} flexDirection="column">
              <Flex>
                <Text pt={2} mr={1}>
                  {sa.first_name} {sa.last_name},
                </Text>
                <Text pt={2} mr={1}>
                  {sa.address_1},
                </Text>
                {sa.address_2 && <Text pt={2}>{sa.address_2}</Text>}
              </Flex>
              <Flex>
                <Text pt={2} mr={1}>
                  {sa.postal_code} {sa.city}, {sa.country_code}
                </Text>
                <Text pt={2}>{sa.country}</Text>
              </Flex>
            </Flex>
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
