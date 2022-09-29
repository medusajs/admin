import React, { useContext, useEffect, useState } from "react"
import { useAdminOrder } from "medusa-react"

import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import OrderEditLine from "../details/order-line/edit"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"

function AddProductVariant() {
  const { pop } = React.useContext(LayeredModalContext)

  return (
    <>
      <Modal.Content>TODO</Modal.Content>
      <Modal.Footer>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            Back
          </Button>
          <Button variant="primary" size="small" onClick={console.log}>
            Save and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

type OrderEditModalProps = {
  orderId: string
  close: () => void
}

/**
 * Displays layered modal for order editing.
 */
function OrderEditModal(props: OrderEditModalProps) {
  const { close, orderId } = props

  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const layeredModalContext = useContext(LayeredModalContext)

  const { order } = useAdminOrder(orderId)

  useEffect(() => {
    const nextState = {}

    order?.items.map((oi) => (nextState[oi.id] = oi.quantity))

    setQuantities(nextState)
  }, [order?.items])

  const onQuantityChange = (itemId: string, quantity: number) => {
    setQuantities({ ...quantities, [itemId]: quantity })
  }

  const onClose = () => {
    close()
  }

  const addroductVariantScreen = {
    title: "Add Variant",
    onBack: layeredModalContext.pop,
    view: <AddProductVariant />,
  }

  return (
    <LayeredModal
      open
      isLargeModal
      handleClose={onClose}
      context={layeredModalContext}
    >
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Edit Order</h1>
        </Modal.Header>
        <Modal.Content>
          <Button
            size="small"
            variant="ghost"
            className="border border-grey-20"
            onClick={() => layeredModalContext.push(addroductVariantScreen)}
          >
            <PlusIcon size={20} /> Add Channels
          </Button>

          {order?.items.map((oi) => (
            <OrderEditLine
              item={oi}
              currencyCode={order.currency_code}
              onQuantityChange={onQuantityChange}
              quantity={quantities[oi.id]}
            />
          ))}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end w-full">
            <Button
              variant="ghost"
              size="small"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={onClose}
            >
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default OrderEditModal
