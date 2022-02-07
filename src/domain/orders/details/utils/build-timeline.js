const buildTimeline = (order, notifications, notes) => {
  const events = []

  let allItems = [...order.items]
  if (order.swaps && order.swaps.length) {
    for (const swap of order.swaps) {
      allItems = [...allItems, ...swap.additional_items]
    }
  }

  for (const n of notifications) {
    events.push({
      id: n.id,
      type: "notification",
      event_name: n.event_name,
      provider_id: n.provider_id,
      created_at: n.created_at,
      time: n.created_at,
      raw: n,
    })
  }

  for (const n of notes) {
    events.push({
      id: n.id,
      type: "note",
      created_at: n.created_at,
      updated_at: n.updated_at,
      time: n.created_at,
      raw: n,
    })
  }

  const returns = order.returns.map(r => {
    const items = r.items.map(i => {
      const line = allItems.find(({ id }) => i.item_id === id)
      return {
        ...line,
        is_registered: i.is_registered,
        is_requested: i.is_requested,
        quantity_requested: i.quantity_requested,
        quantity: i.quantity,
      }
    })

    return {
      items,
      status: r.status,
      refund_amount: r.refund_amount,
      created_at: r.created_at,
      no_notification: r.no_notification,
      raw: r,
    }
  })

  events.push({
    id: `${order.id}-placed`,
    type: "placed",
    event: "Placed",
    items: order.items,
    time: order.created_at,
  })

  if (returns.length) {
    for (const r of returns) {
      events.push({
        id: r.id,
        type: "return",
        event: "Items returned",
        items: r.items,
        refund_amount: r.refund_amount,
        no_notification: r.no_notification,
        status: r.status,
        time: r.created_at,
        raw: r.raw,
      })
    }
  }

  if (order.fulfillments.length) {
    for (const fulfillment of order.fulfillments) {
      const items = fulfillment.items.map(i => {
        const line = order.items.find(({ id }) => i.item_id === id)
        return {
          ...line,
          quantity: i.quantity,
        }
      })

      events.push({
        id: `${fulfillment.id}-fulfill`,
        event: "Items fulfilled",
        type: "fulfilled",
        items,
        time: fulfillment.created_at,
        shipped_at: fulfillment.shipped_at,
        tax_rate: order.tax_rate,
        currency_code: order.currency_code,
        fulfilledAllItems: fulfillment.items.length === order.items.length,
      })
    }
  }

  if (order.swaps && order.swaps.length) {
    for (const swap of order.swaps) {
      const returnLines = swap.return_order.items.map(i => {
        const line = allItems.find(({ id }) => i.item_id === id)
        return {
          ...line,
          quantity: i.quantity,
        }
      })
      events.push({
        id: swap.id,
        type: "swap",
        event: "Items swapped",
        items: swap.additional_items,
        return_lines: returnLines,
        time: swap.created_at,
        no_notification: swap.no_notification,
        raw: swap,
      })
    }
  }

  if (order.claims && order.claims.length) {
    for (const claim of order.claims) {
      const claimLines = claim.claim_items.map(i => {
        const line = allItems.find(({ id }) => i.item_id === id)
        return {
          ...line,
          ...i,
        }
      })
      events.push({
        id: claim.id,
        type: "claim",
        claim_type: claim.type,
        event: "Items claimed",
        items: claim.additional_items,
        claim_items: claimLines,
        time: claim.created_at,
        no_notification: claim.no_notification,
        raw: claim,
      })
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

  events[0].isLatest = true

  return events
}

export default buildTimeline
