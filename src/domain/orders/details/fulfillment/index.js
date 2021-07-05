import React, { useState } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import Button from "../../../../components/button"

const FulfillMenu = ({ type, order, onFulfill, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [itemError, setItemError] = useState("")
  const [fulfillAll, setFulfillAll] = useState(false)
  const [toFulfill, setToFulfill] = useState([])
  const [quantities, setQuantities] = useState({})
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const { control, errors, register, handleSubmit } = useForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata",
  })

  const handleFulfillToggle = item => {
    setItemError("")

    const id = item.id
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
        [item.id]: item.quantity - item.fulfilled_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  const handleQuantity = (e, item) => {
    const element = e.target
    const newQuantities = {
      ...quantities,
      [item.id]: parseInt(element.value),
    }

    setQuantities(newQuantities)
  }

  const onSubmit = data => {
    let metadata = {}
    if (data.metadata) {
      metadata = data.metadata.reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})
    }

    switch (type) {
      case "claim":
      case "swap":
        setSubmitting(true)
        return onFulfill(order.id, {
          metadata,
        })
          .then(() => onDismiss())
          .then(() => toaster(`Successfully fulfilled ${type}`, "success"))
          .catch(() => toaster(`Failed to fulfill ${type}`, "error"))
          .finally(() => setSubmitting(false))
      default:
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

        if (onFulfill) {
          setSubmitting(true)
          return onFulfill({
            items,
            metadata,
            no_notification:
              noNotification !== order.no_notification
                ? noNotification
                : undefined,
          })
            .then(() => onDismiss())
            .then(() => toaster("Successfully fulfilled order", "success"))
            .catch(() => toaster("Failed to fulfill order", "error"))
            .finally(() => setSubmitting(false))
        }
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
          newFulfills.push(item.id)
          newQuantities[item.id] = item.quantity - item.fulfilled_quantity
        }
      }
      setQuantities(newQuantities)
      setToFulfill(newFulfills)
      setFulfillAll(true)
    }
  }

  const items = type === "default" ? order.items : order.additional_items

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
              {type === "default" && (
                <input
                  checked={fulfillAll}
                  onChange={handleFulfillAll}
                  type="checkbox"
                />
              )}
            </Box>
            <Box width={400} px={2} py={1}>
              Details
            </Box>
            <Box textAlign="center" width={75} px={2} py={1}>
              Quantity
            </Box>
          </Flex>
          {items.map(item => {
            // Only show items that have not been fulfilled
            if (item.fulfilled) {
              return
            }

            return (
              <Flex justifyContent="space-between" fontSize={2} py={2}>
                <Box width={30} px={2} py={1}>
                  {type === "default" && (
                    <input
                      checked={toFulfill.includes(item.id)}
                      onChange={() => handleFulfillToggle(item)}
                      type="checkbox"
                    />
                  )}
                </Box>
                <Box width={400} px={2} py={1}>
                  {item.title}
                </Box>
                <Box textAlign="center" width={75} px={2} py={1}>
                  {toFulfill.includes(item.id) ? (
                    <Input
                      type="number"
                      onChange={e => handleQuantity(e, item)}
                      value={quantities[item.id] || ""}
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
        <Modal.Footer justifyContent="space-between">
          {type !== "claim" && type !== "swap" && (
            <Flex>
              <Box px={0} py={1}>
                <input
                  id="noNotification"
                  name="noNotification"
                  checked={!noNotification}
                  onChange={() => setNoNotification(!noNotification)}
                  type="checkbox"
                />
              </Box>
              <Box px={2} py={1}>
                <Text fontSize={1}>Send notifications</Text>
              </Box>
            </Flex>
          )}
          <Button loading={submitting} type="submit" variant="primary">
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default FulfillMenu
