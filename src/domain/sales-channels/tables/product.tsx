import { useLocation } from "@reach/router"
import { isEmpty } from "lodash"
import { useAdminProducts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import ProductsFilter from "../../../domain/products/filter-dropdown"

import Table, { TablePagination } from "../../../components/molecules/table"

import useProductTableColumn from "./use-product-columns"
import { useProductFilters } from "../../../components/templates/product-table/use-product-filters"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"

const DEFAULT_PAGE_SIZE = 15
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18

type ProductTableProps = {}

const defaultQueryProps = {
  fields: "id,title,type,thumbnail,status",
  expand: "variants,options,variants.prices,variants.options,collection,tags",
  is_giftcard: false,
}

const ProductTable: React.FC<ProductTableProps> = ({
  count,
  products,
  ...props
}) => {
  const location = useLocation()

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

  const setTileView = () => {
    setLimit(DEFAULT_PAGE_SIZE_TILE_VIEW)
    setShowList(false)
  }

  const setListView = () => {
    setLimit(DEFAULT_PAGE_SIZE)
    setShowList(true)
  }
  const [showList, setShowList] = React.useState(true)
  const [columns] = useProductTableColumn({
    setTileView,
    setListView,
    showList,
  })

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
        pageIndex: Math.floor(offs / limit),
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  // Debounced search
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

  return (
    <div className="w-full h-full overflow-y-auto">
      <>
        <Table
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
              return <ProductRow row={row} />
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
      </>
    </div>
  )
}

const ProductRow = ({ row }) => {
  const product = row.original
  // const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/products/${product.id}`}
      // actions={getActions()}
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

function SalesChannelProductsTable() {
  const filters = useProductFilters(location.search, defaultQueryProps)

  const { products, count } = useAdminProducts({
    ...filters.queryObject,
  })

  if (!products?.length) {
    return null
  }

  return <ProductTable products={products} count={count} {...filters} />
}

function SalesChannelProductsSelectModal({ handleClose, handleSubmit }) {
  const filters = useProductFilters(location.search, defaultQueryProps)

  const { products, count } = useAdminProducts({
    ...filters.queryObject,
  })

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
          <ProductTable products={products} count={count} {...filters} />
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
              // loading={updateSalesChannel.isLoading}
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

// export default ProductTable
