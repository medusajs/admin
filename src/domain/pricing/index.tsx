import { Router } from "@reach/router"
import { navigate } from "gatsby"
import React from "react"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import PriceListTable from "../../components/templates/price-list-table"

const PricingIndex = () => {
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
          <PriceListTable />
        </BodyCard>
      </div>
    </div>
  )
}

const Products = () => {
  return (
    <Router>
      <PricingIndex path="/" />
    </Router>
  )
}

export default Products
