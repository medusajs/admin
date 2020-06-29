import React from "react"
import { Input, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledInput = styled(Input)`
  ${Typography.Base}
`

const StyledLabel = styled.div`
  ${Typography.Base}
  padding-bottom: 10px;
`

const InputField = React.forwardRef(
  ({ placeholder, label, name, ...props }, ref) => {
    return (
      <>
        {label && (
          <Label htmlFor={name}>
            <StyledLabel>{label}</StyledLabel>
          </Label>
        )}
        <StyledInput
          ref={ref}
          variant="input"
          name={name}
          placeholder={placeholder ? placeholder : "Placeholder"}
          {...props}
        />
      </>
    )
  }
)

export default InputField
