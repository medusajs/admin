import React, { useEffect, useState, useRef } from "react"
import { Text, Flex, Image } from "rebass"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"
import Button from "../button"

const StyledLabel = styled.div`
  ${Typography.Base}
  padding-bottom: 10px;

  ${props =>
    props.boldLabel &&
    `
    font-weight: 500;
  `}
`

const StyledButton = styled(Text)`
  input {
    display: none;
  }
`

const Container = styled(Flex)`
  cursor: pointer;
  border-radius: 5px;
  border: 1px dashed ${props => props.theme.colors.placeholder};
  width: ${props => (props.width ? props.width : "150px")};
  height: ${props => (props.height ? props.height : "150px")};

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

const ImageUpload = ({
  label,
  boldLabel,
  name,
  button,
  onChange,
  value,
  height,
  width,
}) => {
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

    handleUnhighlight(e)
  }

  return (
    <Flex flexDirection="column">
      <Label htmlFor={name}>
        <StyledLabel boldLabel={boldLabel}>{label}</StyledLabel>
      </Label>
      {button ? (
        <StyledButton onClick={handleFocus} variant={"buttons.link"}>
          <input
            multiple
            ref={inputRef}
            onChange={onChange}
            name={name}
            type="file"
            accept="image/*"
          />
          Upload more
        </StyledButton>
      ) : (
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
          width={width}
          height={height}
        >
          <input
            multiple
            ref={inputRef}
            onChange={onChange}
            name={name}
            type="file"
            accept="image/*"
          />
          {value ? (
            <Image
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
              src={value}
            />
          ) : (
            <div>Upload</div>
          )}
        </Container>
      )}
    </Flex>
  )
}

export default ImageUpload
