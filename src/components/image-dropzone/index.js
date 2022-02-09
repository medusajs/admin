import styled from "@emotion/styled"
import React from "react"
import { useDropzone } from "react-dropzone"
import { Box, Flex, Image } from "rebass"

const StyledImageCard = styled(Image)`
  cursor: default;
  height: 240px;
  width: 240px;
  border: ${(props) => (props.selected ? "1px solid #53725D" : "none")};
  object-fit: cover;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  border-radius: 3px;
  &:hover {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.2) 0px 5px 9px 0px;
  }
`

const Overlay = `
  &:after {
    cursor: pointer;
    display: flex;
    color: #454B54;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 18px;
    content: ${(props) =>
      props.noImages
        ? '"Drop here to add images or click to browse files"'
        : '"Drop here to add images"'};
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
  ${(props) => (props.noImages ? "min-height: 300px;" : "")};
  border-width: 2px;
  border-radius: 5px;
  border-color: ${(props) =>
    props.showDropClues || props.noImages ? "#89959c" : "transparent"};
  border-style: dashed;
  background-color: rgba(255, 255, 255, 0.85);
  color: #bdbdbd;
  outline: none;
  transition: border 0.1s ease-in-out;
  padding-top: 12px;
  cursor: pointer;

  &:after {
    display: ${(props) => (props.showDropClues ? "flex" : "none")};
    cursor: pointer;
    color: #454b54;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 18px;
    content: ${(props) =>
      props.noImages ? `"${props.clues.empty}"` : `"${props.clues.onDrag}"`};
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 40;
    background-color: ${(props) =>
      props.noImages ? "#F5F7FA" : "rgba(255, 255, 255, 0.85)"};
  }
`

const Preview = ({ component, children, ...props }) => {
  const Component = component || StyledImageCard
  return (
    <Flex mr={3} mb={3} sx={{ position: "relative" }}>
      <Component {...props} />
      {children}
    </Flex>
  )
}

const ImagesDropzone = ({
  multiple,
  onChange,
  images = [],
  value = [],
  clues = {
    onDrag: "Drop here to add images",
    empty: "Drop here to add images or click to browse files",
  },
  dropzoneOptions = {},
  children,
  ...props
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
  } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      onChange(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      )
    },
    ...dropzoneOptions,
  })

  return (
    <Container
      {...getRootProps({
        isDragAccept,
        isDragActive,
        noImages: images.length === 0,
        showDropClues: isDragActive || images.length === 0,
        clues,
      })}
    >
      <input
        {...getInputProps({
          multiple: true,
        })}
      />
      {children}
    </Container>
  )
}

ImagesDropzone.Preview = Preview

export default ImagesDropzone
