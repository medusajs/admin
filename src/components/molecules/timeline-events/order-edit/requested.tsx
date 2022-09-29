import React from "react"
import { OrderEditRequestedEvent } from "../../../../hooks/use-build-timeline"
import MailIcon from "../../../fundamentals/icons/mail-icon"
import EventContainer from "../event-container"

type RequestedProps = {
  event: OrderEditRequestedEvent
}

const EditRequested: React.FC<RequestedProps> = ({ event }) => {
  return (
    <EventContainer
      title={"Order Edit confirmation-request sent"}
      icon={<MailIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={
        <span className="inter-small-regular text-grey-50">{event.email}</span>
      }
    />
  )
}

export default EditRequested
