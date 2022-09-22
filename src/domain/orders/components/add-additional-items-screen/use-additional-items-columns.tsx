import { ProductVariant } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Column } from "react-table"
import CopyToClipboard from "../../../../components/atoms/copy-to-clipboard"
import Thumbnail from "../../../../components/atoms/thumbnail"
import StatusIndicator from "../../../../components/fundamentals/status-indicator"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { ProductStatus } from "../../../../types/shared"

const getProductStatus = (
  status: ProductStatus
): { variant: "warning" | "default" | "success"; title: string } => {
  switch (status) {
    case "proposed":
      return { variant: "warning", title: "Proposed" }
    case "published":
      return { variant: "success", title: "Published" }
    case "draft":
      return { variant: "default", title: "Draft" }
    default:
      return { variant: "default", title: "Unknown" }
  }
}

const useAdditionalItemsColumns = () => {
  const columns = useMemo(() => {
    const cols: Column<ProductVariant>[] = [
      {
        id: "selection",
        maxWidth: 60,
        Header: ({ getToggleAllRowsSelectedProps }) => {
          return (
            <div className="pl-base pr-large">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          )
        },
        Cell: ({ row }) => {
          return (
            <div className="pl-base pr-large">
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
      },
      {
        Header: "Product details",
        accessor: "title",
        Cell: ({
          cell: { value: title },
          row: {
            original: {
              product: { title: productTitle, thumbnail },
              sku,
            },
          },
        }) => {
          return (
            <div className="inter-small-regular flex items-center gap-base py-xsmall">
              <Thumbnail src={thumbnail} />
              <div>
                <p>
                  {productTitle} <span className="text-grey-50">({title})</span>
                </p>
                {sku && (
                  <CopyToClipboard
                    value={sku}
                    displayValue={sku}
                    iconSize={14}
                  />
                )}
              </div>
            </div>
          )
        },
      },
      {
        Header: "Status",
        accessor: "product",
        Cell: ({
          cell: {
            value: { status },
          },
        }) => {
          const props = getProductStatus(status)
          return <StatusIndicator {...props} />
        },
      },
      {
        Header: () => <p className="text-right">In Stock</p>,
        accessor: "inventory_quantity",
        Cell: ({ cell: { value } }) => {
          return <p className="text-right">{value}</p>
        },
      },
    ]

    return cols
  }, [])

  return columns
}

export default useAdditionalItemsColumns
