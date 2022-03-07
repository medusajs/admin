import React from "react"
import { navigate } from "gatsby"

import TableViewHeader from "../../components/organisms/custom-table-header"

type P = {
  activeView: "customers" | "groups"
}

const CustomersPageTableHeader = (props: P) => {
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "customers") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={["customers", "groups"]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
