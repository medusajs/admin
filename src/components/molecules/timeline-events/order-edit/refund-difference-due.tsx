import { useAdminOrder } from "medusa-react"
import React, { useState } from "react"

import { RefundDifferenceDueEvent } from "../../../../hooks/use-build-timeline"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import EventContainer, { EventIconColor } from "../event-container"
import CreateRefundModal from "../../../../domain/orders/details/refund"

type RequestedProps = {
  event: RefundDifferenceDueEvent
}

const RefundDifferenceDue: React.FC<RequestedProps> = ({ event }) => {
  const { order } = useAdminOrder(event.orderId)

  const [showRefundModal, setShowRefundModal] = useState(false)

  if (
    !order ||
    (order && order.paid_total - order.refunded_total - order.total <= 0)
  ) {
    return null
  }

  const refundableAmount = order.paid_total - order.refunded_total - order.total

  return (
    <>
      <EventContainer
        title={"Refund required"}
        icon={<AlertIcon size={20} />}
        iconColor={EventIconColor.RED}
        time={event.time}
        isFirst={event.first}
      >
        <Button
          onClick={() => setShowRefundModal(true)}
          variant="ghost"
          size="small"
          className="w-full border border-grey-20 mb-xsmall text-rose-50"
        >
          Refund
          {formatAmountWithSymbol({
            amount: refundableAmount,
            currency: event.currency_code,
          })}
        </Button>
      </EventContainer>
      {showRefundModal && (
        <CreateRefundModal
          order={order}
          initialAmount={refundableAmount}
          initialReason="other"
          onDismiss={() => setShowRefundModal(false)}
        />
      )}
    </>
  )
}

export default RefundDifferenceDue
