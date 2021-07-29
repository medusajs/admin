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
  flex: 50% 0 0;
  `}
`

const StyledLabel = styled.div`
  ${Typography.Base};
  
  ${props =>
    props.boldLabel &&
    `
    font-weight: bold;
  `}
  
  ${props =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}
  
  ${props =>
    props.required &&
    `
  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
  `}
`

const TextArea = React.forwardRef(
  (
    {
      value,
      placeholder,
      inline,
      label,
      name,
      required,
      boldLabel,
      resize = "none",
      rows,
      cols,
      ...props
    },
    ref
  ) => {
    return (
      <Flex
        alignItems={inline && "start"}
        flexDirection={inline ? "row" : "column"}
        {...props}
      >
        {label && (
          <Label
            flex={"30% 0 0"}
            maxWidth={"200px"}
            htmlFor={name}
            display={inline && "inline !important"}
          >
            <StyledLabel
              required={required}
              inline={inline}
              boldLabel={boldLabel}
            >
              {label}
            </StyledLabel>
          </Label>
        )}
        <StyledTextArea
          minHeight={props.minHeight}
          inline={inline}
          ref={ref}
          value={value}
          variant="textarea"
          name={name}
          rows={rows}
          cols={cols}
          placeholder={placeholder ? placeholder : "Placeholder"}
          sx={{ resize }}
        />
      </Flex>
    )
  }
)

export default TextArea
