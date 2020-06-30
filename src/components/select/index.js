import React from "react"
import { Flex } from "rebass"
import { Label, Select as RebassSelect } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledSelect = styled(RebassSelect)`
  ${Typography.Base}
  max-width: 350px;
  flex-grow: 1;
`

const StyledLabel = styled.div`
  ${Typography.Base}
  ${props =>
    props.inline
      ? `
      text-align: right;
      padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}
`

const Select = React.forwardRef(
  (
    {
      name = "",
      label = "",
      defaultValue = "",
      options = [],
      inline,
      ...props
    },
    ref
  ) => {
    return (
      <Flex
        alignItems={inline && "center"}
        flexDirection={inline ? "row" : "column"}
        {...props}
      >
        {label && (
          <Label
            maxWidth={"200px"}
            htmlFor={name}
            display={inline && "inline !important"}
          >
            <StyledLabel inline={inline}>{label}</StyledLabel>
          </Label>
        )}
        <StyledSelect
          pr={4}
          variant="buttons.primary"
          name={name}
          ref={ref}
          defaultValue={defaultValue}
        >
          {options.map(option => (
            <option key={option.key}>{option.value}</option>
          ))}
        </StyledSelect>
      </Flex>
    )
  }
)

export default Select
