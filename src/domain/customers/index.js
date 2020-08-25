import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Input } from "@rebass/forms"
import { Text, Flex, Box } from "rebass"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
  TableHeaderRow,
} from "../../components/table"
import Spinner from "../../components/spinner"

const CustomerIndex = () => {
  const { customers, isLoading, refresh } = useMedusa("customers")

  const [query, setQuery] = useState("")

  const searchQuery = search => {
    refresh({ search })
  }

  const delayedQuery = useCallback(
    _.debounce(q => searchQuery(q), 500),
    []
  )

  useEffect(() => {
    delayedQuery(query)
  }, [query])

  return (
    <Flex flexDirection="column">
      <Flex>
        <Text mb={3}>Customers</Text>
      </Flex>
      <Flex>
        <Box ml="auto" />
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={3}>
          <Input
            height="28px"
            fontSize="12px"
            name="q"
            type="text"
            placeholder="Search customers"
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
      </Flex>
      {isLoading ? (
        <Flex
          flexDirection="column"
          alignItems="center"
          height="100vh"
          mt="auto"
        >
          <Box height="75px" width="75px" mt="50%">
            <Spinner dark />
          </Box>
        </Flex>
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>First name</TableHeaderCell>
              <TableHeaderCell>Last name</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {customers.map((el, i) => (
              <TableRow
                key={i}
                onClick={() => navigate(`/a/customers/${el._id}`)}
              >
                <TableDataCell>{el.email ? el.email : ""}</TableDataCell>
                <TableDataCell>
                  {el.first_name ? el.first_name : "John"}
                </TableDataCell>
                <TableDataCell>
                  {el.last_name ? el.last_name : "Doe"}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Flex>
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
