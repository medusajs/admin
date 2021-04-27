import React from "react"
import { Text, Flex } from "rebass"
import { Input, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledInput = styled(Input)`
  ${Typography.Base}
  ${props =>
    props.inline &&
    `
  max-width: 350px;
  flex: 50% 0 0;
  `}
`

const StyledLabel = styled.div`
  ${Typography.Base}
  ${props =>
    props.boldLabel &&
    `
    font-weight: 500;
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

const InputField = React.forwardRef(
  (
    {
      invalid,
      placeholder,
      defaultValue,
      step,
      min,
      max,
      inline,
      label,
      boldLabel,
      name,
      type,
      inputStyle,
      required,
      value,
      deletable,
      onDelete,
      onChange,
      textAlign,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Flex
        alignItems={inline && "center"}
        flexDirection={inline ? "row" : "column"}
        width={props.width}
        {...props}
      >
        {label && (
          <Label
            flex={"30% 0 0"}
            htmlFor={name}
            display={props.start ? "flex" : inline && "inline !important"}
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
        <StyledInput
          ref={ref}
          defaultValue={defaultValue}
          inline={inline}
          textAlign={textAlign || "left"}
          variant={invalid ? "invalidInput" : "input"}
          name={name}
          type={type}
          min={min}
          max={max}
          sx={inputStyle}
          value={value}
          step={step || "1"}
          placeholder={placeholder ? placeholder : "Placeholder"}
          onChange={onChange}
          disabled={disabled}
        />
        {deletable && (
          <Text ml={2} onClick={onDelete} sx={{ cursor: "pointer" }}>
            &times;
          </Text>
        )}
      </Flex>
    )
  }
)

export default InputField
