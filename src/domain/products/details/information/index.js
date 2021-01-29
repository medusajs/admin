import React, { useEffect, useState } from "react"
import { Flex, Box, Text } from "rebass"
import { useForm } from "react-hook-form"

import Creatable from "react-select"
import Medusa from "../../../../services/api"
import styled from "@emotion/styled"

import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import TextArea from "../../../../components/textarea"
import ImageUpload from "../../../../components/image-upload"
import Spinner from "../../../../components/spinner"
import useMedusa from "../../../../hooks/use-medusa"
import TagInput from "../../../../components/tag-input"
import Select from "../../../../components/select"

const StyledCreatableSelect = styled(Creatable)`
  font-size: 14px;
  color: #454545;

  > div {
    height: 33px;
  }
`

const Information = ({ isLoading, product, onSubmit, onDelete }) => {
  const { register, reset, handleSubmit } = useForm()
  const [thumbnail, setThumbnail] = useState("")
  const [type, setSelectedType] = useState(null)
  const [collection, setCollection] = useState({})
  const [tags, setTags] = useState([])
  const { collections, isLoading: isLoadingCollections } = useMedusa(
    "collections"
  )

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

    if (type) {
      updateData.type = {
        value: type.label,
      }
    }

    onSubmit(updateData)
  }

  const handleTypeChange = selectedOption => {
    setSelectedType(selectedOption)
  }

  const handleTagChange = newTags => {
    setTags(newTags)
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
            <Input
              name="title"
              label="Name"
              ref={register}
              boldLabel={"true"}
            />
          </Box>
          <Box width={1 / 2} mb={3}>
            <Input
              name="description"
              label="Description"
              ref={register}
              boldLabel={"true"}
            />
          </Box>
          <Box width={1 / 2} mb={3}>
            <Text fontSize={1} mb={2} fontWeight="500">
              Tags (separated by comma)
            </Text>
            <TagInput
              placeholder="Spring, summer..."
              values={product.tags || []}
              onChange={values => handleTagChange(values)}
              boldLabel={"true"}
            />
          </Box>
          <Box width={1 / 2} mb={3}>
            <Text fontSize={1} mb={2} fontWeight="500">
              Type
            </Text>
            <StyledCreatableSelect
              value={type || null}
              placeholder="Select type..."
              onChange={handleTypeChange}
              options={[{ value: "test", label: "test" }]}
              label="Type"
            />
          </Box>
          <Box width={1 / 2} mb={3}>
            <Text fontSize={1} mb={1} fontWeight="500">
              Collection
            </Text>
            <Select
              fontWeight="500"
              name="collection"
              options={[{ value: "test", label: "test" }]}
              // options={collections.map(({ title, id }) => ({
              //   value: id,
              //   label: title,
              // }))}
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
