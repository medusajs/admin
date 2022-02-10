import _ from "lodash"
import React, { useEffect, useState } from "react"
import { Flex } from "rebass"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/close-rounded-bg.svg"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import ImagesDropzone from "../../../../components/image-dropzone"
import Medusa from "../../../../services/api"
import { getErrorMessage } from "../../../../utils/error-messages"

const Images = ({ product, refresh, notification }) => {
  const [uploads, setUploads] = useState([])
  const [images, setImages] = useState([])
  const [isSavingImages, setIsSavingImages] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    if (product) {
      let imgs = product.images.map((img) => img.url)
      imgs = [...new Set(imgs)].filter(Boolean)
      setImages([...imgs])
    }
  }, [product])

  const handleSave = () => {
    setIsSavingImages(true)
    Medusa.uploads
      .create(uploads)
      .then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        return uploaded
      })
      .then((uploadedImgs) => {
        const minusLocalImages = _.difference(
          images,
          uploads.map((u) => u.preview)
        )
        const allImages = [...minusLocalImages, ...uploadedImgs]
        Medusa.products
          .update(product.id, { images: allImages })
          .then(() => {
            setIsSavingImages(false)
            setUploads([])
            setIsDirty(false)
            refresh({ id: product.id })
            notification("Success", "Successfully saved images", "success")
          })
          .catch((error) =>
            notification("Error", getErrorMessage(error), "error")
          )
      })
  }

  return (
    <Card mb={2}>
      <Card.Header>Images</Card.Header>
      <Card.Body flexDirection="column" px={3}>
        <ImagesDropzone
          images={images}
          value={uploads}
          onChange={(files) => {
            setUploads([...uploads, ...files])
            const merged = [...images, ...files.map((f) => f.preview)]
            setImages(merged)
            setIsDirty(true)
          }}
        >
          {images.map((image) => (
            <ImagesDropzone.Preview
              key={image}
              onClick={(e) => {
                e.stopPropagation()
              }}
              sx={{ position: "relative" }}
              src={image}
            >
              <CloseIcon
                onClick={(e) => {
                  e.stopPropagation()
                  const newImages = images.filter((img) => image != img)
                  setImages(newImages)
                  const newUploads = uploads.filter(
                    (img) => image != img.preview
                  )
                  setUploads(newUploads)
                  setIsDirty(true)
                }}
                style={{
                  position: "absolute",
                  right: 5,
                  zIndex: 5,
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
