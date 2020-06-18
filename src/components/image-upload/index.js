import React, { useEffect, useState, useRef } from "react"
import { Flex } from "rebass"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"

const StyledLabel = styled.div`
  ${Typography.Base}
  padding-bottom: 10px;
`

const Wrap = styled(Flex)``

const Container = styled(Flex)`
  cursor: pointer;
  border-radius: 3px;
  border: 1px dashed ${props => props.theme.colors.placeholder};
  width: 150px;
  height: 150px;

  input {
    display: none;
  }

  ${props =>
    props.showFocus &&
    `
    box-shadow: ${props.theme.shadows.inputBoxShadowHover};
    `}

  &:focus {
    outline: none;
    box-shadow: ${props => props.theme.shadows.inputBoxShadowHover};
  }

  &:hover {
    color: ${props => props.theme.colors.dark};
    border-color: ${props => props.theme.colors.dark};
  }
`

const ImageUpload = ({ label, name }) => {
  const [focus, setFocus] = useState(false)
  const dropRef = useRef()
  const inputRef = useRef()

  const handleHighlight = e => {
    e.stopPropagation()
    e.preventDefault()

    e.dataTransfer.dropEffect = "copy"

    setFocus(true)
  }

  const handleUnhighlight = e => {
    e.stopPropagation()
    e.preventDefault()
    console.log(e)
    setFocus(false)
  }

  const handleFocus = () => {
    inputRef.current.click()
  }

  const handleDrop = e => {
    e.stopPropagation()
    e.preventDefault()

    const transfer = e.dataTransfer
    const files = transfer.files

    console.log(files)

    handleUnhighlight()
  }

  return (
    <Flex flexDirection="column">
      <Label htmlFor={name}>
        <StyledLabel>{label}</StyledLabel>
      </Label>
      <Container
        onDrop={handleDrop}
        onDragEnter={handleHighlight}
        onDragOver={handleHighlight}
        onDragLeave={handleUnhighlight}
        showFocus={focus}
        onClick={handleFocus}
        tabIndex="0"
        fontSize={1}
        color={"placeholder"}
        justifyContent="center"
        alignItems="center"
      >
        <input ref={inputRef} name={name} type="file" accept="image/*" />
        <div>Upload</div>
      </Container>
    </Flex>
  )
}

export default ImageUpload
