import { Order } from "@medusajs/medusa"
import React from "react"
import { Controller, useWatch } from "react-hook-form"
import Thumbnail from "../../../../components/atoms/thumbnail"
import Button from "../../../../components/fundamentals/button"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { useAddReasonScreen } from "./add-return-reason-screen"
import {
  ItemsToReturnFormType,
  ReturnItemObject,
  ReturnReasonDetails,
} from "./items-to-return-form"

type Props = {
  form: NestedForm<ItemsToReturnFormType>
  order: Order
  nestedItem: ReturnItemObject
  isClaim?: boolean
  index: number
}

export const ReturnItemField = ({
  form,
  order,
  nestedItem,
  isClaim = false,
  index,
}: Props) => {
  const { control, path, setValue } = form
  const { quantity, thumbnail, product_title, variant_title, refundable } =
    nestedItem

  const isSelected = useWatch({
    control,
    name: path(`items.${index}.return`),
  })

  const selectedQuantity = useWatch({
    control,
    name: path(`items.${index}.quantity`),
  })

  const reasonDetails = useWatch({
    control,
    name: path(`items.${index}.return_reason_details`),
  })

  const addReasonDetails = (index: number, details: ReturnReasonDetails) => {
    setValue(path(`items.${index}.return_reason_details`), details)
  }

  const [disableDecrease, disableIncrease] = React.useMemo(() => {
    const isMinVal = selectedQuantity < 1
    const isMaxVal = selectedQuantity === quantity

    return [isMinVal, isMaxVal]
  }, [selectedQuantity, quantity])

  const updateQuantity = (change: number) => {
    const update = selectedQuantity + change

    if (update === 0) {
      setValue(path(`items.${index}.return`), false)
      setValue(path(`items.${index}.quantity`), quantity)
      return
    }

    setValue(path(`items.${index}.quantity`), update)
  }

  const { pushScreen } = useAddReasonScreen()

  return (
    <div>
      <div className="grid grid-cols-[1fr_120px_120px_50px] gap-xsmall py-small border-t border-grey-20">
        <div className="flex items-center gap-x-large pl-base">
          <Controller
            control={control}
            name={path(`items.${index}.return`)}
            render={({ field: { value, onChange } }) => {
              return (
                <IndeterminateCheckbox checked={value} onChange={onChange} />
              )
            }}
          />
          <div className="flex items-center gap-x-base">
            <div>
              <Thumbnail src={thumbnail} />
            </div>
            <div className="inter-small-regular">
              <p>{product_title}</p>
              <p className="text-grey-50">{variant_title}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          {isSelected ? (
            <div className="inter-small-regular text-grey-50 grid grid-cols-3 gap-x-2xsmall">
              <Button
                variant="ghost"
                size="small"
                type="button"
                onClick={() => updateQuantity(-1)}
                disabled={disableDecrease}
                className="disabled:text-grey-30 w-large h-large rounded-base"
              >
                <MinusIcon size={16} />
              </Button>
              <div className="flex items-center justify-center">
                <p>{selectedQuantity}</p>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={() => updateQuantity(1)}
                disabled={disableIncrease}
                className="disabled:text-grey-30 w-large h-large rounded-base"
              >
                <PlusIcon size={16} />
              </Button>
            </div>
          ) : (
            <p className="inter-small-regular text-grey-40">{quantity}</p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <p className="inter-small-regular">
            {formatAmountWithSymbol({
              amount: refundable || 0,
              currency: order.currency_code,
            })}
          </p>
        </div>
        <div className="flex items-center justify-end">
          <p className="inter-small-regular text-grey-40">
            {order.currency_code.toUpperCase()}
          </p>
        </div>
      </div>
      {isSelected && (
        <div className="w-full grid grid-cols-[4rem,1fr,1fr] pb-small">
          <span />
          <p className="inter-small-semibold">{reasonDetails.reason?.label}</p>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              size="small"
              type="button"
              className="max-w-[120px]"
              onClick={() =>
                pushScreen({ reasonDetails, index, isClaim, addReasonDetails })
              }
            >
              Select reason
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
