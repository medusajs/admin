import React from "react"
import InputField from "../../../../components/molecules/input"
import { useCreatePriceListForm } from "../form/pricing-form-context"

const General = () => {
  const { register } = useCreatePriceListForm()
  return (
    <div className="flex flex-col gap-y-small mt-5">
      <InputField
        label="Name"
        name="name"
        required
        placeholder="B2B, Black Friday..."
        ref={register}
      />
      <InputField
        label="Description"
        name="description"
        placeholder="For our business partners..."
        ref={register}
      />
    </div>
  )
}

export default General
