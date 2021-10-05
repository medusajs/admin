import React, { useState } from "react"
import { useForm } from "react-hook-form"
import _ from "lodash"
import Modal from "../../../components/modal"
import Button from "../../../components/button"
import { Input } from "@rebass/forms"
import { Flex, Box, Text } from "rebass"
import InfoTooltip from "../../../components/info-tooltip"

const CustomerInformationEdit = ({
  customer,
  onUpdate,
  onDismiss,
  toaster,
}) => {
  const { register, handleSubmit } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [firstName, setFirstName] = useState(customer.first_name)
  const [lastName, setLastName] = useState(customer.last_name)

  const onSubmit = async data => {
    setSubmitting(true)

    // this check ensures we can actually update the remaining when the user is registered
    for (const key in data) {
      if (!data[key] || data[key] === customer[key]) delete data[key]
    }

    return onUpdate(data)
      .then(() => onDismiss())
      .then(() =>
        toaster("Successfully updated customer information", "success")
      )
      .catch(() => toaster("Failed to update customer information", "error"))
      .finally(() => setSubmitting(false))
  }

  const disabled = customer.has_account

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header fontWeight="700">Customer Details</Modal.Header>
        <Modal.Content flexDirection="column">
          <Box pb={3}>
            <Flex>
              <Text
                fontWeight="400"
                fontSize={2}
                mb={1}
                mt={1}
                color={disabled ? "light" : "dark"}
              >
                Email
              </Text>
              {disabled && (
                <InfoTooltip
                  mt={2}
                  ml={2}
                  tooltipText="Editing emails is disabled for registered users"
                />
              )}
            </Flex>

            <Input
              disabled={disabled}
              color={disabled ? "light" : ""}
              borderColor="lightest"
              ref={register}
              label="Email"
              required={true}
              name="email"
              defaultValue={email}
              fontSize={2}
            />
          </Box>
          <Flex justifyContent="space-between">
            <Box pb={3}>
              <Text mb={1} color="dark" fontWeight="400" fontSize={2}>
                First name
              </Text>
              <Input
                ref={register}
                label="First name"
                name="first_name"
                defaultValue={firstName}
                fontSize={2}
              />
            </Box>
            <Box pb={3}>
              <Text mb={1} color="dark" fontWeight="400" fontSize={2}>
                Last name
              </Text>
              <Input
                ref={register}
                label="Last name"
                name="last_name"
                defaultValue={lastName}
                fontSize={2}
              />
            </Box>
          </Flex>
          <Box pb={3}>
            <Text mb={1} color="dark" fontWeight="400" fontSize={2}>
              Phone number
            </Text>
            <Input
              ref={register}
              label="Phone number"
              name="phone"
              defaultValue={phone}
              fontSize={2}
            />
          </Box>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button loading={submitting} type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CustomerInformationEdit
