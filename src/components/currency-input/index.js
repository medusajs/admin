import React, { useEffect, useState, useRef } from "react"
import { Box, Flex, Text } from "rebass"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"
import Select from "../select"

const TextWrapper = styled(Text)`
  display: inline-block;
`

const CurrencyBox = styled(Box)`
  white-space: nowrap;
  color: gray;
  ${props =>
    props.inline &&
    `
  max-width: 350px;
  flex-grow: 1;
  `}
`

const StyledInput = styled.input`
  ${Typography.Base}
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  padding: 8px;
  padding-left: 15px;
  &:focus {
    outline: none;
  }
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
  
  ${props =>
    props.required &&
    `
  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
  `}
`

const CurrencyInput = React.forwardRef(
  (
    {
      edit,
      name,
      label,
      inline,
      currencyOptions,
      onCurrencySelected,
      onChange,
      currency,
      removable,
      onRemove,
      value,
      required,
      fontSize,
      ...props
    },
    ref
  ) => {
    const [isFocused, setFocused] = useState(false)
    const [highlighted, setHighlighted] = useState(-1)
    const containerRef = useRef()

    const handleRemove = index => {
      const newValues = [...values]
      newValues.splice(index, 1)
      onChange(newValues)
    }

    const handleBlur = () => {
      setHighlighted(-1)
      setFocused(false)
    }

    const handleFocus = () => {
      setFocused(true)
    }

    const handleCurrencySelected = e => {
      const element = e.target
      onCurrencySelected(element.value)
    }

    return (
      <Flex
        alignItems={inline && "center"}
        flexDirection={inline ? "row" : "column"}
        {...props}
      >
        {label && (
          <Label
            flex={"30% 0 0"}
            maxWidth={"200px"}
            htmlFor={name}
            display={props.start ? "flex" : inline && "inline !important"}
          >
            <StyledLabel
              style={fontSize && { fontSize }}
              required={required}
              inline={inline}
            >
              {label}
            </StyledLabel>
          </Label>
        )}
        <Flex
          fontSize={1}
          flex={"50% 0 0"}
          alignItems="center"
          className={isFocused ? "tag__focus" : ""}
          focused={isFocused}
          variant="forms.input"
        >
          <CurrencyBox
            textAlign="center"
            width={"3.3rem"}
            mr={edit && currencyOptions.length > 0 && "28px"}
            lineHeight="1.5"
            my={1}
            ml={1}
          >
            {edit && currencyOptions.length > 0 ? (
              <Select
                inline
                width={"3.3rem"}
                value={currency}
                options={currencyOptions}
                onChange={handleCurrencySelected}
              />
            ) : (
              <TextWrapper>{currency}</TextWrapper>
            )}
          </CurrencyBox>
          <StyledInput
            ref={ref}
            name={name}
            value={value}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={onChange}
            step="0.01"
            type="number"
          />
        </Flex>
        {removable && (
          <Text ml={2} onClick={onRemove} sx={{ cursor: "pointer" }}>
            &times;
          </Text>
        )}
      </Flex>
    )
  }
)

export default CurrencyInput
