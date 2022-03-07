import React from "react"
import { useAdminCustomerGroup } from "medusa-react"

const Details = (p) => {
  const { customer_group } = useAdminCustomerGroup(p.id)
  return <div>Customer group: {JSON.stringify(customer_group)} </div>
}

export default Details
