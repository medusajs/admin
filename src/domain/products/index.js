import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import _ from "lodash"
import { Flex, Text, Box, Image } from "rebass"
import { Input } from "@rebass/forms"
import { Router } from "@reach/router"

import ImagePlaceholder from "../../assets/svg/image-placeholder.svg"

import Spinner from "../../components/spinner"
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableBody,
  TableRow,
  TableDataCell,
  TableLinkRow,
  DefaultCellContent,
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
    filtersOnLoad.limit = 20
  }

  const { store } = useMedusa("store")

  const { products, hasCache, isLoading, refresh, isReloading } = useMedusa(
    "products",
    {
      search: {
        ...filtersOnLoad,
        fields: "id,title,thumbnail",
        expand: "variants,variants.prices,collection",
      },
    }
  )
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [storeCurrencies, setStoreCurrencies] = useState([])

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
      fields: "id,title,thumbnail",
      expand: "variants,variants.prices,collection",
      q: query,
      offset: 0,
      limit: 20,
    }

    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({ search })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      fields: "id,title,thumbnail",
      expand: "variants,variants.prices,collection",
      q: query,
      offset: updatedOffset,
      limit,
    }
    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)

    refresh({ search }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const moreResults = products && products.length >= limit

  useEffect(() => {
    if (store?.currencies) {
      const currencyCodes = store.currencies.map(c => c.code)
      setStoreCurrencies(currencyCodes)
    }
  }, [store])

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Flex>
        <Text mb={3} fontSize={20} fontWeight="bold">
          Products
        </Text>
      </Flex>
      <Flex>
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
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/products/new`)} variant={"cta"}>
          New product
        </Button>
      </Flex>
      {(isLoading && !hasCache) || isReloading ? (
        <Flex
          flexDirection="column"
          alignItems="center"
          height="100vh"
          mt="20%"
        >
          <Box height="50px" width="50px">
            <Spinner dark />
          </Box>
        </Flex>
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Collection</TableHeaderCell>
              <TableHeaderCell>Inventory</TableHeaderCell>
              <TableHeaderCell />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {products.map(p => {
              const missingVariantPrices = p.variants.map(v => {
                const variantPriceCurrencies = v.prices.map(
                  vp => vp.currency_code
                )

                return _.difference(storeCurrencies, variantPriceCurrencies)
                  .length
              })

              const missingPrices = _.sum(missingVariantPrices)

              return (
                <TableLinkRow
                  key={p.id}
                  to={`/a/products${p.is_giftcard ? "/gift-card" : ""}/${p.id}`}
                >
                  <TableDataCell
                    maxWidth="75px"
                    p={2}
                    height="100%"
                    textAlign="center"
                  >
                    <DefaultCellContent>
                      <Image
                        src={p.thumbnail || ImagePlaceholder}
                        height={38}
                        width={38}
                        p={!p.thumbnail && "8px"}
                        sx={{
                          objectFit: "contain",
                          border: "1px solid #f1f3f5",
                        }}
                      />
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>{p.title}</DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {p.collection?.title || "-"}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {p.variants.reduce(
                        (acc, next) => acc + next.inventory_quantity,
                        0
                      )}
                      {" in stock for "}
                      {p.variants.length} variant(s)
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {missingPrices > 0
                        ? `${missingPrices} variant price(s) missing`
                        : "-"}
                    </DefaultCellContent>
                  </TableDataCell>
                </TableLinkRow>
              )
            })}
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
