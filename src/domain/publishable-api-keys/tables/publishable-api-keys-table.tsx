import React, { useState } from "react"
import { useTable } from "react-table"
import { useAdminPublishableApiKeys } from "medusa-react"
import TableContainer from "../../../components/organisms/table-container"
import Table from "../../../components/molecules/table"

const PAGE_SIZE = 12

const columns = [
  {
    accessor: "title",
    Header: <div className="text-gray-500 text-small font-semibold">Name</div>,
    Cell: ({ row: { original } }) => {
      return <span>{original.title}</span>
    },
  },
  {
    accessor: "id",
    Header: <div className="text-gray-500 text-small font-semibold">Token</div>,
    Cell: ({ row: { original } }) => {
      return <span>{original.id}</span>
    },
  },
  {
    accessor: "created_at",
    Header: (
      <div className="text-gray-500 text-small font-semibold">Created</div>
    ),
    Cell: ({ row: { original } }) => {
      return <span>{original.created_at}</span>
    },
  },
  {
    accessor: "revoked_at",
    Header: (
      <div className="text-gray-500 text-small font-semibold">Status</div>
    ),
    Cell: ({ row: { original } }) => {
      return <span>{original.revoked_at ? "Live" : "Revoked"}</span>
    },
  },
]

/**
 * Container component that displays paginated publishable api keys table.
 */
function PublishableApiKeysTable() {
  const [query, setQuery] = useState("")
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const {
    publishable_api_keys: keys,
    count,
    isLoading,
  } = useAdminPublishableApiKeys()

  const table = useTable({
    columns,
    data: keys || [],
    manualPagination: true,
    initialState: {
      pageIndex: currentPage,
      pageSize: PAGE_SIZE,
      selectedRowIds: {},
    },
    pageCount: numPages,
    autoResetSelectedRows: false,
    autoResetPage: false,
    getRowId: (row) => row.id,
  })

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

  return (
    <TableContainer
      hasPagination
      isLoading={isLoading}
      numberOfRows={PAGE_SIZE}
      pagingState={{
        count: count!,
        offset: offset,
        pageSize: offset + table.rows.length,
        title: "API Keys",
        currentPage: table.state.pageIndex + 1,
        pageCount: table.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
      }}
    >
      <Table {...table.getTableProps()}>
        {/* === HEADER === */}
        {table.headerGroups.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}

        {/* === BODY === */}
        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return (
              <Table.Row {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

export default PublishableApiKeysTable
