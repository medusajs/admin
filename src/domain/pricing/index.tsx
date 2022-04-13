import { RouteComponentProps, Router } from "@reach/router"
import { navigate } from "gatsby"
import React from "react"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import PricingDetails from "./details"
import New from "./new"
import PricingTable from "./pricing-table"

const PricingIndex: React.FC<RouteComponentProps> = () => {
  const actionables = [
    {
      label: "Add price list",
      onClick: () => navigate(`/a/pricing/new`),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["Price lists"]} />}
        >
          <PricingTable />
        </BodyCard>
      </div>
    </div>
  )
}

const Pricing = () => {
  return (
    <Router>
      <PricingIndex path="/" />
      <PricingDetails path="/:id" />
      <New path="/new" />
    </Router>
  )
}

export default Pricing
