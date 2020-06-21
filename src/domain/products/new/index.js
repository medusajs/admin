import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"

import Button from "../../../components/button"
import Pill from "../../../components/pill"
import Input from "../../../components/input"
import TagInput from "../../../components/tag-input"
import ImageUpload from "../../../components/image-upload"
import TextArea from "../../../components/textarea"
import VariantGrid from "../../../components/variant-grid"

import getCombinations from "./utils/get-combinations"

const NewProduct = ({}) => {
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState([])
  const [options, setOptions] = useState([])
  const { register } = useForm()

  useEffect(() => {
    const os = [...options]
    const combinations = getCombinations(os)

    const newVariants = combinations.map(optionValues => {
      optionValues = optionValues || []

      const existing =
        variants.find(v =>
          v.options.every((value, index) => optionValues[index] === value)
        ) || {}

      existing.options = optionValues.filter(v => v !== "")

      return existing
    })

    setVariants(newVariants)
  }, [options])

  const updateOptionValue = (index, values) => {
    const newOptions = [...options]
    newOptions[index] = {
      ...newOptions[index],
      values,
    }

    setOptions(newOptions)
  }

  const updateOptionName = e => {
    const element = e.target
    const newOptions = [...options]
    newOptions[parseInt(element.name)] = {
      ...newOptions[parseInt(element.name)],
      name: element.value,
    }

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

  return (
    <Flex as="form" flexDirection="column">
      <Text mb={4}>Product Details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Input mb={4} label="Name" name="title" register={register} />
          <TextArea
            label="Description"
            name="description"
            register={register}
          />
          <Flex mt={4}>
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
          </Flex>
        </Box>
        <Flex justifyContent="center" width={3 / 7}>
          <ImageUpload name="images" label="Images" />
        </Flex>
      </Flex>
      {hasVariants ? (
        <>
          <Text mb={4}>Options</Text>
          <Flex mb={5} flexDirection="column">
            {options.map((o, index) => (
              <Flex mb={4} key={index} alignItems="flex-end">
                <Box>
                  <Input
                    name={index}
                    onChange={updateOptionName}
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
                  <Button
                    variant="primary"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Remove
                  </Button>
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
              <Input label="Price" ref={register} />
            </Box>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default NewProduct
