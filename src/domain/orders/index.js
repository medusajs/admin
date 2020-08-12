import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import _ from "lodash"
import { Router } from "@reach/router"
import { Text, Box, Flex } from "rebass"
import { Input } from "@rebass/forms"
import styled from "@emotion/styled"
import moment from "moment"

import Details from "./details"
import New from "./new"
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
import Filter from "./filter-dropdown"

const OrderNumCell = styled(Text)`
  color: #006fbb;
  z-index: 1000;

  &:hover {
    text-decoration: underline;
  }
`

const OrderIndex = ({}) => {
  const { orders, isLoading, refresh } = useMedusa("orders")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState({ open: false, filter: "" })
  const [fulfillmentFilter, setFulfillmentFilter] = useState({
    open: false,
    filter: "",
  })
  const [paymentFilter, setPaymentFilter] = useState({
    open: false,
    filter: "",
  })

  const getFilterString = () => {
    let filterString = ""
    if (statusFilter.filter) {
      filterString += `&status=${statusFilter.filter}`
    }
    if (fulfillmentFilter.filter) {
      filterString += `&fulfillment_status=${fulfillmentFilter.filter}`
    }
    if (paymentFilter.filter) {
      filterString += `&payment_status=${paymentFilter.filter}`
    }
    return filterString
  }

  const searchQuery = search => {
    const filters = getFilterString()
    if (filters) {
      refresh({ search, filters: getFilterString() })
    } else {
      refresh({ search })
    }
  }

  const delayedQuery = useCallback(
    _.debounce(q => searchQuery(q), 500),
    [statusFilter, fulfillmentFilter, paymentFilter]
  )

  useEffect(() => {
    delayedQuery(query)
  }, [query])

  const submit = () => {
    refresh({ filters: getFilterString() })
  }

  const clear = () => {
    refresh()
  }

  return (
    <>
      <Flex>
        <Text mb={4}>Orders</Text>
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/orders/new`)} variant={"cta"}>
          New draft order
        </Button>
      </Flex>
      <Flex>
        <Box ml="auto" />
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={3}>
          <Input
            height="28px"
            fontSize="12px"
            id="email"
            name="q"
            type="text"
            placeholder="Search orders"
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Filter
          submitFilters={submit}
          clearFilters={clear}
          statusFilter={statusFilter}
          fulfillmentFilter={fulfillmentFilter}
          paymentFilter={paymentFilter}
          setStatusFilter={setStatusFilter}
          setPaymentFilter={setPaymentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
        />
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
                <TableDataCell>
                  {moment(el.created).format("MMMM Do YYYY")}
                </TableDataCell>
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
      <New path="/new" />
      <Details path=":id" />
    </Router>
  )
}

export default Orders
