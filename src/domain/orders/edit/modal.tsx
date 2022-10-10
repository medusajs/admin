import React, { useContext, useEffect, useState } from "react"
import { Order, OrderEdit, ProductVariant } from "@medusajs/medusa"
import {
  useAdminCreateOrderEdit,
  useAdminOrderEdit,
  useAdminOrderEditAddLineItem,
} from "medusa-react"
import clsx from "clsx"

import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import Modal from "../../../components/molecules/modal"
import Button from "../../../components/fundamentals/button"
import OrderEditLine from "../details/order-line/edit"
import VariantsTable from "./variants-table"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import { formatAmountWithSymbol } from "../../../utils/prices"
import InputField from "../../../components/molecules/input"
import useNotification from "../../../hooks/use-notification"

type TotalsSectionProps = {
  currentSubtotal: number
  currencyCode: string
  newSubtotal: number
}

/**
 * Totals section displaying order and order edit subtotals.
 */
function TotalsSection(props: TotalsSectionProps) {
  const { currencyCode, newSubtotal, currentSubtotal } = props

  const differenceDue = currentSubtotal - newSubtotal

  return (
    <>
      <div className="h-px w-full bg-grey-20 mb-6" />
      <div className="flex justify-between h-[40px] mb-2">
        <span className="text-gray-500">Current Subtotal</span>
        <span className="text-gray-900">
          {formatAmountWithSymbol({
            amount: currentSubtotal,
            currency: currencyCode,
          })}
          <span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
        </span>
      </div>

      <div className="flex justify-between h-[40px] mb-2">
        <span className="text-gray-900 font-semibold">New Subtotal</span>
        <span className="text-2xl font-semibold">
          {formatAmountWithSymbol({
            amount: newSubtotal,
            currency: currencyCode,
          })}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Difference Due</span>
        <span
          className={clsx("text-gray-900", {
            "text-rose-500": differenceDue < 0,
            "text-emerald-500": differenceDue >= 0,
          })}
        >
          {formatAmountWithSymbol({
            amount: differenceDue,
            currency: currencyCode,
          })}
          <span className="text-gray-400"> {currencyCode.toUpperCase()}</span>
        </span>
      </div>

      <div className="h-px w-full bg-grey-20 mt-8 mb-6" />
    </>
  )
}

type AddProductVariantProps = {
  isReplace?: boolean
  onSubmit: (variants: ProductVariant[]) => void
}

/**
 * Add product variant modal screen
 */
export function AddProductVariant(props: AddProductVariantProps) {
  const { pop } = React.useContext(LayeredModalContext)

  const [selectedVariants, setSelectedVariants] = useState<ProductVariant[]>([])

  const onSubmit = async () => {
    // wait until onSubmit is done to reduce list jumping
    await props.onSubmit(selectedVariants)
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
  close: () => void
  orderEdit: OrderEdit
  currencyCode: string
  currentSubtotal: number
}

/**
 * Displays layered modal for order editing.
 */
function OrderEditModal(props: OrderEditModalProps) {
  const { close, currentSubtotal, orderEdit, currencyCode } = props

  const notification = useNotification()
  const [note, setNote] = useState<string | undefined>()

  const showTotals = currentSubtotal !== orderEdit.subtotal

  const { mutateAsync: addLineItem } = useAdminOrderEditAddLineItem(
    orderEdit.id
  )

  const layeredModalContext = useContext(LayeredModalContext)

  const onClose = () => {
    close()
  }

  const onAddVariants = async (selectedVariants: ProductVariant[]) => {
    try {
      const promises = selectedVariants.map((v) =>
        addLineItem({ variant_id: v.id, quantity: 1 })
      )

      await Promise.all(promises)

      notification("Success", "Added successfully", "success")
    } catch (e) {
      notification("Error", "Error occurred", "error")
    }
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

          {/* ITEMS */}
          {orderEdit.items
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .map((oi) => (
              <OrderEditLine
                key={oi.id}
                item={oi}
                currencyCode={currencyCode}
                change={orderEdit.changes.find(
                  (change) =>
                    change.line_item_id === oi.id ||
                    change.original_line_item_id
                )}
              />
            ))}

          <div className="mt-8" />

          {/* TOTALS */}
          {showTotals && (
            <TotalsSection
              currencyCode={currencyCode}
              currentSubtotal={currentSubtotal}
              newSubtotal={orderEdit.subtotal}
            />
          )}

          {/* NOTE */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Note</span>
            <InputField
              className="max-w-[455px]"
              placeholder="Add a note..."
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </div>
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

type OrderEditModalContainerProps = {
  order: Order
  close: () => void
}

function OrderEditModalContainer(props: OrderEditModalContainerProps) {
  const [activeOrderEditId, setActiveOrderEditId] = useState<
    string | undefined
  >()
  const { mutate: createOrderEdit } = useAdminCreateOrderEdit()

  const { order_edit: orderEdit } = useAdminOrderEdit(
    activeOrderEditId as string,
    {
      enabled: typeof activeOrderEditId === "string",
    }
  )

  useEffect(() => {
    if (!props.order) {
      return
    }

    const edit = props.order.edits?.find((oe) => oe.status === "created")
    if (!edit) {
      createOrderEdit(
        { order_id: props.order.id },
        { onSuccess: ({ order_edit }) => setActiveOrderEditId(order_edit.id) }
      )
    } else {
      setActiveOrderEditId(edit.id)
    }
  }, [props.order?.edits])

  if (!orderEdit) {
    return null
  }

  return (
    <OrderEditModal
      close={props.close}
      orderEdit={orderEdit}
      currentSubtotal={props.order.subtotal}
      currencyCode={props.order.currency_code}
    />
  )
}

export default OrderEditModalContainer
