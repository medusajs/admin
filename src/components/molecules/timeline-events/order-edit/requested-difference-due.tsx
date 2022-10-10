import { useAdminOrderEdit } from "medusa-react"
import React from "react"
import { OrderEditDifferenceDueEvent } from "../../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import EventContainer, { EventIconColor } from "../event-container"

type RequestedProps = {
  event: OrderEditDifferenceDueEvent
}

const EditRequestedDifferenceDue: React.FC<RequestedProps> = ({ event }) => {
  const { order_edit: orderEdit } = useAdminOrderEdit(event.edit.id)

  if (!orderEdit || orderEdit.difference_due < 0) {
    return null
  }

  const onCopyPaymentLinkClicked = () => {
    console.log("TODO")
  }

  const onMarkAsPaidClicked = () => {
    console.log("TODO")
  }

  const isRequested = orderEdit.status === "requested"
  return (
    <EventContainer
      title={"Customer payment required"}
      icon={<AlertIcon size={20} />}
      iconColor={isRequested ? EventIconColor.VIOLET : EventIconColor.DEFAULT}
      time={event.time}
      isFirst={event.first}
      midNode={
        <span className="inter-small-regular text-grey-50">
          {formatAmountWithSymbol({
            amount: orderEdit.difference_due,
            currency: event.currency_code,
          })}
        </span>
      }
    >
      {isRequested && (
        <>
          <Button
            size="small"
            className="w-full border border-grey-20 mb-xsmall"
            variant="ghost"
            onClick={onCopyPaymentLinkClicked}
          >
            Copy Payment Link
          </Button>
          <Button
            size="small"
            className="w-full border border-grey-20"
            variant="ghost"
            onClick={onMarkAsPaidClicked}
          >
            Mark as Paid
          </Button>
        </>
      )}
    </EventContainer>
  )
}

export default EditRequestedDifferenceDue
