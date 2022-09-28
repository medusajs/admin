import { createColumnHelper } from "@tanstack/react-table"
import React, { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { ItemsToReceiveFormType, ReceiveReturnObject } from "."
import Thumbnail from "../../../../components/atoms/thumbnail"
import Button from "../../../../components/fundamentals/button"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"

const columnHelper = createColumnHelper<ReceiveReturnObject>()

type Props = {
  form: NestedForm<ItemsToReceiveFormType>
  orderCurrency: string
}

const useItemsToReceiveColumns = ({ form, orderCurrency }: Props) => {
  const { control, setValue, getValues, path } = form

  const updateQuantity = (index: number, change: number) => {
    const pathToQuantity = path(`items.${index}.quantity`)
    const selectedQuantity = getValues(pathToQuantity)

    setValue(pathToQuantity, selectedQuantity + change)
  }

  const colums = useMemo(
    () => [
      columnHelper.display({
        id: "selection",
        maxSize: 36,
        header: ({ table }) => {
          return (
            <div className="pl-base pr-large">
              <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                indeterminate={table.getIsSomePageRowsSelected()}
              />
            </div>
          )
        },
        cell: ({
          row: { getIsSelected, getIsSomeSelected, getToggleSelectedHandler },
        }) => {
          return (
            <div className="pl-base pr-large">
              <IndeterminateCheckbox
                checked={getIsSelected()}
                indeterminate={getIsSomeSelected()}
                onChange={getToggleSelectedHandler()}
              />
            </div>
          )
        },
      }),
      columnHelper.accessor("variant_title", {
        header: "Product",
        cell: ({ getValue, row: { original } }) => {
          return (
            <div className="inter-small-regular flex items-center gap-base py-xsmall">
              <Thumbnail src={original.thumbnail} />
              <div>
                <p>
                  {original.product_title}{" "}
                  <span className="text-grey-50">({getValue()})</span>
                </p>
                {original.sku && <p className="text-grey-50">{original.sku}</p>}
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
            original: { original_quantity, quantity },
            getIsSelected,
          },
        }) => {
          const currentQuantity = useWatch({
            control,
            name: path(`items.${index}.quantity`),
          })

          return (
            <div className="flex items-center justify-end">
              {getIsSelected() && original_quantity !== 1 ? (
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
                    disabled={currentQuantity === original_quantity}
                    className="disabled:text-grey-30 w-large h-large rounded-base"
                  >
                    <PlusIcon size={16} />
                  </Button>
                </div>
              ) : (
                <p className="inter-small-regular text-grey-50">
                  {original_quantity}
                </p>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor("refundable", {
        maxSize: 80,
        header: () => <p className="text-right">Refundable</p>,
        cell: ({ getValue }) => {
          return (
            <p className="text-right">
              {formatAmountWithSymbol({
                amount: getValue() || 0,
                currency: orderCurrency,
              })}
            </p>
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
    ],
    []
  )

  return colums
}

export default useItemsToReceiveColumns
