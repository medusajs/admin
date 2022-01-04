import styled from "@emotion/styled"
import { Input, Label } from "@rebass/forms"
import React, { useEffect, useImperativeHandle, useRef, useState } from "react"
import InfoTooltip from "../info-tooltip"
import Typography from "../typography"
import MinusIcon from "../fundamentals/icons/minus-icon"
import PlusIcon from "../fundamentals/icons/plus-icon"

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
    const inputRef = useRef(null)
    useImperativeHandle(ref, () => inputRef.current)

    const onClickChevronUp = e => {
      inputRef.current?.stepUp()
      if (onChange) {
        inputRef.current?.dispatchEvent(
          new InputEvent("change", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
        )
      }
    }

    const onClickChevronDown = e => {
      inputRef.current?.stepDown()
      if (onChange) {
        inputRef.current?.dispatchEvent(
          new InputEvent("change", {
            view: window,
            bubbles: true,
            cancelable: false,
          })
        )
      }
    }

    return (
      <div
        className="bg-grey-5 inter-base-regular w-full p-3 flex flex-col cursor-text border border-grey-20 focus-within:shadow-input focus-within:border-violet-60 rounded-base my-4"
        onClick={() => inputRef?.current?.focus()}
        onMouseDown={e => e.preventDefault()}
        key={name}
        {...props}
      >
        {label && (
          <span className="w-full pb-1.5 font-semibold text-small leading-xsmall text-grey-50 after:content-[*] after:text-violet-50">
            {label}
            {withTooltip ? (
              <InfoTooltip
                pb="10px"
                ml={2}
                tooltipText={tooltipText}
                {...tooltipProps}
              />
            ) : null}
          </span>
        )}
        <div className="w-full flex mt-1">
          <input
            className="bg-inherit outline-0 w-full leading-small text-grey-90 font-normal caret-violet-60 placeholder-grey-40"
            ref={inputRef}
            defaultValue={defaultValue}
            autoComplete="off"
            name={name}
            key={name}
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

          {type === "number" && (
            <div className="flex self-end">
              <span
                onClick={onClickChevronDown}
                // onMouseDown={e => e.preventDefault()}
                className="mr-2 text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
              >
                <MinusIcon size={16} />
              </span>
              <span
                onClick={onClickChevronUp}
                // onMouseDown={e => e.preventDefault()}
                className="text-grey-50 w-4 h-4 hover:bg-grey-10 rounded-soft cursor-pointer"
              >
                <PlusIcon size={16} />
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)

export default InputField
