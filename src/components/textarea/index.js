import React from "react"
import { Flex } from "rebass"
import { Textarea, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledTextArea = styled(Textarea)`
  ${Typography.Base}
  ${props =>
    props.inline &&
    `
  max-width: 350px;
  flex-grow: 1;
  `}
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

const TextArea = React.forwardRef(
  ({ placeholder, inline, label, name, ...props }, ref) => {
    return (
      <Flex
        alignItems={inline && "start"}
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
        <StyledTextArea
          inline={inline}
          ref={ref}
          variant="textarea"
          name={name}
          placeholder={placeholder ? placeholder : "Placeholder"}
        />
      </Flex>
    )
  }
)

export default TextArea
