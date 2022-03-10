import React from "react"
import { useAdminCustomerGroups } from "medusa-react"
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
import { CustomerGroup } from "@medusajs/medusa"
import useQueryFilters from "../../../hooks/use-query-filters"

const DEFAULT_PAGE_SIZE = 2

const defaultQueryProps = {
  expand: "customers",
}

type HeaderCellProps = {
  col: HeaderGroup<CustomerGroup>
}

function CustomerGroupTableHeaderCell(props: HeaderCellProps) {
  return (
    <Table.HeadCell
      className="w-[100px]"
      {...props.col.getHeaderProps(props.col.getSortByToggleProps())}
    >
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
  } = useQueryFilters(location.search, defaultQueryProps)

  const offs = parseInt(queryObject?.offset) || 0
  const lim = parseInt(queryObject.limit) || DEFAULT_PAGE_SIZE

  const { customer_groups, count } = useAdminCustomerGroups({
    ...queryObject,
    expand: "customers",
  })

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
        pageSize: lim,
        pageIndex: offs / lim,
      },
      pageCount: Math.ceil(count / lim),
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  )

  return (
    <div className="w-full h-full overflow-y-auto flex flex-col justify-between">
      <Table {...getTableProps()}>
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
        // nextPage={handleNext}
        // prevPage={handlePrev}
        hasNext={canNextPage}
        hasPrev={canPreviousPage}
      />
    </div>
  )
}

export default CustomerGroupTable
