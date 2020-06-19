import React, { useState, useRef } from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"
import Tag, { Cross } from "../tag"

const StyledInput = styled.input`
  width: 100%;
  height: 30px;
  background-color: transparent;
  border: none;
  margin: 2px 5px;
  &:focus {
    outline: none;
  }
`

const TagInput = ({ ...props }) => {
  const [values, setValues] = useState([])
  const [isFocused, setFocused] = useState(false)
  const containerRef = useRef()
  const inputRef = useRef()

  const handleBlur = () => {
    setFocused(false)
  }

  const handleFocus = () => {
    setFocused(true)
  }

  const handleInput = e => {
    if (e.keyCode === 9) {
      const value = inputRef.current.value
      setValues([...values, value])
      inputRef.current.value = ""
      e.preventDefault()
    }
    const value = inputRef.current.value
    if (value.endsWith(",")) {
      setValues([...values, value.slice(0, -1)])
      inputRef.current.value = ""
    }
  }

  return (
    <Box
      fontSize={1}
      className={isFocused ? "tag__focus" : ""}
      focused={isFocused}
      height="100%"
      variant="forms.input"
      style={{ position: "relative" }}
    >
      <Flex>
        {values.map(v => (
          <Tag px={1} m={1}>
            {v}
          </Tag>
        ))}
      </Flex>
      <StyledInput
        contentEditable={true}
        onInput={handleInput}
        onKeyDown={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={inputRef}
        type="text"
      />
    </Box>
  )
}

export default TagInput
