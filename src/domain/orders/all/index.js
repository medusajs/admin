import React from "react"
import {
  Table,
  TableBody,
  TableHeaderRow,
  TableRow,
  TableDataCell,
} from "../../../components/table"
import { Text, Box, Link } from "rebass"
import styled from "@emotion/styled"
import Badge from "../../../components/badge"

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const OrderNumCell = styled(Text)`
  color: #006fbb;

  &:hover {
    text-decoration: underline;
  }
`

const AllProducts = ({}) => {
  return (
    <>
      <Text mb={4}>Orders</Text>
      <Table>
        <TableBody>
          {/* TABLE HEADER */}
          <TableHeaderRow>
            <TableDataCell>Order</TableDataCell>
            <TableDataCell>Date</TableDataCell>
            <TableDataCell>Customer</TableDataCell>
            <TableDataCell>Payment</TableDataCell>
            <TableDataCell>Fulfillment</TableDataCell>
            <TableDataCell>Items</TableDataCell>
          </TableHeaderRow>
          {/* TABLE HEADER */}
          {Array(40)
            .fill()
            .map(el => (
              <StyledLink href={`/a/orders/42`}>
                <TableRow>
                  <TableDataCell>
                    <OrderNumCell>#123456789</OrderNumCell>
                  </TableDataCell>
                  <TableDataCell>{new Date().toDateString()}</TableDataCell>
                  <TableDataCell>oliver@mrbltech.com</TableDataCell>
                  <TableDataCell>
                    <Box>
                      <Badge color="#4f566b" bg="#e3e8ee">
                        Awaiting
                      </Badge>
                    </Box>
                  </TableDataCell>
                  <TableDataCell>
                    <Box>
                      <Badge color="#4f566b" bg="#e3e8ee">
                        Not fulfilled
                      </Badge>
                    </Box>
                  </TableDataCell>
                  <TableDataCell>5</TableDataCell>
                </TableRow>
              </StyledLink>
            ))}
        </TableBody>
      </Table>
    </>
  )
}

export default AllProducts
