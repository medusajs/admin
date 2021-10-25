export const filterItems = order => {
  let orderItems = order.items.reduce(
    (map, obj) =>
      map.set(obj.id, {
        ...obj,
      }),
    new Map()
  )

  let claimedItems = []

  if (order.claims && order.claims.length) {
    for (const c of order.claims) {
      claimedItems = [...claimedItems, ...c.claim_items]
      if (
        c.fulfillment_status === "not_fulfilled" &&
        c.payment_status === "na"
      ) {
        continue
      }

      if (c.additional_items && c.additional_items.length)
        orderItems = c.additional_items
          .filter(
            it =>
              it.shipped_quantity ||
              it.shipped_quantity === it.fulfilled_quantity
          )
          .reduce((map, obj) => map.set(obj.id, { ...obj }), orderItems)
    }
  }

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

  for (const item of claimedItems) {
    let i = orderItems.get(item.item_id)
    if (i) {
      i.quantity = i.quantity - item.quantity
      i.quantity !== 0 ? orderItems.set(i.id, i) : orderItems.delete(i.id)
    }
  }

  return [...orderItems.values()]
}
