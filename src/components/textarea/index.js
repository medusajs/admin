import React from "react"
import { Textarea, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledTextArea = styled(Textarea)`
  ${Typography.Base}
`

const StyledLabel = styled.div`
  ${Typography.Base}
  padding-bottom: 10px;
`

const TextArea = ({ ref, placeholder, label, name, ...props }) => {
  return (
    <>
      {label && (
        <Label htmlFor={name}>
          <StyledLabel>{label}</StyledLabel>
        </Label>
      )}
      <StyledTextArea
        ref={ref}
        variant="textarea"
        name={name}
        placeholder={placeholder ? placeholder : "Placeholder"}
        {...props}
      />
    </>
  )
}

export default TextArea
