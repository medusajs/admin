import { Order, Return } from "@medusajs/medusa"
import React from "react"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"

type ReceiveReturnFormType = {
  receive_items: ItemsToReceiveFormType
}

type Props = {
  open: boolean
  onClose: () => void
  order: Order
  returnRequest: Return
  handleReceive: (
    items: { item_id: string; quantity: number }[],
    refund?: number
  ) => void
  type: "return" | "swap_return"
}

const ReceiveReturnMenu = ({ open, onClose, order, returnRequest }: Props) => {
  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Receive Return</h1>
        </Modal.Header>
        <Modal.Content></Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-end gap-x-xsmall">
            <Button variant="secondary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Submit and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReceiveReturnMenu
