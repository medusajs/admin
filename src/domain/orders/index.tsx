import { RouteComponentProps, Router } from "@reach/router"
import clsx from "clsx"
import { capitalize } from "lodash"
import React, { useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import DraftOrderTable from "../../components/templates/draft-order-table"
import OrderTable from "../../components/templates/order-table"
import Details from "./details"
import DraftOrderDetails from "./draft-orders"
import NewOrder from "./new"

const VIEWS = [
  "overview",
  "drafts",
  // "swaps", <- TODO
  // "returns" <- TODO
]

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const [view, setView] = useState("overview")

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
      <PageDescription
        title="Orders"
        subtitle="Manage the orders of your Medusa Store"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard className="mb-0">
          <div className="flex inter-large-semibold text-grey-40 space-x-4">
            {VIEWS.map((k, i) => (
              <div
                key={i}
                className={clsx("cursor-pointer", {
                  ["text-grey-90"]: k === view,
                })}
                onClick={() => setView(k)}
              >
                {capitalize(k)}
              </div>
            ))}
          </div>
          <div className="flex grow  flex-col pt-2 mt-large">
            <CurrentView />
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
