import { LineItem, OrderEdit, OrderItemChange } from "@medusajs/medusa"
import {
  useAdminCancelOrderEdit,
  useAdminConfirmOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminOrderEdit,
  useAdminRequestOrderEditConfirmation,
  useAdminUser,
} from "medusa-react"
import React from "react"
import { ByLine } from "."
import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import TwoStepDelete from "../../../atoms/two-step-delete"
import Button from "../../../fundamentals/button"
import EditIcon from "../../../fundamentals/icons/edit-icon"
import ImagePlaceholder from "../../../fundamentals/image-placeholder"
import EventContainer from "../event-container"

type EditCreatedProps = {
  event: OrderEditEvent
}

enum OrderEditItemChangeType {
  ITEM_ADD = "item_add",
  ITEM_REMOVE = "item_remove",
  ITEM_UPDATE = "item_update",
}

const getInfo = (edit: OrderEdit): { type: string; user_id: string } => {
  if (edit.requested_at && edit.requested_by) {
    return {
      type: "requested",
      user_id: edit.requested_by,
    }
  }
  return {
    type: "created",
    user_id: edit.created_by,
  }
}

const EditCreated: React.FC<EditCreatedProps> = ({ event }) => {
  const { type, user_id } = getInfo(event.edit)

  const { order_edit: orderEdit } = useAdminOrderEdit(event.edit.id)

  const notification = useNotification()

  const name = `Order Edit ${type}`

  const { user } = useAdminUser(user_id)

  const forceConfirmDialog = useImperativeDialog()

  const deleteOrderEdit = useAdminDeleteOrderEdit(event.edit.id)
  const cancelOrderEdit = useAdminCancelOrderEdit(event.edit.id)
  const requestOrderEdit = useAdminRequestOrderEditConfirmation(event.edit.id)
  const confirmOrderEdit = useAdminConfirmOrderEdit(event.edit.id)

  const onDeleteOrderEditClicked = () => {
    deleteOrderEdit.mutate(undefined, {
      onSuccess: () => {
        notification("Success", `Successfully deleted Order Edit`, "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  const onCancelOrderEditClicked = () => {
    cancelOrderEdit.mutate(undefined, {
      onSuccess: () => {
        notification("Success", `Successfully canceled Order Edit`, "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  const onConfirmEditClicked = async () => {
    const shouldDelete = await forceConfirmDialog({
      heading: "Delete Confirm",
      text:
        "By force confirming you allow the order edit to be fulfilled. You will still have to reconcile payments manually after confirming.",
      confirmText: "Yes, Force Confirm",
      cancelText: "No, Cancel",
    })

    if (shouldDelete) {
      confirmOrderEdit.mutate(undefined, {
        onSuccess: () => {
          notification(
            "Success",
            `Successfully confirmed Order Edit`,
            "success"
          )
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onCopyConfirmationLinkClicked = () => {
    console.log("TODO")
  }

  const onRequestOrderEditClicked = () => {
    requestOrderEdit.mutate(undefined, {
      onSuccess: () => {
        notification("Success", `Successfully requested Order Edit`, "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  return (
    <>
      <EventContainer
        title={name}
        icon={<EditIcon size={20} />}
        time={event.time}
        isFirst={event.first}
        midNode={<ByLine user={user} />}
      >
        {event.edit.internal_note && (
          <div className="px-base py-small mt-base mb-large rounded-large bg-grey-10 inter-base-regular text-grey-90">
            {event.edit.internal_note}
          </div>
        )}
        <div>
          <OrderEditChanges orderEdit={orderEdit} />
        </div>
        {(event.edit.status === "created" ||
          event.edit.status === "requested") && (
          <div className="space-y-xsmall mt-large">
            {type === "created" && (
              <Button
                className="w-full border border-grey-20"
                size="small"
                variant="ghost"
                onClick={onRequestOrderEditClicked}
              >
                Send Confirmation-Request
              </Button>
            )}
            <Button
              className="w-full border border-grey-20"
              size="small"
              variant="ghost"
              onClick={onCopyConfirmationLinkClicked}
            >
              Copy Confirmation-Request Link
            </Button>
            <Button
              className="w-full border border-grey-20"
              size="small"
              variant="ghost"
              onClick={onConfirmEditClicked}
            >
              Force Confirm
            </Button>

            {type === "created" ? (
              <TwoStepDelete
                onDelete={onDeleteOrderEditClicked}
                className="w-full border border-grey-20"
              >
                Delete Order Edit
              </TwoStepDelete>
            ) : (
              <TwoStepDelete
                onDelete={onCancelOrderEditClicked}
                className="w-full border border-grey-20"
              >
                Cancel Order Edit
              </TwoStepDelete>
            )}
          </div>
        )}
      </EventContainer>
    </>
  )
}

const OrderEditChanges = ({ orderEdit }) => {
  if (!orderEdit) {
    return <></>
  }
  const added = orderEdit.changes.filter(
    (oec: OrderItemChange) =>
      oec.type === OrderEditItemChangeType.ITEM_ADD ||
      (oec.type === OrderEditItemChangeType.ITEM_UPDATE &&
        oec.line_item &&
        oec.original_line_item &&
        oec.original_line_item.quantity < oec.line_item.quantity)
  )

  const removed = orderEdit.changes.filter(
    (oec) =>
      oec.type === OrderEditItemChangeType.ITEM_REMOVE ||
      (oec.type === OrderEditItemChangeType.ITEM_UPDATE &&
        oec.line_item &&
        oec.original_line_item &&
        oec.original_line_item.quantity > oec.line_item.quantity)
  )

  return (
    <div className="flex flex-col gap-y-base">
      {added.length > 0 && (
        <div>
          <span className="inter-small-regular text-grey-50">Added</span>
          {added.map((change) => (
            <OrderEditChangeItem change={change} key={change.id} />
          ))}
        </div>
      )}
      {removed.length > 0 && (
        <div>
          <span className="inter-small-regular text-grey-50">Removed</span>
          {removed.map((change) => (
            <OrderEditChangeItem change={change} key={change.id} />
          ))}
        </div>
      )}
    </div>
  )
}

type OrderEditChangeItem = {
  change: OrderItemChange
}

const OrderEditChangeItem: React.FC<OrderEditChangeItem> = ({ change }) => {
  let quantity
  if (change.type === OrderEditItemChangeType.ITEM_ADD) {
    quantity = (change.line_item as LineItem).quantity
  } else {
    quantity =
      (change.original_line_item as LineItem)?.quantity -
      (change.line_item as LineItem)?.quantity
  }

  quantity = Math.abs(quantity)

  return (
    <div className="flex gap-x-base mt-xsmall">
      <div>
        <div className="flex h-[40px] w-[30px] rounded-rounded overflow-hidden">
          {change.line_item?.thumbnail ? (
            <img src={change.line_item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="inter-small-semibold text-grey-90">
          {quantity > 1 && <>{quantity}x</>} {change.line_item?.title}
          {change.line_item?.variant?.sku && (
            <span className="inter-small-regular text-grey-50">
              ({change.line_item.variant?.sku})
            </span>
          )}
        </span>
        <span className="flex inter-small-regular text-grey-50">
          {change.line_item?.variant?.options?.map((option) => option.value)}
        </span>
      </div>
    </div>
  )
}

export default EditCreated
