import React from "react"

import { OrderEditRequestedEvent } from "../../../../hooks/use-build-timeline"
import MailIcon from "../../../fundamentals/icons/mail-icon"
import EventContainer from "../event-container"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { useAdminRequestOrderEditConfirmation } from "medusa-react"
import Button from "../../../fundamentals/button"

type RequestedProps = {
  event: OrderEditRequestedEvent
}

const EditRequested: React.FC<RequestedProps> = ({ event }) => {
  const isRequested = event.edit?.status === "requested"

  const notification = useNotification()

  const requestOrderEdit = useAdminRequestOrderEditConfirmation(event.edit?.id)

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
    <EventContainer
      title={"Order Edit confirmation-request sent"}
      icon={<MailIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={
        <span className="inter-small-regular text-grey-50">{event.email}</span>
      }
    >
      {isRequested && (
        <Button
          className="w-full border border-grey-20 mb-5"
          size="small"
          variant="ghost"
          onClick={onRequestOrderEditClicked}
        >
          Resend Confirmation-Request
        </Button>
      )}
    </EventContainer>
  )
}

export default EditRequested
