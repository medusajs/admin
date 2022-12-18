import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useAdminPriceListProducts } from "medusa-react"
import { useMemo, useState } from "react"
import { useSortBy, useTable } from "react-table"
import Table from "../../../../../../components/molecules/table"
import { useDebounce } from "../../../../../../hooks/use-debounce"
import { useColumns } from "./use-columns"

type Props = {
  priceListId: string
}

const PriceListProductsTable = ({ priceListId }: Props) => {
  const [query, setQuery] = useState<string | undefined>(undefined)
  const debouncedQuery = useDebounce(query, 500)

  const { products } = useAdminPriceListProducts(priceListId, {
    q: debouncedQuery,
  })

  const data: PricedProduct[] = useMemo(
    () => (products as PricedProduct[]) || [],
    [products]
  )

  const columns = useColumns({ id: priceListId })

  const { getTableProps, getTableBodyProps, rows, prepareRow, headerGroups } =
    useTable(
      {
        data: data,
        columns,
      },
      useSortBy
    )

  return (
    <div>
      <Table
        {...getTableProps}
        enableSearch
        searchValue={query}
        searchPlaceholder={"Search by title, SKU, etc."}
        handleSearch={setQuery}
      >
        <Table.Head>
          {headerGroups.map((headerGroup) => {
            return (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (["title", "collection"].includes(column.id)) {
                    return (
                      <Table.HeadCell
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                      </Table.HeadCell>
                    )
                  }

                  return (
                    <Table.HeadCell {...column.getHeaderProps()}>
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
    </div>
  )
}

export default PriceListProductsTable
