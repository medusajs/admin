import { useAdminVariants } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"

import { useDebounce } from "../../../hooks/use-debounce"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import Table, { TablePagination } from "../../../components/molecules/table"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import Spinner from "../../../components/atoms/spinner"

const PAGE_SIZE = 12

type Props = {
  onSubmit: (selectItems) => void
  selectedItems?: any
}

const VariantsTable: React.FC<Props> = (props) => {
  const { onSubmit, selectedItems } = props

  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const [selectedVariants, setSelectedVariants] = useState<any[]>([])

  const debouncedSearchTerm = useDebounce(query, 500)

  const { isLoading, count, variants } = useAdminVariants({
    q: debouncedSearchTerm,
    limit: PAGE_SIZE,
    offset,
  })

  useEffect(() => {
    if (typeof count !== "undefined") {
      setNumPages(Math.ceil(count / PAGE_SIZE))
    }
  }, [count])

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">Name</div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.product.thumbnail ? (
                  <img
                    src={original.product.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.product.title}</span>
                {original.title}
              </div>
            </div>
          )
        },
      },
      {
        Header: (
          <div className="text-gray-500 text-small font-semibold">Options</div>
        ),
        accessor: "options",
        Cell: ({ row: { original } }) => (
          <span>{original.options?.map(({ value }) => value + " ")}</span>
        ),
      },
      {
        Header: (
          <div className="text-right text-gray-500 text-small font-semibold">
            In Stock
          </div>
        ),
        accessor: "inventory_quantity",
        Cell: ({ row: { original } }) => (
          <div className="text-right">{original.inventory_quantity}</div>
        ),
      },
    ]
  }, [])

  const table = useTable(
    {
      columns,
      data: variants || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: PAGE_SIZE,
        selectedRowIds: selectedItems.reduce((prev, { id }) => {
          prev[id] = true
          return prev
        }, {}),
      },
      pageCount: numPages,
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => {
            return (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllRowsSelectedProps()}
                  type="radio"
                />
              </div>
            )
          },
          Cell: ({ row }) => {
            return (
              <div>
                <IndeterminateCheckbox
                  {...row.getToggleRowSelectedProps()}
                  type="radio"
                />
              </div>
            )
          },
        },
        ...columns,
      ])
    }
  )

  useEffect(() => {
    setSelectedVariants((selectedVariants) => [
      ...selectedVariants.filter(
        (sv) =>
          Object.keys(table.state.selectedRowIds).findIndex(
            (id) => id === sv.id
          ) > -1
      ),
      ...(variants?.filter(
        (v) =>
          selectedVariants.findIndex((sv) => sv.id === v.id) < 0 &&
          Object.keys(table.state.selectedRowIds).findIndex(
            (id) => id === v.id
          ) > -1
      ) || []),
    ])
  }, [table.state.selectedRowIds])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset((old) => old + table.state.pageSize)
      setCurrentPage((old) => old + 1)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset((old) => Math.max(old - table.state.pageSize, 0))
      setCurrentPage((old) => old - 1)
      table.previousPage()
    }
  }

  const handleSearch = (q) => {
    setOffset(0)
    setCurrentPage(0)
    setQuery(q)
  }

  return (
    <>
      <Table
        immediateSearchFocus
        enableSearch
        searchPlaceholder="Search Product Variants..."
        handleSearch={handleSearch}
        {...table.getTableProps()}
      >
        {table.headerGroups.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}

        <Table.Body {...table.getTableBodyProps()}>
          {isLoading ? (
            <Spinner size="large" />
          ) : (
            table.rows.map((row) => {
              const isDisabled = row.original.inventory_quantity === 0

              table.prepareRow(row)
              return (
                <Table.Row
                  {...row.getRowProps()}
                  className={isDisabled && "opacity-50 pointer-events-none"}
                >
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })
          )}
        </Table.Body>
      </Table>
      <TablePagination
        count={count!}
        limit={PAGE_SIZE}
        offset={offset}
        pageSize={offset + table.rows.length}
        title="Products"
        currentPage={table.state.pageIndex + 1}
        pageCount={table.pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={table.canNextPage}
        hasPrev={table.canPreviousPage}
      />
    </>
  )
}

export default VariantsTable
