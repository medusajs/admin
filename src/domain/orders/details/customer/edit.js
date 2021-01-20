import React, { useState } from "react"
import { useForm } from "react-hook-form"
import _ from "lodash"
import Modal from "../../../../components/modal"
import Button from "../../../../components/button"
import Select from "../../../../components/select"
import { Input } from "@rebass/forms"
import { Flex, Text } from "rebass"

const CustomerInformationEdit = ({
  order,
  customerData,
  billingData,
  shippingData,
  onUpdate,
  onDismiss,
  toaster,
}) => {
  const { register, handleSubmit } = useForm()
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState(customerData.email)
  const [billing, setBilling] = useState(billingData)
  const [shipping, setShipping] = useState(shippingData)

  const onSubmit = async data => {
    setSubmitting(true)
    return onUpdate(data)
      .then(() => onDismiss())
      .then(() =>
        toaster("Successfully updated customer information", "success")
      )
      .catch(() => toaster("Failed to update customer information", "error"))
      .finally(() => setSubmitting(false))
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Edit customer information</Modal.Header>
        <Modal.Content flexDirection="column">
          <Text mb={3} fontWeight="500">
            Customer
          </Text>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              Email
            </Text>
            <Input
              ref={register}
              label="Email"
              required={true}
              name="email"
              defaultValue={email}
            />
          </Flex>
          <Text mb={3} fontWeight="500">
            Shipping address
          </Text>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              Address 1
            </Text>
            <Input
              mb={1}
              ref={register}
              label="Address 1"
              required={true}
              name="shipping_address.address_1"
              defaultValue={shipping.address_1}
            />
          </Flex>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              Address 2
            </Text>
            <Input
              mb={1}
              ref={register}
              label="Address 2"
              name="shipping_address.address_2"
              defaultValue={shipping.address_2}
            />
          </Flex>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              State
            </Text>
            <Input
              mb={1}
              ref={register}
              label="Province"
              name="shipping_address.province"
              defaultValue={shipping.province}
            />
          </Flex>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              Postal code
            </Text>
            <Input
              mb={1}
              ref={register}
              label="Postal code"
              required={true}
              name="shipping_address.postal_code"
              defaultValue={shipping.postal_code}
            />
          </Flex>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              City
            </Text>
            <Input
              mb={1}
              ref={register}
              label="City"
              required={true}
              name="shipping_address.city"
              defaultValue={shipping.city}
            />
          </Flex>
          <Flex flexDirection="row" alignItems="baseline" mb={3}>
            <Text height="100%" minWidth="100px">
              Country code
            </Text>
            <Input
              mb={1}
              ref={register}
              label="Country code"
              required={true}
              name="shipping_address.country_code"
              defaultValue={shipping.country_code}
            />
          </Flex>
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
