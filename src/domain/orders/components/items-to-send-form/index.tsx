import { Order } from "@medusajs/medusa"
import React from "react"
import { FieldArrayWithId, useFieldArray } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import { NestedForm } from "../../../../utils/nested-form"
import useAddAdditionalItemsScreen from "../add-additional-items-screen"
import AdditionalItem from "./additional-item"

export type AdditionalItem = {
  variant_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  quantity: number
  in_stock: number
}

export type ItemsToSendFormType = {
  items: AdditionalItem[]
}

export type AdditionalItemObject = FieldArrayWithId<
  {
    __nested__: ItemsToSendFormType
  },
  "__nested__.items",
  "fieldId"
>

type Props = {
  form: NestedForm<ItemsToSendFormType>
  order: Order
}

const ItemsToSendForm = ({ form, order }: Props) => {
  const { control, path } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
  })

  const { pushScreen } = useAddAdditionalItemsScreen()

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
              <AdditionalItem
                form={form}
                key={field.fieldId}
                nestedItem={field}
                order={order}
                index={index}
              />
            )
          })}
        </div>
      </div>
      <div className="flex w-full justify-end items-center">
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() =>
            pushScreen({
              append: append,
              selectedIds: fields.map((f) => f.variant_id),
            })
          }
        >
          Add product
        </Button>
      </div>
    </div>
  )
}

export default ItemsToSendForm
