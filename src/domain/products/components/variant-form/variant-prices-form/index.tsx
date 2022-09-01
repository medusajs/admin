import React from "react"
import { NestedForm } from "../../../../../utils/nested-form"
import PricesForm, { PricesFormType } from "../../prices-form"

type Props = {
  form: NestedForm<PricesFormType>
}

const VariantPricesForm = ({ form }: Props) => {
  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        To start selling, all you need is a title, price, and image.
      </p>
      <div className="pt-large">
        <PricesForm form={form} />
      </div>
    </div>
  )
}

export default VariantPricesForm
