import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/molecules/input"
import Button from "../../../../components/button"

import useMedusa from "../../../../hooks/use-medusa"
import { getErrorMessage } from "../../../../utils/error-messages"

const FulfillmentEdit = ({
  order,
  swap,
  claim,
  type,
  fulfillment,
  onCreateClaimShipment,
  onCreateSwapShipment,
  onCreateShipment,
  onDismiss,
  toaster,
}) => {
  const { control, errors, register, setValue, handleSubmit } = useForm({})

  const {
    fields: trackingNumbers,
    append: appendTracking,
    remove: removeTracking,
  } = useFieldArray({
    control,
    name: "tracking_numbers",
  })

  useEffect(() => {
    appendTracking({
      value: "",
    })
  }, [])

  const onSubmit = data => {
    const tracking_numbers = data.tracking_numbers.map(({ value }) => value)

    switch (type) {
      case "swap":
        if (onCreateSwapShipment) {
          return onCreateSwapShipment(swap.id, {
            fulfillment_id: fulfillment.id,
            tracking_numbers,
          })
            .then(() => onDismiss())
            .then(() => toaster("Fulfillment was marked shipped", "success"))
            .catch(error => toaster(getErrorMessage(error), "error"))
        }
        break

      case "claim":
        if (onCreateClaimShipment) {
          return onCreateClaimShipment(claim.id, {
            fulfillment_id: fulfillment.id,
            tracking_numbers,
          })
            .then(() => onDismiss())
            .then(() => toaster("Fulfillment was marked shipped", "success"))
            .catch(error => toaster(getErrorMessage(error), "error"))
        }
        break

      default:
        if (onCreateShipment) {
          return onCreateShipment({
            fulfillment_id: fulfillment.id,
            tracking_numbers,
          })
            .then(() => onDismiss())
            .then(() => toaster("Fulfillment was marked shipped", "success"))
            .catch(error => toaster(getErrorMessage(error), "error"))
        }
        break
    }
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body width={"600px"} as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Mark fulfillment shipped</Modal.Header>
        <Modal.Content flexDirection="column">
          <Flex my={3} flexDirection="column">
            {trackingNumbers.map((_, index) => (
              <Flex mb={3}>
                <Box flex={1}>
                  <Input
                    inline
                    deletable={index !== 0}
                    label={index === 0 ? "Tracking Numbers" : " "}
                    type="text"
                    placeholder={"Tracking Number"}
                    name={`tracking_numbers[${index}].value`}
                    invalid={
                      errors.tracking_numbers && errors.tracking_numbers[index]
                    }
                    ref={register({
                      required: "Must be filled",
                    })}
                    onDelete={() => removeTracking(index)}
                  />
                </Box>
              </Flex>
            ))}
            <Flex>
              <Box flex={"30% 0 0"} />
              <Button
                flex={"0 0 auto"}
                onClick={() => appendTracking({ key: "", value: "" })}
                variant="primary"
              >
                + Add additional tracking numbers
              </Button>
            </Flex>
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default FulfillmentEdit
