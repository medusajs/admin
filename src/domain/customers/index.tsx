import { RouteComponentProps, Router } from "@reach/router"
import React from "react"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import Details from "./details"

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  return (
    <div className="flex flex-col grow h-full">
      <PageDescription
        title={"Customers"}
        subtitle="Manage the Customers of your store"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Overview"
          subtitle="An overview of all of your existing customers"
          className="mb-0"
        >
          <div className="flex grow  flex-col pt-2 mt-large">
            <CustomerTable />
          </div>
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
