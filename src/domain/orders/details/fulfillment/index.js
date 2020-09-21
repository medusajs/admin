import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Button from "../../../../components/button"

import useMedusa from "../../../../hooks/use-medusa"

const FulfillMenu = ({ order, onFulfill, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [itemError, setItemError] = useState("")
  const [fulfillAll, setFulfillAll] = useState(false)
  const [toFulfill, setToFulfill] = useState([])
  const [quantities, setQuantities] = useState({})
  const { control, errors, register, handleSubmit } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata",
  })

  const handleFulfillToggle = item => {
    setItemError("")

    const id = item._id
    const idx = toFulfill.indexOf(id)
    if (idx !== -1) {
      const newFulfills = [...toFulfill]
      newFulfills.splice(idx, 1)
      setToFulfill(newFulfills)

      if (fulfillAll) {
        setFulfillAll(false)
      }
    } else {
      const newFulfills = [...toFulfill, id]
      setToFulfill(newFulfills)

      const newQuantities = {
        ...quantities,
        [item._id]: item.quantity - item.fulfilled_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  const handleQuantity = (e, item) => {
    const element = e.target
    const newQuantities = {
      ...quantities,
      [item._id]: parseInt(element.value),
    }

    setQuantities(newQuantities)
  }

  const onSubmit = data => {
    const items = toFulfill
      .map(t => {
        if (quantities[t]) {
          return {
            item_id: t,
            quantity: quantities[t],
          }
        }
      })
      .filter(t => !!t)

    if (!items.length) {
      setItemError("You must select at least one item to fulfill")
    }

    let metadata = {}
    if (data.metadata) {
      metadata = data.metadata.reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})
    }

    if (onFulfill) {
      setSubmitting(true)
      return onFulfill({
        items,
        metadata,
      })
        .then(() => onDismiss())
        .then(() => toaster("Successfully fulfilled order", "success"))
        .catch(() => toaster("Failed to fulfill order", "error"))
        .finally(() => setSubmitting(false))
    }
  }

  const handleFulfillAll = () => {
    if (fulfillAll) {
      setToFulfill([])
      setFulfillAll(false)
    } else {
      const newFulfills = []
      const newQuantities = {}
      for (const item of order.items) {
        if (!item.fulfilled) {
          newFulfills.push(item._id)
          newQuantities[item._id] = item.quantity - item.fulfilled_quantity
        }
      }
      setQuantities(newQuantities)
      setToFulfill(newFulfills)
      setFulfillAll(true)
    }
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Create Fulfillment</Modal.Header>
        <Modal.Content flexDirection="column">
          {itemError && (
            <Flex mb={2}>
              <Text fontSize={1} color="danger">
                {itemError}
              </Text>
            </Flex>
          )}
          <Flex
            sx={{
              borderBottom: "hairline",
            }}
            justifyContent="space-between"
            fontSize={1}
            py={2}
          >
            <Box width={30} px={2} py={1}>
              <input
                checked={fulfillAll}
                onChange={handleFulfillAll}
                type="checkbox"
              />
            </Box>
            <Box width={400} px={2} py={1}></Box>
            <Box width={75} px={2} py={1}>
              Quantity
            </Box>
          </Flex>
          {order.items.map(item => {
            // Only show items that have not been fulfilled
            if (item.fulfilled) {
              return
            }

            return (
              <Flex justifyContent="space-between" fontSize={2} py={2}>
                <Box width={30} px={2} py={1}>
                  <input
                    checked={toFulfill.includes(item._id)}
                    onChange={() => handleFulfillToggle(item)}
                    type="checkbox"
                  />
                </Box>
                <Box width={400} px={2} py={1}>
                  {item.title}
                </Box>
                <Box width={60} px={2} py={1}>
                  {toFulfill.includes(item._id) ? (
                    <Input
                      type="number"
                      onChange={e => handleQuantity(e, item)}
                      value={quantities[item._id] || ""}
                      min={1}
                      max={item.quantity - item.fulfilled_quantity}
                      defaultValue={item.quantity - item.fulfilled_quantity}
                    />
                  ) : (
                    item.quantity - item.fulfilled_quantity
                  )}
                </Box>
              </Flex>
            )
          })}
          <Flex my={3} flexDirection="column" justifyContent="space-between">
            {fields.map((req, index) => (
              <Flex my={3} justifyContent="space-between">
                <Input
                  mr={4}
                  flex={"0 0 100px"}
                  type="text"
                  placeholder={"Key"}
                  name={`metadata[${index}].key`}
                  invalid={errors.metadata && errors.metadata[index].key}
                  ref={register({
                    required: "Must be filled",
                  })}
                />
                <Input
                  mr={2}
                  flex={"1 1 auto"}
                  placeholder={"Value"}
                  type="text"
                  name={`metadata[${index}].value`}
                  invalid={errors.metadata && errors.metadata[index].value}
                  ref={register({
                    required: "Must be filled",
                  })}
                />
                <Text onClick={() => remove(index)} sx={{ cursor: "pointer" }}>
                  &times;
                </Text>
              </Flex>
            ))}
            <Button
              onClick={() => append({ key: "", value: "" })}
              variant="primary"
            >
              + Add metadata
            </Button>
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button loading={submitting} type="submit" variant="primary">
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default FulfillMenu
