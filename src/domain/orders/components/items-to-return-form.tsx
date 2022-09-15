import { Order } from "@medusajs/medusa"
import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import IndeterminateCheckbox from "../../../components/molecules/indeterminate-checkbox"
import { Option } from "../../../types/shared"
import { NestedForm } from "../../../utils/nested-form"

type ReturnReasonDetails = {
  note?: string
  reason?: Option
}

type ReturnItem = {
  item_id: string
  quantity: number
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
        <div>
          {fields.map((field, index) => {
            return (
              <div
                className="grid grid-cols-[1fr_120px_120px_50px] gap-xsmall py-small"
                key={field.fieldId}
              >
                <div className="flex items-center gap-x-base">
                  <Controller
                    control={control}
                    name={path(`items.${index}.return`)}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <IndeterminateCheckbox
                          checked={value}
                          onChange={onChange}
                        />
                      )
                    }}
                  />
                  <div>
                    <div></div>
                    <div>
                      <p>{field.item_id}</p>
                    </div>
                  </div>
                </div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ItemsToReturnForm
