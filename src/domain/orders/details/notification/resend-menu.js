import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Box, Flex } from "rebass"
import Button from "../../../../components/button"
import Modal from "../../../../components/modal"
import Input from "../../../../components/molecules/input"
import Medusa from "../../../../services/api"
import { getErrorMessage } from "../../../../utils/error-messages"

const ResendMenu = ({ notification, onDismiss, notificationFn }) => {
  const { errors, register, setValue, handleSubmit } = useForm({})

  useEffect(() => {
    setValue("to", notification.to)
  }, [])

  const onSubmit = (data) => {
    return Medusa.notifications
      .resend(notification.id, {
        to: data.to,
      })
      .then(() => onDismiss())
      .then(() =>
        notificationFn("Success", "The notification was resent", "success")
      )
      .catch((error) => notification("Error", getErrorMessage(error), "error"))
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
