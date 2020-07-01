import React from "react"
import { navigate } from "gatsby"
import { Flex, Text } from "rebass"
import { Router } from "@reach/router"

import Spinner from "../../components/spinner"
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableBody,
  TableRow,
  TableDataCell,
} from "../../components/table"

import New from "./new"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

const ProductIndex = () => {
  const { products, isLoading } = useMedusa("products")

  return (
    <Flex flexDirection="column">
      <Text mb={4}>Products</Text>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Inventory</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow
                key={p._id}
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/a/products/${p._id}`)}
              >
                <TableDataCell>{p.title}</TableDataCell>
                <TableDataCell>
                  {p.variants.reduce(
                    (acc, next) => acc + next.inventory_quantity,
                    0
                  )}
                  {" in stock for "}
                  {p.variants.length} variants
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Flex>
  )
}

const Products = () => {
  return (
    <>
      <Router>
        <ProductIndex path="/" />
        <Details path=":id" />
        <New path="new" />
      </Router>
    </>
  )
}

export default Products
