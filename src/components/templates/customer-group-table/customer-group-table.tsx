import React from "react"
import { useAdminCustomerGroups } from "medusa-react"
import { CustomerGroup } from "@medusajs/medusa"
import {
  HeaderGroup,
  Row,
  usePagination,
  useSortBy,
  useTable,
} from "react-table"
import { navigate } from "gatsby"

import Table, { TablePagination } from "../../molecules/table"
import EditIcon from "../../fundamentals/icons/edit-icon"
import DetailsIcon from "../../fundamentals/details-icon"

import { CUSTOMER_GROUPS_TABLE_COLUMNS } from "./config"
import useQueryFilters from "../../../hooks/use-query-filters"
import useSetSearchParams from "../../../hooks/use-set-search-params"

const DEFAULT_PAGE_SIZE = 2

const defaultQueryProps = {
  expand: "customers",
}

type HeaderCellProps = {
  col: HeaderGroup<CustomerGroup>
}

function CustomerGroupsPlaceholder() {
  return (
    <div className="h-full flex center justify-center items-center min-h-[756px]">
      <span className="text-xs text-gray-400">No customer groups yet</span>
    </div>
  )
}

function CustomerGroupTableHeaderCell(props: HeaderCellProps) {
  return (
    <Table.HeadCell className="w-[100px]" {...props.col.getHeaderProps()}>
      {props.col.render("Header")}
    </Table.HeadCell>
  )
}

type HeaderRowProps = {
  headerGroup: HeaderGroup<CustomerGroup>
}

function CustomerGroupTableHeaderRow(props: HeaderRowProps) {
  return (
    <Table.HeadRow {...props.headerGroup.getHeaderGroupProps()}>
      {props.headerGroup.headers.map((col) => (
        <CustomerGroupTableHeaderCell col={col} />
      ))}
    </Table.HeadRow>
  )
}

function CustomerGroupTableRow(props: { row: Row<CustomerGroup> }) {
  const { row } = props

  const actions = [
    {
      label: "Edit",
      onClick: () => navigate(row.original.id),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Details",
      onClick: () => navigate(row.original.id),
      icon: <DetailsIcon size={20} />,
    },
  ]

  return (
    <Table.Row
      color={"inherit"}
      actions={actions}
      linkTo={props.row.original.id}
      {...props.row.getRowProps()}
    >
      {props.row.cells.map((cell, index) => (
        <Table.Cell {...cell.getCellProps()}>
          {cell.render("Cell", { index })}
        </Table.Cell>
      ))}
    </Table.Row>
  )
}

function CustomerGroupTable() {
  const {
    reset,
    paginate,
    setQuery,
    queryObject,
    representationObject,
  } = useQueryFilters(defaultQueryProps)

  const { customer_groups, isLoading, count = 0 } = useAdminCustomerGroups(
    queryObject
  )

  useSetSearchParams(representationObject)

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // Pagination
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns: CUSTOMER_GROUPS_TABLE_COLUMNS,
      data: customer_groups || [],
      manualPagination: true,
      initialState: {
        pageSize: queryObject.limit,
        pageIndex: queryObject.offset / queryObject.limit,
      },
      pageCount: Math.ceil(count / queryObject.limit),
      autoResetPage: false,
    },
    // useSortBy,
    usePagination
  )

  // ********* HANDLERS *********

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

  const handleSearch = (text: string) => {
    setQuery(text)

    if (!text) reset()
    else gotoPage(0)
  }

  // ********* RENDER *********

  if (!isLoading && !customer_groups?.length && !queryObject.q)
    return <CustomerGroupsPlaceholder />

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
      <Table
        enableSearch
        handleSearch={handleSearch}
        searchValue={queryObject.q}
        {...getTableProps()}
      >
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <CustomerGroupTableHeaderRow headerGroup={headerGroup} />
          ))}
        </Table.Head>

        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return <CustomerGroupTableRow row={row} />
          })}
        </Table.Body>
      </Table>

      <TablePagination
        count={count!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + rows.length}
        title="Customers"
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

export default CustomerGroupTable
