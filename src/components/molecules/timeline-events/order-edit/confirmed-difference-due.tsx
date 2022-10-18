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

const EditConfirmedDifferenceDue: React.FC<RequestedProps> = ({ event }) => {
  const { order_edit: orderEdit } = useAdminOrderEdit(event.edit.id)

  if (!orderEdit || orderEdit.difference_due >= 0) {
    return null
  }

  return (
    <EventContainer
      title={"Refund reqired"}
      icon={<AlertIcon size={20} />}
      iconColor={EventIconColor.RED}
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
      <Button
        variant="ghost"
        size="small"
        className="w-full border border-grey-20 mb-xsmall text-rose-50"
      >
        Refund
        {formatAmountWithSymbol({
          amount: Math.abs(orderEdit.difference_due),
          currency: event.currency_code,
        })}
      </Button>
    </EventContainer>
  )
}

export default EditConfirmedDifferenceDue
