import { Discount } from "@medusajs/medusa"
import { RouteComponentProps } from "@reach/router"
import React from "react"
import DiscountForm from "./discount-form"
import { DiscountFormProvider } from "./discount-form/form/discount-form-context"
import { discountToFormValuesMapper } from "./discount-form/form/mappers"

type NewProps = RouteComponentProps<{
  location: { state: { discount?: Discount } }
}>

const New: React.FC<NewProps> = ({ location }) => {
  const toDuplicate = location?.state?.discount

  return (
    <div className="pb-xlarge">
      <DiscountFormProvider
        discount={
          toDuplicate ? discountToFormValuesMapper(toDuplicate) : undefined
        }
      >
        <DiscountForm discount={toDuplicate} />
      </DiscountFormProvider>
    </div>
  )
}

export default New
