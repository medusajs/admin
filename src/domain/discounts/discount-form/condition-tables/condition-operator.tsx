import React from "react"
import RadioGroup from "../../../../components/organisms/radio-group"

const ConditionOperator = () => {
  return (
    <RadioGroup.Root
      onChange={console.log}
      className="grid grid-cols-2 gap-base mb-4"
    >
      <RadioGroup.Item
        className="w-full"
        label="In"
        value="in"
        description="Applies to the selected items."
      />
      <RadioGroup.Item
        className="w-full"
        label="Not in"
        value="not_in"
        description="Applies to all items except the selected items."
      />
    </RadioGroup.Root>
  )
}

export default ConditionOperator
