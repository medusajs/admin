import { Fragment } from "react"
import CreateFulfillmentModal from "../../../../domain/orders/details/create-fulfillment"
import ReceiveReturn from "../../../../domain/orders/details/receive-return"
import { ClaimEvent } from "../../../../hooks/use-build-timeline"
import useToggleState from "../../../../hooks/use-toggle-state"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import CancelIcon from "../../../fundamentals/icons/cancel-icon"
import {
  FulfillmentStatus,
  RefundStatus,
  ReturnStatus,
} from "../../order-status"
import EventContainer, {
  EventContainerProps,
  EventIconColor,
} from "../event-container"
import EventItemContainer from "../event-item-container"

type Props = {
  event: ClaimEvent
}

const Claim = ({ event }: Props) => {
  const {
    state: stateReceiveMenu,
    open: openReceiveMenu,
    close: closeReceiveMenu,
  } = useToggleState()

  const {
    state: stateFulfillMenu,
    open: openFulfillMenu,
    close: closeFulfillMenu,
  } = useToggleState()

  const shouldHaveButtonActions =
    !event.canceledAt &&
    (event.claim.return_order || event.claim.additional_items?.length > 0)

  const args: EventContainerProps = {
    icon: event.canceledAt ? <CancelIcon size={20} /> : <AlertIcon size={20} />,
    iconColor: event.canceledAt
      ? EventIconColor.DEFAULT
      : EventIconColor.ORANGE,
    title: event.canceledAt ? "Claim Canceled" : "Claim Created",
    time: event.canceledAt ? event.canceledAt : event.time,
    children: [
      <Fragment key={event.id}>
        <div className="flex flex-col gap-y-base">
          <ClaimStatus event={event} />
          {renderClaimItems(event)}
          {event.claim.additional_items?.length > 0 &&
            renderReplacementItems(event)}
          {shouldHaveButtonActions && (
            <div className="flex items-center gap-x-xsmall">
              {event.claim.return_order.status === "requested" && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={openReceiveMenu}
                >
                  Receive Return
                </Button>
              )}
              {event.claim.additional_items?.length > 0 &&
                event.claim.fulfillment_status === "not_fulfilled" && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={openFulfillMenu}
                  >
                    Fulfill Replacement
                  </Button>
                )}
            </div>
          )}
        </div>
        {stateReceiveMenu && (
          <ReceiveReturn
            onClose={closeReceiveMenu}
            order={event.order}
            returnRequest={event.claim.return_order}
          />
        )}
        {stateFulfillMenu && (
          <CreateFulfillmentModal
            handleCancel={closeFulfillMenu}
            orderToFulfill={event.claim}
            orderId={event.claim.order_id}
          />
        )}
      </Fragment>,
    ],
  }

  return <EventContainer {...args} />
}

export default Claim

const ClaimStatus = ({ event }: Props) => {
  const divider = <div className="h-11 w-px bg-grey-20" />

  const shouldHaveFulfillment =
    !!event.claim.fulfillment_status && event.claim.additional_items?.length > 0
  const shouldHaveReturnStatus = !!event.claim.return_order

  let refundStatus: string = event.claim.payment_status

  if (event.claim.type === "replace") {
    refundStatus =
      event.claim.return_order.status === "received"
        ? "refunded"
        : event.claim.payment_status
  }

  return (
    <div className="inter-small-regular flex items-center gap-x-base">
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Refund:</span>
        <RefundStatus refundStatus={refundStatus} />
      </div>
      {shouldHaveReturnStatus && (
        <>
          {divider}
          <div className="flex flex-col gap-y-2xsmall">
            <span className="text-grey-50">Return:</span>
            <ReturnStatus returnStatus={event.returnStatus} />
          </div>
        </>
      )}
      {shouldHaveFulfillment && (
        <>
          {divider}
          <div className="flex flex-col gap-y-2xsmall">
            <span className="text-grey-50">Fulfillment:</span>
            <FulfillmentStatus
              fulfillmentStatus={event.claim.fulfillment_status}
            />
          </div>
        </>
      )}
    </div>
  )
}

const renderClaimItems = (event: ClaimEvent) => {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">Claim Items</span>
      <div>
        {event.claimItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}

const renderReplacementItems = (event: ClaimEvent) => {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">
        Replacement Items
      </span>
      <div>
        {event.newItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}
