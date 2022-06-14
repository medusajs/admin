import React from "react"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import { usePriceListForm } from "../form/pricing-form-context"

const General = () => {
  const { register } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      title="General"
      tooltip="General information for the price list."
      value="general"
    >
      <div className="flex flex-col gap-y-small group-radix-state-open:mt-5 accordion-margin-transition">
        <InputField
          label="Name"
          required
          placeholder="B2B, Black Friday..."
          {...register("name",{ required: "Name is required" })}
        />
        <InputField
          label="Description"
          required
          placeholder="For our business partners..."
          {...register("description",{ required: "Description is required" })}
        />
      </div>
    </Accordion.Item>
  )
}

export default General
