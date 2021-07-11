import React, { useEffect, useState, useRef } from "react"
import { Box, Flex, Text } from "rebass"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"
import Select from "../select"

const TextWrapper = styled(Flex)`
  margin-left: 8px;
  align-items: center;
`

const CurrencyBox = styled(Box)`
  white-space: nowrap;
  color: gray;
  margin-right: 0px;
  ${props =>
    props.inline &&
    `
  max-width: 350px;
  flex-grow: 1;
  `}

  border-right: 1px solid rgb(60 66 87 / 16%);
  min-width: 75px;
`

const StyledInput = styled.input`
  ${Typography.Base}
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  padding: 8px;
  // padding-left: 15px;
  &:focus {
    outline: none;
  }

  &::placeholder {
    opacity: 0.2;
  }
`

const StyledLabel = styled.div`
  ${Typography.Base};
  
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

const CurrencyInput = React.forwardRef(
  (
    {
      edit,
      name,
      label,
      boldLabel,
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
      placeholder,
      ...props
    },
    ref
  ) => {
    const [isFocused, setFocused] = useState(false)

    const handleRemove = index => {
      const newValues = [...values]
      newValues.splice(index, 1)
      onChange(newValues)
    }

    const handleBlur = () => {
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
        flexDirection={inline || removable ? "row" : "column"}
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
              boldLabel={boldLabel}
            >
              {label}
            </StyledLabel>
          </Label>
        )}
        <Flex
          fontSize={1}
          flex={removable ? "auto" : "50% 0 0"}
          alignItems="center"
          className={isFocused ? "tag__focus" : ""}
          focused={isFocused}
          variant="forms.input"
          height={props.height || "inherit"}
        >
          <CurrencyBox
            textAlign="center"
            width={"3.3rem"}
            mr={edit && currencyOptions.length > 0 && "28px"}
            lineHeight="1.5"
            height="100%"
            ml={1}
          >
            {edit && currencyOptions.length > 1 ? (
              <Select
                isCurrencyInput={true}
                inline
                width={"3.3rem"}
                height="100%"
                selectHeight="100%"
                value={currency}
                options={currencyOptions}
                onChange={handleCurrencySelected}
              />
            ) : (
              <TextWrapper
                marginTop={inline || !edit ? "0px" : "6px"}
                height="100%"
              >
                {currency.toUpperCase()}
              </TextWrapper>
            )}
          </CurrencyBox>
          <StyledInput
            ref={ref}
            name={name}
            value={value || null}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onChange={onChange}
            placeholder={placeholder || ""}
            step="0.01"
            type="number"
          />
        </Flex>
        {removable && (
          <Text ml={2} mt={1} onClick={onRemove} sx={{ cursor: "pointer" }}>
            &times;
          </Text>
        )}
      </Flex>
    )
  }
)

export default CurrencyInput
