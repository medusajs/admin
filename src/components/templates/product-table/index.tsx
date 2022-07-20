import { useLocation } from "@reach/router"
import { isEmpty } from "lodash"
import { useAdminProducts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import { FeatureFlagContext } from "../../../context/feature-flag"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import Spinner from "../../atoms/spinner"
import Table, { TablePagination } from "../../molecules/table"
import ProductOverview from "./overview"
import useProductActions from "./use-product-actions"
import useProductTableColumn from "./use-product-column"
import { useProductFilters } from "./use-product-filters"

const DEFAULT_PAGE_SIZE = 15
const DEFAULT_PAGE_SIZE_TILE_VIEW = 18

type ProductTableProps = {}

const defaultQueryProps = {
  fields: "id,title,type,thumbnail,status",
  expand: "variants,options,variants.prices,variants.options,collection,tags",
  is_giftcard: false,
}

const ProductTable: React.FC<ProductTableProps> = () => {
  const location = useLocation()

  const { isFeatureEnabled } = React.useContext(FeatureFlagContext)

  let hiddenColumns = ["sales_channel"]
  if (isFeatureEnabled("sales_channels")) {
    defaultQueryProps.expand =
      "variants,options,variants.prices,variants.options,collection,tags,sales_channels"
    hiddenColumns = []
  }

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
  } = useProductFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit)

  const [query, setQuery] = useState(queryObject.query)
  const [numPages, setNumPages] = useState(0)

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  const { products, isLoading, isRefetching, count } = useAdminProducts({
    ...queryObject,
  })

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
        hiddenColumns,
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
          {showList ? (
            <>
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
              <LoadingContainer
                isLoading={isLoading || isRefetching || !products}
              >
                <Table.Body {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row)
                    return <ProductRow row={row} />
                  })}
                </Table.Body>
              </LoadingContainer>
            </>
          ) : (
            <LoadingContainer
              isLoading={isLoading || isRefetching || !products}
            >
              <ProductOverview
                products={products}
                toggleListView={setListView}
              />
            </LoadingContainer>
          )}
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

const LoadingContainer = ({ isLoading, children }) => {
  return isLoading ? (
    <div className="w-full pt-2xlarge flex items-center justify-center">
      <Spinner size={"large"} variant={"secondary"} />
    </div>
  ) : (
    children
  )
}

const ProductRow = ({ row }) => {
  const product = row.original
  const { getActions } = useProductActions(product)

  return (
    <Table.Row
      color={"inherit"}
      linkTo={`/a/products/${product.id}`}
      actions={getActions()}
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
