import { Discount } from "@medusajs/medusa"
import { RouteComponentProps } from "@reach/router"
import { PageProps } from "gatsby"
import React from "react"
import DiscountForm from "../promotion-form"
import { PromotionFormProvider } from "../promotion-form/form/promotion-form-context"
import { discountToFormValuesMapper } from "../promotion-form/form/mappers"

type NewProps = RouteComponentProps<{
  location: { state: { discount?: Discount } }
}> &
  PageProps

const New: React.FC<NewProps> = ({ location }) => {
  const toDuplicate = location.state?.discount

  return (
    <div className="pb-xlarge">
      <PromotionFormProvider
        discount={
          toDuplicate ? discountToFormValuesMapper(toDuplicate) : undefined
        }
      >
        <DiscountForm discount={toDuplicate} />
      </PromotionFormProvider>
    </div>
  )
}

export default New
