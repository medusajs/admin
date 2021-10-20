import React, { useState, useCallback, useEffect } from "react"
import { Link, navigate } from "gatsby"
import _ from "lodash"
import { Flex, Text, Box, Image } from "rebass"
import { Input } from "@rebass/forms"
import { Router } from "@reach/router"
import Medusa from "../../services/api"
import { getErrorMessage } from "../../utils/error-messages"
import ProductsFilter from "./filter-dropdown"

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
  DefaultCellContent,
} from "../../components/table"

import New from "./new"
import Details from "./details"
import useMedusa from "../../hooks/use-medusa"
import Button from "../../components/button"
import qs from "query-string"
import styled from "@emotion/styled"
import Badge from "../../components/badge"
import { decideBadgeColor } from "../../utils/decide-badge-color"

const removeNullish = obj =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const LinkWrapper = styled(Link)`
  width: 100%;
  height: 100%;

  text-decoration: none;
  color: black;

  > div {
    color: blue;
  }

  &:focus {
    outline: none;
  }
  display: flex;
`

const ProductIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { store } = useMedusa("store")
  const { collections, isLoading: isLoadingCollections } = useMedusa(
    "collections"
  )
  const defaultQueryProps = {
    fields: "id,title,thumbnail",
    expand: "variants,variants.prices,collection,tags",
  }
  const {
    products,
    hasCache,
    isLoading,
    refresh,
    isReloading,
    toaster,
  } = useMedusa("products", {
    search: {
      ...filtersOnLoad,
      ...defaultQueryProps,
    },
  })

  const [tags, setTags] = useState(null)
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [storeCurrencies, setStoreCurrencies] = useState([])
  const [collectionsList, setCollectionsList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState()
  const [copyingProduct, setCopyingProduct] = useState(false)

  const [statusFilter, setStatusFilter] = useState({
    open: false,
    filter: null,
  })
  const [collectionFilter, setCollectionFilter] = useState({
    open: false,
    filter: null,
  })
  const [tagsFilter, setTagsFilter] = useState({
    open: false,
    filter: null,
    invalidTagsMessage: null,
  })

  const toggleFilterTags = async tagsFilter => {
    if (!tags) {
      const tagsResponse = await Medusa.products.listTagsByUsage()
      setTags(tagsResponse.data.tags)
    }

    const invalidTags = tagsFilter.filter?.filter(tag =>
      tags.every(t => t.value !== tag)
    )

    tagsFilter.invalidTagsMessage =
      invalidTags?.length > 0
        ? invalidTags?.length === 1
          ? `${invalidTags[0]} is not a valid tag`
          : `${invalidTags} are not valid tags`
        : null

    setTagsFilter(tagsFilter)
  }

  const resetFilters = () => {
    setStatusFilter({
      open: false,
      filter: null,
    })
    setCollectionFilter({
      open: false,
      filter: null,
    })
    setTagsFilter({
      open: false,
      filter: null,
      invalidTagsMessage: null,
    })
  }

  const submit = async () => {
    const collectionIds = collectionFilter.filter
      ? collectionFilter.filter
          .split(",")
          .map(cf => collections.find(c => c.title === cf)?.id)
          .filter(Boolean)
          .join(",")
      : null

    const tagIds = tagsFilter.filter
      ? tagsFilter.filter
          .map(tag => tag.trim())
          .map(tag => tags?.find(t => t.value === tag)?.id)
          .filter(Boolean)
          .join(",")
      : null

    const urlObject = {
      "status[]": statusFilter.open ? statusFilter.filter : null,
      "collection_id[]": collectionFilter.open ? collectionIds : null,
      "tags[]": tagsFilter.open && tagIds?.length > 0 ? tagIds : null,
    }

    const url = { ...removeNullish(urlObject) }

    replaceQueryString(url)
  }

  const replaceQueryString = queryObject => {
    let searchObject = {
      ...queryObject,
      ...defaultQueryProps,
    }

    if (_.entries(queryObject).length === 0) {
      resetFilters()
      window.history.replaceState({}, "", "/a/products")
      refresh({ search: { ...defaultQueryProps } })
    } else {
      if (!searchObject.offset) {
        searchObject.offset = 0
      }

      if (!searchObject.limit) {
        searchObject.limit = 20
      }

      const query = qs.stringify(queryObject)
      window.history.replaceState(`/a/products`, "", `${`?${query}`}`)
      refresh({ search: { ...searchObject } })
    }
  }

  const clearFilters = () => {
    resetFilters()
    setOffset(0)
    replaceQueryString({})
  }

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
      limit: 20,
    }

    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    resetFilters()
    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({ search })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = removeNullish({
      fields: "id,title,thumbnail",
      expand: "variants,variants.prices,collection",
      q: query,
      offset: updatedOffset,
      limit,
    })

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
    if (isLoadingCollections) {
      return
    }
    setCollectionsList(collections.map(c => c.title))
  }, [store, isLoadingCollections])

  const handleCheckbox = p => {
    if (!selectedProduct) {
      setSelectedProduct(p)
    } else if (p.id === selectedProduct.id) {
      setSelectedProduct()
    } else {
      setSelectedProduct(p)
    }
  }

  const handleCopyProduct = async () => {
    if (!selectedProduct) {
      return
    }

    setCopyingProduct(true)

    const { data: toCopy } = await Medusa.products.retrieve(selectedProduct.id)

    let copy = {
      title: `${toCopy.product.title} copy`,
      description: `${toCopy.product.description}`,
      handle: `${toCopy.product.handle}-copy`,
    }

    copy.options = toCopy.product.options.map(po => ({
      title: po.title,
    }))

    copy.variants = toCopy.product.variants.map(pv => ({
      title: pv.title,
      inventory_quantity: pv.inventory_quantity,
      prices: pv.prices.map(price => {
        let p = {
          amount: price.amount,
        }
        if (price.region_id) {
          p.region_id = price.region_id
        }
        if (price.currency_code) {
          p.currency_code = price.currency_code
        }

        return p
      }),
      options: pv.options.map(pvo => ({ value: pvo.value })),
    }))

    if (toCopy.product.type) {
      copy.type = {
        id: toCopy.product.type.id,
        value: toCopy.product.type.value,
      }
    }

    if (toCopy.product.collection_id) {
      copy.collection_id = toCopy.product.collection_id
    }

    if (toCopy.product.tags) {
      copy.tags = toCopy.product.tags.map(({ id, value }) => ({ id, value }))
    }

    if (toCopy.product.thumbnail) {
      copy.thumbnail = toCopy.product.thumbnail
    }

    try {
      const { data } = await Medusa.products.create(copy)
      navigate(`/a/products/${data.product.id}`)
      setCopyingProduct(false)
    } catch (error) {
      toaster(getErrorMessage(error), "error")
      setCopyingProduct(false)
    }
  }

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
        <ProductsFilter
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
          setCollectionFilter={setCollectionFilter}
          collectionFilter={collectionFilter}
          collections={collectionsList}
          setTagsFilter={toggleFilterTags}
          submitFilters={submit}
          tagsFilter={tagsFilter}
          resetFilters={resetFilters}
          clearFilters={clearFilters}
        />
        {selectedProduct && (
          <Button
            mr={2}
            onClick={() => handleCopyProduct()}
            variant={"primary"}
            loading={copyingProduct}
          >
            Copy product
          </Button>
        )}
        <Button onClick={() => navigate(`/a/products/new`)} variant={"cta"}>
          New product
        </Button>
      </Flex>
      {(isLoading && !hasCache) || isReloading || copyingProduct ? (
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
              <TableHeaderCell sx={{ maxWidth: "35px" }} />
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Collection</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Inventory</TableHeaderCell>
              <TableHeaderCell />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {products &&
              products.map(p => {
                const missingVariantPrices = p.variants.map(v => {
                  const variantPriceCurrencies = v.prices.map(
                    vp => vp.currency_code
                  )

                  return _.difference(storeCurrencies, variantPriceCurrencies)
                    .length
                })

                const missingPrices = _.sum(missingVariantPrices)

                return (
                  <TableRow key={p.id}>
                    <TableDataCell
                      sx={{
                        maxWidth: "35px !important",
                        paddingRight: "0px",
                        paddingLeft: "0px !important",
                      }}
                    >
                      <DefaultCellContent
                        width="35px !important"
                        justifyContent="center"
                      >
                        <input
                          id={p.id}
                          checked={
                            selectedProduct && selectedProduct.id === p.id
                          }
                          onChange={() => handleCheckbox(p)}
                          disabled={
                            selectedProduct && selectedProduct.id !== p.id
                          }
                          type="checkbox"
                        />
                      </DefaultCellContent>
                    </TableDataCell>
                    <LinkWrapper
                      to={`/a/products${p.is_giftcard ? "/gift-card" : ""}/${
                        p.id
                      }`}
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
                          <Badge
                            color={decideBadgeColor(p.status).color}
                            bg={decideBadgeColor(p.status).bgColor}
                          >
                            {p.status}
                          </Badge>
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
                    </LinkWrapper>
                  </TableRow>
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
