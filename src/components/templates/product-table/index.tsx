import clsx from "clsx"
import { navigate } from "gatsby"
import _ from "lodash"
import { useAdminCollections, useAdminProducts } from "medusa-react"
import qs from "query-string"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useTable } from "react-table"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import { useDebounce } from "../../../hooks/use-debounce"
import useToaster from "../../../hooks/use-toaster"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import Spinner from "../../atoms/spinner"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import ListIcon from "../../fundamentals/icons/list-icon"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import Table, { TablePagination } from "../../molecules/table"
import DeletePrompt from "../../organisms/delete-prompt"

const removeNullish = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const getProductStatusVariant = (title) => {
  switch (title) {
    case "proposed":
      return "warning"
    case "published":
      return "success"
    case "rejected":
      return "danger"
    case "draft":
    default:
      return "default"
  }
}

type ProductTableProps = {}

const ProductTable: React.FC<ProductTableProps> = () => {
  const [offset, setOffset] = useState(0)
  const [deleteProduct, setDeleteProduct] = useState(undefined)
  const [collectionsList, setCollectionsList] = useState<string[]>([])
  const [limit, setLimit] = useState(20)
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [showList, setShowList] = useState(true)
  const toaster = useToaster()
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

  const filtersOnLoad = qs.parse(
    window.location.search.charAt(0) === "?"
      ? window.location.search.substring(1)
      : window.location.search
  )

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { collections, isLoading: isLoadingCollections } = useAdminCollections()

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
      refetch({ ...defaultQueryProps })
    } else {
      if (!searchObject.offset) {
        searchObject.offset = 0
      }

      if (!searchObject.limit) {
        searchObject.limit = 20
      }

      const query = qs.stringify(queryObject)
      window.history.replaceState(`/a/products`, "", `${`?${query}`}`)
      refetch({ ...searchObject })
    }
  }

  useEffect(() => {
    if (!isLoadingCollections && collections?.length) {
      setCollectionsList(collections.map((c) => c.title))
    }
  }, [isLoadingCollections])

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center py-[7px]">
              <div className="w-[30px] h-[40px] rounded-soft overflow-hidden mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-contain rounded-soft"
                  />
                ) : (
                  <div className="flex items-center justify-center w-[30px] h-[40px] rounded-soft bg-grey-5">
                    <ImagePlaceholder size={16} />
                  </div>
                )}
              </div>
              {original.title}
            </div>
          )
        },
      },
      {
        Header: "Collection",
        accessor: "collection", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value?.title || "-"}</div>
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <StatusIndicator
            title={`${value.charAt(0).toUpperCase()}${value.slice(1)}`}
            variant={getProductStatusVariant(value)}
          />
        ),
      },
      {
        Header: "Inventory",
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div>
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {" in stock for "}
            {value.length} variant(s)
          </div>
        ),
      },
      // TODO: INSERT WITH MORE ADVANCED QUERIES
      // {
      //   accessor: "col",
      //   Header: "Total Sales",
      // },
      // {
      //   Header: "Total Revenue",
      //   accessor: "col-2",
      // },
      {
        accessor: "col-3",
        Header: (
          <div className="text-right flex justify-end">
            <span
              onClick={() => setShowList(true)}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": showList,
                "text-grey-40": !showList,
              })}
            >
              <ListIcon size={20} />
            </span>
            <span
              onClick={() => setShowList(false)}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": !showList,
                "text-grey-40": showList,
              })}
            >
              <TileIcon size={20} />
            </span>
          </div>
        ),
      },
    ],
    [showList]
  )

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

  const handleCopyProduct = async (product) => {
    const copy = {
      title: `${product.title} copy`,
      description: `${product.description}`,
      handle: `${product.handle}-copy`,
    }

    copy.options = product.options.map((po) => ({
      title: po.title,
    }))

    copy.variants = product.variants.map((pv) => ({
      title: pv.title,
      inventory_quantity: pv.inventory_quantity,
      prices: pv.prices.map((price) => {
        const p = {
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
      options: pv.options.map((pvo) => ({ value: pvo.value })),
    }))

    if (product.type) {
      copy.type = {
        id: product.type.id,
        value: product.type.value,
      }
    }

    if (product.collection_id) {
      copy.collection_id = product.collection_id
    }

    if (product.tags) {
      copy.tags = product.tags.map(({ id, value }) => ({ id, value }))
    }

    if (product.thumbnail) {
      copy.thumbnail = product.thumbnail
    }

    try {
      const { data } = await Medusa.products.create(copy)
      navigate(`/a/products/${data.product.id}`)
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  const getActionablesForProduct = (product) => {
    return [
      {
        label: "Edit",
        onClick: () => navigate(`/a/products/${product.id}`),
        icon: <EditIcon size={20} />,
      },
      {
        label: product.status === "published" ? "Unpublish" : "Publish",
        onClick: () =>
          Medusa.products
            .update(product.id, {
              status: product.status === "published" ? "draft" : "published",
            })
            .then(() =>
              toaster(
                `Successfully ${
                  product.status === "published" ? "unpublished" : "published"
                } product`,
                "success"
              )
            )
            .then(() => refetch())
            .catch((err) => toaster(getErrorMessage(err), "error")),
        icon:
          product.status === "published" ? (
            <UnpublishIcon size={20} />
          ) : (
            <PublishIcon size={20} />
          ),
      },
      {
        label: "Duplicate",
        onClick: () => handleCopyProduct(product),
        icon: <DuplicateIcon size={20} />,
      },
      {
        label: "Delete",
        variant: "danger",
        onClick: () => setDeleteProduct(product),
        icon: <TrashIcon size={20} />,
      },
    ]
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
                return (
                  <Table.Row
                    color={"inherit"}
                    linkTo={`/a/products/${row.original.id}`}
                    actions={getActionablesForProduct(row.original)}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, index) => {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render("Cell", { index })}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <TablePagination
            count={count!}
            limit={limit}
            offset={offset}
            pageSize={offset + rows.length}
            title="Customers"
            currentPage={pageIndex}
            pageCount={pageCount}
            nextPage={handleNext}
            prevPage={handlePrev}
            hasNext={canNextPage}
            hasPrev={canPreviousPage}
          />
        </>
      )}
      {deleteProduct && (
        <DeletePrompt
          handleClose={() => setDeleteProduct(undefined)}
          onDelete={async () => {
            Medusa.products.delete(deleteProduct.id).then(() => refetch())
          }}
        />
      )}
    </div>
  )
}

export default ProductTable
