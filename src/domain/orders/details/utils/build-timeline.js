const buildTimeline = order => {
  const events = []

  const returns = order.returns.map(r => {
    const items = r.items.map(i => {
      const line = order.items.find(({ id }) => i.item_id === id)
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
      created: r.created_at,
      raw: r,
    }
  })

  events.push({
    id: `${order.id}-placed`,
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
        items,
        time: fulfillment.created_at,
      })

      if (fulfillment.shipped_at) {
        events.push({
          id: `${fulfillment.id}-ship`,
          event: "Items shipped",
          items,
          time: fulfillment.shipped_at,
        })
      }
    }
  }

  if (order.swaps && order.swaps.length) {
    for (const swap of order.swaps) {
      const returnLines = swap.return.items.map(i => {
        const line = order.items.find(({ id }) => i.item_id === id)
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
        raw: swap,
      })
    }
  }

  events.sort((a, b) => {
    if (a.time < b.time) {
      return -1
    }

    if (a.time > b.time) {
      return 1
    }

    return 0
  })

  return events
}

export default buildTimeline
