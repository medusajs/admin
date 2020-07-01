import React, { useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm } from "react-hook-form"

import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import TextArea from "../../../../components/textarea"
import Spinner from "../../../../components/spinner"

const Information = ({ isLoading, product, onSubmit }) => {
  const { register, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (isLoading) return
    reset({
      title: product.title,
      description: product.description,
    })
  }, [product, isLoading])

  const dropdownOptions = [
    { label: "Delete product...", onClick: () => console.log("EDIT") },
  ]

  return (
    <Card as="form" onSubmit={handleSubmit(onSubmit)}>
      <Card.Header dropdownOptions={dropdownOptions}>
        Product Information
      </Card.Header>
      <Card.Body px={3}>
        <Flex width={1} flexDirection={"column"}>
          <Box mb={3} width={1 / 2}>
            <Input inline name="title" label="Name" ref={register} />
          </Box>
          <Box mb={3} width={1 / 2}>
            <TextArea
              inline
              name="description"
              label="Description"
              ref={register}
            />
          </Box>
        </Flex>
      </Card.Body>
      <Card.Footer px={3} justifyContent="flex-end">
        <Button type="submit">Save</Button>
      </Card.Footer>
    </Card>
  )
}

export default Information
