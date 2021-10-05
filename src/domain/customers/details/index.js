import React, { useEffect, useState } from "react"
import { Text, Flex, Box } from "rebass"
import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableDataCell,
  TableHeaderRow,
  TableRow,
  DefaultCellContent,
  BadgdeCellContent,
} from "../../../components/table"
import styled from "@emotion/styled"
import ReactJson from "react-json-view"
import moment from "moment"
import _ from "lodash"

import Card from "../../../components/card"
import Badge from "../../../components/badge"
import Spinner from "../../../components/spinner"
import EditCustomer from "./edit"

import { decideBadgeColor } from "../../../utils/decide-badge-color"
import { extractOptionPrice } from "../../../utils/prices"

import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"

const CustomerDetail = ({ id }) => {
  const { customer, isLoading, toaster, update } = useMedusa("customers", {
    id,
  })

  const [orders, setOrders] = useState([])
  const [hasFetchedOrders, setHasFetchedOrders] = useState(false)
  const [editCustomer, setEditCustomer] = useState(false)

  useEffect(() => {
    if (!hasFetchedOrders) {
      Medusa.orders.list({ customer_id: id }).then(resp => {
        setOrders(resp.data.orders)
        setHasFetchedOrders(true)
      })
    }
  }, [])

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  let name =
    (customer.first_name ? customer.first_name : "") +
    (customer.last_name ? ` ${customer.last_name}` : "")
  if (!name) name = "N / A"

  const phone = customer.phone
    ? customer.phone
    : customer.shipping_addresses && customer?.shipping_addresses[0]
    ? customer?.shipping_addresses[0].phone
    : "N / A"

  const customerDropdown = [
    {
      label: "Edit customer",
      onClick: () => {
        setEditCustomer(true)
      },
    },
  ]

  const registered = customer.has_account ? "registered" : "not_registered"

  return (
    <Flex flexDirection="column" mb={5} pt={5}>
      <Card mb={2}>
        <Card.Header dropdownOptions={customerDropdown}>
          {customer.email}
        </Card.Header>
        <Box pl={3}>
          <Text fontWeight="bold">
            {customer.orders.length} order
            {customer.orders.length > 1 ? "s" : ""}
          </Text>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              First seen at
            </Text>
            <Text pb={1}>
              {" "}
              {moment(customer.created_at).format("MMMM Do YYYY HH:mm a")}
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Name
            </Text>
            <Text pb={1}>{name}</Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Phone
            </Text>
            <Text pb={1}>{phone}</Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Registered user
            </Text>
            <Badge
              color={decideBadgeColor(registered).color}
              bg={decideBadgeColor(registered).bgColor}
            >
              {`${customer.has_account}`}
            </Badge>
          </Box>
        </Card.Body>
      </Card>
      {editCustomer && (
        <EditCustomer
          customer={customer}
          toaster={toaster}
          onUpdate={update}
          onDismiss={() => setEditCustomer(false)}
        />
      )}
      <Card mr={3} mb={2} width="100%">
        <Card.Header>Orders</Card.Header>
        <Card.Body flexDirection="column">
          <Table>
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell>Order</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Fulfillment</TableHeaderCell>
                <TableHeaderCell>Payment</TableHeaderCell>
                <TableHeaderCell>Total</TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {orders?.map((order, i) => (
                <TableRow
                  key={i}
                  to={`/a/orders/${order.id}`}
                  id={`order-${order.id}`}
                >
                  <TableDataCell color="link">
                    <DefaultCellContent>#{order.display_id}</DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {moment(order.created_at).format("MMMM Do YYYY HH:mm a")}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <BadgdeCellContent>
                      <Badge
                        color={decideBadgeColor(order.fulfillment_status).color}
                        bg={decideBadgeColor(order.fulfillment_status).bgColor}
                      >
                        {order.fulfillment_status}
                      </Badge>
                    </BadgdeCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <BadgdeCellContent>
                      <Badge
                        color={decideBadgeColor(order.payment_status).color}
                        bg={decideBadgeColor(order.payment_status).bgColor}
                      >
                        {order.payment_status}
                      </Badge>
                    </BadgdeCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {extractOptionPrice(order.total, order.region)}
                    </DefaultCellContent>
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
