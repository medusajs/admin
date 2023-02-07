import { createColumnHelper } from "@tanstack/react-table"
import { useCallback, useMemo } from "react"
import Thumbnail from "../../../../components/atoms/thumbnail"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import TableQuantitySelector from "../table-quantity-selector"
import {
  ItemsToReceiveFormType,
  ReceiveReturnObject,
} from "./items-to-receive-form"

const columnHelper = createColumnHelper<ReceiveReturnObject>()

type Props = {
  form: NestedForm<ItemsToReceiveFormType>
  orderCurrency: string
}

export const useItemsToReceiveColumns = ({ form, orderCurrency }: Props) => {
  const { control, setValue, getValues, path } = form

  const updateQuantity = useCallback(
    (index: number, change: number) => {
      const pathToQuantity = path(`items.${index}.quantity`)
      const selectedQuantity = getValues(pathToQuantity)

      setValue(pathToQuantity, selectedQuantity + change)
    },
    [getValues, path, setValue]
  )

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
            original: { original_quantity },
            getIsSelected,
          },
        }) => {
          return (
            <TableQuantitySelector
              {...{
                index,
                maxQuantity: original_quantity,
                isSelected: getIsSelected(),
                control,
                path,
                updateQuantity,
                name: path(`items.${index}.quantity`),
              }}
              key={index}
            />
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
    [control, orderCurrency, path, updateQuantity]
  )

  return colums
}
