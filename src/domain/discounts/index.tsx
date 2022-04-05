import { Router } from "@reach/router"
import { navigate } from "gatsby"
import React, { useState } from "react"
import Fade from "../../components/atoms/fade-wrapper"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import DiscountTable from "../../components/templates/discount-table"
import Details from "./details"
import DiscountForm from "./discount-form"
import { DiscountFormProvider } from "./discount-form/form/discount-form-context"
import New from "./new"

const DiscountIndex = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actionables = [
    {
      label: "Add Promotion",
      onClick: () => setIsOpen(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["promotions"]} />}
        >
          <DiscountTable />
        </BodyCard>
      </div>
      <DiscountFormProvider>
        <Fade isVisible={isOpen} isFullScreen={true}>
          <DiscountForm closeForm={() => setIsOpen(false)} />
        </Fade>
      </DiscountFormProvider>
    </div>
  )
}

const Discounts = () => {
  return (
    <Router>
      <DiscountIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Discounts
