import React, { useEffect, useState } from "react"
import { useAdminProductTags } from "medusa-react"
import { usePagination, useRowSelect, useTable } from "react-table"

import Table, { TablePagination } from "../../../../components/molecules/table"
import useQueryFilters from "../../../../hooks/use-query-filters"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import SortingIcon from "../../../../components/fundamentals/icons/sorting-icon"

/**
 * Default filtering config for querying tags list endpoint.
 */
const defaultQueryProps = {
  // additionalFilters: { expand: "products" },
  limit: 2,
}

const TagsTableColumns = [
  {
    id: "selection",
    Header: ({ getToggleAllPageRowsSelectedProps }) => (
      <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
    ),
    Cell: ({ row }) => {
      return (
        <Table.Cell onClick={(e) => e.stopPropagation()}>
          <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </Table.Cell>
      )
    },
  },
  {
    Header: () => (
      <div className="flex items-center gap-1">
        Title <SortingIcon size={16} />
      </div>
    ),
    accessor: "value",
    Cell: ({ row }) => (
      <div>
        <span className="bg-grey-20 p-1 rounded">#{row.original.value}</span>
      </div>
    ),
  },
  {
    Header: () => (
      <div className="flex items-center gap-1 justify-end">
        Products <SortingIcon size={16} />
      </div>
    ),
    accessor: "products",
    Cell: <div className="text-right">N/A</div>,
  },
]

/*
 * Tags table header row.
 */
function TagsTableHeaderRow(props: any) {
  const { headerGroup } = props

  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col, index) => (
        <Table.HeadCell {...col.getHeaderProps()}>
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

/*
 * Tags table row.
 */
function TagsTableRow(props: any) {
  return (
    <Table.Row color={"inherit"} {...props.row.getRowProps()}>
      {props.row.cells.map((cell, index) => (
        <Table.Cell {...cell.getCellProps()}>
          {cell.render("Cell", { index })}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

/**
 * A table for selecting product tags for a product condition.
 */
function SelectTagsTable() {
  const { product_tags, count } = useAdminProductTags()

  const { paginate, setQuery, queryObject } = useQueryFilters(defaultQueryProps)

  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (typeof count !== "undefined") {
      const controlledPageCount = Math.ceil(count / queryObject.limit)
      setNumPages(controlledPageCount)
    }
  }, [count])

  const tableConfig = {
    columns: TagsTableColumns,
    data: product_tags || [],
    initialState: {
      pageSize: queryObject.limit,
      pageIndex: queryObject.offset / queryObject.limit,
      // selectedRowIds: selectedIds.reduce((prev, id) => {
      //   prev[id] = true
      //   return prev
      // }, {}),
    },
    pageCount: numPages,
    autoResetSelectedRows: false,
    manualPagination: true,
    autoResetPage: false,
    getRowId: (row) => row.id,
  }

  const table = useTable(tableConfig, usePagination, useRowSelect)

  // useEffect(() => {
  //   setSelectedIds(Object.keys(table.state.selectedRowIds))
  // }, [table.state.selectedRowIds])

  const handleNext = () => {
    if (!table.canNextPage) return

    paginate(1)
    table.nextPage()
  }

  const handlePrev = () => {
    if (!table.canPreviousPage) return

    paginate(-1)
    table.previousPage()
  }

  const handleSearch = (text: string) => {
    setQuery(text)

    if (text) table.gotoPage(0)
  }

  return (
    <div className="p-4 min-h-[700px]">
      <Table
        // filteringOptions={filteringOptions}
        enableSearch
        handleSearch={handleSearch}
        searchValue={queryObject.q}
        {...table.getTableProps()}
      >
        <Table.Head>
          {table.headerGroups?.map((headerGroup) => (
            <TagsTableHeaderRow headerGroup={headerGroup} />
          ))}
        </Table.Head>

        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return <TagsTableRow row={row} />
          })}
        </Table.Body>
      </Table>

      <TablePagination
        count={count!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + table.rows.length}
        title="tags"
        currentPage={table.state.pageIndex + 1}
        pageCount={table.pageCount}
        nextPage={handleNext}
        prevPage={handlePrev}
        hasNext={table.canNextPage}
        hasPrev={table.canPreviousPage}
      />
    </div>
  )
}

export default SelectTagsTable
