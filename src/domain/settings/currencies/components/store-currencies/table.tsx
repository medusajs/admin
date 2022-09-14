import { AdminGetCurrenciesParams, Currency } from "@medusajs/medusa"
import { useAdminCurrencies } from "medusa-react"
import React, { useMemo, useState } from "react"
import { Column, usePagination, useTable } from "react-table"
import IndeterminateCheckbox from "../../../../../components/molecules/indeterminate-checkbox"
import Table, {
  TablePagination,
} from "../../../../../components/molecules/table"

type Props = {
  source: Currency[]
  count: number
  setParams: React.Dispatch<
    React.SetStateAction<AdminGetCurrenciesParams | undefined>
  >
  params: AdminGetCurrenciesParams | undefined
}

const CurrenciesTable = ({ source, count }: Props) => {
  const {} = useAdminCurrencies({})

  const columns = useColumns()
  const limit = 10
  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

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
    state: { pageIndex, pageSize },
  } = useTable<Currency>(
    {
      columns,
      data: source,
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
      },
      pageCount: numPages,
    },
    usePagination
  )

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

  return (
    <div>
      <Table {...getTableProps()}>
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
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
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Table.Cell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
      <TablePagination
        count={count}
        limit={limit}
        offset={offset}
        pageSize={offset + rows.length}
        title="Currencies"
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

const useColumns = (): Column<Currency>[] => {
  const columns: Column<Currency>[] = useMemo(() => {
    return [
      {
        width: 30,
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <span className="flex justify-center w-[30px]">
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
          </span>
        ),
        Cell: ({ row }) => {
          return (
            <span
              onClick={(e) => e.stopPropagation()}
              className="flex justify-center w-[30px]"
            >
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </span>
          )
        },
      },
      {
        Header: "Title",
        accessor: "name",
        Cell: ({ row, value }) => {
          return (
            <div className="flex items-center gap-x-xsmall inter-small-regular">
              <span className="inter-small-semibold">
                {row.original.code.toUpperCase()}
              </span>
              <p>{value}</p>
            </div>
          )
        },
      },
    ]
  }, [])

  return columns
}

export default CurrenciesTable
