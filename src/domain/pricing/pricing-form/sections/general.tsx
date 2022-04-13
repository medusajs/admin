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
      tooltip="General information for the price list. A name is required."
      value="general"
    >
      <div className="flex flex-col gap-y-small mt-5">
        <InputField
          label="Name"
          name="name"
          required
          placeholder="B2B, Black Friday..."
          ref={register({ required: "Name is required" })}
        />
        <InputField
          label="Description"
          name="description"
          required
          placeholder="For our business partners..."
          ref={register({ required: "Description is required" })}
        />
      </div>
    </Accordion.Item>
  )
}

export default General
