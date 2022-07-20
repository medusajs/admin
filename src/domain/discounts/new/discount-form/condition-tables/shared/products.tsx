import { Product } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Column, HeaderGroup, Row } from "react-table"
import SortingIcon from "../../../../../../components/fundamentals/icons/sorting-icon"
import ImagePlaceholder from "../../../../../../components/fundamentals/image-placeholder"
import StatusIndicator from "../../../../../../components/fundamentals/status-indicator"
import Table from "../../../../../../components/molecules/table"

const getProductStatusVariant = (status: string) => {
  switch (status) {
    case "proposed":
      return "warning"
    case "published":
      return "success"
    case "rejected":
      return "danger"
    case "draft":
    default:
      return "default"
  }
}

export const ProductRow = ({ row }: { row: Row<Product> }) => {
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
}

export const ProductsHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<Product>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell
          className="w-[100px]"
          {...col.getHeaderProps(col.getSortByToggleProps())}
        >
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

export const useProductColumns = () => {
  const columns = useMemo<Column<Product>[]>(() => {
    return [
      {
        Header: () => (
          <div className="flex items-center gap-1 min-w-[443px]">
            Title <SortingIcon size={16} />
          </div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-cover rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.title}</span>
              </div>
            </div>
          )
        },
      },
      {
        Header: () => (
          <div className="flex items-center gap-1">
            Status <SortingIcon size={16} />
          </div>
        ),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <StatusIndicator
            title={`${original.status
              .charAt(0)
              .toUpperCase()}${original.status.slice(1)}`}
            variant={getProductStatusVariant(original.status)}
          />
        ),
      },
      {
        Header: () => (
          <div className="flex justify-end items-center gap-1">
            Variants <SortingIcon size={16} />
          </div>
        ),
        id: "variants",
        accessor: (row) => row.variants.length,
        Cell: ({ cell: { value } }) => {
          return <div className="text-right">{value}</div>
        },
      },
    ]
  }, [])

  return columns
}
