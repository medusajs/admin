import React from "react"
import { Flex } from "rebass"
import { Label, Select as RebassSelect } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledSelect = styled(RebassSelect)`
  ${Typography.Base}
`

const Select = ({
  name = "",
  label = "",
  defaultValue = "",
  options = [],
  ...props
}) => {
  return (
    <Flex>
      {label && <Label htmlFor={name}>{label}</Label>}
      <StyledSelect
        variant="dropdown"
        name={name}
        defaultValue={defaultValue}
        {...props}
      >
        {options.map(option => (
          <option key={option.key}>{option.value}</option>
        ))}
      </StyledSelect>
    </Flex>
  )
}

export default Select
