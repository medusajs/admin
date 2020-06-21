import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"

import Button from "../../../components/button"
import Input from "../../../components/input"
import TagInput from "../../../components/tag-input"
import ImageUpload from "../../../components/image-upload"
import TextArea from "../../../components/textarea"
import VariantGrid from "../../../components/variant-grid"

const NewProduct = ({}) => {
  const getCombinations = options => {
    if (options.length === 0) {
      return []
    }

    if (options.length === 1) {
      const values = options.shift().values
      if (values.length > 0) {
        return values.map(v => [v])
      }

      return [""]
    }

    const combinations = []
    const theseValues = options.shift().values

    const lowerCombinations = getCombinations(options)
    for (const v of theseValues) {
      for (const second of lowerCombinations) {
        combinations.push([v, second].flat())
      }
    }

    return combinations
  }

  const [variants, setVariants] = useState([])
  const [options, setOptions] = useState([])
  const { register } = useForm()

  useEffect(() => {
    const os = [...options]
    const combinations = getCombinations(os)

    const newVariants = combinations.map(optionValues => {
      optionValues = optionValues || []
      const v = []

      const existing =
        variants.find(v =>
          v[0].every((value, index) => optionValues[index] === value)
        ) || []

      existing[0] = optionValues.filter(v => v !== "")

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
    <form>
      <Text mb={4}>Product Details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Input mb={4} label="Name" name="title" register={register} />
          <TextArea
            label="Description"
            name="description"
            register={register}
          />
        </Box>
        <Flex justifyContent="center" alignItems="center" width={3 / 7}>
          <ImageUpload name="images" label="Images" />
        </Flex>
      </Flex>
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
      <Text mb={4}>Variants</Text>
      <Flex flexDirection="column">
        <VariantGrid variants={variants} />
      </Flex>
    </form>
  )
}

export default NewProduct
