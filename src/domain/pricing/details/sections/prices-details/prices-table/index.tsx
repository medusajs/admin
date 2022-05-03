import { Product } from "@medusajs/medusa"
import { useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import { HeaderGroup, Row } from "react-table"
import CancelIcon from "../../../../../../components/fundamentals/icons/cancel-icon"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import Table from "../../../../../../components/molecules/table"
import { SelectableTable } from "../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import usePricesColumns from "./use-columns"

const DEFAULT_PAGE_SIZE = 9
const defaultQueryProps = {
  offset: 0,
  limit: DEFAULT_PAGE_SIZE,
}

type PricesTableProps = {
  id: string
  selectProduct: (product: Product) => void
}

const PricesTable = ({ id, selectProduct }: PricesTableProps) => {
  const params = useQueryFilters(defaultQueryProps)
  const { products, isLoading, count = 0 } = useAdminPriceListProducts(
    id,
    params.queryObject
  )
  const columns = usePricesColumns()

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <SelectableTable
        columns={columns}
        data={products || []}
        renderRow={({ row }: { row: Row<Product> }) => {
          const handleSelect = () => {
            selectProduct(row.original)
          }

          const actions = [
            {
              label: "Edit prices",
              icon: <EditIcon size={20} />,
              onClick: handleSelect,
            },
            {
              label: "Remove product",
              icon: <CancelIcon size={20} />,
              variant: "danger" as const,
              onClick: () => {},
            },
          ]

          return (
            <Table.Row
              {...row.getRowProps()}
              actions={actions}
              onClick={handleSelect}
              className="hover:bg-grey-5 hover:cursor-pointer"
            >
              {row.cells.map((cell) => {
                return (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        }}
        renderHeaderGroup={ProductHeader}
        isLoading={isLoading}
        totalCount={count}
        options={{
          enableSearch: false,
          searchPlaceholder: "Search by name or SKU...",
        }}
        {...params}
      />
    </div>
  )
}

const ProductHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<Product>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell {...col.getHeaderProps(col.getSortByToggleProps())}>
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

export default PricesTable
