import { RouteComponentProps } from "@reach/router"
import React from "react"
import CreatePriceListForm from "./pricing-form"
import { CreatePriceListFormProvider } from "./pricing-form/form/pricing-form-context"

const New: React.FC<RouteComponentProps> = () => {
  return (
    <CreatePriceListFormProvider onSubmit={(v) => console.log(v)}>
      <CreatePriceListForm />
    </CreatePriceListFormProvider>
  )
}

export default New
