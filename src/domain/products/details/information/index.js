import styled from "@emotion/styled"
import { Checkbox, Label } from "@rebass/forms"
import React, { useEffect, useRef, useState } from "react"
import Collapsible from "react-collapsible"
import { useForm } from "react-hook-form"
import Select from "react-select"
import Creatable from "react-select/creatable"
import { Box, Flex, Text } from "rebass"
import { ReactComponent as ArrowDown } from "../../../../assets/svg/arrow-down.svg"
import { ReactComponent as ArrowUp } from "../../../../assets/svg/arrow-up.svg"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Divider from "../../../../components/divider"
import InfoTooltip from "../../../../components/info-tooltip"
import Input from "../../../../components/input"
import Spinner from "../../../../components/spinner"
import TagInput from "../../../../components/tag-input"
import TextArea from "../../../../components/textarea"
import Tooltip from "../../../../components/tooltip"
import useMedusa from "../../../../hooks/use-medusa"
import Medusa from "../../../../services/api"
import SingleImageDropzone from "./image-dropzone"

const StyledLabel = styled(Label)`
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  width: auto;
  cursor: pointer;
`

const TriggerElement = ({ label, icon, isOpen }) => {
  const colorOpened = "#453B54"
  const colorClosed = "#89959C"
  const color = isOpen ? colorOpened : colorClosed
  return (
    <Box mb={3}>
      <Box
        pb="2px"
        alignItems="center"
        display="inline-flex"
        sx={{
          color,
          cursor: "pointer",
          borderBottom: "1px solid transparent",
          "& *": { transition: "color 0.1s ease-out, fill 0.1s ease-out" },
          "&:hover *": !isOpen
            ? {
                fill: colorOpened,
                color: colorOpened,
              }
            : null,
          "& svg": { fill: color },
        }}
      >
        <Text mr="6px">{label}</Text>
        <Box>{icon}</Box>
      </Box>
    </Box>
  )
}

const StyledCreatableSelect = styled(Creatable)`
  font-size: 14px;
  color: #454545;

  border-radius: 3px;

  > div {
    border: none;
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;

    &:hover {
      outline: none;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    }
  }
`

const StyledSelect = styled(Select)`
  font-size: 14px;
  color: #454545;

  > div {
    border: none;
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 0%) 0px 0px 0px 0px;

    &:hover {
      outline: none;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    }
  }
`

const Information = ({ isLoading, product, onSubmit, onDelete }) => {
  const { register, reset, handleSubmit, formState } = useForm()
  const { isDirty: formDirty } = formState
  const [isDirty, setIsDirty] = useState(false)
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
  const resetAllFnRef = useRef(() => {})

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
      const resetAll = () => {
        reset({
          title: product.title,
          thumbnail: product.thumbnail,
          description: product.description,
          handle: product.handle,
          subtitle: product.subtitle,
          discountable: product.discountable,
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
        setIsDirty(false)
      }
      resetAllFnRef.current = resetAll
      resetAll()
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

  const onImageChange = images => {
    Medusa.uploads.create(images).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => url)
      setThumbnail(uploaded[0])
      setIsDirty(true)
    })
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
    setIsDirty(true)
  }

  const handleCollectionChange = selectedOption => {
    setCollection(selectedOption)
    setIsDirty(true)
  }

  const handleTagChange = newTags => {
    setTags(newTags)
    setIsDirty(true)
  }
  const handleProductStatusAction = () => {
    switch (product.status) {
      case "draft":
        return {
          type: "cta",
          label: "Publish",
          onClick: () => onSubmit({ status: "published" }),
          isLoading: isLoading,
        }
      case "published":
        return {
          type: "cta",
          label: "Unpublish",
          onClick: () => onSubmit({ status: "draft" }),
          isLoading: isLoading,
        }
      default:
        return null
    }
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
    <Card
      as="form"
      onSubmit={handleSubmit(handleOnSubmit)}
      onKeyDown={e => e.key === "Enter" && e.preventDefault()}
      mb={2}
    >
      <Card.Header
        dropdownOptions={dropdownOptions}
        // Check for product status prop. for backwards compatibility
        action={product?.status && handleProductStatusAction()}
      >
        Product Information
      </Card.Header>
      <Card.Body px={3}>
        <Box flexGrow="1" paddingRight={6}>
          <Flex width={1} flexDirection={"column"}>
            <Box mb={3}>
              <Input
                name="title"
                label="Name"
                ref={register}
                boldLabel={"true"}
              />
            </Box>
            <Box mb={3}>
              <Input
                name="subtitle"
                placeholder="subtitle"
                label="Subtitle"
                ref={register}
                boldLabel={"true"}
                withTooltip
                tooltipText="Subtitle of the product"
              />
            </Box>

            <Box mb={3}>
              <TextArea
                sx={{ "& div": { fontWeight: "500 !important" } }}
                resize="vertical"
                name="description"
                rows="3"
                label="Description"
                ref={register}
                boldLabel={"true"}
              />
            </Box>
            <Box mb={3}>
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
            <Box mb={3}>
              <Flex mb={2} alignItems="center">
                <Text mr={2} fontSize={1} fontWeight="500">
                  Handle
                </Text>
                <InfoTooltip tooltipText="URL Slug for the product" />
              </Flex>
              <Input name="handle" ref={register} boldLabel={"true"} />
            </Box>
            <Divider mb={3} />

            <Collapsible
              transitionTime={200}
              overflowWhenOpen="visible"
              triggerWhenOpen={
                <TriggerElement
                  isOpen
                  label="Hide additional details"
                  icon={<ArrowUp />}
                />
              }
              trigger={
                <TriggerElement
                  label="Show additional details"
                  icon={<ArrowDown />}
                />
              }
            >
              <Box mb={3}>
                <Flex mb={2} alignItems="center">
                  <Text mr={2} fontSize={1} fontWeight="500">
                    Tags (separated by comma)
                  </Text>
                  <InfoTooltip tooltipText="Tags are one word descriptors for the product used for searches" />
                </Flex>
                <TagInput
                  placeholder="Spring, summer..."
                  values={tags || []}
                  onChange={values => handleTagChange(values)}
                  boldLabel={"true"}
                  withTooltip
                  tooltipText="Subtitle of the product"
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
              <Box mb={3}>
                <Flex mb={2} alignItems="center">
                  <Text mr={2} fontSize={1} fontWeight="500">
                    Type
                  </Text>
                  <InfoTooltip tooltipText="Type of the product" />
                </Flex>
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
              <Box mb={3}>
                <StyledLabel
                  data-for="tooltip-discountable"
                  data-tip="Product can discounted"
                >
                  <Tooltip id="tooltip-discountable" />
                  <Checkbox ref={register} mr={1} name="discountable" />
                  Discountable
                </StyledLabel>
              </Box>
            </Collapsible>
          </Flex>
        </Box>
        <Flex pl={4} flexGrow="1" mb={3}>
          <SingleImageDropzone
            onChange={onImageChange}
            label="Thumbnail"
            value={thumbnail}
            height={255}
            width={255}
          />
        </Flex>
      </Card.Body>
      <Card.Footer
        sx={{
          opacity: isDirty || formDirty ? 1 : 0,
          visibility: isDirty || formDirty ? "visible" : "hidden",
          pointerEvents: isDirty || formDirty ? "inherit" : "none",
        }}
        px={3}
        justifyContent="flex-end"
      >
        <Button
          mr={2}
          variant="primary"
          type="button"
          onClick={() => {
            if (resetAllFnRef.current) {
              resetAllFnRef.current()
            }
          }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="deep-blue">
          Save
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default Information
