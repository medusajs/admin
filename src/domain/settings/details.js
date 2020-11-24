import React, { useState, useEffect } from "react"
import { Flex, Box, Text } from "rebass"
import { useForm } from "react-hook-form"

import useMedusa from "../../hooks/use-medusa"
import Input from "../../components/input"
import Card from "../../components/card"
import Button from "../../components/button"

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm()
  const { store, isLoading, update } = useMedusa("store")
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (isLoading) return
    reset({
      name: store.name,
      swap_link_template: store.swap_link_template,
    })
  }, [store, isLoading])

  const onSubmit = data => {
    localStorage.removeItem("medusa::cache::store")

    update(data)
  }

  return (
    <Flex
      flexDirection="column"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      mb={2}
    >
      <Card>
        <Card.Header>Account Details</Card.Header>
        <Card.Body flexDirection="column">
          <Flex width={1}>
            <Box width={1 / 2}>
              <Input inline ref={register} name="name" label="Store name" />
            </Box>
          </Flex>
          <Flex mt={4} width={1} justifyContent="center">
            <Text onClick={() => setShowAdvanced(!showAdvanced)}>
              {showAdvanced ? "Hide" : "Advanced settings"}
            </Text>
          </Flex>
          {showAdvanced && (
            <Flex py={3}>
              <Box width={1 / 2}>
                <Input
                  inline
                  ref={register}
                  name="swap_link_template"
                  label="Swap link template"
                />
              </Box>
            </Flex>
          )}
        </Card.Body>
        <Card.Footer justifyContent="flex-end" px={3}>
          <Button type="submit">Save</Button>
        </Card.Footer>
      </Card>
    </Flex>
  )
}

export default AccountDetails
