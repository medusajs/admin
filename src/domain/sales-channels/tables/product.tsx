import { useLocation } from "@reach/router"
import { isEmpty } from "lodash"
import {
  useAdminAddProductsToSalesChannel,
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import qs from "qs"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import ProductsFilter from "../../../domain/products/filter-dropdown"

import Table, { TablePagination } from "../../../components/molecules/table"

import { useProductFilters } from "../../../components/templates/product-table/use-product-filters"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"

import Placeholder from "./placeholder"
import { navigate } from "gatsby"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import clsx from "clsx"
import { Product } from "@medusajs/medusa"

/* ****************************************** */
/* ************** TABLE CONFIG ************** */
/* ****************************************** */

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  fields: "id,title,type,thumbnail,status",
  expand: "variants,options,variants.prices,variants.options,collection,tags",
  is_giftcard: false,
}

const COLUMNS = [
  {
    id: "selection",
    Header: ({ getToggleAllPageRowsSelectedProps }) => (
      <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
    ),
    Cell: ({ row }) => {
      return (
        <Table.Cell onClick={(e) => e.stopPropagation()} className="w-[10px]">
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </Table.Cell>
      )
    },
  },
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
              <div className="flex items-center justify-center w-full h-full rounded-soft bg-grey-10">
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
    accessor: "collection",
    Cell: ({ cell: { value } }) => {
      return <div>{value?.title || "-"}</div>
    },
  },
]

/* ******************************************** */
/* ************** PRODUCTS TABLE ************** */
/* ******************************************** */

type ProductTableProps = {
  isAddTable: boolean
  count: number
  products: Product[]
  setSelectedRowIds: (ids: string[]) => void
  selectedRowIds: string[]
  removeProductFromSalesChannel: (ids: string[]) => void
}

/**
 * Renders a table of sales channel products.
 */
