import { RouteComponentProps, Router } from "@reach/router"
import React, { useMemo } from "react"
import { navigate } from "gatsby"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import OrderTable from "../../components/templates/order-table"
import Details from "./details"

const VIEWS = ["orders", "drafts"]

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const view = "orders"

  const actions = useMemo(() => {
    return []
  }, [view])

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          customHeader={
            <TableViewHeader
              views={VIEWS}
              setActiveView={(v) => {
                if (v === "drafts") {
                  navigate(`/a/draft-orders`)
                }
              }}
              activeView={view}
            />
          }
          actionables={actions}
        >
          <OrderTable />
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
    </Router>
  )
}

export default Orders
