import { Discount } from "@medusajs/medusa"
import { RouteComponentProps } from "@reach/router"
import { PageProps } from "gatsby"
import React from "react"
import PromotionForm from "../promotion-form"
import { PromotionFormProvider } from "../promotion-form/form/promotion-form-context"
import { promotionToFormValuesMapper } from "../promotion-form/form/mappers"

type NewProps = RouteComponentProps<{
  location: { state: { promotion?: Discount } }
}> &
  PageProps

const New: React.FC<NewProps> = ({ location }) => {
  const toDuplicate = location.state?.promotion

  return (
    <div className="pb-xlarge">
      <PromotionFormProvider
        promotion={
          toDuplicate ? promotionToFormValuesMapper(toDuplicate) : undefined
        }
      >
        <PromotionForm promotion={toDuplicate} />
      </PromotionFormProvider>
    </div>
  )
}

export default New
