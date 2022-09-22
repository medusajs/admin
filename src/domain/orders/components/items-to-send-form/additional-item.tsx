import { Order } from "@medusajs/medusa"
import React from "react"
import { AdditionalItemObject, ItemsToSendFormType } from "."
import { NestedForm } from "../../../../utils/nested-form"

type Props = {
  form: NestedForm<ItemsToSendFormType>
  order: Order
  nestedItem: AdditionalItemObject
  index: number
}

const AdditionalItem = ({ form, order, nestedItem, index }: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(nestedItem, null, 4)}</pre>
    </div>
  )
}

export default AdditionalItem
