import React, { useEffect, useState } from "react"
import { Flex, Box, Text } from "rebass"
import { useForm } from "react-hook-form"

import Creatable from "react-select/creatable"
import Select from "react-select"
import Medusa from "../../../../services/api"
import styled from "@emotion/styled"

import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import ImageUpload from "../../../../components/image-upload"
import Spinner from "../../../../components/spinner"
import useMedusa from "../../../../hooks/use-medusa"
import TagInput from "../../../../components/tag-input"

const StyledCreatableSelect = styled(Creatable)`
  font-size: 14px;
  color: #454545;

  .css-yk16xz-control 
    box-shadow: none;
  }
`

const StyledSelect = styled(Select)`
  font-size: 14px;
  color: #454545;
`

const Information = ({ isLoading, product, onSubmit, onDelete }) => {
  const { register, reset, handleSubmit } = useForm()
  const [thumbnail, setThumbnail] = useState("")
  const [type, setSelectedType] = useState(null)
  const [types, setTypes] = useState([])
  const [collection, setCollection] = useState(null)
  const [frequentTags, setFrequentTags] = useState([])
  const [tags, setTags] = useState([])
  const [allCollections, setAllCollections] = useState([])
  const { collections, isLoading: isLoadingCollections } = useMedusa(
    "collections"
  )

  const fetchTypes = async () => {
    const productTypes = await Medusa.products
      .listTypes()
      .then(({ data }) => data.types)

    setTypes(productTypes)
  }

  const fetchTags = async () => {
    const productTags = await Medusa.products
      .listTagsByUsage()
      .then(({ data }) => data.tags)

    setFrequentTags(productTags)
  }

  useEffect(() => {
    if (product) {
      reset({
        title: product.title,
        thumbnail: product.thumbnail,
        description: product.description,
        handle: product.handle,
      })

      if (product.type) {
        setSelectedType({
          value: product.type.value,
          label: product.type.value,
        })
      }

      if (product.collection) {
        setCollection({
          value: product.collection.id,
          label: product.collection.title,
        })
      }

      if (product.tags) {
        const productTags = product.tags.map(tag => tag.value)

        setTags(productTags)
      }
      setThumbnail(product.thumbnail)
    }
  }, [product])

  useEffect(() => {
    fetchTags()
    fetchTypes()
  }, [])

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

    if (type === null) {
      updateData.type = null
    }

    if (type) {
      updateData.type = {
        value: type.label,
      }
    }

    if (tags) {
      updateData.tags = tags.map(t => ({ value: t }))
    }

    if (collection === null) {
      updateData.collection_id = null
    }

    if (collection) {
      const coll = collections.find(c => c.id === collection.value)
      if (coll) {
        updateData.collection_id = coll.id
      }
    }

    onSubmit(updateData)
  }

  const handleTypeChange = selectedOption => {
    setSelectedType(selectedOption)
  }

  const handleCollectionChange = selectedOption => {
    setCollection(selectedOption)
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
          <Box mb={3} width={1 / 2}>
            <Input
              name="handle"
              label="Handle"
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
              values={tags || []}
              onChange={values => handleTagChange(values)}
              boldLabel={"true"}
            />
            {frequentTags?.length ? (
              <Flex mt={1}>
                <Text mr={2} fontSize="10px">
                  Frequently used tags:{" "}
                </Text>
                <Text fontSize="10px">
                  {frequentTags.map(t => t.value).join(", ")}
                </Text>
              </Flex>
            ) : null}
          </Box>
          <Box width={1 / 2} mb={3}>
            <Text fontSize={1} mb={2} fontWeight="500">
              Type
            </Text>
            <StyledCreatableSelect
              value={type ? { value: type.value, label: type.value } : null}
              placeholder="Select type..."
              onChange={handleTypeChange}
              isClearable={true}
              options={
                types?.map(typ => ({
                  value: typ.value,
                  label: typ.value,
                })) || []
              }
              label="Type"
            />
          </Box>
          <Box width={1 / 2} mb={3}>
            <Text fontSize={1} mb={1} fontWeight="500">
              Collection
            </Text>
            <StyledSelect
              isClearable={true}
              value={collection}
              placeholder="Select collection..."
              onChange={handleCollectionChange}
              options={
                collections?.map(col => ({
                  value: col.id,
                  label: col.title,
                })) || []
              }
            />
          </Box>
        </Flex>
        <Flex mb={3}>
          <ImageUpload
            boldLabel={true}
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
