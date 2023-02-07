import { ClaimItem, LineItem, Order, Return } from "@medusajs/medusa"
import { AddressPayload } from "../../../../components/templates/address-form"
import { Subset } from "../../../../types/shared"
import { isoAlpha2Countries } from "../../../../utils/countries"
import { isLineItemNotReturnable } from "../../../../utils/is-line-item"
import { ClaimTypeFormType } from "../../components/claim-type-form"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"
import { ItemsToReturnFormType } from "../../components/items-to-return-form"
import { ItemsToSendFormType } from "../../components/items-to-send-form"
import { ReceiveNowFormType } from "../../components/receive-now-form"
import { ReturnShippingFormType } from "../../components/return-shipping-form"
import { SendNotificationFormType } from "../../components/send-notification-form"
import { ShippingFormType } from "../../components/shipping-form"
import { CreateClaimFormType } from "../claim/register-claim-menu"
import { ReceiveReturnFormType } from "../returns/receive-return-menu"
import { RequestReturnFormType } from "../returns/request-return-menu"
import { CreateSwapFormType } from "../swap/swap-menu"

const getDefaultShippingAddressValues = (
  order: Order
): Subset<AddressPayload> => {
  const keys = Object.keys(order.shipping_address).map(
    (k) => k
  ) as (keyof AddressPayload)[]

  return keys.reduce((acc, key) => {
    if (key === "country_code") {
      const countryDisplayName = order.shipping_address.country_code
        ? isoAlpha2Countries[order.shipping_address.country_code.toUpperCase()]
        : ""
      acc[key] = {
        value: order.shipping_address[key],
        label: countryDisplayName,
      }
    } else {
      acc[key] = order.shipping_address[key] || undefined
    }
    return acc
  }, {})
}

export const getAllReturnableItems = (
  order: Omit<Order, "beforeInserts">,
  isClaim: boolean
) => {
  let orderItems = order.items.reduce(
    (map, obj) =>
      map.set(obj.id, {
        ...obj,
      }),
    new Map<string, Omit<LineItem, "beforeInsert">>()
  )

  let claimedItems: ClaimItem[] = []

  if (order.claims && order.claims.length) {
    for (const s of order.claims) {
      s.claim_items = s.claim_items || []
      claimedItems = [...claimedItems, ...s.claim_items]

      if (
        s.fulfillment_status === "not_fulfilled" &&
        s.payment_status === "na"
      ) {
        continue
      }

      if (s.additional_items && s.additional_items.length) {
        orderItems = s.additional_items
          .filter(
            (it) =>
              it.shipped_quantity ||
              it.shipped_quantity === it.fulfilled_quantity
          )
          .reduce((map, obj) => map.set(obj.id, { ...obj }), orderItems)
      }
    }
  }

  if (!isClaim) {
    if (order.swaps && order.swaps.length) {
      for (const s of order.swaps) {
        orderItems = s.additional_items.reduce(
          (map, obj) =>
            map.set(obj.id, {
              ...obj,
            }),
          orderItems
        )
      }
    }
  }

  for (const item of claimedItems) {
    const i = orderItems.get(item.item_id)
    if (i) {
      i.quantity = i.quantity - item.quantity
      i.quantity !== 0 ? orderItems.set(i.id, i) : orderItems.delete(i.id)
    }
  }

  return [...orderItems.values()]
}

const getDefaultSendNotificationValues = (): SendNotificationFormType => {
  return {
    send_notification: true,
  }
}

const getDefaultAdditionalItemsValues = (): ItemsToSendFormType => {
  return {
    items: [],
  }
}

const getDefaultReceiveVaues = (): ReceiveNowFormType => {
  return {
    receive_now: false,
  }
}

const getDefaultClaimTypeValues = (): ClaimTypeFormType => {
  return {
    type: "refund",
  }
}

const getDefaultShippingValues = (): Subset<
  ShippingFormType | ReturnShippingFormType
> => {
  return {
    option: undefined,
    price: undefined,
  }
}

const getReturnableItemsValues = (
  order: Order,
  isClaim = false
): Subset<ItemsToReturnFormType> => {
  const returnItems: ItemsToReturnFormType = {
    items: [],
  }

  const returnableItems = getAllReturnableItems(order, isClaim)

  returnableItems.forEach((item) => {
    if (isLineItemNotReturnable(item, order)) {
      return // If item in not returnable either because it's already returned or the line item has been cancelled, we skip it.
    }

    const returnableQuantity = item.quantity - (item.returned_quantity || 0)

    returnItems.items.push({
      item_id: item.id,
      thumbnail: item.thumbnail,
      refundable: item.refundable
        ? (item.refundable / item.quantity) * returnableQuantity
        : 0,
      product_title: item.variant.product.title,
      variant_title: item.variant.title,
      quantity: returnableQuantity,
      original_quantity: returnableQuantity,
      return_reason_details: {
        note: undefined,
        reason: undefined,
      },
      return: false,
    })
  })

  return returnItems
}

const getReceiveableItemsValues = (
  order: Order,
  returnRequest: Return
): Subset<ItemsToReceiveFormType> => {
  const returnableItems = getReturnableItemsValues(order, false)

  const returnItems = {
    items: returnableItems?.items?.reduce((acc, item) => {
      if (!item) {
        return acc
      }

      const indexOfRequestedItem = returnRequest.items.findIndex(
        (i) => i.item_id === item.item_id
      )

      if (item?.item_id && indexOfRequestedItem > -1) {
        const requestedItem = returnRequest.items[indexOfRequestedItem]

        const adjustedQuantity =
          requestedItem.requested_quantity - requestedItem.received_quantity

        acc.push({
          ...item,
          quantity: adjustedQuantity,
          original_quantity: adjustedQuantity,
        })
      }
      return acc
    }, [] as Subset<ItemsToReceiveFormType["items"]>),
  }

  return returnItems
}

export const getDefaultSwapValues = (
  order: Order
): Subset<CreateSwapFormType> => {
  return {
    return_items: getReturnableItemsValues(order, false),
    additional_items: getDefaultAdditionalItemsValues(),
    notification: getDefaultSendNotificationValues(),
    return_shipping: getDefaultShippingValues(),
  }
}

export const getDefaultRequestReturnValues = (
  order: Order
): Subset<RequestReturnFormType> => {
  return {
    return_items: getReturnableItemsValues(order, false),
    notification: getDefaultSendNotificationValues(),
    receive: getDefaultReceiveVaues(),
    return_shipping: getDefaultShippingValues(),
  }
}

export const getDefaultReceiveReturnValues = (
  order: Order,
  returnRequest: Return
): Subset<ReceiveReturnFormType> => {
  return {
    receive_items: getReceiveableItemsValues(order, returnRequest),
  }
}

export const getDefaultClaimValues = (
  order: Order
): Subset<CreateClaimFormType> => {
  return {
    claim_type: getDefaultClaimTypeValues(),
    additional_items: getDefaultAdditionalItemsValues(),
    notification: getDefaultSendNotificationValues(),
    return_items: getReturnableItemsValues(order, true),
    shipping_address: getDefaultShippingAddressValues(order),
    return_shipping: getDefaultShippingValues(),
    replacement_shipping: getDefaultShippingValues(),
  }
}
