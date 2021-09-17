import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import Input, { StyledLabel } from "../../../components/input"
import Button from "../../../components/button"
import { ReactSelect } from "../../../components/react-select"

import Medusa from "../../../services/api"

const NewReturnReason = ({ id, ...rest }) => {
  const parent_return_reasons = rest.location.state.parent_return_reasons
  const { register, handleSubmit } = useForm()

  const [isParentReason, setIsParentReason] = useState(true)

  const [parentReasonId, setParentReasonId] = useState("")

  const onSave = data => {
    const return_reason = { parent_return_reason_id: parentReasonId, ...data }

    Medusa.returnReasons.create(data).then(({ return_reason }) => {
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
        <Box mb={3}>
          <StyledLabel>
            <Text>Is this a return reason category</Text>
          </StyledLabel>
          <input
            name="isParentReason"
            type="checkbox"
            defaultChecked={isParentReason}
            onChange={() => setIsParentReason(!isParentReason)}
          />
        </Box>
        {!isParentReason && (
          <Box width={3 / 4}>
            <StyledLabel>
              <Text>Parent return reason</Text>
            </StyledLabel>
            <ReactSelect
              options={parent_return_reasons}
              onChange={parentReason => setParentReasonId(parentReason.id)}
            />
          </Box>
        )}
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
