import { RouteComponentProps, Router } from "@reach/router"
import React from "react"

import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import CustomerGroups from "./groups"
import Details from "./details"
import CustomersPageTableHeader from "./header"

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          customHeader={<CustomersPageTableHeader activeView="customers" />}
        >
          <CustomerTable />
        </BodyCard>
      </div>
    </div>
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <CustomerGroups path="/groups/*" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
