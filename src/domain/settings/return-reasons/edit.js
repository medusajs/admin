import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"

import Input from "../../../components/input"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

import useMedusa from "../../../hooks/use-medusa"

const EditReturnReason = ({ id }) => {
  const {
    return_reason,
    isLoading,
    update,
    toaster,
  } = useMedusa("returnReasons", { id })

  const { register, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (isLoading) return
    reset({ ...return_reason })
  }, [return_reason, isLoading])

  const onSave = async data => {
    try {
      await update({ ...data })
      toaster("Successfully updated return reason", "success")
    } catch (error) {
      toaster("Failed to update return reason", "error")
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
    <Flex
      as="form"
      onSubmit={handleSubmit(onSave)}
      flexDirection="column"
      pt={5}
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Flex flexDirection="column" width={3 / 5} justifyContent="flex-start">
        <Text mb={1} fontWeight="bold" fontSize={20}>
          Edit Return Reason
        </Text>
        <Box>
          <Text mb={4} color="gray" fontSize={16}>
            {return_reason.value}
          </Text>
        </Box>
      </Flex>
      <Flex mb={5} width={3 / 5} flexDirection="column">
        <Input mb={3} name="label" label="Label" ref={register} width="75%" />
        <Input
          mb={3}
          name="description"
          label="Description"
          ref={register}
          width="75%"
        />
        <Flex mt={4} width="75%">
          <Box ml="auto" />
          <Button variant={"cta"} type="submit">
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default EditReturnReason
