import React from "react"
import DefaultEditor from "./default"
import OptionEditor from "./option"
import PricesEditor from "./prices"

const GridEditor = React.forwardRef(
  ({ column, value, index, onChange, ...rest }, ref) => {
    if (column.editor === "prices") {
      return (
        <PricesEditor
          ref={ref}
          value={value}
          onChange={(value) => onChange(index, column.field, value)}
          index={index}
          {...rest}
        />
      )
    }

    if (column.editor === "option") {
      return (
        <OptionEditor
          ref={ref}
          optionId={column.option_id}
          value={value}
          onChange={(value) => onChange(index, column.field, value)}
          {...rest}
        />
      )
    }

    return (
      <DefaultEditor
        ref={ref}
        value={value}
        onChange={(value) => onChange(index, column.field, value)}
        {...rest}
      />
    )
  }
)

export default GridEditor
