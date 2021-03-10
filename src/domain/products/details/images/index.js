import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import _ from "lodash"
import { Flex, Box, Image, Text } from "rebass"

import Medusa from "../../../../services/api"

import Card from "../../../../components/card"
import Spinner from "../../../../components/spinner"
import ImageUpload from "../../../../components/image-upload"

const StyledImageCard = styled(Image)`
  height: 150px;
  width: 150px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  cursor: pointer;

  object-fit: contain;

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

const Images = ({ isLoading, product, refresh, toaster }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [images, setImages] = useState([])
  const [isDeletingImages, setIsDeletingImages] = useState(false)

  const handleImageSelection = image => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(im => im !== image))
    } else {
      setSelectedImages(selectedImages => [...selectedImages, image])
    }
  }

  useEffect(() => {
    if (product) {
      const imgs = [product.thumbnail, ...product.images].filter(Boolean)
      setImages(imgs)
    }
  }, [product])

  const handleImageDelete = () => {
    setIsDeletingImages(true)
    const newImages = _.difference(images, selectedImages)

    Medusa.products
      .update(product.id, { images: newImages })
      .then(() => {
        setIsDeletingImages(false)
        setSelectedImages([])
        refresh()
        toaster("Successfully deleted images", "success")
      })
      .catch(() => toaster("Failed to deleted images", "error"))
    setIsDeletingImages(false)
  }

  const onImageChange = e => {
    Medusa.uploads
      .create(e.target.files)
      .then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        return uploaded[0]
      })
      .then(uploadedImage => {
        const all = [...images, uploadedImage]

        Medusa.products
          .update(product.id, { images: all })
          .then(() => {
            setIsDeletingImages(false)
            refresh({ id: product.id, search: { expand: "images" } })
            toaster("Successfully uploaded image", "success")
          })
          .catch(() => toaster("Failed to upload image", "error"))
      })
  }

  return (
    <Card mb={2}>
      <Card.Header
        action={
          selectedImages.length > 0 && {
            type: "delete",
            label: "Delete images",
            onClick: () => handleImageDelete(),
            isLoading: isDeletingImages,
          }
        }
      >
        {selectedImages.length > 0
          ? `${selectedImages.length} image(s) selected`
          : "Images"}
      </Card.Header>
      <Card.Body px={3}>
        <Flex>
          {images.map((img, i) => (
            <StyledImageCard
              key={i}
              m={2}
              src={img}
              selected={selectedImages.includes(img)}
              onClick={() => handleImageSelection(img)}
            />
          ))}
          <ImageUpload onChange={e => onImageChange(e)} name="files" />
        </Flex>
      </Card.Body>
    </Card>
  )
}

export default Images
