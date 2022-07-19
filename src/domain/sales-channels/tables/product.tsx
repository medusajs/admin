import clsx from "clsx"
import { navigate } from "gatsby"
import {
  useAdminAddProductsToSalesChannel,
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import { Product, SalesChannel } from "@medusajs/medusa"

import Placeholder from "./placeholder"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table, { TablePagination } from "../../../components/molecules/table"
import { SALES_CHANNEL_PRODUCTS_TABLE_COLUMNS } from "./config"
import useQueryFilters from "../../../hooks/use-query-filters"
import { useProductFilters } from "../../../components/templates/product-table/use-filter-tabs"

/* ****************************************** */
/* ************** TABLE CONFIG ************** */
/* ****************************************** */

const DEFAULT_PAGE_SIZE = 12

/**
 * Default filtering config for querying products endpoint.
 */
const defaultQueryProps = {
  additionalFilters: {
    expand: "collection,sales_channels",
    fields: "id,title,type,thumbnail,status",
  },
  limit: DEFAULT_PAGE_SIZE,
  offset: 0,
}

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
    productFilters: {
      setTab,
      saveTab,
      removeTab,
      availableTabs: filterTabs,
      activeFilterTab,
      setFilters,
      reset,
      filters,
    },
    paginate,
    setQuery: setFreeText,
    queryObject,

    // CONTAINER props
    isAddTable,
    count,
    products,
    setSelectedRowIds,
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
      columns: SALES_CHANNEL_PRODUCTS_TABLE_COLUMNS,
      data: products || [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect
  )

  useEffect(() => {
    setSelectedRowIds(Object.keys(state.selectedRowIds))
  }, [Object.keys(state.selectedRowIds).length])

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
          filters && (
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
          )
        }
        enableSearch
        handleSearch={setQuery}
        {...getTableProps()}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
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

/**
 * Renders product table row.
 */
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

type RemoveProductsPopupProps = {
  close: () => void
  onRemove: () => void
  total: number
}

/**
 * Popup for removing selected products from a sales channel.
 */
function RemoveProductsPopup({
  close,
  onRemove,
  total,
}: RemoveProductsPopupProps) {
  const classes = {
    "translate-y-1 opacity-0": !total,
    "translate-y-0 opacity-100": total,
  }

  return (
    <div
      className={clsx(
        "absolute w-full bottom-1 flex justify-center transition-all duration-200 pointer-events-none",
        classes
      )}
    >
      <div className="h-[48px] min-w-[224px] rounded-lg border shadow-toaster flex items-center justify-around gap-3 px-4 py-3 pointer-events-auto">
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

type SalesChannelProductsTableProps = {
  salesChannelId: string
  showAddModal: () => void
}

/**
 * Sales channel products table container.
 */
function SalesChannelProductsTable(props: SalesChannelProductsTableProps) {
  const { salesChannelId, showAddModal } = props
  const [selectedRowIds, setSelectedRowIds] = useState([])

  const params = useQueryFilters(defaultQueryProps)
  const filters = useProductFilters()

  const {
    mutate: deleteProductsFromSalesChannel,
  } = useAdminDeleteProductsFromSalesChannel(salesChannelId)

  const { products, count, isLoading } = useAdminProducts({
    ...params.queryObject,
    ...filters.queryObject,
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

  const isFilterOn = Object.keys(filters.queryObject).length

  if (!filteredProducts?.length && !isLoading && !isFilterOn) {
    return <Placeholder showAddModal={showAddModal} />
  }

  const toBeRemoveCount = selectedRowIds.length

  return (
    <div className="relative h-[880px]">
      <ProductTable
        count={count}
        products={filteredProducts}
        removeProductFromSalesChannel={removeProductFromSalesChannel}
        setSelectedRowIds={setSelectedRowIds}
        productFilters={filters}
        {...params}
      />
      <RemoveProductsPopup
        total={toBeRemoveCount}
        onRemove={removeSelectedProducts}
        close={() => setSelectedRowIds([])}
      />
    </div>
  )
}

type SalesChannelProductsSelectModalProps = {
  handleClose: () => void
  salesChannel: SalesChannel
}

/**
 * Sales channels products add container.
 * Renders product table for adding/editing sales channel products
 * in a modal.
 */
function SalesChannelProductsSelectModal(
  props: SalesChannelProductsSelectModalProps
) {
  const { handleClose, salesChannel } = props
  const [selectedRowIds, setSelectedRowIds] = useState([])

  const params = useQueryFilters(defaultQueryProps)
  const filters = useProductFilters()

  const { products, count } = useAdminProducts({
    ...params.queryObject,
    ...filters.queryObject,
  })

  const { mutate: addProductsBatch } = useAdminAddProductsToSalesChannel(
    salesChannel.id
  )

  const handleSubmit = () => {
    addProductsBatch({ product_ids: selectedRowIds.map((i) => ({ id: i })) })
    handleClose()
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
            products={products || []}
            count={count}
            setSelectedRowIds={setSelectedRowIds}
            productFilters={filters}
            {...params}
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
