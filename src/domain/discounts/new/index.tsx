import { Discount } from "@medusajs/medusa"
import { useLocation } from "@reach/router"
import React from "react"
import DiscountForm from "./discount-form"
import { DiscountFormProvider } from "./discount-form/form/discount-form-context"

const New: React.FC = () => {
  const location = useLocation()
  const toDuplicate = location?.state?.discount as Discount | undefined

  return (
    <div className="pb-xlarge">
      <DiscountFormProvider>
        <DiscountForm discount={toDuplicate} />
      </DiscountFormProvider>
    </div>
  )
}

export default New
