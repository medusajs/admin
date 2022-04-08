import { Router } from "@reach/router"
import React, { useState } from "react"
import Fade from "../../components/atoms/fade-wrapper"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import PromotionsTable from "../../components/templates/promotion-table"
import Details from "./details"
import PromotionForm from "./promotion-form"
import { PromotionFormProvider } from "./promotion-form/form/promotion-form-context"
import New from "./new"

const PromotionIndex = () => {
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
          <PromotionsTable />
        </BodyCard>
      </div>
      <PromotionFormProvider>
        <Fade isVisible={isOpen} isFullScreen={true}>
          <PromotionForm closeForm={() => setIsOpen(false)} />
        </Fade>
      </PromotionFormProvider>
    </div>
  )
}

const Promotions = () => {
  return (
    <Router>
      <PromotionIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Promotions
