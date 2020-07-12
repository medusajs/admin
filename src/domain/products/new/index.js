import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"
import { navigate } from "gatsby"

import Button from "../../../components/button"
import Pill from "../../../components/pill"
import Input from "../../../components/input"
import TagInput from "../../../components/tag-input"
import ImageUpload from "../../../components/image-upload"
import TextArea from "../../../components/textarea"
import VariantGrid from "../../../components/variant-grid"

import Medusa from "../../../services/api"

import { getCombinations } from "./utils/get-combinations"

const Cross = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 5px;
  cursor: pointer;
`

const ImageCardWrapper = styled(Box)`
  position: relative;
  display: inline-block;
  height: 200px;
  width: 200px;
`

const StyledImageCard = styled(Box)`
  height: 200px;
  width: 200px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  object-fit: contain;

  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;

  border-radius: 3px;
`

const StyledImageBox = styled(Flex)`
  flex-wrap: wrap;
  .img-container {
    border: 1px solid black;
    background-color: ${props => props.theme.colors.light};
    height: 50px;
    width: 50px;

    &:first-of-type {
      height: 230px;
      width: 100%;
      object-fit: contain;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`

const NewProduct = ({}) => {
  const [hasVariants, setHasVariants] = useState(true)
  const [variants, setVariants] = useState([])
  const [options, setOptions] = useState([])
  const [images, setImages] = useState([])
  const { register, handleSubmit, reset, setValue } = useForm()

  /**
   * Will be called everytime an option has changed. It will then recalculate
   * the combinations of variants that may exist.
   */
  useEffect(() => {
    const os = [...options]
    const combinations = getCombinations(os)

    const newVariants = combinations.map(optionValues => {
      if (!optionValues) {
        return null
      }

      const existing =
        variants.find(v =>
          v.options.every((value, index) => optionValues[index] === value)
        ) || {}

      existing.options = optionValues.filter(v => v !== "")

      return existing
    })

    setVariants(newVariants.filter(v => !!v))
  }, [options])

  /**
   * Updates one of the values in a option.
   */
  const updateOptionValue = (index, values) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      values,
    }

    setValue(`options[${index}].values`, values)
    setOptions(newOptions)
  }

  const updateOptionName = (e, index) => {
    const element = e.target
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      name: element.value,
    }

    setValue(`options[${index}].name`, element.value)
    setOptions(newOptions)
  }

  const handleRemoveOption = index => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleAddOption = e => {
    setOptions([
      ...options,
      {
        name: "",
        values: [],
      },
    ])
  }

  const parseProduct = data => {
    return {
      images,
      title: data.title,
      description: data.description,
      options: options.map(o => ({ title: o.name })),
      variants: variants.map(v => ({
        title: v.title,
        sku: v.sku,
        ean: v.ean,
        inventory_quantity: v.inventory,
        prices: [
          {
            currency_code: "DKK",
            amount: v.price,
          },
        ],
        options: v.options.map(o => ({ value: o })),
      })),
    }
  }

  const onAddMore = data => {
    const product = parseProduct(data)
    Medusa.products.create(product).then(({ data }) => {
      reset()
      setVariants([])
      setOptions([])
    })
  }

  const submit = data => {
    const product = parseProduct(data)
    Medusa.products.create(product).then(({ data }) => {
      navigate(`/a/products/${data.product._id}`)
    })
  }

  const onImageChange = e => {
    Medusa.uploads.create(e.target.files).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => url)
      setImages(images.concat(uploaded))
    })
  }

  const handleImageDelete = url => {
    Medusa.uploads.delete(url[0]).then(() => {
      setImages(images.filter(im => im !== url))
    })
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      pb={6}
      onSubmit={handleSubmit(submit)}
    >
      <Text mb={4}>Product Details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Input mb={4} label="Name" name="title" ref={register} />
          <TextArea label="Description" name="description" ref={register} />
          {/*<Flex mt={4}>
            <Pill
              onClick={() => setHasVariants(false)}
              active={!hasVariants}
              mr={4}
            >
              Simple Product
            </Pill>
            <Pill onClick={() => setHasVariants(true)} active={hasVariants}>
              Product with Variants
            </Pill>
          </Flex>*/}
        </Box>
      </Flex>
      <Flex mb={3}>
        <ImageUpload onChange={onImageChange} name="files" label="Images" />
      </Flex>
      <Flex mb={5}>
        <StyledImageBox>
          {images.map((url, i) => (
            <ImageCardWrapper key={i} mr={3}>
              <StyledImageCard key={i} as="img" src={url} sx={{}} />
              <Cross onClick={() => handleImageDelete(url)}>&#x2715;</Cross>
            </ImageCardWrapper>
          ))}
        </StyledImageBox>
      </Flex>
      {hasVariants ? (
        <>
          <Text mb={4}>Options</Text>
          <Flex mb={5} flexDirection="column">
            {options.map((o, index) => (
              <Flex mb={4} key={index} alignItems="flex-end">
                <Box>
                  <Input
                    name={`options[${index}].name`}
                    onChange={e => updateOptionName(e, index)}
                    label="Option Name"
                    value={o.name}
                  />
                </Box>
                <Box mx={3} flexGrow="1">
                  <TagInput
                    values={o.values}
                    onChange={values => updateOptionValue(index, values)}
                  />
                </Box>
                <Box>
                  <Text
                    fontSize={4}
                    onClick={() => handleRemoveOption(index)}
                    sx={{ cursor: "pointer", height: "28px" }}
                  >
                    &times;
                  </Text>
                </Box>
              </Flex>
            ))}
            <Button onClick={handleAddOption} variant="primary">
              + Add an option
            </Button>
          </Flex>
          {variants && variants.length > 0 && (
            <>
              <Text mb={4}>Variants</Text>
              <Flex flexDirection="column" flexGrow="1">
                <VariantGrid
                  variants={variants}
                  onChange={vs => setVariants(vs)}
                />
              </Flex>
            </>
          )}
        </>
      ) : (
        <>
          <Text mb={4}>Price</Text>
          <Flex mb={5}>
            <Box>
              <Input name="price" label="Price" ref={register} />
            </Box>
          </Flex>
        </>
      )}

      <Flex pt={5}>
        <Button mr={2} onClick={handleSubmit(onAddMore)} variant={"primary"}>
          Save and add more
        </Button>
        <Button variant={"cta"} type="submit">
          Save
        </Button>
      </Flex>
    </Flex>
  )
}

export default NewProduct
