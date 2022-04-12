import React from "react"
import InputField from "../../../../components/molecules/input"

const General = () => {
  return (
    <div className="flex flex-col gap-y-small mt-5">
      <InputField label="Name" required placeholder="B2B, Black Friday..." />
      <InputField
        label="Description"
        placeholder="For our business partners..."
      />
    </div>
  )
}

export default General
