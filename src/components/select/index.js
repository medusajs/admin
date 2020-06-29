import React from "react"
import { Select as RebassSelect } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledSelect = styled(RebassSelect)`
  ${Typography.Base}
`

const Select = ({ name = "", defaultValue = "", options = [], ...props }) => {
  return (
    <StyledSelect
      variant="dropdown"
      name={name}
      defaultValue={defaultValue}
      {...props}
    >
      {console.log(options)}
      {options.map(option => (
        <option key={option.key}>{option.value}</option>
      ))}
    </StyledSelect>
  )
}

export default Select
