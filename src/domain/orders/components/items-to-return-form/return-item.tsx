import { Order } from "@medusajs/medusa"
import React from "react"
import { Controller, useWatch } from "react-hook-form"
import Thumbnail from "../../../../components/atoms/thumbnail"
import IndeterminateCheckbox from "../../../../components/molecules/indeterminate-checkbox"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"

type ReturnReasonDetails = {
  note?: string
  reason?: Option
}

export type ReturnItem = {
  item_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  quantity: number
  refundable?: number | null
  return_reason_details: ReturnReasonDetails
  return: boolean
}

type Props = {
  form: NestedForm<ReturnItem>
  order: Order
  field: ReturnItem
}

const ReturnItemField = ({ form, order, field }: Props) => {
  const { control, path } = form

  const isSelected = useWatch({
    control,
    name: path("return"),
  })

  return (
    <div className="grid grid-cols-[1fr_120px_120px_50px] gap-xsmall py-small border-t border-grey-20">
      <div className="flex items-center gap-x-large">
        <Controller
          control={control}
          name={path(`return`)}
          render={({ field: { value, onChange } }) => {
            return <IndeterminateCheckbox checked={value} onChange={onChange} />
          }}
        />
        <div className="flex items-center gap-x-base">
          <div>
            <Thumbnail src={field.thumbnail} />
          </div>
          <div className="inter-small-regular">
            <p>{field.product_title}</p>
            <p className="text-grey-50">{field.variant_title}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <p className="inter-small-regular text-grey-40">
          {field.quantity} {isSelected ? "true" : "false"}
        </p>
      </div>
      <div className="flex items-center justify-end">
        <p className="inter-small-regular">
          {formatAmountWithSymbol({
            amount: field.refundable || 0,
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
  )
}

export default ReturnItemField
