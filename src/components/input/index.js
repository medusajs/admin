import React from "react"
import { Input } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledInput = styled(Input)`
  ${Typography.Base}
`

const InputField = ({ placeholder, ...props }) => {
  return (
    <StyledInput
      variant="input"
      placeholder={placeholder ? placeholder : "Placeholder"}
      {...props}
    />
  )
}

export default InputField
