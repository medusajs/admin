import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import Input from "../../../components/input"
import Button from "../../../components/button"

import Medusa from "../../../services/api"

const NewReturnReason = ({ id }) => {
  const { register, handleSubmit } = useForm()

  const onSave = data => {
    Medusa.returnReasons.create(data).then(({ data }) => {
      navigate(`/a/settings/return-reasons`)
    })
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
      <Flex width={3 / 5} justifyContent="flex-start">
        <Text mb={4} fontWeight="bold" fontSize={20}>
          Return Reason
        </Text>
      </Flex>
      <Flex mb={5} width={3 / 5} flexDirection="column">
        <Input
          required={true}
          mb={3}
          name="value"
          label="Reason Code"
          ref={register}
          width="75%"
        />
        <Input
          required={true}
          mb={3}
          name="label"
          label="Label"
          ref={register}
          width="75%"
        />
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
            Create
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NewReturnReason
