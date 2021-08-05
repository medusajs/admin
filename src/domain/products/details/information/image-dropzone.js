import styled from "@emotion/styled"
import React from "react"
import { useDropzone } from "react-dropzone"
import { Box, Image, Text } from "rebass"

const StyledImageCard = styled(Image)`
  height: 255px;
  width: 255px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  cursor: pointer;

  object-fit: cover;

  border-radius: 3px;
`

const Overlay = `
  &:after {
    cursor: pointer;
    display: flex;
    color: #454B54;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 14px;
    content: "Drop here to replace thumbnail";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 99;
    background-color: rgba(255,255,255,0.85)
  }
`

const Container = styled(Box)`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  ${props => (props.noImages ? "min-height: 300px;" : "")}
  border-width: 2px;
  border-radius: 5px;
  border-color: ${props => (props.showDropClues ? "#89959c" : "transparent")};
  border-style: dashed;
  background-color: rgba(255, 255, 255, 0.85);
  color: #bdbdbd;
  outline: none;
  transition: border 0.1s ease-in-out;
  &:hover {
    border-color: #89959c;
  }
  ${props => (props.showDropClues ? Overlay : "")}
`

const SingleImageDropzone = ({ value = null, onChange, label, ...props }) => {
  const {
    isDragAccept,
    isDragActive,
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      const newImages = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      onChange(newImages)
    },
    maxFiles: 1,
  })

  return (
    <Box>
      <Text mb={2} fontWeight={700} fontSize="14px">
        {label}
      </Text>
      <Container
        p={2}
        {...getRootProps({
          isDragAccept,
          isDragActive,
          noImage: !value,
          showDropClues: isDragActive || !value,
        })}
      >
        <input {...getInputProps()} />
        <StyledImageCard src={value} {...props} />
      </Container>
    </Box>
  )
}

export default SingleImageDropzone
