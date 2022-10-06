import React, { useContext, useEffect, useState } from "react"
import { useAdminOrder } from "medusa-react"

import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import OrderEditLine from "../details/order-line/edit"
import VariantsTable from "./variants-table"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import { ProductVariant } from "@medusajs/medusa"

type AddProductVariantProps = {
  isReplace?: boolean
  onSubmit: (variants: ProductVariant[]) => void
}

/**
 * Add product variant modal screen
 */
function AddProductVariant(props: AddProductVariantProps) {
  const { pop } = React.useContext(LayeredModalContext)

  const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>([])

  const onSubmit = () => {
    props.onSubmit(selectedVariants)
    pop()
  }

  const onBack = () => {
    setSelectedVariants([])
    pop()
  }

  return (
    <>
      <Modal.Content>
        <div className="min-h-[680px] flex flex-col justify-between">
          <VariantsTable
            isReplace={props.isReplace}
            setSelectedVariants={setSelectedVariants}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button variant="secondary" size="small" onClick={onBack}>
            Back
          </Button>
          <Button variant="primary" size="small" onClick={onSubmit}>
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

  const onAddVariants = (selectedVariants: ProductVariant[]) => {
    console.log(selectedVariants)
  }

  const addProductVariantScreen = {
    title: "Add Product Variants",
    onBack: layeredModalContext.pop,
    view: <AddProductVariant onSubmit={onAddVariants} />,
  }

  const replaceProductVariantScreen = {
    title: "Replace Product Variants",
    onBack: layeredModalContext.pop,
    view: <AddProductVariant onSubmit={onAddVariants} isReplace />,
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
          <div className="flex justify-between mb-6">
            <span className="text-gray-900 font-semibold">Items</span>
            <div className="flex gap-2 items-center">
              <Button
                size="small"
                variant="ghost"
                className="border border-grey-20 text-gray-900"
                onClick={() =>
                  layeredModalContext.push(addProductVariantScreen)
                }
              >
                Add items
              </Button>
              <Button variant="secondary" size="small" className="h-full">
                <SearchIcon size={18} className="text-gray-500" />
              </Button>
            </div>
          </div>

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
