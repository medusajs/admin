import clsx from "clsx"
import { isEmpty } from "lodash"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { toast, ToastOptions } from "react-hot-toast"
import { usePagination, useRowSelect, useTable } from "react-table"
import Spinner from "../../atoms/spinner"
import BackspaceIcon from "../../fundamentals/icons/backspace-icon"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import Table, { TablePagination } from "../../molecules/table"
import { HotKey, TableToasterContainer } from "../../molecules/table-toaster"
import PriceListsFilter from "./price-list-filters"
import { usePriceListTableColumns } from "./use-price-list-columns"
import { usePriceListFilters } from "./use-price-list-filters"

const priceLists = [
  {
    name: "VIP Customers",
    description: "Attractive prices for our frequent and loyal buyers",
    status: "draft",
    customer_groups: [
      { title: "Medusa Community Club" },
      { title: "FRIENDS" },
      { title: "Morocco" },
    ],
  },
  {
    name: "Business2Business",
    description: "Special prices for our B2B Customers",
    status: "active",
    customer_groups: [
      { title: "B2B partners" },
      { title: "FRIENDS" },
      { title: "Morocco" },
    ],
  },
  {
    name: "Black Friday",
    description: "Adjustment of prices for black friday 2022",
    status: "scheduled",
    customer_groups: [{ title: "all customers" }],
  },
  {
    name: "Christmas 2022",
    description: "Celebratory prices for the holidays",
    status: "expired",
    customer_groups: [{ title: "all customers" }, { title: "friends" }],
  },
]

const DEFAULT_PAGE_SIZE = 15

const defaultQueryProps = {}

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
  } = usePriceListFilters(location.search, defaultQueryProps)
  const [count, setCount] = useState(priceLists.length)
  const [isLoading, setIsLoading] = useState(false)
  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  // TODO: integrate with medusa-react once pr has been merged
  // const { discounts, isLoading, count } = useAdminDiscounts({
  //   is_dynamic: false,
  //   ...queryObject,
  // })

  // const fetchUsers = async () => {
  //   Medusa.priceLists.retrieve().then(({ data }) => {
  //     setCount(data.count)
  //     setPriceLists(data.price_lists)
  //     setIsLoading(false)
  //     console.log(data)
  //   })
  // }

  // useEffect(() => {
  //   fetchUsers()
  // }, [])

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

  console.log({ selectedRowIds, selectedFlatRows })

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
            <HotKey
              label="Unpublish"
              hotKey="U"
              icon="U"
              onAction={() => console.log("clicked")}
            />
          </div>
          <div className="pr-base">
            <HotKey
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

type ToasterProps = {
  visible: boolean
  children: React.ReactElement
} & ToastOptions

const Toaster = ({ visible, children, ...options }: ToasterProps) => {
  useEffect(() => {
    if (visible) {
      toast.custom((t) => React.cloneElement(children, { toast: t }), {
        ...options,
      })
    } else {
      toast.dismiss(options.id)
    }
  }, [visible, children])

  return null
}

export default PriceListTable
