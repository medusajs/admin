import {
  useAdminNotes,
  useAdminNotifications,
  useAdminOrder,
} from "medusa-react"
import { useMemo } from "react"

export interface TimelineEvent {
  id: string
  time: Date
  first?: boolean
  orderId: string
  noNotification?: boolean
  type:
    | "payment"
    | "note"
    | "notification"
    | "placed"
    | "shipped"
    | "delivered"
    | "fulfilled"
    | "canceled"
    | "return"
    | "exchange"
    | "exchange_fulfilled"
    | "notification"
    | "claim"
}

interface CancelableEvent {
  canceledAt?: Date
  isCanceled?: boolean
}

export interface OrderPlacedEvent extends TimelineEvent {
  amount: number
  currency_code: string
  tax?: number
}

interface OrderItem {
  title: string
  quantity: number
  thumbnail?: string
  variant: {
    title: string
  }
}

interface ReturnItem extends OrderItem {
  requestedQuantity: number
  receivedQuantity: number
}

interface FulfillmentEvent extends TimelineEvent {
  isExchangeFulfillment?: boolean
}

export interface ItemsFulfilledEvent extends FulfillmentEvent {
  items: OrderItem[]
}

export interface ItemsShippedEvent extends FulfillmentEvent {
  items: OrderItem[]
}

enum ReturnStatus {
  REQUESTED = "requested",
  RECEIVED = "received",
  REQUIRES_ACTION = "requires_action",
  CANCELED = "canceled",
}

export interface ReturnEvent extends TimelineEvent {
  items: ReturnItem[]
  status: ReturnStatus
  currentStatus?: ReturnStatus
}

export interface NoteEvent extends TimelineEvent {
  value: string
  authorId: string
}

export interface ExchangeEvent extends TimelineEvent, CancelableEvent {
  paymentStatus: string
  fulfillmentStatus: string
  returnStatus: string
  returnId: string
  returnItems: ReturnItem[]
  newItems: OrderItem[]
  exchangeCartId?: string
}

export interface ClaimEvent extends TimelineEvent, CancelableEvent {
  fulfillmentStatus?: string
  refundStatus?: string
  refundAmount?: number
  currencyCode: string
  claimItems: OrderItem[]
  newItems: OrderItem[]
  claimType: string
  claim: any
  order: any
}

export interface NotificationEvent extends TimelineEvent {
  to: string
  title: string
}

