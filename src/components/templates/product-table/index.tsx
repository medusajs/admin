import {
  useAdminCollections,
  useAdminCreateProduct,
  useAdminDeleteProduct,
  useAdminProducts,
  useAdminUpdateProduct,
} from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useTable } from "react-table"
import _, { filter } from "lodash"
import Spinner from "../../atoms/spinner"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import StatusIndicator from "../../fundamentals/status-indicator"
import Table, { TablePagination } from "../../molecules/table"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { navigate } from "gatsby"
import useToaster from "../../../hooks/use-toaster"
import Medusa from "../../../services/api"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import { getErrorMessage } from "../../../utils/error-messages"
import DeletePrompt from "../../organisms/delete-prompt"
import ListIcon from "../../fundamentals/icons/list-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import clsx from "clsx"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import qs from "query-string"
import { useDebounce } from "../../../hooks/use-debounce"

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
  const [updateProduct, setUpdateProduct] = useState(undefined)
  const [collectionsList, setCollectionsList] = useState<string[]>([])
  const [limit, setLimit] = useState(14)
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [showList, setShowList] = useState(true)
  const toaster = useToaster()
  const [tags, setTags] = useState(null)

  const deleteProductHook = useAdminDeleteProduct(deleteProduct?.id)
  const createProductHook = useAdminCreateProduct()
  const updateProductHook = useAdminUpdateProduct(updateProduct?.id)
  // const updateProductHook = useAdminUpdateProduct(updateProduct?.id)

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
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 14
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
      refetch({ ...defaultQueryProps })
    } else {
      if (!searchObject.offset) {
        searchObject.offset = 0
      }

      if (!searchObject.limit) {
        searchObject.limit = 14
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
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
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

    await createProductHook.mutateAsync(copy, {
      onSuccess: ({ product }) => {
        navigate(`/a/products/${product.id}`)
        toaster("Created a new return reason", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
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
        onClick: () => {
          setUpdateProduct(product)
          updateProductHook.mutate(
            {
              status: product.status === "published" ? "draft" : "published",
            },
            {
              onSuccess: () => {
                toaster(
                  `Successfully ${
                    product.status === "published" ? "unpublished" : "published"
                  } product`,
                  "success"
                )
                refetch()
              },
              onError: (err) => toaster(getErrorMessage(err), "error"),
            }
          )
        },
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
            deleteProductHook.mutateAsync().then(() => refetch())
          }}
        />
      )}
    </div>
  )
}

export default ProductTable
