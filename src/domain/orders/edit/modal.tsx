import React, { useContext, useEffect, useState } from "react"
import { Order, OrderEdit, ProductVariant } from "@medusajs/medusa"
import {
  useAdminCreateOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminOrder,
  useAdminOrderEdit,
  useAdminOrderEditAddLineItem,
  useAdminRequestOrderEditConfirmation,
  useAdminUpdateOrderEdit,
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
import useToggleState from "../../../hooks/use-toggle-state"

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

  const differenceDue = newSubtotal - currentSubtotal

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
  regionId: string
  currencyCode: string
  customerId: string
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
            regionId={props.regionId}
            customerId={props.customerId}
            currencyCode={props.currencyCode}
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
  regionId: string
  customerId: string
  currentSubtotal: number
}

/**
 * Displays layered modal for order editing.
 */
function OrderEditModal(props: OrderEditModalProps) {
  const {
    close,
    currentSubtotal,
    orderEdit,
    currencyCode,
    regionId,
    customerId,
  } = props

  const notification = useNotification()
  const [note, setNote] = useState<string | undefined>()
  const [showFilter, setShowFilter] = useState(false)
  const [filterTerm, setFilterTerm] = useState<string>("")

  const showTotals = currentSubtotal !== orderEdit.subtotal

  const {
    mutateAsync: requestConfirmation,
  } = useAdminRequestOrderEditConfirmation(orderEdit.id)

  const { mutateAsync: updateOrderEdit } = useAdminUpdateOrderEdit(orderEdit.id)

  const { mutateAsync: deleteOrderEdit } = useAdminDeleteOrderEdit(orderEdit.id)

  const { mutateAsync: addLineItem } = useAdminOrderEditAddLineItem(
    orderEdit.id
  )

  const layeredModalContext = useContext(LayeredModalContext)

  const onSave = async () => {
    try {
      if (note) {
        await updateOrderEdit({ internal_note: note })
      }
      await requestConfirmation()
      notification("Success", "Order edit set as requested", "success")
    } catch (e) {
      notification("Error", "Failed to request confirmation", "success")
    }
    close()
  }

  const onCancel = async () => {
    close()
    await deleteOrderEdit()
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

  const toggleFilter = () => {
    if (showFilter) {
      setFilterTerm("")
    }
    setShowFilter((s) => !s)
  }

  let displayItems = orderEdit.items.sort(
    // @ts-ignore
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  )

  if (filterTerm) {
    displayItems = displayItems.filter(
      (i) =>
        i.title.toLowerCase().includes(filterTerm) ||
        i.variant?.sku.toLowerCase().includes(filterTerm)
    )
  }

  const addProductVariantScreen = {
    title: "Add Product Variants",
    onBack: layeredModalContext.pop,
    view: (
      <AddProductVariant
        onSubmit={onAddVariants}
        customerId={customerId}
        regionId={regionId}
        currencyCode={currencyCode}
      />
    ),
  }

  return (
    <LayeredModal
      open
      isLargeModal
      handleClose={onCancel}
      context={layeredModalContext}
    >
      <Modal.Body>
        <Modal.Header handleClose={onCancel}>
          <h1 className="inter-xlarge-semibold">Edit Order</h1>
        </Modal.Header>
        <Modal.Content>
          <div className="flex justify-between mb-6">
            <span className="text-gray-900 font-semibold">Items</span>
            <div className="flex gap-2 items-center justify-between">
              <Button
                size="small"
                variant="ghost"
                className="border border-grey-20 text-gray-900 flex-shrink-0"
                onClick={() =>
                  layeredModalContext.push(addProductVariantScreen)
                }
              >
                Add items
              </Button>
              {showFilter && (
                <InputField
                  value={filterTerm}
                  placeholder="Filter items..."
                  onChange={(e) => setFilterTerm(e.target.value)}
                />
              )}
              <Button
                size="small"
                variant="secondary"
                className={clsx("h-full flex-shrink-0", {
                  "bg-gray-100": showFilter,
                })}
                onClick={toggleFilter}
              >
                <SearchIcon size={18} className="text-gray-500" />
              </Button>
            </div>
          </div>

          {/* ITEMS */}
          {displayItems.map((oi) => (
            <OrderEditLine
              key={oi.id}
              item={oi}
              customerId={customerId}
              regionId={regionId}
              currencyCode={currencyCode}
              change={orderEdit.changes.find(
                (change) =>
                  change.line_item_id === oi.id ||
                  change.original_line_item_id === oi.id
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
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={onSave}
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
  orderId: string
  close: () => void
}

function OrderEditModalContainer(props: OrderEditModalContainerProps) {
  const notification = useNotification()

  // TODO: replace with the list endpoint
  const { order } = useAdminOrder(props.orderId, { expand: "edits" })

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

  // find an existing edit or create one if active order edit doesn't exist on the order
  useEffect(() => {
    if (!order || activeOrderEditId) {
      return
    }

    const edit = order.edits.find((oe) => oe.status === "created")

    if (!edit) {
      createOrderEdit(
        { order_id: order.id },
        {
          onSuccess: ({ order_edit }) => setActiveOrderEditId(order_edit.id),
          onError: () =>
            notification(
              "Error",
              "There is already active order edit on this order",
              "error"
            ),
        }
      )
    } else {
      setActiveOrderEditId(edit.id)
    }
  }, [order, activeOrderEditId])

  if (!orderEdit || !order) {
    return null
  }

  return (
    <OrderEditModal
      close={close}
      orderEdit={orderEdit}
      currentSubtotal={order.subtotal}
      regionId={order.region_id}
      customerId={order.customer_id}
      currencyCode={order.currency_code}
    />
  )
}

export default OrderEditModalContainer
