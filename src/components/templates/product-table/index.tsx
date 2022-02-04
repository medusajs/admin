import { isEmpty } from "lodash"
import { useLocation } from "@reach/router"
import { useAdminProducts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import ProductsFilter from "../../../domain/products/filter-dropdown"
import Spinner from "../../atoms/spinner"
import Table, { TablePagination } from "../../molecules/table"
import useProductActions from "./use-product-actions"
import useProductTableColumn from "./use-product-column"
import { useProductFilters } from "./use-product-filters"
import ProductOverview from "./overview"

const DEFAULT_PAGE_SIZE = 15

type ProductTableProps = {}

const defaultQueryProps = {
  fields: "id,title,type,thumbnail",
  expand: "variants,options,variants.prices,variants.options,collection,tags",
}

const ProductTable: React.FC<ProductTableProps> = () => {
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
    filters,
    setQuery: setFreeText,
    queryObject,
    representationObject,
  } = useProductFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject.offset) || 0
  const limit = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

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

  const [columns, showList, setShowList] = useProductTableColumn()

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
    <div className="w-full h-full overflow-y-scroll">
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
              {isLoading || isRefetching || !products ? (
                <div className="w-full pt-2xlarge flex items-center justify-center">
                  <Spinner size={"large"} variant={"secondary"} />
                </div>
              ) : (
                <Table.Body {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row)
                    return <ProductRow row={row} />
                  })}
                </Table.Body>
              )}
            </>
          ) : (
            <ProductOverview
              products={products}
              toggleListView={() => setShowList(true)}
            />
          )}
        </Table>
        <TablePagination
          count={count!}
          limit={limit}
          offset={offs}
          pageSize={offs + rows.length}
          title="Products"
          currentPage={pageIndex}
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
