import React, { useEffect } from "react"
import { Flex, Box } from "rebass"
import { useForm } from "react-hook-form"

import useMedusa from "../../hooks/use-medusa"
import Input from "../../components/input"
import Card from "../../components/card"
import Button from "../../components/button"

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm()
  const { store, isLoading, update } = useMedusa("store")

  useEffect(() => {
    if (isLoading) return
    reset({
      name: store.name,
    })
  }, [store, isLoading])

  const onSubmit = data => {
    update({
      name: data.name,
    })
  }

  return (
    <Flex flexDirection="column" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Card.Header>Account Details</Card.Header>
        <Card.Body>
          <Flex width={1}>
            <Box width={1 / 2}>
              <Input inline ref={register} name="name" label="Store name" />
            </Box>
          </Flex>
        </Card.Body>
        <Card.Footer justifyContent="flex-end" px={3}>
          <Button type="submit">Save</Button>
        </Card.Footer>
      </Card>
    </Flex>
  )
}

export default AccountDetails
