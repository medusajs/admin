import React, { useState, useRef } from "react"
import { Box } from "rebass"
import styled from "@emotion/styled"

const StyledInput = styled.input`
  width: 100%;
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

  return (
    <Box
      fontSize={1}
      className={isFocused ? "tag__focus" : ""}
      focused={isFocused}
      height="100%"
      variant="forms.input"
    >
      <StyledInput
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={inputRef}
        type="text"
      />
    </Box>
  )
}

export default TagInput
