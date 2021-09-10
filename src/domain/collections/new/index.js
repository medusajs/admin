import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"
import { navigate } from "gatsby"

import Button from "../../../components/button"
import Input from "../../../components/input"

import InfoTooltip from "../../../components/info-tooltip"

import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"

const NewCollection = ({}) => {
  const { toaster } = useMedusa("collections")
  const { register, handleSubmit, errors } = useForm()

  const submit = async data => {
    try {
      const newCollection = await Medusa.collections.create(data)
      navigate(`/a/collections`)
    } catch (error) {
      const errorData = error.response.data.message
      toaster(`${errorData[0].message}`, "error")
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length) {
      const requiredErrors = Object.keys(errors).map(err => {
        if (errors[err].type === "required") {
          return err
        }
      })

      toaster(`Missing info: ${requiredErrors.join(", ")}`, "error")
    }
  }, [errors])

  return (
    <Flex as="form" pb={6} onSubmit={handleSubmit(submit)} pt={5}>
      <Flex mx="auto" width="100%" maxWidth="750px" flexDirection="column">
        <Text mb={4}>Collection details</Text>
        <Flex mb={5}>
          <Box width={4 / 7}>
            <Flex mb={5}>
              <Flex flexDirection="column" width={4 / 7}>
                <Input
                  boldLabel={true}
                  mt={4}
                  placeholder={"Bathrobes"}
                  name={`title`}
                  label="Title"
                  required={true}
                  ref={register({ required: "Title is required" })}
                />
                <Flex mt={4} mb={2} alignItems="center">
                  <Text mr={2} fontSize={1} fontWeight="500">
                    Handle
                  </Text>
                  <InfoTooltip tooltipText="URL Slug for the product" />
                </Flex>
                <Input
                  boldLabel={true}
                  placeholder={"bathrobes"}
                  name={`handle`}
                  ref={register}
                />
              </Flex>
            </Flex>
          </Box>
        </Flex>
        <Flex pt={5}>
          <Box ml="auto" />
          <Button variant={"cta"} type="submit">
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NewCollection
