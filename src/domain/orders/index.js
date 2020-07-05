import React from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Text, Box, Flex } from "rebass"
import styled from "@emotion/styled"

import Details from "./details"
import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
} from "../../components/table"
import Badge from "../../components/badge"

import useMedusa from "../../hooks/use-medusa"
import Spinner from "../../components/spinner"
import Button from "../../components/button"

const OrderNumCell = styled(Text)`
  color: #006fbb;
  z-index: 1000;

  &:hover {
    text-decoration: underline;
  }
`

const OrderIndex = ({}) => {
  const { orders, isLoading } = useMedusa("orders")

  return (
    <>
      <Flex>
        <Text mb={4}>Orders</Text>
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/orders/new`)} variant={"cta"}>
          New draft order
        </Button>
      </Flex>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHead>
            <TableRow
              p={0}
              sx={{
                background: "white",
              }}
            >
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Payment</TableHeaderCell>
              <TableHeaderCell>Fulfillment</TableHeaderCell>
              <TableHeaderCell>Items</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((el, i) => (
              <TableRow
                sx={{ cursor: "pointer" }}
                key={i}
                onClick={() => navigate(`/a/orders/${el._id}`)}
              >
                <TableDataCell>
                  <OrderNumCell>#{el._id}</OrderNumCell>
                </TableDataCell>
                <TableDataCell>{new Date().toDateString()}</TableDataCell>
                <TableDataCell>{el.email}</TableDataCell>
                <TableDataCell>
                  <Box>
                    <Badge color="#4f566b" bg="#e3e8ee">
                      {el.payment_status}
                    </Badge>
                  </Box>
                </TableDataCell>
                <TableDataCell>
                  <Box>
                    <Badge color="#4f566b" bg="#e3e8ee">
                      {el.fulfillment_status}
                    </Badge>
                  </Box>
                </TableDataCell>
                <TableDataCell>{el.items.length || 0}</TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}

const Orders = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Orders
