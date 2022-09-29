import { OrderEdit } from "@medusajs/medusa"
import {
  useAdminCancelOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminRequestOrderEditConfirmation,
  useAdminUser,
} from "medusa-react"
import React from "react"
import { ByLine } from "."
import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import TwoStepDelete from "../../../atoms/two-step-delete"
import Button from "../../../fundamentals/button"
import EditIcon from "../../../fundamentals/icons/edit-icon"
import EventContainer from "../event-container"

type EditCreatedProps = {
  event: OrderEditEvent
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

  const notification = useNotification()

  const name = `Order Edit ${type}`

  const { user } = useAdminUser(user_id)

  const deleteOrderEdit = useAdminDeleteOrderEdit(event.edit.id)
  const cancelOrderEdit = useAdminCancelOrderEdit(event.edit.id)
  const requestOrderEdit = useAdminRequestOrderEditConfirmation(event.edit.id)

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

  const onConfirmEditClicked = () => {
    console.log("TODO")
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
          <div className="px-base py-small mt-base rounded-large bg-grey-10 inter-base-regular text-grey-90">
            {event.edit.internal_note}
          </div>
        )}
        {(event.edit.status === "created" ||
          event.edit.status === "requested") && (
          <div className="space-y-xsmall mt-base">
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

export default EditCreated
