import { RouteComponentProps, Router } from "@reach/router"
import React, { useState } from "react"
import Fade from "../../components/atoms/fade-wrapper"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import DiscountTable from "../../components/templates/discount-table"
import Details from "./details"
import New from "./new"
import DiscountForm from "./new/discount-form"
import { DiscountFormProvider } from "./new/discount-form/form/discount-form-context"

const DiscountIndex: React.FC<RouteComponentProps> = () => {
  const [isOpen, setIsOpen] = useState(false)

  const actionables = [
    {
      label: "Add Discount",
      onClick: () => setIsOpen(true),
      icon: <PlusIcon size={20} />,
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["discounts"]} />}
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
