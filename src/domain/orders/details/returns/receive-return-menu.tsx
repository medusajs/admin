import { Order, Return } from "@medusajs/medusa"
import React from "react"

type Props = {
  open: boolean
  onClose: () => void
  order: Order
  returnRequest: Return
  handleReceive: (items: { item_id: string; quantity: number }[]) => void
}

const ReceiveReturnMenu = ({}: Props) => {
  return (
    <div>
      <div></div>
    </div>
  )
}

export default ReceiveReturnMenu
