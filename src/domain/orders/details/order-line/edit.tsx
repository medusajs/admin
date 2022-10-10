import React from "react"
import { LineItem, OrderItemChange, ProductVariant } from "@medusajs/medusa"
import {
  useAdminDeleteOrderEditItemChange,
  useAdminOrderEditAddLineItem,
  useAdminOrderEditDeleteLineItem,
  useAdminOrderEditUpdateLineItem,
} from "medusa-react"

import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import Actionables from "../../../../components/molecules/actionables"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import DuplicateIcon from "../../../../components/fundamentals/icons/duplicate-icon"
import RefreshIcon from "../../../../components/fundamentals/icons/refresh-icon"
import useNotification from "../../../../hooks/use-notification"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { AddProductVariant } from "../../edit/modal"

type OrderEditLineProps = {
  item: LineItem
  currencyCode: string
  change?: OrderItemChange
}

const OrderEditLine = ({ item, currencyCode, change }: OrderEditLineProps) => {
  const notification = useNotification()
  const { pop, push } = React.useContext(LayeredModalContext)

  const isNew = change?.type === "item_add"
  const isLocked = item.fulfilled_quantity === item.quantity

  const { mutateAsync: addLineItem } = useAdminOrderEditAddLineItem(
    item.order_edit_id!
  )

  const { mutateAsync: removeItem } = useAdminOrderEditDeleteLineItem(
    item.order_edit_id!,
    item.id
  )

  const { mutateAsync: updateItem } = useAdminOrderEditUpdateLineItem(
    item.order_edit_id!,
    item.id
  )

  const { mutateAsync: undoChange } = useAdminDeleteOrderEditItemChange(
    item.order_edit_id!,
    change?.id as string
  )

  const onQuantityUpdate = async (newQuantity: number) => {
    await updateItem({ quantity: newQuantity })
  }

  const onDuplicate = async () => {
    try {
      await addLineItem({
        variant_id: item.variant_id,
        quantity: item.quantity,
      })
    } catch (e) {
      notification("Error", "Failed to duplicate item", "error")
    }
  }

  const onRemove = async () => {
    try {
      if (change) {
        if (change.type === "item_add") {
          await undoChange()
        }
        if (change.type === "item_update") {
          await undoChange()
          await removeItem()
        }
      } else {
        await removeItem()
      }
      notification("Success", "Item removed", "success")
    } catch (e) {
      notification("Error", "Failed to remove item", "error")
    }
  }

  const onReplace = async (selected: ProductVariant[]) => {
    const newVariantId = selected[0].id
    try {
      await onRemove()
      await addLineItem({ variant_id: newVariantId, quantity: item.quantity })
      notification("Success", "Item added", "success")
    } catch (e) {
      notification("Error", "Failed to replace the item", "error")
    }
  }

  const replaceProductVariantScreen = {
    title: "Replace Product Variants",
    onBack: pop,
    view: <AddProductVariant onSubmit={onReplace} isReplace />,
  }

  return (
    <div className="flex justify-between mb-1 h-[64px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded">
      <div className="flex space-x-4 justify-center flex-grow-1">
        <div className="flex h-[48px] w-[36px] rounded-rounded overflow-hidden">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex flex-col justify-center max-w-[185px]">
          <div>
            <span className="inter-small-regular text-grey-90 truncate">
              {item.title}
            </span>
          </div>
          {item?.variant && (
            <div className="flex items-center">
              {isNew && (
                <div className="text-small text-blue-500 bg-blue-10 h-[24px] w-[42px] mr-2 flex items-center justify-center rounded-rounded">
                  New
                </div>
              )}
              <span className="inter-small-regular text-grey-50 truncate">
                {`${item.variant.title}${
                  item.variant.sku ? ` (${item.variant.sku})` : ""
                }`}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between min-w-[312px]">
        <div className="flex items-center flex-grow-0 text-gray-400">
          <MinusIcon
            className="cursor-pointer"
            onClick={() =>
              item.quantity > 1 &&
              // TODO: check if this is OK
              item.quantity > (item.fulfilled_quantity || 0) &&
              onQuantityUpdate(item.quantity - 1)
            }
          />
          <span className="px-8 text-center text-gray-900 min-w-[74px]">
            {item.quantity}
          </span>
          <PlusIcon
            className="cursor-pointer text-gray-400"
            onClick={() => onQuantityUpdate(item.quantity + 1)}
          />
        </div>

        <div className="flex small:space-x-2 medium:space-x-4 large:space-x-6 ">
          <div className="inter-small-regular text-gray-900">
            {formatAmountWithSymbol({
              amount: item.unit_price * item.quantity,
              currency: currencyCode,
              tax: item.tax_lines,
              digits: 2,
            })}
          </div>
        </div>
        <div className="inter-small-regular text-gray-400">
          {currencyCode.toUpperCase()}
        </div>
        <Actionables
          forceDropdown
          actions={[
            {
              label: "Replace with other item",
              onClick: () => push(replaceProductVariantScreen),
              icon: <RefreshIcon size="20" />,
            },
            {
              label: "Duplicate item",
              onClick: onDuplicate,
              icon: <DuplicateIcon size="20" />,
            },
            {
              label: "Remove item",
              onClick: onRemove,
              variant: "danger",
              icon: <TrashIcon size="20" />,
            },
          ]}
        />
      </div>
    </div>
  )
}

export default OrderEditLine
