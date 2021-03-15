import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import _ from "lodash"
import { Flex, Text, Box, Image } from "rebass"
import { Input } from "@rebass/forms"
import { Router } from "@reach/router"
import Medusa from "../../services/api"

import ImagePlaceholder from "../../assets/svg/image-placeholder.svg"
import ImportProducts from "./import"

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
  const [limit, setLimit] = useState(filtersOnLoad.limit || 50)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [showImport, setShowImport] = useState(false)
  const [uploadedProducts, setUploadedProducts] = useState(0)
  const [importing, setImporting] = useState(false)
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
      limit: 50,
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

  const chunkArr = (array, size) => {
    const chunked_arr = []
    for (let i = 0; i < array.length; i++) {
      const last = chunked_arr[chunked_arr.length - 1]
      if (!last || last.length === size) {
        chunked_arr.push([array[i]])
      } else {
        last.push(array[i])
      }
    }

    return chunked_arr
  }

  const handleSubmitImport = async data => {
    try {
      setImporting(true)
      const chunckedData = chunkArr(data, 25)

      for (const chunk of chunckedData) {
        await Medusa.products.importProducts(chunk)
      }

      setShowImport(false)
      setImporting(false)

      const search = {
        fields: "id,title,thumbnail",
        expand: "variants,variants.prices,collection",
        offset: 0,
        limit: 50,
      }

      refresh({ search })
    } catch (error) {
      setImporting(false)
      console.log(error)
    }
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
        <Button onClick={() => setShowImport(true)} variant={"primary"}>
          Import products
        </Button>
        <Button
          onClick={() => navigate(`/a/products/new`)}
          variant={"cta"}
          ml={3}
        >
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
                  </TableDataCell>
                  <TableDataCell>{p.title}</TableDataCell>
                  <TableDataCell>{p.collection?.title || "-"}</TableDataCell>
                  <TableDataCell>
                    {p.variants.reduce(
                      (acc, next) => acc + next.inventory_quantity,
                      0
                    )}
                    {" in stock for "}
                    {p.variants.length} variant(s)
                  </TableDataCell>
                  <TableDataCell>
                    {missingPrices > 0
                      ? `${missingPrices} variant price(s) missing`
                      : "-"}
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
      {showImport && (
        <ImportProducts
          dismiss={() => setShowImport(false)}
          handleSubmit={handleSubmitImport}
          importing={importing}
        />
      )}
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
