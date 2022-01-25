import { RouteComponentProps } from "@reach/router"
import { useAdminCustomers } from "medusa-react"
import moment from "moment"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useTable } from "react-table"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import DetailsIcon from "../../fundamentals/details-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import Table, { TablePagination } from "../../molecules/table"

const getColor = (index: number): string => {
  const colors = [
    "bg-fuschia-40",
    "bg-pink-40",
    "bg-orange-40",
    "bg-teal-40",
    "bg-cyan-40",
    "bg-blue-40",
    "bg-indigo-40",
  ]
  return colors[index % colors.length]
}

const CustomerTable: React.FC<RouteComponentProps> = () => {
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(14)
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(0)

  const columns = useMemo(
    () => [
      {
        Header: "Date added",
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: "Name",
        accessor: "customer",
        Cell: ({ row }) => (
          <CustomerAvatarItem
            customer={row.original}
            color={getColor(row.index)}
          />
        ),
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "",
        accessor: "col",
      },
      {
        accessor: "orders",
        Header: () => <div className="text-right">Orders</div>,
        Cell: ({ cell: { value } }) => (
          <div className="text-right">{value?.length || 0}</div>
        ),
      },
      {
        Header: "",
        accessor: "col-2",
      },
    ],
    []
  )

  const debouncedSearchTerm = useDebounce(query, 500)

  const { customers, isLoading, isRefetching, count } = useAdminCustomers({
    q: debouncedSearchTerm,
    expand: "orders",
    limit,
    offset,
  })

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
      data: customers || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / limit)
    setNumPages(controlledPageCount)
  }, [customers])

  const rowActions = [
    {
      label: "Details",
      onClick: () => console.log("hello"),
      icon: <DetailsIcon size={20} />,
    },
    {
      label: "Edit",
      onClick: () => console.log("hello"),
      icon: <EditIcon size={20} />,
    },
  ]

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize)
      setCurrentPage((old) => old + 1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => old - pageSize)
      setCurrentPage((old) => old - 1)
      previousPage()
    }
  }

  // Upon searching, we always start on first oage
  const handleSearch = (q) => {
    setOffset(0)
    setCurrentPage(0)
    setQuery(q)
  }

  return (
    <div className="w-full h-full overflow-y-scroll flex flex-col justify-between">
      {isLoading || isRefetching || !customers ? (
        <div className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <Table
            filteringOptions={[]}
            enableSearch
            handleSearch={handleSearch}
            {...getTableProps()}
          >
            <Table.Head>
              {headerGroups?.map((headerGroup) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col) => (
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
                    actions={rowActions}
                    linkTo={row.original.id}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, index) => {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render("Cell", { index })}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <TablePagination
            count={count!}
            limit={limit}
            offset={offset}
            pageSize={offset + rows.length}
            title="Customers"
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

export default CustomerTable