export const useBuildTimelime = (orderId: string) => {
  const {
    order,
    isLoading: orderLoading,
    isError: orderError,
    refetch,
  } = useAdminOrder(orderId)
  const {
    notes,
    isLoading: notesLoading,
    isError: notesError,
  } = useAdminNotes({ resource_id: orderId, limit: 100, offset: 0 })
  const {
    notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useAdminNotifications({ resource_id: orderId })

  const events: TimelineEvent[] | undefined = useMemo(() => {
    if (!order) {
      return undefined
    }

    let allItems = [...order.items]

    if (order.swaps && order.swaps.length) {
      for (const swap of order.swaps) {
        allItems = [...allItems, ...swap.additional_items]
      }
    }

    if (order.claims && order.claims.length) {
      for (const claim of order.claims) {
        allItems = [...allItems, ...claim.additional_items]
      }
    }

    const events: TimelineEvent[] = []

    events.push({
      id: `${order.id}-placed`,
      time: order.created_at,
      amount: order.total,
      currency_code: order.currency_code,
      tax: order.tax_rate,
      type: "placed",
      orderId: order.id,
    } as OrderPlacedEvent)

    if (order.status === "canceled") {
      events.push({
        id: `${order.id}-canceled`,
        time: order.updated_at,
        type: "canceled",
        orderId: order.id,
      } as TimelineEvent)
    }

    if (notes) {
      for (const note of notes) {
        events.push({
          id: note.id,
          time: note.created_at,
          type: "note",
          authorId: note.author_id,
          value: note.value,
          orderId: order.id,
        } as NoteEvent)
      }
    }

    for (const event of order.fulfillments) {
      events.push({
        id: event.id,
        time: event.created_at,
        type: "fulfilled",
        items: event.items.map((item) => getLineItem(allItems, item.item_id)),
        noNotification: event.no_notification,
        orderId: order.id,
      } as ItemsFulfilledEvent)

      if (event.shipped_at) {
        events.push({
          id: event.id,
          time: event.shipped_at,
          type: "shipped",
          items: event.items.map((item) => getLineItem(allItems, item.item_id)),
          noNotification: event.no_notification,
          orderId: order.id,
        } as ItemsShippedEvent)
      }
    }

    for (const event of order.returns) {
      events.push({
        id: event.id,
        items: event.items.map((i) => getReturnItems(allItems, i)),
        status: event.status,
        currentStatus: event.status,
        time: event.updated_at,
        type: "return",
        noNotification: event.no_notification,
        orderId: order.id,
      } as ReturnEvent)

      if (event.status !== "requested") {
        events.push({
          id: event.id,
          items: event.items.map((i) => getReturnItems(allItems, i)),
          status: "requested",
          time: event.created_at,
          type: "return",
          currentStatus: event.status,
          noNotification: event.no_notification,
          orderId: order.id,
        } as ReturnEvent)
      }
    }

    for (const event of order.swaps) {
      events.push({
        id: event.id,
        time: event.canceled_at ? event.canceled_at : event.created_at,
        noNotification: event.no_notification === true,
        fulfillmentStatus: event.fulfillment_status,
        returnId: event.return_order.id,
        paymentStatus: event.payment_status,
        returnStatus: event.return_order.status,
        type: "exchange",
        newItems: event.additional_items.map((i) => getSwapItem(i)),
        returnItems: event.return_order.items.map((i) =>
          getReturnItems(allItems, i)
        ),
        exchangeCartId:
          event.payment_status !== "captured" ? event.cart_id : undefined,
        canceledAt: event.canceled_at,
        orderId: event.order_id,
      } as ExchangeEvent)

      if (
        event.fulfillment_status === "fulfilled" ||
        event.fulfillment_status === "shipped"
      ) {
        events.push({
          id: event.id,
          time: event.fulfillments[0].created_at,
          type: "fulfilled",
          items: event.additional_items.map((i) => getSwapItem(i)),
          noNotification: event.no_notification,
          orderId: order.id,
          isExchangeFulfillment: true,
        } as ItemsFulfilledEvent)

        if (event.fulfillments[0].shipped_at) {
          events.push({
            id: event.id,
            time: event.fulfillments[0].shipped_at,
            type: "shipped",
            items: event.additional_items.map((i) => getSwapItem(i)),
            noNotification: event.no_notification,
            orderId: order.id,
            isExchangeFulfillment: true,
          } as ItemsShippedEvent)
        }
      }
    }

    if (order.claims) {
      for (const claim of order.claims) {
        events.push({
          id: claim.id,
          type: "claim",
          newItems: claim.additional_items.map((i) => ({
            quantity: i.quantity,
            title: i.title,
            thumbnail: i.thumbnail,
            variant: {
              title: i.variant.title,
            },
          })),
          fulfillmentStatus: claim.fulfillment_status,
          refundStatus: claim.payment_status,
          refundAmount: claim.refund_amount,
          currencyCode: order.currency_code,
          claimItems: claim.claim_items.map((i) => getClaimItem(i)),
          time: claim.canceled_at ? claim.canceled_at : claim.created_at,
          noNotification: claim.no_notification,
          claimType: claim.type,
          canceledAt: claim.canceled_at,
          orderId: order.id,
          claim,
          order,
        } as ClaimEvent)

        if (claim.canceled_at) {
          events.push({
            id: `${claim.id}-created`,
            type: "claim",
            newItems: claim.additional_items.map((i) => ({
              quantity: i.quantity,
              title: i.title,
              thumbnail: i.thumbnail,
              variant: {
                title: i.variant.title,
              },
            })),
            fulfillmentStatus: claim.fulfillment_status,
            refundStatus: claim.payment_status,
            refundAmount: claim.refund_amount,
            currencyCode: order.currency_code,
            claimItems: claim.claim_items.map((i) => getClaimItem(i)),
            time: claim.created_at,
            noNotification: claim.no_notification,
            claimType: claim.type,
            isCanceled: true,
            orderId: order.id,
          } as ClaimEvent)
        }
      }
    }

    if (notifications) {
      for (const notification of notifications) {
        events.push({
          id: notification.id,
          time: notification.created_at,
          to: notification.to,
          type: "notification",
          title: notification.event_name,
          orderId: order.id,
        } as NotificationEvent)
      }
    }

    events.sort((a, b) => {
      if (a.time > b.time) {
        return -1
      }

      if (a.time < b.time) {
        return 1
      }

      return 0
    })

    events[events.length - 1].first = true

    return events
  }, [
    order,
    orderLoading,
    orderError,
    notes,
    notesLoading,
    notesError,
    notifications,
    notificationsLoading,
    notificationsError,
  ])

  return { events, refetch }
}

function getLineItem(allItems, itemId) {
  const line = allItems.find((line) => line.id === itemId)

  if (!line) {
    return
  }

  return {
    title: line.title,
    quantity: line.quantity,
    thumbnail: line.thumbnail,
    variant: { title: line?.variant?.title || "-" },
  }
}

function getReturnItems(allItems, item) {
  const line = allItems.find((li) => li.id === item.item_id)

  if (!line) {
    return
  }

  return {
    title: line.title,
    quantity: item.quantity,
    requestedQuantity: item.requested_quantity,
    receivedQuantity: item.received_quantity,
    variant: {
      title: line?.variant?.title || "-",
    },
    thumbnail: line.thumbnail,
  }
}

function getClaimItem(claimItem) {
  return {
    title: claimItem.item.title,
    quantity: claimItem.quantity,
    thumbnail: claimItem.item.thumbnail,
    variant: {
      title: claimItem.item.variant.title,
    },
  }
}

function getSwapItem(item) {
  return {
    title: item.title,
    quantity: item.quantity,
    thumbnail: item.thumbnail,
    variant: { title: item.variant.title },
  }
}
