import React from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import { Text, Flex } from "rebass"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
} from "../../components/table"
import Spinner from "../../components/spinner"

const CustomerIndex = () => {
  const { customers, isLoading } = useMedusa("customers")

  return (
    <>
      <Flex>
        <Text mb={4}>Customers</Text>
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
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>First name</TableHeaderCell>
              <TableHeaderCell>Last name</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers &&
              customers.map((el, i) => (
                <TableRow
                  sx={{ cursor: "pointer" }}
                  key={i}
                  onClick={() => navigate(`/a/customers/${el._id}`)}
                >
                  <TableDataCell>{el.email}</TableDataCell>
                  <TableDataCell>{el.first_name}</TableDataCell>
                  <TableDataCell>{el.last_name}</TableDataCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
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
