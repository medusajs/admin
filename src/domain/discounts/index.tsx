import React from "react"
import { Router } from "@reach/router"
import New from "./new"
import Details from "./details"
import { navigate } from "gatsby"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import DiscountTable from "../../components/templates/discount-table"

const DiscountIndex = () => {
  const actionables = [
    {
      label: "Add Discount",
      onClick: () => navigate(`/a/discounts/new`),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <PageDescription
        title={"Discounts"}
        subtitle={"Manage the discounts for your Medusa store"}
      />
      <div className="w-full flex flex-col grow">
        <BodyCard
          title="Overview"
          subtitle="See the overview of created discounts"
          actionables={actionables}
        >
          <div className="flex grow flex-col">
            <DiscountTable />
          </div>
        </BodyCard>
      </div>
    </div>
  )
}

const Discounts = () => {
  return (
    <Router className="h-full">
      <DiscountIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Discounts
