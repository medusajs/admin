import React from "react"
import { RouteComponentProps, Router } from "@reach/router"

import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import CustomerTable from "../../components/templates/customer-table"
import { CustomerGroupTable } from "./groups"
import Details from "./details"

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  const [activeView, setActiveView] = React.useState("customers")

  const isGroupsView = activeView === "customers"
  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          customHeader={
            <TableViewHeader
              activeView={activeView}
              setActiveView={setActiveView}
              views={["customers", "groups"]}
            />
          }
        >
          {isGroupsView ? <CustomerTable /> : <CustomerGroupTable />}
        </BodyCard>
      </div>
    </div>
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
