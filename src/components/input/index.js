import React from "react"
import { Input } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledInput = styled(Input)`
  ${Typography.Base}
`

const InputField = ({ dark, placeholder }) => {
  return (
    <StyledInput
      variant="largeInput"
      width={350}
      height={30}
      placeholder={placeholder ? placeholder : "Placeholder"}
    />
  )
}

export default InputField
