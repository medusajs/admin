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

import Medusa from "../../../services/api"

import { getCombinations } from "./utils/get-combinations"

const NewProduct = ({}) => {
  const [hasVariants, setHasVariants] = useState(true)
  const [variants, setVariants] = useState([])
  const [options, setOptions] = useState([])
  const { register, handleSubmit, setValue } = useForm()

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

  const submit = data => {
    const product = {
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

    Medusa.products.create(product)
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
              <Input name="price" label="Price" ref={register} />
            </Box>
          </Flex>
        </>
      )}

      <Flex pt={5}>
        <Button mr={2} variant={"primary"}>
          Save and add more
        </Button>
        <Button variant={"secondary"} type="submit">
          Save
        </Button>
      </Flex>
    </Flex>
  )
}

export default NewProduct
