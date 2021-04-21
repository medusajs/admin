import React, { useEffect, useState, useRef } from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"
import Typography from "../typography"

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

  &::placeholder {
    opacity: 0.2;
  }
`

const TagInput = ({ onChange, values, ...props }) => {
  const [isFocused, setFocused] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const containerRef = useRef()
  const inputRef = useRef()

  const handleKeyDown = e => {
    const value = inputRef.current.value

    switch (e.keyCode) {
      case ARROW_LEFT_KEY:
        if (highlighted !== -1) {
          if (highlighted > 0) {
            setHighlighted(highlighted - 1)
          }
        } else if (!inputRef.current.selectionStart) {
          setHighlighted(values.length - 1)
          e.preventDefault()
        }
        break
      case ARROW_RIGHT_KEY:
        if (highlighted !== -1) {
          if (highlighted < values.length - 1) {
            setHighlighted(highlighted + 1)
            e.preventDefault()
          } else {
            setHighlighted(-1)
          }
        }
        break
      case ENTER_KEY: // Fall through
        e.preventDefault()
      case TAB_KEY:
        if (value) {
          onChange([...values, value])
          inputRef.current.value = ""
          e.preventDefault()
        }
        break

      case BACKSPACE_KEY:
        if (!inputRef.current.selectionStart && highlighted === -1) {
          setHighlighted(values.length - 1)
          e.preventDefault()
        }
        if (highlighted !== -1) {
          const newValues = [...values]
          newValues.splice(highlighted, 1)
          onChange(newValues)
          setHighlighted(-1)
        }
        break
      default:
        setHighlighted(-1)
    }
  }

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

  const handleInput = e => {
    const value = inputRef.current.value
    if (value.endsWith(",")) {
      onChange([...values, value.slice(0, -1)])
      inputRef.current.value = ""
    }
  }

  return (
    <Flex
      fontSize={1}
      alignItems="center"
      className={isFocused ? "tag__focus" : ""}
      focused={isFocused}
      variant="forms.input"
      style={{ position: "relative" }}
    >
      {values.map((v, index) => (
        <TagBox
          key={index}
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
        placeholder={!values.length ? props.placeholder : ""}
        type="text"
      />
    </Flex>
  )
}

export default TagInput
