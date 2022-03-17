import React, { useContext, useEffect, useState } from "react"
import { useAdminCustomerGroups } from "medusa-react"
import { CustomerGroup } from "@medusajs/medusa"
import {
  HeaderGroup,
  Row,
  TableInstance,
  TableOptions,
  usePagination,
  UsePaginationOptions,
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
import CustomerGroupContext, {
  CustomerGroupContextContainer,
} from "../../../domain/customers/groups/context/customer-group-context"

const defaultQueryProps = {
  additionalFilters: { expand: "customers" },
  limit: 15,
  offset: 0,
}

/**
 * Customer groups empty state.
 */
function CustomerGroupsPlaceholder() {
  return (
    <div className="h-full flex center justify-center items-center min-h-[756px]">
      <span className="text-xs text-gray-400">No customer groups yet</span>
    </div>
  )
}

/**********************************************/
/*************** TABLE ELEMENTS ***************/
/**********************************************/

type HeaderCellProps = {
  col: HeaderGroup<CustomerGroup>
}

/**
 * Renders react-table cell for the customer groups table.
 */
function CustomerGroupsTableHeaderCell(props: HeaderCellProps) {
  return (
    <Table.HeadCell className="w-[100px]" {...props.col.getHeaderProps()}>
      {props.col.render("Header")}
    </Table.HeadCell>
  )
}

type HeaderRowProps = {
  headerGroup: HeaderGroup<CustomerGroup>
}

/**
 * Renders react-table header row for the customer groups table.
 */
function CustomerGroupsTableHeaderRow(props: HeaderRowProps) {
  return (
    <Table.HeadRow {...props.headerGroup.getHeaderGroupProps()}>
      {props.headerGroup.headers.map((col) => (
        <CustomerGroupsTableHeaderCell key={col.id} col={col} />
      ))}
    </Table.HeadRow>
  )
}

type CustomerGroupsTableRowProps = {
  row: Row<CustomerGroup>
}

/**
 * Render react-table row for the customer groups table.
 */
function CustomerGroupsTableRow(props: CustomerGroupsTableRowProps) {
  const { row } = props
  const { showModal } = useContext(CustomerGroupContext)

  const actions = [
    {
      label: "Edit",
      onClick: showModal,
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

/***********************************************/
/*************** TABLE CONTAINER ***************/
/***********************************************/

/**
 * A container component for rendering customer groups table.
 */
function CustomerGroupsTable() {
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

  // !!! HACK - `pageCount` can't be set directly as a computed value due to react table circular reference bug.
  const [pageCount, setPageCount] = useState(
    Math.ceil(count / queryObject.limit)
  )

  useEffect(() => {
    setPageCount(Math.ceil(count / queryObject.limit))
  }, [count])

  useSetSearchParams(representationObject)

  const tableConfig: TableOptions<UsePaginationOptions<CustomerGroup>> = {
    columns: CUSTOMER_GROUPS_TABLE_COLUMNS,
    data: customer_groups || [],
    initialState: {
      pageSize: queryObject.limit,
      pageIndex: queryObject.offset / queryObject.limit,
    },
    pageCount,
    manualPagination: true,
    autoResetPage: false,
  }

  // TODO: fix `useSortBy` - this hook causes infinite renders (missing memo somewhere?)
  const table: TableInstance<CustomerGroup> = useTable(
    tableConfig,
    // useSortBy,
    usePagination
  )

  // ********* HANDLERS *********

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

    if (!text) reset()
    else table.gotoPage(0)
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
        {...table.getTableProps()}
      >
        {/*HEAD*/}
        <Table.Head>
          {table.headerGroups?.map((headerGroup, ind) => (
            <CustomerGroupsTableHeaderRow key={ind} headerGroup={headerGroup} />
          ))}
        </Table.Head>

        {/*BODY*/}
        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return (
              <CustomerGroupContextContainer key={row.id} group={row.original}>
                <CustomerGroupsTableRow row={row} />
              </CustomerGroupContextContainer>
            )
          })}
        </Table.Body>
      </Table>

      {/*PAGINATION*/}
      <TablePagination
        count={count!}
        limit={queryObject.limit}
        offset={queryObject.offset}
        pageSize={queryObject.offset + table.rows.length}
        title="Customers"
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

export default CustomerGroupsTable
