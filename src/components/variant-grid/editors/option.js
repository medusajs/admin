import React from "react"

import { InputField } from "../elements"

const OptionEditor = React.forwardRef(
  ({ onKeyDown, optionId, value, onChange }, ref) => {
    const editIndex = value.findIndex(val => optionId === val.option_id)
    let inputVal = ""
    if (editIndex !== -1) {
      inputVal = value[editIndex].value
    }

    const handleChange = e => {
      const element = e.target
      const newValue = [...value]
      newValue[editIndex] = {
        ...newValue[editIndex],
        option_id: optionId,
        value: element.value,
      }

      onChange(newValue)
    }

    return (
      <InputField
        ref={ref}
        name
        onKeyDown={onKeyDown}
        value={inputVal}
        onChange={handleChange}
      />
    )
  }
)

export default OptionEditor
