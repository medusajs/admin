import { flexRender, Table as Instance } from "@tanstack/react-table"
import React from "react"
import { ReceiveReturnObject } from "."
import Table from "../../../../components/molecules/table"

type Props = {
  instance: Instance<ReceiveReturnObject>
}

const ItemsToReceiveTable = ({ instance }: Props) => {
  const { getRowModel, getHeaderGroups } = instance

  return (
    <Table>
      <Table.Head>
        {getHeaderGroups().map((headerGroup) => {
          return (
            <Table.HeadRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.HeadCell
                    key={header.id}
                    className="inter-small-semibold text-grey-50"
                    style={{
                      width: header.getSize(),
                      maxWidth: header.getSize(),
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Table.HeadCell>
                )
              })}
            </Table.HeadRow>
          )
        })}
      </Table.Head>
      <Table.Body>
        {getRowModel().rows.map((row) => {
          return (
            <Table.Row key={row.id} className="last-of-type:border-b-0">
              {row.getVisibleCells().map((cell) => {
                return (
                  <Table.Cell
                    key={cell.id}
                    style={{
                      width: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

export default ItemsToReceiveTable
