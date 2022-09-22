import { Order } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { NestedForm } from "../../../../utils/nested-form"
import ReturnItemField from "./return-item"

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

export type ItemsToReturnFormType = {
  items: ReturnItem[]
}

export type ReturnItemObject = FieldArrayWithId<
  {
    __nested__: ItemsToReturnFormType
  },
  "__nested__.items",
  "fieldId"
> & { index: number }

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
    shouldUnregister: true,
  })

  const fieldArray = useMemo(() => {
    const arr: ReturnItemObject[] = []

    fields.forEach((field, index) => {
      arr.push({
        ...field,
        index,
      })
    })

    return arr
  }, [fields])

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
          {fieldArray.map((field) => {
            return (
              <ReturnItemField
                form={form}
                key={field.fieldId}
                nestedItem={field}
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
