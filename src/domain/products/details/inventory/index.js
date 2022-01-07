import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Box, Flex, Text } from "rebass"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/molecules/input"
import { convertEmptyStringToNull } from "../../../../utils/convert-empty-string-to-null"

const numberFields = ["weight", "length", "width", "height"]

const Inventory = ({ product, onSubmit }) => {
  const { register, handleSubmit, reset, formState } = useForm()
  const { isDirty } = formState
  useEffect(() => {
    if (product) {
      reset({
        height: product.height,
        width: product.width,
        length: product.length,
        weight: product.weight,
        mid_code: product.mid_code,
        material: product.material,
        origin_country: product.origin_country,
        hs_code: product.hs_code,
      })
    }
  }, [product])

  const submitHandler = data => {
    const cleanedData = convertEmptyStringToNull(data, numberFields)
    onSubmit(cleanedData)
  }

  return (
    <Card mb={2} as="form" onSubmit={handleSubmit(submitHandler)}>
      <Card.Header>Stock & Inventory</Card.Header>
      <Card.Body px={3} flexDirection="column">
        <Box maxWidth={800} mb={4}>
          <Text fontWeight="700" mb={3}>
            Dimensions
          </Text>
          <Flex>
            <Box mr={4}>
              <Input
                name="height"
                label="Height"
                placeholder="Height"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
            <Box mr={4}>
              <Input
                name="width"
                label="Width"
                placeholder="Width"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
            <Box mr={4}>
              <Input
                name="length"
                label="Length"
                placeholder="Length"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
            <Box mr={4}>
              <Input
                name="weight"
                label="Weight"
                placeholder="Weight"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
          </Flex>
        </Box>
        <Box maxWidth={800} pt={2} mb={3}>
          <Text fontWeight="700" mb={3}>
            Customs
          </Text>
          <Flex>
            <Box mr={4}>
              <Input
                name="mid_code"
                label="MID Code"
                placeholder="MID Code"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
            <Box mr={4}>
              <Input
                name="hs_code"
                label="HS Code"
                placeholder="HS Code"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
            <Box mr={4}>
              <Input
                name="origin_country"
                label="Country of origin"
                placeholder="Country of origin"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
            <Box mr={4}>
              <Input
                name="material"
                label="Material"
                placeholder="Material"
                boldLabel={"true"}
                ref={register}
              />
            </Box>
          </Flex>
        </Box>
        {isDirty && (
          <Flex justifyContent="flex-end">
            <Button type="submit" variant="deep-blue">
              Save
            </Button>
          </Flex>
        )}
      </Card.Body>
    </Card>
  )
}

export default Inventory
