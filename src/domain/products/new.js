import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"

import Button from "../../components/button"
import Input from "../../components/input"
import TagInput from "../../components/tag-input"
import ImageUpload from "../../components/image-upload"

const NewProduct = ({}) => {
  const [options, setOptions] = useState([])
  const { register } = useForm()

  const updateOptionValue = e => {
    const element = e.target
    const newOptions = [...options]
    newOptions[parseInt(element.name)] = {
      ...newOptions[parseInt(element.name)],
      value: element.value,
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
        values: "",
      },
    ])
  }

  return (
    <form>
      <Text mb={4}>Product Details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Input mb={4} label="Name" name="title" register={register} />
          <Input label="Description" name="description" register={register} />
        </Box>
        <Flex justifyContent="center" alignItems="center" width={3 / 7}>
          <ImageUpload name="images" label="Images" />
        </Flex>
      </Flex>
      <Text mb={4}>Options</Text>
      <Flex flexDirection="column">
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
                name={index}
                onChange={updateOptionValue}
                value={o.name}
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
    </form>
  )
}

export default NewProduct
