import React, { useEffect } from "react"
import _ from "lodash"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../components/modal"
import Input from "../../../components/input"
import CurrencyInput from "../../../components/currency-input"
import Button from "../../../components/button"
import Select from "../../../components/select"

import Medusa from "../../../services/api"

const EditShipping = ({ shippingOption, region, onDone, onClick }) => {
  const { control, errors, register, setValue, reset, handleSubmit } = useForm()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "requirements",
  })

  const {
    fields: metaFields,
    append: metaAppend,
    remove: metaRemove,
  } = useFieldArray({
    control,
    name: "metadata",
  })

  useEffect(() => {
    const option = {
      ...shippingOption,
      metadata: Object.entries(shippingOption.metadata).map(
        ([key, value], index) => {
          return {
            id: index,
            key,
            value,
          }
        }
      ),
    }
    reset(option)

    if (shippingOption.requirements.length) {
      shippingOption.requirements.map((r, index) => {
        register({ name: `requirements.${index}.value` })
        register({ name: `requirements.${index}.type` })

        setValue(`requirements.${index}.value`, r.value)
        setValue(`requirements.${index}.type`, r.type)
      })
    }

    if (!_.isEmpty(shippingOption.metadata)) {
      let index = 0
      Object.entries(shippingOption.metadata).map(([key, value]) => {
        if (typeof value === "string") {
          register({ name: `metadata.${index}.key` })
          register({ name: `metadata.${index}.value` })

          setValue(`metadata.${index}.key`, key)
          setValue(`metadata.${index}.value`, value)
          index += 1
        }
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

    if (data.metadata) {
      payload.metadata = data.metadata.reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})
    }

    Medusa.shippingOptions.update(shippingOption._id, payload).then(() => {
      if (onDone) {
        onDone()
      }
      onClick()
    })
  }

  console.log(errors)

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
            {fields.map((_, index) => (
              <Flex key={index} justifyContent="space-between">
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
          <Flex mb={4} flexDirection="column">
            <Text fontSize={1} fontWeight={300} mb={1}>
              Metadata
            </Text>
            {metaFields.map((field, index) => (
              <Flex key={field.id} my={3} justifyContent="space-between">
                <Input
                  mr={4}
                  flex={"0 0 100px"}
                  type="text"
                  placeholder={"Key"}
                  name={`metadata.${index}.key`}
                  invalid={
                    errors.metadata &&
                    errors.metadata[index] &&
                    errors.metadata[index].key
                  }
                  ref={register({ required: "Must be filled" })}
                />
                <Input
                  mr={2}
                  flex={"1 1 auto"}
                  placeholder={"Value"}
                  type="text"
                  name={`metadata.${index}.value`}
                  invalid={
                    errors.metadata &&
                    errors.metadata[index] &&
                    errors.metadata[index].value
                  }
                  ref={register({ required: "Must be filled" })}
                />
                <Text
                  onClick={() => metaRemove(index)}
                  sx={{ cursor: "pointer" }}
                >
                  &times;
                </Text>
              </Flex>
            ))}
            <Button
              onClick={() =>
                metaAppend({ id: metaFields.length, key: "", value: "" })
              }
              variant="primary"
            >
              + Add metadata
            </Button>
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
