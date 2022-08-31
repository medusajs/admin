import React from "react"
import { nestedForm, NestedForm } from "../../../../../utils/nested-form"
import CustomsForm, { CustomsPayload } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"

export type VariantShippingFormType = {
  dimensions: DimensionsFormType
  customs: CustomsPayload
}

type Props = {
  form: NestedForm<VariantShippingFormType>
}

const VariantShippingForm = ({ form }: Props) => {
  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        To start selling, all you need is a title, price, and image.
      </p>
      <div className="mt-large">
        <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3>
        <p className="inter-base-regular text-grey-50 mb-large">
          Configure to calculate the most accurate shipping rates
        </p>
        <DimensionsForm form={nestedForm(form, "dimensions")} />
      </div>
      <div className="mt-xlarge">
        <h3 className="inter-base-semibold mb-2xsmall">Customs</h3>
        <p className="inter-base-regular text-grey-50 mb-large">
          Configure to calculate the most accurate shipping rates
        </p>
        <CustomsForm form={nestedForm(form, "customs")} />
      </div>
    </div>
  )
}

export default VariantShippingForm
