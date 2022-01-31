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
    | "notification"
}

export interface OrderPlacedEvent extends TimelineEvent {
  amount: number
  currency_code: string
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

export interface ItemsFulfilledEvent extends TimelineEvent {
  items: OrderItem[]
}

export interface ItemsShippedEvent extends TimelineEvent {
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

export interface ExchangeEvent extends TimelineEvent {
  paymentStatus: string
  fulfillmentStatus: string
  returnStatus: string
  returnItems: ReturnItem[]
  newItems: OrderItem[]
}

export interface NotificationEvent extends TimelineEvent {
  to: string
  title: string
}

export const useBuildTimelime = (orderId: string) => {
  const { order, isLoading: orderLoading, isError: orderError } = useAdminOrder(
    orderId
  )
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
    if (!order) return undefined

    const events: TimelineEvent[] = []

    events.push({
      id: `${order.id}-placed`,
      time: order.created_at,
      amount: order.total,
      currency_code: order.currency_code,
      type: "placed",
    } as OrderPlacedEvent)

    if (order.canceled_at) {
      events.push({
        id: `${order.id}-canceled`,
        time: order.canceled_at,
        type: "canceled",
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
        } as NoteEvent)
      }
    }

    for (const event of order.fulfillments) {
      events.push({
        id: event.id,
        time: event.created_at,
        type: "fulfilled",
        items: event.items.map((item) => getLineItem(order, item.item_id)),
        noNotification: event.no_notification,
      } as ItemsFulfilledEvent)

      if (event.shipped_at) {
        events.push({
          id: event.id,
          time: event.shipped_at,
          type: "shipped",
          items: event.items.map((item) => getLineItem(order, item.item_id)),
          noNotification: event.no_notification,
        } as ItemsShippedEvent)
      }
    }

    for (const event of order.returns) {
      events.push({
        id: event.id,
        items: event.items.map((i) => getReturnItems(order, i)),
        status: event.status,
        currentStatus: event.status,
        time: event.updated_at,
        type: "return",
        noNotification: event.no_notification,
      } as ReturnEvent)

      if (event.status !== "requested") {
        events.push({
          id: event.id,
          items: event.items.map((i) => getReturnItems(order, i)),
          status: "requested",
          time: event.created_at,
          type: "return",
          currentStatus: event.status,
          noNotification: event.no_notification,
        } as ReturnEvent)
      }
    }

    for (const event of order.swaps) {
      events.push({
        id: event.id,
        time: event.created_at,
        noNotification: event.no_notification,
        fulfillmentStatus: event.fulfillment_status,
        paymentStatus: event.payment_status,
        returnStatus: event.return_order.status,
        type: "exchange",
        newItems: event.additional_items.map((i) => getSwapItem(i)),
        returnItems: event.return_order.items.map((i) =>
          getReturnItems(order, i)
        ),
      } as ExchangeEvent)
    }

    for (const event of order.claims) {
    }

    if (notifications) {
      for (const notification of notifications) {
        events.push({
          id: notification.id,
          time: notification.created_at,
          to: notification.to,
          type: "notification",
          title: notification.event_name,
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

  return { events }
}

function getExchangeItems(order, swap) {}

function getLineItem(order, itemId) {
  const line = order.items.find((line) => line.id === itemId)

  if (!line) return

  return {
    title: line.title,
    quantity: line.quantity,
    thumbnail: line.thumbnail,
    variant: { title: line.variant.title },
  }
}

function getReturnItems(order, item) {
  const line = order.items.find((li) => li.id === item.item_id)

  if (!line) return

  return {
    title: line.title,
    quantity: item.quantity,
    requestedQuantity: item.requested_quantity,
    receivedQuantity: item.received_quantity,
    variant: {
      title: line.variant.title,
    },
    thumbnail: line.thumbnail,
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
