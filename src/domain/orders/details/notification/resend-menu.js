import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm, useFieldArray } from "react-hook-form"
import { getErrorMessage } from "../../../../utils/error-messages"

import Modal from "../../../../components/modal"
import Input from "../../../../components/molecules/input"
import Button from "../../../../components/button"

import Medusa from "../../../../services/api"

const ResendMenu = ({ notification, onDismiss, toaster }) => {
  const { errors, register, setValue, handleSubmit } = useForm({})

  useEffect(() => {
    setValue("to", notification.to)
  }, [])

  const onSubmit = data => {
    return Medusa.notifications
      .resend(notification.id, {
        to: data.to,
      })
      .then(() => onDismiss())
      .then(() => toaster("The notification was resent", "success"))
      .catch(error => toaster(getErrorMessage(error), "error"))
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body width={"600px"} as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Resend notification</Modal.Header>
        <Modal.Content flexDirection="column">
          <Flex my={3} flexDirection="column">
            <Flex mb={3}>
              <Box flex={1}>
                <Input
                  inline
                  label={"To"}
                  type="text"
                  placeholder={"To address"}
                  name={`to`}
                  invalid={errors.to && errors.to}
                  ref={register({
                    required: "Must be filled",
                  })}
                />
              </Box>
            </Flex>
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Resend
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ResendMenu
