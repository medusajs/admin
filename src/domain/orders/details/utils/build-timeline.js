const buildTimeline = order => {
  const events = []

  const returns = order.returns.map(r => {
    const items = r.items.map(i => {
      const line = order.items.find(({ _id }) => i.item_id === _id)
      return {
        ...line,
        quantity: i.quantity,
      }
    })
    return {
      items,
      refund_amount: r.refund_amount,
      created: r.created,
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
        event: "Items returned",
        items: r.items,
        time: parseInt(r.created),
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
