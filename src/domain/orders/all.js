import React from "react"
import {
  Table,
  TableBody,
  TableHeaderRow,
  TableRow,
  TableHeaderCell,
  TableDataCell,
} from "../../components/table"
import { Text } from "rebass"

const AllProducts = ({}) => {
  return (
    <>
      <Text mb={4}>Orders</Text>
      <Table>
        <TableBody>
          {/* TABLE HEADER */}
          <TableHeaderRow>
            <TableHeaderCell>Order</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>Payment</TableHeaderCell>
            <TableHeaderCell>Fulfillment</TableHeaderCell>
            <TableHeaderCell>Items</TableHeaderCell>
          </TableHeaderRow>
          {/* TABLE HEADER */}
          {Array(40)
            .fill()
            .map(el => (
              <TableRow>
                <TableDataCell>#123456789</TableDataCell>
                <TableDataCell>{new Date().toDateString()}</TableDataCell>
                <TableDataCell>oliver@mrbltech.com</TableDataCell>
                <TableDataCell>Captured</TableDataCell>
                <TableDataCell>Not fulfilled</TableDataCell>
                <TableDataCell>5</TableDataCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  )
}

export default AllProducts
