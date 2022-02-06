import {
  useAdminCancelReturn,
  useAdminCancelSwap,
  useAdminStore,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { ExchangeEvent } from "../../../hooks/use-build-timeline"
import CopyToClipboard from "../../atoms/copy-to-clipboard"
import Button from "../../fundamentals/button"
import CancelIcon from "../../fundamentals/icons/cancel-icon"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import DeletePrompt from "../../organisms/delete-prompt"
import { ActionType } from "../actionables"
import InfoTooltip from "../info-tooltip"
import { FulfillmentStatus, PaymentStatus, ReturnStatus } from "../order-status"
import EventActionables from "./event-actionables"
import EventContainer, { EventIconColor } from "./event-container"
import EventItemContainer from "./event-item-container"

type ExchangeProps = {
  event: ExchangeEvent
}

const ExchangeStatus: React.FC<ExchangeProps> = ({ event }) => {
  const divider = <div className="h-11 w-px bg-grey-20" />

  return (
    <div className="flex items-center inter-small-regular gap-x-base">
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Payment:</span>
        <PaymentStatus paymentStatus={event.paymentStatus} />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Return:</span>
        <ReturnStatus returnStatus={event.returnStatus} />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Fulfillment:</span>
        <FulfillmentStatus fulfillmentStatus={event.fulfillmentStatus} />
      </div>
    </div>
  )
}

const Exchange: React.FC<ExchangeProps> = ({ event }) => {
  const [showCancel, setShowCancel] = useState(false)
  // const [showCancelReturn, setShowCancelReturn] = useState(false)
  const cancelExchange = useAdminCancelSwap(event.orderId)
  const cancelReturn = useAdminCancelReturn(event.returnId)
  const [differenceCardId, setDifferenceCardId] = useState<string | undefined>(
    undefined
  )
  const [paymentFormatWarning, setPaymentFormatWarning] = useState<
    string | undefined
  >(undefined)
  const { store } = useAdminStore()

  useEffect(() => {
    if (!store) {
      return
    }

    if (!store.payment_link_template) {
      setPaymentFormatWarning(
        "No payment link has been set for this store. Please update store settings."
      )
    }
    if (store.payment_link_template?.indexOf("{cart_id}") === -1) {
      setPaymentFormatWarning(
        "Store payment link does not have the default format, as it does not contain '{cart_id}'. Either update the payment link to include '{cart_id}' or update this method to reflect the format of your payment link."
      )
    }
    if (event.exchangeCartId) {
      setDifferenceCardId(
        store.payment_link_template.replace(/\{cart_id\}/, event.exchangeCartId)
      )
    }
  }, [store?.payment_link_template, event.exchangeCartId])

  const paymentLink = getPaymentLink(
    differenceCardId,
    paymentFormatWarning,
    event.exchangeCartId
  )

  const handleCancelExchange = () => {
    cancelExchange.mutate(event.id)
  }

  const handleCancelReturn = () => {
    cancelReturn.mutate()
  }

  const returnItems = getReturnItems(event)
  const newItems = getNewItems(event)

  const actions: ActionType[] = []

  if (!event.isCanceled && !event.canceledAt) {
    actions.push({
      label: "Cancel exchange",
      icon: <CancelIcon size={20} />,
      onClick: () => setShowCancel(!showCancel),
      variant: "danger",
    })
  }

  if (event.returnStatus !== "canceled") {
    actions.push({
      label: "Cancel return",
      icon: <CancelIcon size={20} />,
      onClick: handleCancelReturn,
      variant: "danger",
    })
  }

  const args = {
    title: event.canceledAt ? "Exchange Canceled" : "Exchange Requested",
    icon: event.canceledAt ? (
      <CancelIcon size={20} />
    ) : (
      <RefreshIcon size={20} />
    ),
    expandable: !!event.canceledAt,
    iconColor: event.canceledAt
      ? EventIconColor.DEFAULT
      : EventIconColor.ORANGE,
    time: event.time,
    noNotification: event.noNotification,
    topNode: getActions(event, actions),
    children: [
      <div className="flex flex-col gap-y-base">
        {event.canceledAt && (
          <div>
            <span className="mr-2 inter-small-semibold">Requested on:</span>
            <span className="text-grey-50">
              {new Date(event.time).toUTCString()}
            </span>
          </div>
        )}
        {!event.canceledAt && <ExchangeStatus event={event} />}
        {!event.canceledAt && paymentLink}
        {returnItems}
        {newItems}
        <div className="flex items-center gap-x-xsmall">
          {event.returnStatus === "requested" && (
            <Button variant="secondary" size="small">
              Receive Return
            </Button>
          )}
          {event.fulfillmentStatus === "not_fulfilled" && (
            <Button variant="secondary" size="small">
              Fulfill Exchange
            </Button>
          )}
        </div>
      </div>,
    ],
  }
  return (
    <>
      <EventContainer {...args} />
      {showCancel && (
        <DeletePrompt
          handleClose={() => setShowCancel(!showCancel)}
          onDelete={async () => handleCancelExchange()}
          confirmText="Yes, cancel"
          heading="Cancel exchange"
          text="Are you sure you want to cancel this exchange?"
          successText="Exchange canceled"
        />
      )}
      {/* showCancelReturn && (
        <DeletePrompt
          handleClose={() => setShowCancelReturn(!showCancelReturn)}
          onDelete={async () => handleCancelReturn()}
          confirmText="Yes, cancel"
          heading="Cancel return"
          text="Are you sure you want to cancel this return?"
          successText="Return canceled"
        />
          )*/}
    </>
  )
}

function getNewItems(event: ExchangeEvent) {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">New Items</span>
      <div>
        {event.newItems.map((i) => (
          <EventItemContainer item={i} />
        ))}
      </div>
    </div>
  )
}

function getPaymentLink(
  differenceCardId: string | undefined,
  paymentFormatWarning: string | undefined,
  exchangeCartId: string | undefined
) {
  return differenceCardId ? (
    <div className="inter-small-regular text-grey-50 flex flex-col gap-y-xsmall">
      <div className="flex items-center gap-x-xsmall">
        {paymentFormatWarning && <InfoTooltip content={paymentFormatWarning} />}
        <span>Payment link:</span>
      </div>
      <CopyToClipboard value={differenceCardId} displayValue={exchangeCartId} />
    </div>
  ) : null
}

function getReturnItems(event: ExchangeEvent) {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">Return Items</span>
      <div>
        {event.returnItems.map((i) => (
          <EventItemContainer item={{ ...i, quantity: i.requestedQuantity }} />
        ))}
      </div>
    </div>
  )
}

function getActions(event: ExchangeEvent, actions: ActionType[]) {
  if (actions.length === 0) {
    return null
  }

  // if (event.returnStatus !== "canceled") {
  //   return (
  //     <div className="flex items-center opacity-50">
  //       <Tooltip content="Return must be canceled before the exchange can be canceled">
  //         <div className="pointer-events-none">
  //           <EventActionables actions={actions} />
  //         </div>
  //       </Tooltip>
  //     </div>
  //   )
  // }

  return <EventActionables actions={actions} />
}

export default Exchange
