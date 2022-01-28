import { RouteComponentProps, useLocation } from "@reach/router"
import { debounce, isEmpty } from "lodash"
import { useAdminOrders } from "medusa-react"
import qs from "query-string"
import React, { useEffect, useMemo, useReducer, useState } from "react"
import { usePagination, useTable } from "react-table"
import { removeNullish } from "../../../utils/remove-nullish"
import { formatDateFilter } from "../../../utils/time"
import Spinner from "../../atoms/spinner"
import Table, { TablePagination } from "../../molecules/table"
import OrderFilters from "../order-filter-dropdown"
import useOrderTableColums from "./use-order-column"

type OrderFilter = {
  open: boolean
  filter?: string | string[] | null
}

type OrderFiltersType = {
  limit: number
  offset: number
  fulfillmentStatus?: OrderFilter
  paymentStatus?: OrderFilter
  date?: OrderFilter
  status?: OrderFilter
  q: string
}

const defaultQueryProps = {
  expand: "shipping_address",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
}

const initialState: OrderFiltersType = {
  limit: 14,
  offset: 0,
  status: { open: false, filter: null },
  fulfillmentStatus: { open: false, filter: null },
  paymentStatus: { open: false, filter: null },
  date: { open: false, filter: null },
  q: "",
}

function orderFiltersReducer(state, action) {
  switch (action.type) {
    case "status":
      return { ...state, status: { ...action.payload } }
    case "payment":
      return { ...state, paymentStatus: { ...action.payload } }
    case "fulfillment":
      return { ...state, fulfillmentStatus: { ...action.payload } }
    case "date":
      return { ...state, date: { ...action.payload } }
    case "query":
      return { ...state, q: action.payload }
    case "limit":
      return { ...state, limit: action.payload }
    case "offset":
      return { ...state, offset: action.payload }
    case "reset":
      return {
        status: { open: false, filter: null },
        fulfillmentStatus: { open: false, filter: null },
        paymentStatus: { open: false, filter: null },
        date: { open: false, filter: null },
      }
    default:
      return state
  }
}

const OrderTable: React.FC<RouteComponentProps> = () => {
  const location = useLocation()

  const filtersOnLoad = qs.parse(location.search, {
    arrayFormat: "bracket",
  })

  const parseUrlFilter = (urlVal) => {
    if (!urlVal) {
      return { open: false, filter: null }
    }

    if (Array.isArray(urlVal)) {
      return { open: true, filter: urlVal[0] }
    } else {
      return { open: true, filter: urlVal }
    }
  }

  const initialOrderFilterState = {
    limit: 14,
    offset: 0,
    status: parseUrlFilter(filtersOnLoad.status),
    fulfillmentStatus: parseUrlFilter(filtersOnLoad.fulfillment_status),
    paymentStatus: parseUrlFilter(filtersOnLoad.payment_status),
    date: parseUrlFilter(filtersOnLoad.created_at),
  }

  const [state, dispatch] = useReducer(orderFiltersReducer, initialState)

  const [currentPage, setCurrentPage] = useState(0)
  // const [filters, setFilters] = useState<OrderFiltersType>(
  //   initialOrderFilterState
  // )
  const [query, setQuery] = useState<string>()

  useEffect(() => {
    setCurrentPage(state.offset / state.limit)
  }, [])

  const [numPages, setNumPages] = useState(0)

  const constructFiltersFromState = () => {
    let urlObject: any = {
      "payment_status[]": state?.paymentStatus?.filter,
      "fulfillment_status[]": state?.fulfillmentStatus?.filter,
      "status[]": state?.status?.filter,
      q: state.q,
      limit: state?.limit || 14,
      offset: state?.offset || 0,
    }

    if (!isEmpty(state.date.filter) && state.date.open) {
      const dateFormatted = formatDateFilter(state.date.filter)

      const dateFilters = Object.entries(dateFormatted).reduce(
        (acc, [key, value]) => {
          return {
            ...acc,
            [`created_at[${key}]`]: value,
          }
        },
        {}
      )

      urlObject = {
        ...urlObject,
        ...dateFilters,
      }
    }

    return removeNullish(urlObject)
  }

  // Upon searching, we reset all other filters
  const handleSearch = (q) => {
    setQuery(q)
    dispatch({ type: "limit", payload: 14 })
    dispatch({ type: "offset", payload: 0 })
    dispatch({ type: "offset", payload: 0 })
    setCurrentPage(0)
  }

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), [])

  useEffect(() => {
    if (query) {
      refreshWithFilters({ q: query })
    }
  }, [query])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  })

  const { orders, isLoading, isRefetching, count } = useAdminOrders({
    ...defaultQueryProps,
    ...constructFiltersFromState(),
  })

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / state.limit)
    setNumPages(controlledPageCount)
  }, [orders])

  const [columns] = useOrderTableColums()

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
      data: orders || [],
      manualPagination: true,
      initialState: {
        pageSize: state.limit,
        pageIndex: currentPage,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      const newOffset = state.offset + pageSize
      // setFilters({ ...state, offset: newOffset })
      setCurrentPage((old) => old + 1)
      updateUrlFromFilter({ ...state, offset: newOffset })
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      const newOffset = state.offset - pageSize
      // setFilters({ ...filters, offset: filters.offset - pageSize })
      setCurrentPage((old) => old - 1)
      updateUrlFromFilter({ ...state, offset: newOffset })
      previousPage()
    }
  }

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/orders`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = (queryObject) => {
    const searchObject = {
      ...queryObject,
      ...defaultQueryProps,
    }

    if (isEmpty(queryObject)) {
      resetFilters()
      updateUrlFromFilter({ offset: 0, limit: 14 })
      // setFilters({ ...defaultQueryProps })
    } else {
      updateUrlFromFilter(queryObject)
      // setFilters({ ...searchObject })
    }
  }

  const submitFilters = () => {
    const urlObject = constructFiltersFromState()
    refreshWithFilters(urlObject)
  }

  const resetFilters = () => {
    handleSearch("")
    dispatch({ type: "reset" })
  }

  const setSingleFilter = (filterKey, filterVal) => {
    dispatch({ type: filterKey, payload: filterVal })
  }

  const clearFilters = () => {
    resetFilters()
    refreshWithFilters({ limit: 14, offset: 0 })
  }

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col justify-between">
      {isLoading || isRefetching || !orders ? (
        <div className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <Table
            filteringOptions={
              <OrderFilters
                // setFilters={setFilters}
                setSingleFilter={setSingleFilter}
                filters={state}
                submitFilters={submitFilters}
                resetFilters={resetFilters}
                clearFilters={clearFilters}
              />
            }
            enableSearch
            handleSearch={debouncedSearch}
            searchValue={query}
            {...getTableProps()}
          >
            <Table.Head>
              {headerGroups?.map((headerGroup, index) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col, headerIndex) => (
                    <Table.HeadCell
                      className="w-[100px]"
                      {...col.getHeaderProps()}
                    >
                      {col.render("Header")}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              ))}
            </Table.Head>
            <Table.Body {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row)
                return (
                  <Table.Row
                    color={"inherit"}
                    linkTo={row.original.id}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, index) => {
                      return cell.render("Cell", { index })
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <TablePagination
            count={count!}
            limit={state.limit}
            offset={state.offset}
            pageSize={state.offset + rows.length}
            title="Orders"
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

export default OrderTable
