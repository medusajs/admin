import React from "react"
import { useSortBy, useTable } from "react-table"
import { useAdminRemoveCustomersFromCustomerGroup } from "medusa-react"
import { navigate } from "gatsby"

import { CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS } from "./config"
import Table from "../../molecules/table"
import DetailsIcon from "../../fundamentals/details-icon"
import MailIcon from "../../fundamentals/icons/mail-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"

function CustomersListTable({ customers, groupId }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns: CUSTOMER_GROUPS_CUSTOMERS_LIST_TABLE_COLUMNS,
      data: customers || [],
    },
    useSortBy
  )

  const { mutate: removeCustomers } = useAdminRemoveCustomersFromCustomerGroup(
    groupId
  )

  return (
    <Table {...getTableProps()}>
      <Table.Head>
        {headerGroups?.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col, index) => (
              <Table.HeadCell
                className={index ? "w-[100px]" : "w-[60px]"}
                {...col.getHeaderProps(col.getSortByToggleProps())}
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
              actions={[
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
              ]}
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
