import React, { useEffect, useState, useRef } from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

const ENTER_KEY = 13
const TAB_KEY = 9
const BACKSPACE_KEY = 8

const Remove = styled.div`
  cursor: pointer;
  display: inline-block;
  padding-left: 5px;
`

const TextWrapper = styled.div`
  display: inline-block;
`

const TagBox = styled(Box)`
  white-space: nowrap;

  ${props =>
    props.highlighted &&
    `
      box-shadow: ${props.theme.shadows.tagBoxShadow};
  `}
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
  const [highlighted, setHighlighted] = useState(1000)
  const containerRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    if (highlighted) {
    }
  }, [highlighted])

  const handleKeyDown = e => {
    // Arrow left
    if (e.keyCode === 37 && highlighted !== 1000) {
      if (highlighted > 0) {
        setHighlighted(highlighted - 1)
      }
    }

    // Arrow right
    if (e.keyCode === 39 && highlighted !== 1000) {
      if (highlighted < values.length - 1) {
        setHighlighted(highlighted + 1)
      }
    }

    // Add to values
    if (e.keyCode === ENTER_KEY || e.keyCode === TAB_KEY) {
      const value = inputRef.current.value
      setValues([...values, value])
      inputRef.current.value = ""
      e.preventDefault()
    }

    // Focus last element if first time, second time delete
    if (e.keyCode === BACKSPACE_KEY) {
      if (!inputRef.current.value && highlighted === 1000) {
        setHighlighted(values.length - 1)
        e.preventDefault()
      }
      if (!inputRef.current.value && highlighted !== 1000) {
        const newValues = [...values]
        newValues.splice(highlighted, 1)
        setValues(newValues)
        setHighlighted(1000)
      }
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

  const handleInput = e => {
    const value = inputRef.current.value
    if (value.endsWith(",")) {
      setValues([...values, value.slice(0, -1)])
      inputRef.current.value = ""
    }
  }

  return (
    <Flex
      fontSize={1}
      alignItems="center"
      className={isFocused ? "tag__focus" : ""}
      focused={isFocused}
      height="30px"
      variant="forms.input"
      style={{ position: "relative" }}
    >
      {values.map((v, index) => (
        <TagBox
          lineHeight="1.5"
          my={1}
          ml={1}
          variant="badge"
          highlighted={index === highlighted}
        >
          <TextWrapper>{v}</TextWrapper>
          <Remove onClick={() => handleRemove(index)}>&times;</Remove>
        </TagBox>
      ))}
      <StyledInput
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onChange={handleInput}
        type="text"
      />
    </Flex>
  )
}

export default TagInput
