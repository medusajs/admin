import React from "react"
import { HeaderGroup, Row, useSortBy, useTable } from "react-table"
import { UseMutateFunction } from "react-query"
import { navigate } from "gatsby"

import { Customer } from "@medusajs/medusa"

import { CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS } from "./config"
import Table from "../../molecules/table"
import DetailsIcon from "../../fundamentals/details-icon"
import MailIcon from "../../fundamentals/icons/mail-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"

type CustomersListTableProps = {
  customers: Customer[]
  removeCustomers: UseMutateFunction<any, Error, any, unknown>
  groupId: string
  query?: string
  setQuery: (q: string) => void
}

type CustomersListTableHeaderRowProps = {
  headerGroup: HeaderGroup<Customer>
}

/**
 * Renders customer group customers list header row.
 */
function CustomersListTableHeaderRow(props: CustomersListTableHeaderRowProps) {
  const { headerGroup } = props

  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {props.headerGroup.headers.map((col, index) => {
        const { render, getHeaderProps, getSortByToggleProps } = col
        const className = index ? "w-[100px]" : "w-[60px]"

        return (
          <Table.HeadCell
            className={className}
            {...getHeaderProps(getSortByToggleProps())}
          >
            {render("Header")}
          </Table.HeadCell>
        )
      })}
    </Table.HeadRow>
  )
}

interface CustomersListTableRowProps {
  row: Row<Customer>
  removeCustomers: Function
}

function CustomersListTableRow(props: CustomersListTableRowProps) {
  const { row, removeCustomers } = props

  const actions = [
    {
      label: "Details",
      onClick: () => navigate(`/a/customers/${row.original.id}`),
      icon: <DetailsIcon size={20} />,
    },
    // {
    //   label: "Send an email",
    //   onClick: () => window.open(`mailto:${row.original.email}`),
    //   icon: <MailIcon size={20} />,
    // },
    {
      label: "Delete from the group",
      variant: "danger",
      onClick: () =>
        removeCustomers({
          customer_ids: [{ id: row.original.id }],
        }),
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <Table.Row
      color={"inherit"}
      actions={actions}
      linkTo={`/a/customers/${props.row.original.id}`}
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

/**
 * Render a list of customers that belong to a customer group.
 */
function CustomersListTable(props: CustomersListTableProps) {
  const { customers, removeCustomers, setQuery, query } = props

  const tableConfig = {
    columns: CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS,
    data: customers || [],
  }

  const table = useTable(tableConfig, useSortBy)

  return (
    <Table
      enableSearch
      handleSearch={setQuery}
      searchValue={query}
      {...table.getTableProps()}
    >
      <Table.Head>
        {table.headerGroups?.map((headerGroup, index) => (
          <CustomersListTableHeaderRow key={index} headerGroup={headerGroup} />
        ))}
      </Table.Head>

      <Table.Body {...table.getTableBodyProps()}>
        {table.rows.map((row) => {
          table.prepareRow(row)
          return (
            <CustomersListTableRow
              row={row}
              key={row.id}
              removeCustomers={removeCustomers}
            />
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default CustomersListTable
