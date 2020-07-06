import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../components/modal"
import Input from "../../../components/input"
import CurrencyInput from "../../../components/currency-input"
import Button from "../../../components/button"
import Select from "../../../components/select"

import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"

const NewShipping = ({
  fulfillmentOptions,
  region,
  onSubmit,
  onDelete,
  onClick,
}) => {
  const { register, handleSubmit } = useForm()
  const { store, isLoading } = useMedusa("store")

  const handleSave = data => {
    const [providerIndex, optionIndex] = data.fulfillment_option.split(".")
    const { provider_id, options } = fulfillmentOptions[providerIndex]
    const payload = {
      name: data.name,
      data: options[optionIndex],
      region_id: region._id,
      price: {
        type: "flat_rate",
        amount: data.price.amount,
      },
      provider_id,
    }

    Medusa.shippingOptions.create(payload).then(() => {
      onClick()
    })
  }

  const options = fulfillmentOptions.reduce((acc, provider, p) => {
    return acc.concat(
      provider.options.map((option, o) => ({
        label: `${option.id} via ${provider.provider_id}`,
        value: `${p}.${o}`,
      }))
    )
  }, [])

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(handleSave)}>
        <Modal.Header>
          <Text>Add Shipping Option</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={4}>
            <Input mt={2} mb={3} label="Name" name="name" ref={register} />
          </Box>
          <Box mb={4}>
            <Text mb={3}>Fulfillment Method</Text>
            <Select
              name="fulfillment_option"
              options={options}
              ref={register}
            />
          </Box>
          <Box mb={4}>
            <Text mb={3}>Price</Text>
            <CurrencyInput
              ref={register}
              name={"price.amount"}
              currency={region.currency_code}
            />
          </Box>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default NewShipping
