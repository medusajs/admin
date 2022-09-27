import { createColumnHelper } from "@tanstack/react-table"
import React, { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { AdditionalItemObject, ItemsToSendFormType } from "."
import Thumbnail from "../../../../components/atoms/thumbnail"
import Tooltip from "../../../../components/atoms/tooltip"
import Button from "../../../../components/fundamentals/button"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"

const columnHelper = createColumnHelper<AdditionalItemObject>()

type AdditionalItemsColumnProps = {
  form: NestedForm<ItemsToSendFormType>
  orderCurrency: string
  removeItem: (index: number) => void
}

const useAdditionalItemsColumns = ({
  form,
  orderCurrency,
  removeItem,
}: AdditionalItemsColumnProps) => {
  const { control, setValue, getValues, path } = form

  const updateQuantity = (index: number, change: number) => {
    const pathToQuantity = path(`items.${index}.quantity`)
    const selectedQuantity = getValues(pathToQuantity)

    setValue(pathToQuantity, selectedQuantity + change)
  }

  const columns = useMemo(() => {
    return [
      columnHelper.display({
        id: "product_display",
        header: "Product",
        cell: ({
          row: {
            original: { thumbnail, product_title, variant_title, sku },
          },
        }) => {
          return (
            <div className="flex items-center gap-base">
              <Thumbnail src={thumbnail} />
              <div>
                <p>
                  {product_title}{" "}
                  <span className="text-grey-50">({variant_title})</span>
                </p>
                {sku && <p className="text-grey-50">{sku}</p>}
              </div>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "quantity",
        header: () => <p className="text-right">Quantity</p>,
        maxSize: 50,
        cell: ({
          row: {
            index,
            original: { in_stock },
          },
        }) => {
          const currentQuantity = useWatch({
            control,
            name: path(`items.${index}.quantity`),
          })

          return (
            <div className="flex items-center justify-end">
              <div className="inter-small-regular text-grey-50 grid grid-cols-3 gap-x-2xsmall">
                <Button
                  variant="ghost"
                  size="small"
                  type="button"
                  onClick={() => updateQuantity(index, -1)}
                  disabled={currentQuantity === 1}
                  className="disabled:text-grey-30 w-large h-large rounded-base"
                >
                  <MinusIcon size={16} />
                </Button>
                <div className="flex items-center justify-center">
                  <p>{currentQuantity}</p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => updateQuantity(index, 1)}
                  disabled={currentQuantity === in_stock}
                  className="disabled:text-grey-30 w-large h-large rounded-base"
                >
                  <PlusIcon size={16} />
                </Button>
              </div>
            </div>
          )
        },
      }),
      columnHelper.accessor("price", {
        maxSize: 50,
        header: () => <p className="text-right">Price</p>,
        cell: ({
          getValue,
          row: {
            original: { original_price },
          },
        }) => {
          const price = getValue()

          return (
            <div className="text-right">
              {original_price !== price && (
                <Tooltip
                  content="The price has been overridden in a price list, that is applicable to this order."
                  side="top"
                >
                  <p className="text-grey-40 line-through cursor-default">
                    {formatAmountWithSymbol({
                      amount: original_price,
                      currency: orderCurrency,
                    })}
                  </p>
                </Tooltip>
              )}
              <p>
                {formatAmountWithSymbol({
                  amount: price,
                  currency: orderCurrency,
                })}
              </p>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "order_currency",
        maxSize: 20,
        cell: () => {
          return (
            <p className="text-grey-50 pl-base">
              {orderCurrency.toUpperCase()}
            </p>
          )
        },
      }),
      columnHelper.display({
        id: "remove",
        maxSize: 28,
        cell: ({ row: { index } }) => {
          return (
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="small"
                className="w-xlarge h-xlarge text-grey-40"
                type="button"
                onClick={() => removeItem(index)}
              >
                <TrashIcon size={20} />
              </Button>
            </div>
          )
        },
      }),
    ]
  }, [])

  return columns
}

export default useAdditionalItemsColumns
