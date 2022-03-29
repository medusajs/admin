export const filterItems = (order, isClaim) => {
  let orderItems = order.items.reduce(
    (map, obj) =>
      map.set(obj.id, {
        ...obj,
      }),
    new Map()
  )

  let claimedItems = []

  if (order.claims && order.claims.length) {
    for (const s of order.claims) {
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
