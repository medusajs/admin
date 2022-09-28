import { Order } from "@medusajs/medusa"
import React from "react"
import { NestedForm } from "../../../../utils/nested-form"

export type ReceiveReturnItem = {
  item_id: string
  thumbnail?: string | null
  product_title: string
  variant_title: string
  quantity: number
  original_quantity: number
  refundable?: number | null
  return: boolean
}

export type ItemsToReceiveFormType = {
  items: ReceiveReturnItem[]
}

type Props = {
  form: NestedForm<ItemsToReceiveFormType>
  order: Order
}

const ItemsToReceiveForm = ({ form, order }: Props) => {
  return (
    <div>
      <div></div>
    </div>
  )
}
