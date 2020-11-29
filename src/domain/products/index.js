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
import useMedusa from "../../hooks/use-medusa"
import Button from "../../components/button"
import qs from "query-string"

const ProductIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 50
  }

  const { products, total_count, isLoading, refresh } = useMedusa("products", {
    search: filtersOnLoad,
  })
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)

  const onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      searchQuery()
    }
  }

  const searchQuery = () => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      q: query,
      offset: 0,
      limit: 50,
    }
    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.pushState(baseUrl, "", `?${prepared}`)
    refresh({ search })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      q: query,
      offset: 0,
      limit: 50,
    }
    const prepared = qs.stringify(
      {
        q: query,
        offset: updatedOffset,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)

    refresh({ search }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const moreResults = products && products.length >= limit

  return (
    <Flex flexDirection="column" mb={5}>
      <Flex>
        <Text mb={3}>Products</Text>
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/products/new`)} variant={"cta"}>
          New product
        </Button>
      </Flex>
      <Flex>
        <Box ml="auto" />
        <Box mb={3} sx={{ maxWidth: "300px" }}>
          <Input
            height="28px"
            fontSize="12px"
            name="q"
            type="text"
            placeholder="Search products"
            onKeyDown={onKeyDown}
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Button
          onClick={() => searchQuery()}
          variant={"primary"}
          fontSize="12px"
          ml={2}
        >
          Search
        </Button>
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
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Inventory</TableHeaderCell>
              <TableHeaderCell>Prices</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow
                key={p._id}
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
                <TableDataCell>
                  {p.variants[0].prices.length > 0
                    ? p.variants[0].prices
                        .sort((a, b) => {
                          if (a.currency_code < b.currency_code) {
                            return -1
                          }
                          if (a.currency_code > b.currency_code) {
                            return 1
                          }
                          return 0
                        })
                        .map(price => `${price.amount} ${price.currency_code}`)
                        .join(", ")
                    : "N / A"}
                </TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Flex mt={2}>
        <Box ml="auto" />
        <Button
          onClick={() => handlePagination("previous")}
          disabled={offset === 0}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          mr={1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePagination("next")}
          disabled={!moreResults}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          ml={1}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  )
}

const Products = () => {
  return (
    <Router>
      <ProductIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Products
