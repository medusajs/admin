import { RouteComponentProps, Router } from "@reach/router"
import React from "react"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import CustomerTable from "../../components/templates/customer-table"
import Details from "./details"

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard customHeader={<TableViewHeader views={["customers"]} />}>
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
      <Details path=":id" />
    </Router>
  )
}

export default Customers