function ProductTable(props: ProductTableProps) {
  const {
    removeTab,
    setTab,
    saveTab,
    availableTabs: filterTabs,
    activeFilterTab,
    reset,
    paginate,
    setFilters,
    setLimit,
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,

    // CONTAINER props
    isAddTable,
    count,
    products,
    setSelectedRowIds,
    selectedRowIds,
    removeProductFromSalesChannel,
  } = props

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/products`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = representationObject

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  useEffect(() => {
    refreshWithFilters()
  }, [representationObject])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    toggleAllRowsSelected,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize, ...state },
  } = useTable(
    {
      columns: COLUMNS,
      data: products || [],
      manualPagination: true,
      initialState: {
        selectedRowIds: selectedRowIds.reduce((prev, id) => {
          prev[id] = true
          return prev
        }, {}),
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
      autoResetSelectedRows: true,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect
  )

  useEffect(() => {
    setSelectedRowIds(Object.keys(state.selectedRowIds))
  }, [state.selectedRowIds])

  useEffect(() => {
    if (!selectedRowIds.length && Object.keys(state.selectedRowIds).length) {
      toggleAllRowsSelected(false)
    }
  }, [selectedRowIds])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        if (typeof query !== "undefined") {
          // if we delete query string, we reset the table view
          reset()
        }
      }
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleNext = () => {
    if (canNextPage) {
      paginate(1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      paginate(-1)
      previousPage()
    }
  }

  const getActions = (id: string) => [
    {
      label: "Details",
      onClick: () => navigate(`/a/products/${id}`),
      icon: <DetailsIcon size={20} />,
    },
    {
      label: "Remove from the channel",
      variant: "danger",
      onClick: () => removeProductFromSalesChannel(id),
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <div className="w-full h-[880px] overflow-y-auto flex flex-col">
      <Table
        containerClassName="flex-1"
        filteringOptions={
          <ProductsFilter
            filters={filters}
            submitFilters={setFilters}
            clearFilters={clearFilters}
            tabs={filterTabs}
            onTabClick={setTab}
            activeTab={activeFilterTab}
            onRemoveTab={removeTab}
            onSaveTab={saveTab}
          />
        }
        enableSearch
        handleSearch={setQuery}
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
              <ProductRow
                row={row}
                actions={!isAddTable ? getActions(row.original.id) : undefined}
              />
            )
          })}
        </Table.Body>
      </Table>
      <TablePagination
        count={count!}
        limit={limit}
        offset={offs}
        pageSize={offs + rows.length}
        title="Products"
        currentPage={pageIndex + 1}
        pageCount={pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={canNextPage}
        hasPrev={canPreviousPage}
      />
    </div>
  )
}

const ProductRow = ({ row, actions }) => {
  const product = row.original

  return (
    <Table.Row
      color={"inherit"}
      className={row.isSelected ? "bg-grey-5" : ""}
      linkTo={`/a/products/${product.id}`}
      actions={actions}
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

function RemoveProductsPopup({ close, onRemove, total }) {
  const classes = {
    "translate-y-1 opacity-0": !total,
    "translate-y-0 opacity-100": total,
  }

  return (
    <div
      className={clsx(
        "absolute w-full bottom-1 flex justify-center transition-all duration-200",
        classes
      )}
    >
      <div className="h-[48px] min-w-[224px] rounded-lg border shadow-toaster flex items-center justify-around gap-3 px-4 py-3">
        <span className="text-small text-grey-50">{total} selected</span>
        <div className="w-[1px] h-[20px] bg-grey-20" />
        <Button variant="danger" size="small" onClick={onRemove}>
          Remove
        </Button>
        <button onClick={close} className="text-grey-50 cursor-pointer">
          <CrossIcon size={20} />
        </button>
      </div>
    </div>
  )
}

/* **************************************** */
/* ************** CONTAINERS ************** */
/* **************************************** */

/**
 * Sales channel products table container.
 */
function SalesChannelProductsTable({ salesChannelId, showAddModal }) {
  const [selectedRowIds, setSelectedRowIds] = useState([])

  const filters = useProductFilters(location.search, defaultQueryProps)

  const {
    mutate: deleteProductsFromSalesChannel,
  } = useAdminDeleteProductsFromSalesChannel(salesChannelId)

  const { products, count, isLoading } = useAdminProducts({
    ...filters.queryObject,
    expand: "sales_channels",
  })

  const removeProductFromSalesChannel = (id: string) => {
    deleteProductsFromSalesChannel({ product_ids: [{ id }] })
  }

  const removeSelectedProducts = async () => {
    await deleteProductsFromSalesChannel({
      product_ids: selectedRowIds.map((id) => ({ id })),
    })
    setSelectedRowIds([])
  }

  // TODO: use the products endpoint to do this once `expand` with `sales_channels` is supported
  const filteredProducts = useMemo(
    () =>
      products?.filter(
        (product) =>
          !!product.sales_channels!.find(
            (channel) => channel.id === salesChannelId
          )
      ),
    [products, salesChannelId]
  )

  if (isLoading) {
    return null
  }

  if (!filteredProducts?.length) {
    return <Placeholder showAddModal={showAddModal} />
  }

  const toBeRemoveCount = selectedRowIds.length

  return (
    <div className="relative h-[880px]">
      <ProductTable
        count={count}
        products={filteredProducts}
        selectedRowIds={selectedRowIds}
        removeProductFromSalesChannel={removeProductFromSalesChannel}
        setSelectedRowIds={setSelectedRowIds}
        {...filters}
      />
      <RemoveProductsPopup
        total={toBeRemoveCount}
        onRemove={removeSelectedProducts}
        close={() => setSelectedRowIds([])}
      />
    </div>
  )
}

/**
 * Sales channels products add container.
 * Renders product table for adding/editing sales channel products
 * in a modal.
 */
function SalesChannelProductsSelectModal({ handleClose, salesChannel }) {
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const filters = useProductFilters(location.search, defaultQueryProps)

  const { products, count } = useAdminProducts({
    ...filters.queryObject,
  })

  const { mutate: addProductsBatch } = useAdminAddProductsToSalesChannel(
    salesChannel.id
  )

  const handleSubmit = () => {
    addProductsBatch({ product_ids: selectedRowIds.map((i) => ({ id: i })) })
    handleClose()
  }

  if (!products?.length) {
    return null
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Products available</span>
        </Modal.Header>
        <Modal.Content>
          <ProductTable
            isAddTable
            products={products}
            count={count}
            selectedRowIds={selectedRowIds}
            setSelectedRowIds={setSelectedRowIds}
            {...filters}
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export { SalesChannelProductsTable, SalesChannelProductsSelectModal }
