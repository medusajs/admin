import React from "react"
import { Flex } from "rebass"
import { Label, Select as RebassSelect } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledSelect = styled(RebassSelect)`
  ${Typography.Base}
  padding-right: 28px;
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
      value,
      onChange,
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
          variant="buttons.primary"
          name={name}
          width={"unset"}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.lable || option.value}
            </option>
          ))}
        </StyledSelect>
      </Flex>
    )
  }
)

export default Select
