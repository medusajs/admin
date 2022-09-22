import { ProductVariant } from "@medusajs/medusa"
import React from "react"
import { TableInstance } from "react-table"
import LoadingContainer from "../../../../components/loading-container"
import Table from "../../../../components/molecules/table"

type Props = {
  instance: TableInstance<ProductVariant>
  isLoadingData: boolean
}

const AdditionalItemsTable = ({ instance, isLoadingData }: Props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = instance

  return (
    <LoadingContainer isLoading={isLoadingData}>
      <Table {...getTableProps()}>
        <Table.Head>
          {headerGroups.map((headerGroup) => {
            return (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <Table.HeadCell
                      {...column.getHeaderProps()}
                      className="inter-small-semibold text-grey-50"
                    >
                      {column.render("Header")}
                    </Table.HeadCell>
                  )
                })}
              </Table.HeadRow>
            )
          })}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)
            return (
              <Table.Row {...row.getRowProps()}>
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
    </LoadingContainer>
  )
}

export default AdditionalItemsTable
