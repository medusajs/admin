import { ProductVariant } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Column, useTable } from "react-table"
import DuplicateIcon from "../../../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../../../components/molecules/actionables"
import Table from "../../../../../components/molecules/table"

type Props = {
  variants: ProductVariant[]
}

export const useVariantsTableColumns = () => {
  const columns = useMemo<Column<{ id?: string } & ProductVariant>[]>(
    () => [
      {
        Header: "Title",
        id: "title",
        accessor: "title",
      },
      {
        Header: "SKU",
        id: "sku",
        accessor: "sku",
        maxWidth: 264,
        Cell: ({ cell }) => {
          return cell.value ? (
            cell.value
          ) : (
            <span className="text-grey-50">-</span>
          )
        },
      },
      {
        Header: "EAN",
        id: "ean",
        accessor: "ean",
        maxWidth: 264,
        Cell: ({ cell }) => {
          return cell.value ? (
            cell.value
          ) : (
            <span className="text-grey-50">-</span>
          )
        },
      },
      {
        Header: () => {
          return (
            <div className="text-right">
              <span>Inventory</span>
            </div>
          )
        },
        id: "inventory",
        accessor: "inventory_quantity",
        maxWidth: 56,
        Cell: ({ cell }) => {
          return (
            <div className="text-right">
              <span>{cell.value}</span>
            </div>
          )
        },
      },
      {
        id: "actions",
        width: 32,
        Cell: ({ row }) => {
          return (
            <div className="float-right">
              <Actionables
                forceDropdown
                actions={[
                  {
                    label: "Duplicate Variant",
                    onClick: () => {},
                    icon: <DuplicateIcon size="20" />,
                  },
                  {
                    label: "Delete Variant",
                    onClick: () => {},
                    icon: <TrashIcon size="20" />,
                    variant: "danger",
                  },
                ]}
              />
            </div>
          )
        },
      },
    ],
    []
  )

  return columns
}

const VariantsTable = ({ variants }: Props) => {
  const columns = useVariantsTableColumns()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: variants,
    defaultColumn: {
      width: "auto",
    },
  })

  return (
    <Table {...getTableProps()} className="table-fixed">
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
  )
}

export default VariantsTable
