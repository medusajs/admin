import styled from "@emotion/styled"
import { Input, Label } from "@rebass/forms"
import React, { useImperativeHandle, useRef } from "react"
import { Flex, Text } from "rebass"
import InfoTooltip from "../info-tooltip"
import Typography from "../typography"

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
      start,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef()

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef?.current?.focus()
      },
    }))

    return (
      <div
        className="bg-grey-20 border focus-within:border-voilet-60 rounded-base cursor-text"
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        {label && (
          <Label
            flex={"30% 0 0"}
            htmlFor={name}
            alignItems="center"
            display={start ? "flex" : inline && "inline !important"}
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
        <input
          className="bg-inherit outline-0 w-full caret-violet-60"
          ref={inputRef}
          defaultValue={defaultValue}
          autoComplete="off"
          name={name}
          type={type}
          min={min}
          max={max}
          value={value}
          step={step || "1"}
          placeholder={placeholder ? placeholder : "Placeholder"}
          onChange={onChange}
          onFocus={onFocus}
          disabled={disabled}
        />
        {deletable && (
          <span onClick={onDelete} className="cursor-pointer ml-2">
            &times;
          </span>
        )}
      </div>
    )
  }
)

export default InputField
