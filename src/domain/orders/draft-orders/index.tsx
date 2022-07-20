import { RouteComponentProps, Router } from "@reach/router"
import { navigate } from "gatsby"
import React, { useMemo, useState } from "react"

import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import TableViewHeader from "../../../components/organisms/custom-table-header"
import DraftOrderTable from "../../../components/templates/draft-order-table"
import NewOrderFormProvider from "../new/form"
import NewOrder from "../new/new-order"
import DraftOrderDetails from "./details"

const VIEWS = ["orders", "drafts"]

const DraftOrderIndex: React.FC<RouteComponentProps> = () => {
  const view = "drafts"
  const [showNewOrder, setShowNewOrder] = useState(false)

  const actions = useMemo(() => {
    return [
      {
        label: "Create draft order",
        onClick: () => setShowNewOrder(true),
        icon: <PlusIcon size={20} />,
      },
    ]
  }, [view])

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          customHeader={
            <TableViewHeader
              views={VIEWS}
              setActiveView={(v) => {
                if (v === "orders") {
                  navigate(`/a/orders`)
                }
              }}
              activeView={view}
            />
          }
          actionables={actions}
        >
          <DraftOrderTable />
        </BodyCard>
      </div>
      {showNewOrder && (
        <NewOrderFormProvider>
          <NewOrder onDismiss={() => setShowNewOrder(false)} />
        </NewOrderFormProvider>
      )}
    </div>
  )
}

const DraftOrders = () => {
  return (
    <Router>
      <DraftOrderIndex path="/" />
      <DraftOrderDetails path=":id" />
    </Router>
  )
}

export default DraftOrders
