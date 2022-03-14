import React from "react"
import { sortBy } from "lodash"

import { CustomerGroup } from "@medusajs/medusa"

type CustomerGroupsOfCustomerProps = {
  groups: CustomerGroup[]
}

function CustomersAssociatedGroups(props: CustomerGroupsOfCustomerProps) {
  const groups = sortBy(props.groups, "name")
  if (!groups.length) return null

  const left = groups.length - 1
  return (
    <div className="text-small">
      <span>{groups[0].name}</span>
      {left && <span className="text-grey-40"> + {left} more</span>}
    </div>
  )
}

export default CustomersAssociatedGroups
