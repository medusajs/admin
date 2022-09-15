import { Order } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
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
  const { control, path, resetField } = form

  useEffect(() => {
    resetField(path("items"), {
      defaultValue: getDefaultValues(order),
    })
  }, [order])

  const { fields } = useFieldArray({
    control,
    name: path("items"),
    keyName: "fieldId",
  })

  return (
    <div>
      {fields.map((field) => {
        return <div key={field.fieldId}>{field.item_id}</div>
      })}
    </div>
  )
}

const getDefaultValues = (order: Order): ItemsToReturnFormType => {
  const items = order.items.map((item) => ({
    item_id: item.id,
    quantity: item.quantity,
    return_reason_details: {
      note: undefined,
      reason: undefined,
    },
    return: false,
  }))

  return {
    items,
  }
}

export default ItemsToReturnForm
