import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import _ from "lodash"
import { Flex, Text, Box } from "rebass"
import { Input } from "@rebass/forms"
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
import GiftCard from "./gift-card"
import GiftCardDetail from "./gift-card/detail"

import useMedusa from "../../hooks/use-medusa"
import Button from "../../components/button"

const ProductIndex = () => {
  const { products, isLoading, refresh } = useMedusa("products")
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
        <Text mb={3}>Products</Text>
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/products/new`)} variant={"cta"}>
          New product
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
            placeholder="Search products"
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
      </Flex>
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
                onClick={() =>
                  navigate(
                    `/a/products${p.is_giftcard ? "/gift-card" : ""}/${p._id}`
                  )
                }
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
    <Router>
      <ProductIndex path="/" />
      <GiftCard path="gift-card/*" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Products
