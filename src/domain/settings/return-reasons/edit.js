import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"

import Input, { StyledLabel } from "../../../components/input"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import { ReactSelect } from "../../../components/react-select"

import useMedusa from "../../../hooks/use-medusa"

const EditReturnReason = ({ id }) => {
  const parent_return_reasons = [] //rest.location.state.parent_return_reasons
  const {
    return_reason,
    isLoading,
    update,
    toaster,
  } = useMedusa("returnReasons", { id })

  console.log(return_reason)

  const { register, reset, handleSubmit } = useForm()

  const [isParentReason, setIsParentReason] = useState(
    !return_reason?.parent_return_reason_id
  )

  console.log(isParentReason)

  const [parentReasonId, setParentReasonId] = useState(
    return_reason?.parent_return_reason.id
  )

  useEffect(() => {
    if (isLoading) {
      return
    }
    setIsParentReason(!return_reason?.parent_return_reason_id)
    reset({ ...return_reason })
  }, [return_reason, isLoading])

  const onSave = async data => {
    try {
      const return_reason_update = {
        parent_return_reason_id: parentReasonId,
        ...data,
      }

      await update({ ...return_reason_update })
      toaster("Successfully updated return reason", "success")
    } catch (error) {
      console.log(error.response)
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

  const parentReasons = parent_return_reasons.map(rr => {
    return { id: rr.id, value: rr.value, label: rr.label }
  })

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
              defaultValue={{
                id: return_reason.parent_return_reason.id,
                value: return_reason.parent_return_reason.value,
                label: return_reason.parent_return_reason.label,
              }}
              options={parentReasons}
              onChange={parentReason => setParentReasonId(parentReason.id)}
            />
          </Box>
        )}
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
