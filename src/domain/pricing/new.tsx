import { RouteComponentProps } from "@reach/router"
import React from "react"
import PriceListForm from "./pricing-form"
import { PriceListFormProvider } from "./pricing-form/form/pricing-form-context"
import { ViewType } from "./pricing-form/types"

const New: React.FC<RouteComponentProps> = () => {
  return (
    <PriceListFormProvider>
      <PriceListForm viewType={ViewType.CREATE} />
    </PriceListFormProvider>
  )
}

export default New
