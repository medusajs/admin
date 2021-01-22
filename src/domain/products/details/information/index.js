import React, { useEffect, useState } from "react"
import { Flex, Box } from "rebass"
import { useForm } from "react-hook-form"

import Medusa from "../../../../services/api"

import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import TextArea from "../../../../components/textarea"
import ImageUpload from "../../../../components/image-upload"
import Spinner from "../../../../components/spinner"

const Information = ({ isLoading, product, onSubmit, onDelete }) => {
  const { register, reset, handleSubmit } = useForm()
  const [thumbnail, setThumbnail] = useState("")

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        thumbnail: product.thumbnail,
        description: product.description,
      })
      setThumbnail(product.thumbnail)
    }
  }, [product])

  const dropdownOptions = [
    {
      variant: "danger",
      label: "Delete product",
      onClick: () => onDelete(),
    },
  ]

  const onImageChange = e => {
    if (e.target.files.length > 0) {
      Medusa.uploads.create(e.target.files).then(({ data }) => {
        const uploaded = data.uploads.map(({ url }) => url)
        console.log(uploaded)
        setThumbnail(uploaded[0])
      })
    }
  }

  const handleOnSubmit = data => {
    const updateData = {
      ...data,
    }

    if (thumbnail) {
      updateData.thumbnail = thumbnail
    }

    console.log(updateData)

    onSubmit(updateData)
  }

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Card as="form" onSubmit={handleSubmit(handleOnSubmit)} mb={2}>
      <Card.Header dropdownOptions={dropdownOptions}>
        Product Information
      </Card.Header>
      <Card.Body px={3} flexDirection="column">
        <Flex width={1} flexDirection={"column"}>
          <Box mb={3} width={1 / 2}>
            <Input name="title" label="Name" ref={register} />
          </Box>
          <Box width={1 / 2}>
            <Input
              name="description"
              label="Description"
              ref={register}
              minHeight="120px"
            />
          </Box>
        </Flex>
        <Flex mb={3}>
          <ImageUpload
            onChange={onImageChange}
            name="files"
            label="Thumbnail"
            value={thumbnail}
          />
        </Flex>
      </Card.Body>
      <Card.Footer px={3} justifyContent="flex-end">
        <Button variant={"cta"} type="submit">
          Save
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default Information
