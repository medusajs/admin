import React, { useEffect, useState, useRef } from "react"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"
import Select from "../select"

const ENTER_KEY = 13
const TAB_KEY = 9
const BACKSPACE_KEY = 8
const ARROW_LEFT_KEY = 37
const ARROW_RIGHT_KEY = 39

const Remove = styled.div`
  cursor: pointer;
  display: inline-block;
  padding-left: 5px;
`

const TextWrapper = styled(Text)`
  display: inline-block;
`

const CurrencyBox = styled(Box)`
  white-space: nowrap;
  color: gray;
`

const StyledInput = styled.input`
  ${Typography.Base}
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  padding: 8px;
  &:focus {
    outline: none;
  }
`

const TagInput = ({
  edit,
  currencyOptions,
  onCurrencySelected,
  onChange,
  currency,
  value,
  ...props
}) => {
  const [isFocused, setFocused] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef()
  const inputRef = useRef()

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
      fontSize={1}
      alignItems="center"
      className={isFocused ? "tag__focus" : ""}
      focused={isFocused}
      variant="forms.input"
      {...props}
    >
      <CurrencyBox
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
        ref={inputRef}
        value={value}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={onChange}
        type="number"
      />
    </Flex>
  )
}

export default TagInput
