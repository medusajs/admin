import React from "react"

import OptionEditor from "./option"
import DefaultEditor from "./default"

const GridEditor = React.forwardRef(
  ({ column, value, index, onChange, ...rest }, ref) => {
    if (column.editor === "option") {
      return (
        <OptionEditor
          ref={ref}
          optionId={column.option_id}
          value={value}
          onChange={value => onChange(index, column.field, value)}
          {...rest}
        />
      )
    }

    return (
      <DefaultEditor
        ref={ref}
        value={value}
        onChange={value => onChange(index, column.field, value)}
        {...rest}
      />
    )
  }
)

export default GridEditor
