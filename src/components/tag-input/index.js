import React, { useEffect, useState, useRef } from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const ENTER_KEY = 13
const BACKSPACE_KEY = 8

const Remove = styled.div`
  cursor: pointer;
  display: inline;
  padding-left: 5px;
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

const TagInput = ({ ...props }) => {
  const [values, setValues] = useState([])
  const [isFocused, setFocused] = useState(false)
  const containerRef = useRef()
  const inputRef = useRef()

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      const value = inputRef.current.value
      setValues([...values, value])
      inputRef.current.value = ""
    }

    if (e.keyCode === BACKSPACE_KEY) {
      // if last value hihglighted delete it
      // else Hightlight last of values
    }
  }

  const handleRemove = index => {
    const newValues = [...values]
    newValues.splice(index, 1)
    setValues(newValues)
  }

  const handleBlur = () => {
    setFocused(false)
  }

  const handleFocus = () => {
    setFocused(true)
  }

  return (
    <Flex
      fontSize={1}
      alignItems="center"
      className={isFocused ? "tag__focus" : ""}
      focused={isFocused}
      height="30px"
      variant="forms.input"
    >
      {values.map((v, index) => (
        <Box
          display="inline-block"
          lineHeight="1.5"
          my={1}
          ml={1}
          variant="badge"
        >
          {v}
          <Remove onClick={() => handleRemove(index)}>&times;</Remove>
        </Box>
      ))}
      <StyledInput
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        type="text"
      />
    </Flex>
  )
}

export default TagInput
