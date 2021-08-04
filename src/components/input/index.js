import styled from "@emotion/styled"
import { Input, Label } from "@rebass/forms"
import React from "react"
import { Flex, Text } from "rebass"
import InfoTooltip from "../info-tooltip"
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

export const StyledLabel = styled.div`
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
      onFocus,
      textAlign,
      disabled,
      withTooltip = false,
      tooltipText,
      tooltipProps = {},
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
            alignItems="center"
            display={props.start ? "flex" : inline && "inline !important"}
          >
            <StyledLabel
              required={required}
              inline={inline}
              boldLabel={boldLabel}
            >
              {label}
            </StyledLabel>
            {withTooltip ? (
              <InfoTooltip
                pb="10px"
                ml={2}
                tooltipText={tooltipText}
                {...tooltipProps}
              />
            ) : null}
          </Label>
        )}
        <StyledInput
          ref={ref}
          defaultValue={defaultValue}
          autoComplete="off"
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
          onFocus={onFocus}
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
