import React, { useState, useEffect, useContext } from "react"
import { Link, navigate } from "gatsby"
import _ from "lodash"
import { InterfaceContext } from "../../context/interface"
import { Router } from "@reach/router"
import Medusa from "../../services/api"
import ProductsFilter from "./filter-dropdown"
import ProductTable from "../../components/templates/product-table"
import Spinner from "../../components/atoms/spinner"
import New from "./new"
import Details from "./details"
import useMedusa from "../../hooks/use-medusa"
import Button from "../../components/button"
import qs from "query-string"
import styled from "@emotion/styled"
import Badge from "../../components/fundamentals/badge"
import { decideBadgeColor } from "../../utils/decide-badge-color"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"

const removeNullish = (obj) =>
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

  const toggleFilterTags = async (tagsFilter) => {
    if (!tags) {
      const tagsResponse = await Medusa.products.listTagsByUsage()
      setTags(tagsResponse.data.tags)
    }

    const invalidTags = tagsFilter.filter?.filter((tag) =>
      tags.every((t) => t.value !== tag)
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
          .map((cf) => collections.find((c) => c.title === cf)?.id)
          .filter(Boolean)
          .join(",")
      : null

    const tagIds = tagsFilter.filter
      ? tagsFilter.filter
          .map((tag) => tag.trim())
          .map((tag) => tags?.find((t) => t.value === tag)?.id)
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

  const replaceQueryString = (queryObject) => {
    const searchObject = {
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

  const searchQuery = (q) => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      q,
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

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  useEffect(() => {
    if (store?.currencies) {
      const currencyCodes = store.currencies.map((c) => c.code)
      setStoreCurrencies(currencyCodes)
    }
    if (isLoadingCollections) {
      return
    }
    setCollectionsList(collections.map((c) => c.title))
  }, [store, isLoadingCollections])

  const actionables = [
    {
      label: "New Product",
      onClick: () => navigate("/a/products/new"),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <PageDescription
        title="Products"
        subtitle="Manage the products for your Medusa Store"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard actionables={actionables}>
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
          {(isLoading && !hasCache) || isReloading || copyingProduct ? (
            <Spinner size="large" />
          ) : (
            <ProductTable />
          )}
        </BodyCard>
      </div>
    </div>
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
