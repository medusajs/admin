import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import Input, { StyledLabel } from "../../../components/input"
import Button from "../../../components/button"
import Card from "../../../components/card"
import { ReactSelect } from "../../../components/react-select"

import Medusa from "../../../services/api"

const NewReturnReason = ({ id }) => {
  const { register, handleSubmit } = useForm()

  const onSave = data => {
    Medusa.returnReasons.create(data).then(result => {
      navigate(`/a/settings/return-reasons/${result.data.return_reason.id}`)
    })
  }

  return (
    <Flex alignItems="center" flexDirection="column">
      <Card width="90%" px={0}>
        <Flex
          as="form"
          onSubmit={handleSubmit(onSave)}
          flexDirection="column"
          pt={5}
          alignItems="center"
          justifyContent="center"
          width={1}
        >
          <Flex width={1} flexDirection="column">
            <Flex>
              <Text mb={3} fontWeight="bold" fontSize={20}>
                Create reason
              </Text>
            </Flex>
            <Card.Body py={0} flexDirection="column">
              <Flex mb={5} flexDirection="column">
                <Input
                  required={true}
                  mb={3}
                  name="value"
                  label="Reason Code"
                  ref={register}
                />
                <Input
                  required={true}
                  mb={3}
                  name="label"
                  label="Label"
                  ref={register}
                />
                <Input
                  mb={3}
                  name="description"
                  label="Description"
                  ref={register}
                />
                <Flex mt={4}>
                  <Box ml="auto" />
                  <Button variant={"cta"} type="submit">
                    Create
                  </Button>
                </Flex>
              </Flex>
            </Card.Body>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}

export default NewReturnReason
