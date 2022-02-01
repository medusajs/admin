import { RouteComponentProps, useLocation } from "@reach/router"
import { useAdminDraftOrders } from "medusa-react"
import qs from "query-string"
import React, { useEffect, useReducer, useState } from "react"
import { usePagination, useTable } from "react-table"
import Spinner from "../../atoms/spinner"
import Table, { TablePagination } from "../../molecules/table"
import useDraftOrderTableColumns from "./use-draft-order-column"

type DraftOrderFiltersType = {
  limit: number
  offset: number
  pageIndex: number
  q: string
}

const initialState: DraftOrderFiltersType = {
  limit: 14,
  offset: 0,
  pageIndex: 0,
  q: "",
}

function orderFiltersReducer(state, action) {
  switch (action.type) {
    case "query":
      return { ...state, q: action.payload, limit: 14, offset: 0 }
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

const DraftOrderTable: React.FC<RouteComponentProps> = () => {
  const location = useLocation()

  const filtersOnLoad = qs.parse(location.search, {
    arrayFormat: "bracket",
  })

  const offs = parseInt(filtersOnLoad?.offset as string) || 0
  const lim = parseInt(filtersOnLoad?.limit as string) || 14
  initialState.pageIndex = offs / lim

  const [state, dispatch] = useReducer(orderFiltersReducer, initialState)
  const [query, setQuery] = useState((filtersOnLoad?.q as string) || "")
  const [numPages, setNumPages] = useState(0)

  const { draft_orders, isLoading, isRefetching, count } = useAdminDraftOrders({
    offset: state?.offset || 0,
    limit: state?.limit || 14,
    q: state?.q || "",
  })

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / state.limit)
    setNumPages(controlledPageCount)
  }, [draft_orders])

  const [columns] = useDraftOrderTableColumns()

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
      data: draft_orders || [],
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

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch({ type: "query", payload: query })
      gotoPage(0)
    }, 400)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

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

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col justify-between">
      {isLoading || isRefetching || !draft_orders ? (
        <div className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <Table
            filteringOptions={[]}
            enableSearch
            handleSearch={setQuery}
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
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <Table.Row
                    color={"inherit"}
                    linkTo={`/a/draft-orders/${row.original.id}`}
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
            title="Draft Orders"
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

export default DraftOrderTable
