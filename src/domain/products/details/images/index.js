import _ from "lodash"
import React, { useEffect, useState } from "react"
import { Flex } from "rebass"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/close-rounded-bg.svg"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import ImagesDropzone from "../../../../components/image-dropzone"
import Medusa from "../../../../services/api"

const Images = ({ isLoading, product, refresh, toaster }) => {
  const [uploads, setUploads] = useState([])
  const [images, setImages] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [isSavingImages, setIsSavingImages] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const handleImageSelection = image => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(im => im !== image))
    } else {
      setSelectedImages(selectedImages => [...selectedImages, image])
    }
  }

  useEffect(() => {
    if (product) {
      let imgs = [product.thumbnail, ...product.images.map(img => img.url)]
      imgs = [...new Set(imgs)].filter(Boolean)
      setImages([...imgs])
    }
  }, [product])

  const handleImageDelete = () => {
    const newImages = _.difference(images, selectedImages)
    setSelectedImages([])
    setImages(newImages)
    setIsDirty(true)
  }

  const handleSave = () => {
    setIsSavingImages(true)
    Medusa.uploads
      .create(uploads)
      .then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        return uploaded
      })
      .then(uploadedImgs => {
        let minusLocalImages = _.difference(
          images,
          uploads.map(u => u.preview)
        )
        let allImages = [...minusLocalImages, ...uploadedImgs]
        Medusa.products
          .update(product.id, { images: allImages })
          .then(() => {
            setIsSavingImages(false)
            setSelectedImages([])
            setUploads([])
            setIsDirty(false)
            refresh({ id: product.id })
            toaster("Successfully saved images", "success")
          })
          .catch(() => toaster("Failed to upload images", "error"))
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
          }
        }
      >
        {selectedImages.length > 0
          ? `${selectedImages.length} image(s) selected`
          : "Images"}
      </Card.Header>
      <Card.Body flexDirection="column" px={3}>
        <ImagesDropzone
          images={images}
          value={uploads}
          onChange={files => {
            setUploads([...uploads, ...files])
            let merged = [...images, ...files.map(f => f.preview)]
            setImages(merged)
            setIsDirty(true)
          }}
        >
          {images.map(image => (
            <ImagesDropzone.Preview
              selected={selectedImages.includes(image)}
              onClick={e => {
                e.stopPropagation()
                handleImageSelection(image)
              }}
              sx={{ position: "relative" }}
              src={image}
            >
              <CloseIcon
                onClick={e => {
                  e.stopPropagation()
                  const newImages = images.filter(img => image != img)
                  setImages(newImages)
                  setIsDirty(true)
                }}
                style={{
                  position: "absolute",
                  right: 5,
                  top: 5,
                  cursor: "pointer",
                }}
              />
            </ImagesDropzone.Preview>
          ))}
        </ImagesDropzone>
        <Flex mt={3} justifyContent="flex-end">
          {isDirty && (
            <Button
              isLoading={isSavingImages}
              variant="deep-blue"
              onClick={handleSave}
            >
              Save
            </Button>
          )}
        </Flex>
      </Card.Body>
    </Card>
  )
}

export default Images
