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

const EditShipping = ({
  shippingOption,
  fulfillmentOptions,
  region,
  onDone,
  onDelete,
  onClick,
}) => {
  const { control, register, setValue, reset, handleSubmit } = useForm()
  const { store, isLoading } = useMedusa("store")
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  })

  useEffect(() => {
    reset(shippingOption)

    if (shippingOption.requirements.length) {
      shippingOption.requirements.map((r, index) => {
        register({ name: `requirements.${index}.value` })
        register({ name: `requirements.${index}.type` })

        setValue(`requirements.${index}.value`, r.value)
        setValue(`requirements.${index}.type`, r.type)
      })
    }
  }, [shippingOption])

  const handleDelete = () => {
    Medusa.shippingOptions.delete(shippingOption._id).then(() => {
      if (onDone) {
        onDone()
      }
      onClick()
    })
  }

  const handleSave = data => {
    const payload = {
      name: data.name,
      price: {
        type: "flat_rate",
        amount: data.price.amount,
      },
      requirements: data.requirements || [],
    }

    Medusa.shippingOptions.update(shippingOption._id, payload).then(() => {
      if (onDone) {
        onDone()
      }
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
          <Text>Edit Shipping Option</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text fontSize={2}>
              Fulfillment Method
              <Text fontSize={1} sx={{ fontWeight: "300" }}>
                {shippingOption.data.id} via {shippingOption.provider_id}
              </Text>
            </Text>
          </Box>
          <Box mb={4}>
            <Input mt={2} label="Name" name="name" ref={register} />
          </Box>
          <Box mb={4}>
            <Text fontSize={1} fontWeight={300} mb={1}>
              Price
            </Text>
            <CurrencyInput
              ref={register}
              label={"price"}
              name={"price.amount"}
              currency={region.currency_code}
            />
          </Box>
          <Flex mb={4} flexDirection="column">
            <Text fontSize={1} fontWeight={300} mb={1}>
              Requirement
            </Text>
            {fields.map((req, index) => (
              <Flex justifyContent="space-between">
                <Select
                  mr={3}
                  name={`requirements.${index}.type`}
                  options={[
                    {
                      label: "Minimum subtotal",
                      value: "min_subtotal",
                    },
                    {
                      label: "Maximum subtotal",
                      value: "max_subtotal",
                    },
                  ]}
                  ref={register()}
                />
                <CurrencyInput
                  height={"28px"}
                  name={`requirements.${index}.value`}
                  currency={region.currency_code}
                  ref={register()}
                />
                <Text onClick={() => remove(0)} sx={{ cursor: "pointer" }}>
                  &times;
                </Text>
              </Flex>
            ))}
            {fields.length === 0 && (
              <Button
                onClick={() => append({ type: "min_subtotal", value: "" })}
                variant="primary"
              >
                + Add requirement
              </Button>
            )}
          </Flex>
          <Box mb={4}>
            <Text fontSize={1}>Danger Zone</Text>
            <Button onClick={handleDelete} variant="danger">
              Delete Shipping Option
            </Button>
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

export default EditShipping
