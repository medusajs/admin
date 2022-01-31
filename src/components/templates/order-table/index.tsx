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
  fulfillment?: OrderFilter
  payment?: OrderFilter
  date?: OrderFilter
  status?: OrderFilter
  pageIndex: number
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
  fulfillment: { open: false, filter: null },
  payment: { open: false, filter: null },
  date: { open: false, filter: null },
  pageIndex: 0,
  q: "",
}

function orderFiltersReducer(state, action) {
  switch (action.type) {
    case "filters":
      return { ...state, ...action.payload }
    case "limit":
      return { ...state, limit: action.payload }
    case "offset":
      return { ...state, offset: action.payload }
    case "pageIndex":
      return { ...state, pageIndex: action.payload }
    case "reset":
      return {
        ...initialState,
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

  const offs = parseInt(filtersOnLoad?.offset) || 0
  const lim = parseInt(filtersOnLoad.limit) || 14
  initialState.pageIndex = offs / lim

  const [state, dispatch] = useReducer(orderFiltersReducer, initialState)
  const [tempState, setTempState] = useState(initialState)
  const [query, setQuery] = useState<string>()

  const [numPages, setNumPages] = useState(0)

  const constructFiltersFromState = () => {
    let urlObject: any = {
      "payment_status[]": state?.payment?.filter,
      "fulfillment_status[]": state?.fulfillment?.filter,
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

  useEffect(() => {
    if (query) {
      refreshWithFilters()
    }
  }, [query])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  })

  const initialFilters = constructFiltersFromState()

  const { orders, isLoading, isRefetching, count } = useAdminOrders({
    ...defaultQueryProps,
    ...initialFilters,
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
    gotoPage,
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
        pageIndex: state.pageIndex,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  const handleNext = () => {
    if (canNextPage) {
      const newOffset = state.offset + pageSize
      dispatch({ type: "offset", payload: newOffset })
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      const newOffset = state.offset - pageSize
      dispatch({ type: "offset", payload: newOffset })
      previousPage()
    }
  }

  // Upon searching, we reset all other filters
  const handleSearch = (q) => {
    setQuery(q)
    dispatch({ type: "limit", payload: 14 })
    dispatch({ type: "offset", payload: 0 })
    gotoPage(0)
  }

  const updateUrlFromFilter = (obj = {}) => {
    const stringified = qs.stringify(obj)
    window.history.replaceState(`/a/orders`, "", `${`?${stringified}`}`)
  }

  const refreshWithFilters = () => {
    const filterObj = constructFiltersFromState()

    if (isEmpty(filterObj)) {
      updateUrlFromFilter({ offset: 0, limit: 14 })
    } else {
      updateUrlFromFilter(filterObj)
    }
  }

  const resetFilters = () => {
    dispatch({ type: "reset" })
    gotoPage(0)
    updateUrlFromFilter()
    setTempState(initialState)
  }

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

  const submitFilters = () => {
    dispatch({ type: "filters", payload: tempState })
  }

  const clearFilters = () => {
    resetFilters()
    refreshWithFilters()
  }

  const debouncedSearch = useMemo(() => debounce(handleSearch, 500), [])

  useEffect(() => {
    refreshWithFilters()
  }, [state])

  const setFiltersOnLoad = () => {
    const loadedFilters = {
      limit: filtersOnLoad?.limit ? parseInt(filtersOnLoad?.limit) : 14,
      offset: filtersOnLoad?.offset ? parseInt(filtersOnLoad?.offset) : 0,
      status: parseUrlFilter(filtersOnLoad.status),
      fulfillment: parseUrlFilter(filtersOnLoad.fulfillment_status),
      payment: parseUrlFilter(filtersOnLoad.payment_status),
      date: parseUrlFilter(filtersOnLoad.created_at),
    }

    setTempState(loadedFilters)
    dispatch({ type: "filters", payload: loadedFilters })
  }

  useEffect(() => {
    setFiltersOnLoad()
  }, [])

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
                setSingleFilter={setSingleFilter}
                filters={tempState}
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
