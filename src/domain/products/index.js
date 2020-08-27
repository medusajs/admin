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
import qs from "query-string"

const ProductIndex = () => {
  const { products, total_count, isLoading, refresh } = useMedusa("products")
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
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)
    refresh({ search: `?${prepared}` })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset: updatedOffset,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.replaceState(baseUrl, "", `?${prepared}`)

    refresh({ search: `?${prepared}` }).then(() => {
      setOffset(updatedOffset)
    })
  }

  useEffect(() => {
    filtersOnLoad()
  }, [isLoading])

  const filtersOnLoad = () => {
    const existing = qs.parse(window.location.search)
    const baseUrl = qs.parseUrl(window.location.href).url

    if (!existing.offset) {
      existing.offset = offset
    }

    if (!existing.limit) {
      existing.limit = limit
    }

    const prepared = qs.stringify(existing, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.pushState(baseUrl, "", `?${prepared}`)

    refresh({ search: `?${prepared}` })
  }

  const moreResults = total_count > offset + limit

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
      <GiftCard path="gift-card/*" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Products
