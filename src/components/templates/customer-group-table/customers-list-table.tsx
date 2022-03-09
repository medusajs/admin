import React from "react"
import { useTable } from "react-table"
import Table from "../../molecules/table"

import { CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS } from "./config"

function CustomersListTable({ customers }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns: CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS,
    data: customers || [],
  })

  return (
    <Table {...getTableProps()}>
      <Table.Head>
        {headerGroups?.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col, index) => (
              <Table.HeadCell
                className={index ? "w-[100px]" : "w-[60px]"}
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
              linkTo={`/a/customers/${row.original.id}`}
              {...row.getRowProps()}
            >
              {row.cells.map((cell, index) => (
                <Table.Cell {...cell.getCellProps()}>
                  {cell.render("Cell", { index })}
                </Table.Cell>
              ))}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default CustomersListTable
