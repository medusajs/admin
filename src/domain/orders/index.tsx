import { RouteComponentProps, Router } from "@reach/router"
import React from "react"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import OrderTable from "../../components/templates/order-table"
import Details from "./details/new-details"
import DraftOrderDetails from "./draft-orders/details"
import NewOrder from "./new"

const OrderIndex: React.FC<RouteComponentProps> = () => {
  return (
    <div className="flex flex-col grow h-full">
      <PageDescription
        title={"Orders"}
        subtitle="Manage the Orders of your store"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Overview"
          subtitle="An overview of all Orders"
          className="mb-0"
        >
          <div className="flex grow  flex-col pt-2 mt-large">
            <OrderTable />
          </div>
        </BodyCard>
      </div>
    </div>
  )
}

const Orders = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
      <DraftOrderDetails path="/draft/:id" />
      <NewOrder path="/new" />
    </Router>
  )
}

export default Orders
