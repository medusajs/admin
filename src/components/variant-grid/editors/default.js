import React from "react"

import { InputField } from "../elements"

const DefaultEditor = React.forwardRef(
  ({ onKeyDown, name, value, onChange }, ref) => {
    const handleChange = e => {
      const element = e.target
      onChange(element.value)
    }

    return (
      <InputField
        ref={ref}
        onKeyDown={onKeyDown}
        value={value || ""}
        onChange={handleChange}
      />
    )
  }
)

export default DefaultEditor
