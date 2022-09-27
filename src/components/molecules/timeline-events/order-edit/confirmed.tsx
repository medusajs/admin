import { Customer, User } from "@medusajs/medusa"
import { useAdminCustomer, useAdminUser } from "medusa-react"
import React from "react"
import { ByLine } from "."
import { OrderEditEvent } from "../../../../hooks/use-build-timeline"
import FastDeliveryIcon from "../../../fundamentals/icons/fast-delivery-icon"
import EventContainer from "../event-container"

type ConfirmedProps = {
  event: OrderEditEvent
}

const EditConfirmed: React.FC<ConfirmedProps> = ({ event }) => {
  const confirmedByUser = event.edit.confirmed_by?.startsWith("usr")

  let user: User | Customer
  if (confirmedByUser) {
    const { customer } = useAdminCustomer(event.edit.declined_by as string)
    user = customer as Customer
  } else {
    const { user: adminUser } = useAdminUser(event.edit.declined_by as string)
    user = adminUser as User
  }

  return (
    <EventContainer
      title={`Order Edit ${confirmedByUser ? "" : "force"} confirmed`}
      icon={<FastDeliveryIcon size={20} />}
      time={event.time}
      isFirst={event.first}
      midNode={<ByLine user={user} />}
    ></EventContainer>
  )
}

export default EditConfirmed
