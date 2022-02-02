import _ from "lodash"
import { useAdminCollections, useAdminProducts } from "medusa-react"
import qs from "query-string"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import { useDebounce } from "../../../hooks/use-debounce"
import Medusa from "../../../services/api"
import Spinner from "../../atoms/spinner"
import Table, { TablePagination } from "../../molecules/table"
import useProductActions from "./use-product-actions"
import useProductTableColumn from "./use-product-column"

const removeNullish = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

type ProductTableProps = {}

const ProductTable: React.FC<ProductTableProps> = () => {
  const [offset, setOffset] = useState(0)
  const [collectionsList, setCollectionsList] = useState<string[]>([])
  const [limit, setLimit] = useState(14)
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [tags, setTags] = useState(null)

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

  const clearFilters = () => {
    resetFilters()
    setOffset(0)
    replaceQueryString({})
  }

  const submitFilters = async () => {
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

  const { collections, isLoading: isLoadingCollections } = useAdminCollections()

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

  const setFilterTagsById = async (tagIds) => {
    let ts = []
    if (!tags) {
      const tagsResponse = await Medusa.products.listTagsByUsage()
      setTags(tagsResponse.data.tags)
      ts = tagsResponse.data.tags
    } else {
      ts = tags
    }

    const tagValues = ts
      .filter((tag) => tagIds.indexOf(tag.id) > -1)
      .map((t) => t.value)

    setTagsFilter({ open: true, filter: tagValues })
  }

  const setCollectionsFilterById = async (collectionIds) => {
    const collectionsResponse = await Medusa.collections.list()
    const ts = collectionsResponse.data.collections

    const tagValues = ts
      .filter((collection) => collectionIds.indexOf(collection.id) > -1)
      .map((t) => t.title)
      .join(",")

    setCollectionFilter({ open: true, filter: tagValues })
  }

  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = offset
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = limit
  }

  useEffect(() => {
    const filtersOnLoad = qs.parse(window.location.search, {
      arrayFormat: "bracket",
    })

    if (filtersOnLoad.status?.length) {
      setStatusFilter({
        open: true,
        filter: filtersOnLoad.status[0],
      })
    }

    if (filtersOnLoad.collection_id?.length) {
      setCollectionsFilterById(filtersOnLoad.collection_id[0].split(","))
    }

    if (filtersOnLoad.tags?.length) {
      setFilterTagsById(filtersOnLoad.tags[0].split(","))
    }
    console.log(filtersOnLoad)
  }, [])

  const defaultQueryProps = {
    fields: "id,title,type,thumbnail",
    expand: "variants,options,variants.prices,variants.options,collection,tags",
  }

  const debouncedSearchTerm = useDebounce(query, 500)

  const {
    products,
    isLoading,
    refetch,
    isRefetching,
    count,
  } = useAdminProducts({
    ...filtersOnLoad,
    ...defaultQueryProps,
    q: debouncedSearchTerm,
  })

  const replaceQueryString = (queryObject) => {
    const searchObject = {
      ...queryObject,
      ...defaultQueryProps,
    }

    if (_.entries(queryObject).length === 0) {
      resetFilters()
      window.history.replaceState({}, "", "/a/products")
      refetch()
    } else {
      if (!searchObject.offset) {
        searchObject.offset = 0
      }

      if (!searchObject.limit) {
        searchObject.limit = 14
      }

      const query = qs.stringify(queryObject)
      window.history.replaceState(`/a/products`, "", `${`?${query}`}`)
      refetch()
    }
  }

  useEffect(() => {
    if (!isLoadingCollections && collections?.length) {
      setCollectionsList(collections.map((c) => c.title))
    }
  }, [isLoadingCollections])

  const [columns] = useProductTableColumn()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: products || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / limit)
    setNumPages(controlledPageCount)
  }, [products])

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize)
      setCurrentPage((old) => old + 1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => old - pageSize)
      setCurrentPage((old) => old - 1)
      previousPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setCurrentPage(0)
    setQuery(q)
  }

  return (
    <div className="w-full h-full overflow-y-scroll">
      {isLoading || isRefetching || !products ? (
        <div className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <Table
            filteringOptions={
              <ProductsFilter
                setStatusFilter={setStatusFilter}
                statusFilter={statusFilter}
                setCollectionFilter={setCollectionFilter}
                collectionFilter={collectionFilter}
                collections={collectionsList}
                setTagsFilter={toggleFilterTags}
                submitFilters={submitFilters}
                tagsFilter={tagsFilter}
                resetFilters={resetFilters}
                clearFilters={clearFilters}
              />
            }
            enableSearch
            handleSearch={handleSearch}
            {...getTableProps()}
          >
            <Table.Head>
              {headerGroups?.map((headerGroup) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col) => (
                    <Table.HeadCell
                      className="min-w-[100px]"
                      {...col.getHeaderProps()}
                    >
                      {col.render("Header")}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              ))}
            </Table.Head>
            <Table.Body {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return <ProductRow row={row} />
              })}
            </Table.Body>
          </Table>
          <TablePagination
            count={count!}
            limit={limit}
            offset={offset}
            pageSize={offset + rows.length}
            title="Products"
            currentPage={pageIndex}
            pageCount={pageCount}
            nextPage={handleNext}
            prevPage={handlePrev}
            hasNext={canNextPage}
            hasPrev={canPreviousPage}
          />
        </>
      )}
    </div>
  )
}

const ProductRow = ({ row }) => {
  const product = row.original
  const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/products/${product.id}`}
      actions={getActions(product)}
      {...row.getRowProps()}
    >
      {" "}
      {row.cells.map((cell, index) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {" "}
            {cell.render("Cell", { index })}{" "}
          </Table.Cell>
        )
      })}{" "}
    </Table.Row>
  )
}
export default ProductTable
