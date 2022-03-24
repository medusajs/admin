import clsx from "clsx"
import { isEmpty } from "lodash"
import { useAdminDiscounts } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { usePagination, useTable, useRowSelect } from "react-table"
import Spinner from "../../atoms/spinner"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import Table, { TablePagination } from "../../molecules/table"
import DiscountFilters from "../discount-filter-dropdown"
import { usePriceListTableColumns } from "./use-price-list-columns"
import { useDiscountFilters } from "./use-price-list-filters"

import Medusa from "../../../services/api"

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

const cus = (hooks) => {
  console.log("hooks", hooks)
  hooks.visibleColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: "selection",
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }) => (
        <div>
          <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
        </div>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }) => (
        <div>
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </div>
      ),
    },
    ...columns,
  ])
}

type priceListRes = {
  price_lists: any[]
  imit: number
  offset: number
  count: number
}

const PriceListTable: React.FC = () => {
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
  } = useDiscountFilters(location.search, defaultQueryProps)

  const [priceLists, setPriceLists] = useState([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  // TODO: integrate with medusa-react once pr has been merged
  // const { discounts, isLoading, count } = useAdminDiscounts({
  //   is_dynamic: false,
  //   ...queryObject,
  // })

  const fetchUsers = async () => {
    Medusa.priceLists.retrieve().then(({ data }) => {
      setCount(data.count)
      setPriceLists(data.price_lists)
      setIsLoading(false)
      console.log(data)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

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
    // Get the state from the instance
    state: { pageIndex, selectedRowIds },
  } = useTable(
    {
      columns,
      data: priceLists || [],
      manualPagination: true,
      initialState: {
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination,
    useRowSelect,
    cus
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
    window.history.replaceState(`/a/discounts`, "", `${`?${stringified}`}`)
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
          <DiscountFilters
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
        {isLoading || !priceLists ? (
          <div className="flex w-full h-full absolute items-center justify-center mt-10">
            <div className="">
              <Spinner size={"large"} variant={"secondary"} />
            </div>
          </div>
        ) : (
          <Table.Body {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                  className="group"
                  actions={[
                    {
                      label: "Unpublish",
                      onClick: () => {},
                      icon: <UnpublishIcon size={20} />,
                    },
                    {
                      label: "Duplicate",
                      onClick: () => {},
                      icon: <DuplicateIcon size={20} />,
                    },
                    {
                      label: "Delete",
                      onClick: () => {},
                      icon: <TrashIcon size={20} />,
                      variant: "danger",
                    },
                  ]}
                  linkTo={row.original.id}
                >
                  {row.cells.map((cell, index) => {
                    return cell.render("Cell", { index })
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        )}
      </Table>
      <TablePagination
        count={count!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + rows.length}
        title="Discounts"
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

export default PriceListTable
