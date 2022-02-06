import { RouteComponentProps, Router } from "@reach/router"
import React, { useState } from "react"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import DraftOrderTable from "../../components/templates/draft-order-table"
import OrderTable from "../../components/templates/order-table"
import Details from "./details"
import DraftOrderDetails from "./draft-orders/details"
import NewOrder from "./new"

const VIEWS = [
  "orders",
  "drafts",
  // "swaps", <- TODO
  // "returns" <- TODO
]

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const [view, setView] = useState("orders")

  const CurrentView = () => {
    switch (view) {
      case "drafts":
        return <DraftOrderTable />
      default:
        return <OrderTable />
    }
  }

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          customHeader={
            <TableViewHeader
              views={VIEWS}
              setActiveView={setView}
              activeView={view}
            />
          }
        >
          <CurrentView />
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
