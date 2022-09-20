import { Order } from "@medusajs/medusa"
import React from "react"
import { useFieldArray } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { nestedForm, NestedForm } from "../../../../utils/nested-form"
import ReturnItemField from "./return-item"

type ReturnReasonDetails = {
  note?: string
  reason?: Option
}

type ReturnItem = {
  item_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  quantity: number
  refundable?: number | null
  return_reason_details: ReturnReasonDetails
  return: boolean
}

export type ItemsToReturnFormType = {
  items: ReturnItem[]
}

type Props = {
  form: NestedForm<ItemsToReturnFormType>
  order: Order
}

const ItemsToReturnForm = ({ form, order }: Props) => {
  const { control, path } = form

  const { fields } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
  })

  return (
    <div className="flex flex-col gap-y-base">
      <h2 className="inter-base-semibold">Items to return</h2>
      <div>
        <div className="flex items-center inter-small-semibold text-grey-50">
          <div className="flex-1">
            <p>Product</p>
          </div>
          <div className="ml-small mr-5xlarge">
            <p className="text-right">Quantity</p>
          </div>
          <div className="mr-small">
            <p className="text-right">Refundable</p>
          </div>
          <div className="min-w-[50px]" />
        </div>
        <div className="mt-2.5">
          {fields.map((field, index) => {
            return (
              // <div
              //   className="grid grid-cols-[1fr_120px_120px_50px] gap-xsmall py-small border-t border-grey-20"
              //   key={field.fieldId}
              // >
              //   <div className="flex items-center gap-x-large">
              //     <Controller
              //       control={control}
              //       name={path(`items.${index}.return`)}
              //       render={({ field: { value, onChange } }) => {
              //         return (
              //           <IndeterminateCheckbox
              //             checked={value}
              //             onChange={onChange}
              //           />
              //         )
              //       }}
              //     />
              //     <div className="flex items-center gap-x-base">
              //       <div>
              //         <Thumbnail src={field.thumbnail} />
              //       </div>
              //       <div className="inter-small-regular">
              //         <p>{field.product_title}</p>
              //         <p className="text-grey-50">{field.variant_title}</p>
              //       </div>
              //     </div>
              //   </div>
              //   <div className="flex items-center justify-end">
              //     <p className="inter-small-regular text-grey-40">
              //       {field.quantity}
              //     </p>
              //   </div>
              //   <div className="flex items-center justify-end">
              //     <p className="inter-small-regular">
              //       {formatAmountWithSymbol({
              //         amount: field.refundable || 0,
              //         currency: order.currency_code,
              //       })}
              //     </p>
              //   </div>
              //   <div className="flex items-center justify-end">
              //     <p className="inter-small-regular text-grey-40">
              //       {order.currency_code.toUpperCase()}
              //     </p>
              //   </div>
              // </div>
              <ReturnItemField
                form={nestedForm(form, path(`items.${index}`) as `items.0`)}
                key={field.fieldId}
                field={field}
                order={order}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ItemsToReturnForm
