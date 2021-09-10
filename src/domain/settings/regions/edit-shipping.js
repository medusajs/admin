import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../components/modal"
import Input from "../../../components/input"
import CurrencyInput from "../../../components/currency-input"
import Button from "../../../components/button"

import Medusa from "../../../services/api"
import { Checkbox, Label } from "@rebass/forms"

const EditShipping = ({ shippingOption, region, onDone, onClick }) => {
  const { register, setValue, reset, handleSubmit } = useForm()
  const [adminOnly, setAdminOnly] = useState(shippingOption?.admin_only)

  // const {
  //   fields: metaFields,
  //   append: metaAppend,
  //   remove: metaRemove,
  // } = useFieldArray({
  //   control,
  //   name: "metadata",
  // })

  useEffect(() => {
    const option = {
      ...shippingOption,
    }
    if (!_.isEmpty(shippingOption.metadata)) {
      option.metadata = Object.entries(shippingOption.metadata).map(
        ([key, value], index) => {
          return {
            id: index,
            key,
            value,
          }
        }
      )
    }

    if (shippingOption.requirements) {
      const minSubtotal = shippingOption.requirements.find(
        req => req.type === "min_subtotal"
      )
      if (minSubtotal) {
        option.requirements.min_subtotal = {
          amount: minSubtotal.amount / 100,
          id: minSubtotal.id,
        }
      }
      const maxSubtotal = shippingOption.requirements.find(
        req => req.type === "max_subtotal"
      )
      if (maxSubtotal) {
        option.requirements.max_subtotal = {
          amount: maxSubtotal.amount / 100,
          id: maxSubtotal.id,
        }
      }
    }

    reset({ ...option, amount: option.amount / 100 })

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
    Medusa.shippingOptions.delete(shippingOption.id).then(() => {
      if (onDone) {
        onDone()
      }
      onClick()
    })
  }

  const handleSave = data => {
    const reqs = Object.entries(data.requirements).reduce(
      (acc, [key, value]) => {
        if (parseInt(value.amount) && parseInt(value.amount) > 0) {
          const reqType = shippingOption.requirements.find(
            req => req.type === key
          )
          if (reqType) {
            acc.push({
              type: key,
              amount: Math.round(value.amount * 100),
              id: reqType.id,
            })
          } else {
            acc.push({
              type: key,
              amount: Math.round(value.amount * 100),
            })
          }
          return acc
        } else {
          return acc
        }
      },
      []
    )

    const payload = {
      name: data.name,
      amount: Math.round(data.amount * 100),
      requirements: reqs,
      admin_only: adminOnly,
    }

    if (data.metadata) {
      payload.metadata = data.metadata.reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})
    }

    Medusa.shippingOptions.update(shippingOption.id, payload).then(() => {
      if (onDone) {
        onDone()
      }
      onClick()
    })
  }

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(handleSave)}>
        <Modal.Header>
          <Text>Edit Shipping Option</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={2}>
            <Text fontSize={1} fontWeight="500">
              Fulfillment Method
            </Text>
            <Text fontSize={1} sx={{ fontWeight: "300" }}>
              {shippingOption.data.id} via {shippingOption.provider_id}
            </Text>
          </Box>
          <Box mb={3}>
            <Input
              mt={2}
              label="Name"
              name="name"
              ref={register}
              boldLabel={true}
            />
          </Box>
          <Box mb={4}>
            <Text fontSize={1} fontWeight={300} mb={2} fontWeight="500">
              Price
            </Text>
            <CurrencyInput
              ref={register}
              name={"amount"}
              currency={region.currency_code.toUpperCase()}
            />
          </Box>
          <Flex flexDirection="column" minHeight="50px">
            <Label width={"200px"} fontSize={1}>
              <Checkbox
                id="true"
                name="requires_shipping"
                value="true"
                checked={!adminOnly}
                onChange={() => setAdminOnly(!adminOnly)}
              />
              Show on website
            </Label>
          </Flex>
          <Flex mb={4} flexDirection="column">
            <Text fontSize={1} fontWeight={300} mb={2} fontWeight="500">
              Requirements
            </Text>
            <Flex justifyContent="space-between" mt={2} width="100%">
              <CurrencyInput
                inline
                start={true}
                width="100%"
                fontSize="12px"
                label="Min. subtotal"
                name={`requirements.min_subtotal.amount`}
                currency={region.currency_code.toUpperCase()}
                ref={register}
                boldLabel={true}
              />
            </Flex>
            <Flex justifyContent="space-between" mt={2} width="100%">
              <CurrencyInput
                inline
                width="100%"
                start={true}
                label="Max. subtotal"
                fontSize="12px"
                name={`requirements.max_subtotal.amount`}
                currency={region.currency_code.toUpperCase()}
                ref={register}
                boldLabel={true}
              />
            </Flex>
          </Flex>
          <Flex mb={4} flexDirection="column">
            {/* <Text fontSize={1} fontWeight={300} mb={2}>
              Metadata
            </Text> */}
            {/* {metaFields.map((field, index) => (
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
            ))} */}
            {/* <Button
              onClick={() =>
                metaAppend({ id: metaFields.length, key: "", value: "" })
              }
              variant="primary"
            >
              + Add metadata
            </Button> */}
          </Flex>
          <Box mb={4}>
            <Text mb={2} fontSize={1}>
              Danger Zone
            </Text>
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
