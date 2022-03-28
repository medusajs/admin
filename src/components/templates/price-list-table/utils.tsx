import React from "react"
import StatusDot from "../../fundamentals/status-indicator"

const isFuture = (date: string) => {
  const now = new Date()
  return new Date(date) > now
}

const isPast = (date: string) => {
  const now = new Date()
  return new Date(date) < now
}

const getPriceListStatus = (priceList) => {
  if (priceList.status === "draft") {
    return <StatusDot title="Draft" variant="default" />
  } else if (isFuture(priceList?.starts_at)) {
    return <StatusDot title="Scheduled" variant="warning" />
  } else if (isPast(priceList?.ends_at)) {
    return <StatusDot title="Expired" variant="danger" />
  } else {
    return <StatusDot title="Active" variant="success" />
  }
}

const formatPriceListGroups = (groups = []) => {
  if (!groups?.length) {
    return ""
  }
  const show = groups[0]
  const remainingLength = groups.length - 1
  const more = remainingLength || ""
  return [show, more]
}

export { formatPriceListGroups, getPriceListStatus }
