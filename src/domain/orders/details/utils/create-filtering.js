export const filterItems = (order, is_claim) => {
  let tmpp = order.items.reduce(
    (map, obj) => map.set(obj.id, { ...obj }),
    new Map()
  )

  let claim_items = []

  if (order.claims && order.claims.length) {
    for (const s of order.claims) {
      claim_items = [...claim_items, ...s.claim_items]

      //
      //    Ticket is created to allow claims and swaps on claims and swaps without errors
      //
      //   if (
      //     s.fulfillment_status === "not_fulfilled" &&
      //     s.payment_status === "na"
      //   ) {
      //     continue
      //   }

      //   if (s.additional_items && s.additional_items.length)
      //     tmpp = s.additional_items
      //       .filter(
      //         it =>
      //           it.shipped_quantity ||
      //           it.shipped_quantity === it.fulfilled_quantity
      //       )
      //       .reduce((map, obj) => map.set(obj.id, { ...obj }), tmpp)
    }
  }

  if (!is_claim) {
    if (order.swaps && order.swaps.length) {
      for (const s of order.swaps) {
        tmpp = s.additional_items.reduce(
          (map, obj) => map.set(obj.id, { ...obj }),
          tmpp
        )
      }
    }
  }

  for (const item of claim_items) {
    let i = tmpp.get(item.item_id)
    if (i) {
      i.quantity = i.quantity - item.quantity
      i.quantity !== 0 ? tmpp.set(i.id, i) : tmpp.delete(i.id)
    }
  }

  return [...tmpp.values()]
}
