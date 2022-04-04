import clsx from "clsx"
import { isEmpty } from "lodash"
import { useAdminPriceLists } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import Spinner from "../../atoms/spinner"
import Toaster from "../../declarative-toaster"
import BackspaceIcon from "../../fundamentals/icons/backspace-icon"
import HotKeyAction from "../../molecules/hot-key-action"
import Table, { TablePagination } from "../../molecules/table"
import { TableToasterContainer } from "../../molecules/table-toaster"
import PriceListsFilter from "./price-list-filters"
import usePriceListActions from "./use-price-list-actions"
import { usePriceListTableColumns } from "./use-price-list-columns"
import { usePriceListFilters } from "./use-price-list-filters"
import { useLocation } from "@reach/router"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {
  expand: "customer_groups",
}

const PriceListTable: React.FC = () => {
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
  } = usePriceListFilters(location.search, defaultQueryProps)
  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { price_lists, count, isLoading, isRefetching } = useAdminPriceLists(
    {
      ...queryObject,
    },
    { keepPreviousData: true }
  )

  const [query, setQuery] = useState("")
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (count && queryObject.limit) {
      const controlledPageCount = Math.ceil(count! / queryObject.limit)
      if (controlledPageCount !== numPages) {
        setNumPages(controlledPageCount)
      }
    }
  }, [count, queryObject.limit])

  const [columns] = usePriceListTableColumns()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    selectedFlatRows,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: price_lists || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination,
    useRowSelect
  )

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setFreeText(query)
        gotoPage(0)
      } else {
        // if we delete query string, we reset the table view
        reset()
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

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/pricing`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = representationObject

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  const clearFilters = () => {
    reset()
    setQuery("")
  }

  useEffect(() => {
    refreshWithFilters()
  }, [representationObject])

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <Table
        filteringOptions={
          <PriceListsFilter
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
        searchValue={query}
        {...getTableProps()}
        className={clsx({ ["relative"]: isLoading })}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup, index) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col, headerIndex) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>

        <LoadingContainer isLoading={isLoading || isRefetching || !price_lists}>
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row)
              return (
                <PriceListRow
                  color={"inherit"}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                  className="group"
                  linkTo={row.original.id}
                  id={row.original.id}
                  row={row}
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index })
                  })}
                </PriceListRow>
              )
            })}
          </Table.Body>
        </LoadingContainer>
      </Table>
      <TablePagination
        count={count!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + rows.length}
        title="Price Lists"
        currentPage={pageIndex + 1}
        pageCount={pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={canNextPage}
        hasPrev={canPreviousPage}
      />
      <Toaster
        visible={selectedFlatRows.length}
        duration={Infinity}
        position="bottom-center"
        id="price-list-batch-actions"
      >
        <TableToasterContainer>
          <span className="inter-small-semibold text-grey-40 pr-5">
            {selectedFlatRows.length} entries selected:{" "}
          </span>
          <div className="pr-base">
            <HotKeyAction
              label="Unpublish"
              hotKey="U"
              icon="U"
              onAction={() => console.log("clicked")}
            />
          </div>
          <div className="pr-base">
            <HotKeyAction
              label="Delete"
              hotKey="backspace"
              icon={<BackspaceIcon />}
              onAction={() => console.log("clicked")}
            />
          </div>
        </TableToasterContainer>
      </Toaster>
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

const PriceListRow = ({ row, children, ...props }) => {
  const priceList = row.original
  const { getActions } = usePriceListActions(priceList)

  return (
    <Table.Row {...props} actions={getActions()}>
      {children}
    </Table.Row>
  )
}

export default PriceListTable
