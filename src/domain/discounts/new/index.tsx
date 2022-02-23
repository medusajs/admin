import { RouteComponentProps } from "@reach/router"
import { PageProps } from "gatsby"
import React from "react"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import DiscountForm from "../discount-form"
import { DiscountFormProvider } from "../discount-form/form/discount-form-context"

type NewProps = RouteComponentProps<{
  location: { state: { discount?: any } }
}> &
  PageProps

const New: React.FC<NewProps> = ({ location }) => {
  const toDuplicate = location.state?.discount

  return (
    <div className="pb-xlarge">
      <Breadcrumb
        currentPage="Add Discount"
        previousBreadcrumb="Discount"
        previousRoute="/a/discounts"
      />
      <DiscountFormProvider discount={toDuplicate}>
        <DiscountForm discount={toDuplicate} />
      </DiscountFormProvider>
    </div>
  )
}

export default New
