import { flexRender, Table as Instance } from "@tanstack/react-table"
import React from "react"
import { AdditionalItemObject } from "."
import Table from "../../../../components/molecules/table"

type Props = {
  instance: Instance<AdditionalItemObject>
}

const AdditionalItemsTable = ({ instance }: Props) => {
  const { getHeaderGroups, getRowModel } = instance

  return (
    <div>
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
              <Table.Row
                key={row.id}
                className="last-of-type:border-b-0 py-small"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <Table.Cell
                      key={cell.id}
                      className="py-small"
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  )
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default AdditionalItemsTable
