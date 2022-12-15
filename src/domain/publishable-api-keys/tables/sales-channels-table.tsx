import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { SalesChannel } from "@medusajs/medusa"
import {
  TableOptions,
  usePagination,
  useRowSelect,
  useTable,
} from "react-table"
import React, { useEffect } from "react"
import TableContainer from "../../../components/organisms/table-container"
import Table from "../../../components/molecules/table"
import { TablePagination } from "../../../components/organisms/table-container/pagination"

const LIMIT = 12

const COLUMNS = [
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
  },
  {
    Header: "Description",
    accessor: "description",
  },
]

type SalesChannelTableProps = {
  isEdit: boolean
  query: string
  selectedChannels: Map<string, SalesChannel>
  setSelectedChannels: (
    setter: (oldState: Map<string, SalesChannel>) => void
  ) => {}
  offset: number
  setOffset: (offset: number) => void
  data: SalesChannel[]
  isLoading: boolean
  count: number
}

/**
 * Sales channels select table.
 */
function SalesChannelTable(props: SalesChannelTableProps) {
  const {
    isEdit,
    query,
    offset,
    data,
    isLoading,
    count,
    setOffset,
    selectedChannels,
    setSelectedChannels,
  } = props

  const tableConfig: TableOptions<SalesChannel> = {
    data,
    // @ts-ignore
    columns: COLUMNS,
    autoResetPage: false,
    manualPagination: true,
    autoResetSelectedRows: false,
    initialState: {
      pageIndex: Math.floor(offset / LIMIT),
      pageSize: LIMIT,
      selectedRowIds: Object.keys(selectedChannels).reduce((prev, k) => {
        prev[k] = true
        return prev
      }, {}),
    },
    pageCount: Math.ceil(count / LIMIT),
    getRowId: (row) => row.id,
  }

  const table = useTable(tableConfig, usePagination, useRowSelect)

  useEffect(() => {
    setSelectedChannels((oldState) => {
      const newState = {}

      Object.keys(table.state.selectedRowIds).forEach((k) => {
        newState[k] = oldState[k] || data.find((d) => d.id === k)
      })
      return newState
    })
  }, [table.state.selectedRowIds, data])

  useEffect(() => {
    setOffset(0)
    table.gotoPage(0)
  }, [query])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset(offset + LIMIT)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset(Math.max(offset - LIMIT, 0))
      table.previousPage()
    }
  }

  return (
    <>
      <TableContainer hasPagination numberOfRows={LIMIT} isLoading={isLoading}>
        <Table {...table.getTableProps()}>
          <Table.Head>
            {table.headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          <Table.Body {...table.getTableBodyProps()}>
            {table.rows.map((row) => {
              table.prepareRow(row)
              return (
                <Table.Row color={"inherit"} {...row.getRowProps()}>
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
      </TableContainer>
      <div className="absolute w-[506px]" style={{ bottom: 100 }}>
        <TablePagination
          pagingState={{
            count,
            offset,
            title: "Sales Channels",
            pageSize: offset + table.rows.length,
            currentPage: table.state.pageIndex + 1,
            pageCount: table.pageCount,
            nextPage: handleNext,
            prevPage: handlePrev,
            hasNext: table.canNextPage,
            hasPrev: table.canPreviousPage,
          }}
          isLoading={isLoading}
        />
      </div>
    </>
  )
}

export default SalesChannelTable
