import { ClaimItem, LineItem, Order, Return } from "@medusajs/medusa"
import { AddressPayload } from "../../../../components/templates/address-form"
import { Subset } from "../../../../types/shared"
import { isoAlpha2Countries } from "../../../../utils/countries"
import { isLineItemNotReturnable } from "../../../../utils/is-line-item"
import { ClaimTypeFormType } from "../../components/claim-type-form"
import { ItemsToReceiveFormType } from "../../components/items-to-receive-form"
import { ItemsToReturnFormType } from "../../components/items-to-return-form"
import { ItemsToSendFormType } from "../../components/items-to-send-form"

import { SendNotificationFormType } from "../../components/send-notification-form"
import { ShippingFormType } from "../../components/shipping-form"
import { CreateClaimFormType } from "../claim/register-claim-menu"
import { ReceiveReturnFormType } from "../receive-return/receive-return-menu"

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
    for (const claim of order.claims) {
      claim.claim_items = claim.claim_items ?? []
      claimedItems = [...claimedItems, ...claim.claim_items]

      if (
        claim.fulfillment_status === "not_fulfilled" &&
        claim.payment_status === "na"
      ) {
        continue
      }

      if (claim.additional_items && claim.additional_items.length) {
        orderItems = claim.additional_items
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
      for (const swap of order.swaps) {
        orderItems = swap.additional_items.reduce(
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
      i.quantity = i.quantity - (item.item.returned_quantity || 0)
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

const getDefaultClaimTypeValues = (): ClaimTypeFormType => {
  return {
    type: "refund",
  }
}

const getDefaultShippingValues = (): Subset<ShippingFormType> => {
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

    let total: number

    if (item.total) {
      total = item.total
    } else if (item.tax_lines?.length > 0) {
      const taxRate = item.tax_lines.reduce((acc, line) => {
        return acc + line.rate / 100
      }, 0)

      total = item.unit_price * item.quantity * (1 + taxRate)
    } else {
      total = item.unit_price * item.quantity
    }

    returnItems.items.push({
      item_id: item.id,
      thumbnail: item.thumbnail,
      refundable: item.refundable || 0,
      product_title: item.variant.product.title,
      variant_title: item.variant.title,
      quantity: returnableQuantity,
      original_quantity: item.quantity,
      total,
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

      const indexOfLineItem = order.items.findIndex(
        (i) => i.id === item.item_id
      )

      const indexOfRequestedItem = returnRequest.items.findIndex(
        (i) => i.item_id === item.item_id
      )

      if (item?.item_id && indexOfRequestedItem > -1) {
        const requestedItem = returnRequest.items[indexOfRequestedItem]
        const lineItem = order.items[indexOfLineItem]

        const adjustedQuantity =
          requestedItem.requested_quantity - requestedItem.received_quantity

        /**
         * We need to know the paid price per item, so we can display
         * the correct expcted refund amount. This requires us to
         * find the original quantity on the order line items,
         * as any previous returns will have adjusted the quantity.
         */
        const price = (item.total || 0) / lineItem.quantity

        acc.push({
          ...item,
          price,
          quantity: adjustedQuantity,
          original_quantity: adjustedQuantity,
        })
      }
      return acc
    }, [] as Subset<ItemsToReceiveFormType["items"]>),
  }

  return returnItems
}

// export const getDefaultSwapValues = (
//   order: Order
// ): Subset<CreateSwapFormType> => {
//   return {
//     return_items: getReturnableItemsValues(order, false),
//     additional_items: getDefaultAdditionalItemsValues(),
//     notification: getDefaultSendNotificationValues(),
//     return_shipping: getDefaultShippingValues(),
//   }
// }

// export const getDefaultRequestReturnValues = (
//   order: Order
// ): Subset<RequestReturnFormType> => {
//   return {
//     return_items: getReturnableItemsValues(order, false),
//     notification: getDefaultSendNotificationValues(),
//     receive: getDefaultReceiveVaues(),
//     return_shipping: getDefaultShippingValues(),
//   }
// }

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
