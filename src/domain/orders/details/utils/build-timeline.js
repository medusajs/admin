const buildTimeline = order => {
  const events = []

  const returns = order.returns.map(r => {
    const items = r.items.map(i => {
      const line = order.items.find(({ _id }) => i.item_id === _id)
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
      created: r.created,
      raw: r,
    }
  })

  events.push({
    event: "Placed",
    items: order.items,
    time: order.created,
  })

  if (returns.length) {
    for (const r of returns) {
      events.push({
        type: "return",
        event: "Items returned",
        items: r.items,
        refund_amount: r.refund_amount,
        status: r.status,
        time: parseInt(r.created),
        raw: r.raw,
      })
    }
  }

  if (order.fulfillments.length) {
    for (const fulfillment of order.fulfillments) {
      events.push({
        event: "Items fulfilled",
        items: fulfillment.items,
        time: parseInt(fulfillment.created),
      })

      if (fulfillment.shipped_at) {
        events.push({
          event: "Items shipped",
          items: fulfillment.items,
          time: parseInt(fulfillment.shipped_at),
        })
      }
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
