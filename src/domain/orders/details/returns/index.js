import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm } from "react-hook-form"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Button from "../../../../components/button"

import useMedusa from "../../../../hooks/use-medusa"

const ReturnMenu = ({ order, onReturn, onDismiss, toaster }) => {
  const [refundEdited, setRefundEdited] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})
  const { register, setValue, handleSubmit } = useForm()

  const handleReturnToggle = item => {
    const id = item._id
    const idx = toReturn.indexOf(id)
    if (idx !== -1) {
      const newReturns = [...toReturn]
      newReturns.splice(idx, 1)
      setToReturn(newReturns)

      if (returnAll) {
        setReturnAll(false)
      }
    } else {
      const newReturns = [...toReturn, id]
      setToReturn(newReturns)

      const newQuantities = {
        ...quantities,
        [item._id]: item.quantity - item.returned_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  useEffect(() => {
    const items = toReturn.map(t => order.items.find(i => i._id === t))
    const total = items.reduce((acc, next) => {
      return acc + (next.refundable / next.quantity) * quantities[next._id]
    }, 0)

    setRefundable(total)

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(total)
    }
  }, [toReturn, quantities])

  const handleQuantity = (e, item) => {
    const element = e.target
    const newQuantities = {
      ...quantities,
      [item._id]: parseInt(element.value),
    }

    setQuantities(newQuantities)
  }

  const onSubmit = () => {
    const items = toReturn.map(t => ({
      item_id: t,
      quantity: quantities[t],
    }))

    if (onReturn) {
      return onReturn({
        items,
        refund: refundAmount,
      })
        .then(() => onDismiss())
        .then(() => toaster("Successfully returned order", "success"))
        .catch(() => toaster("Failed to return order", "error"))
    }
  }

  const handleRefundUpdated = e => {
    setRefundEdited(true)
    const element = e.target
    const value = parseFloat(element.value) || ""

    if (value === "" || (value < order.refundable_amount && value >= 0)) {
      setRefundAmount(value)
    }
  }

  const handleReturnAll = () => {
    if (returnAll) {
      setToReturn([])
      setReturnAll(false)
    } else {
      const newReturns = []
      const newQuantities = {}
      for (const item of order.items) {
        if (!item.returned) {
          newReturns.push(item._id)
          newQuantities[item._id] = item.quantity - item.returned_quantity
        }
      }
      setQuantities(newQuantities)
      setToReturn(newReturns)
      setReturnAll(true)
    }
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Register Return</Modal.Header>
        <Modal.Content flexDirection="column">
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
                checked={returnAll}
                onChange={handleReturnAll}
                type="checkbox"
              />
            </Box>
            <Box width={400} px={2} py={1}></Box>
            <Box width={75} px={2} py={1}>
              Quantity
            </Box>
            <Box px={2} py={1}>
              Refundable
            </Box>
          </Flex>
          {order.items.map(item => {
            // Only show items that have not been returned
            if (item.returned) {
              return
            }

            return (
              <Flex justifyContent="space-between" fontSize={2} py={2}>
                <Box width={30} px={2} py={1}>
                  <input
                    checked={toReturn.includes(item._id)}
                    onChange={() => handleReturnToggle(item)}
                    type="checkbox"
                  />
                </Box>
                <Box width={400} px={2} py={1}>
                  {item.title}
                </Box>
                <Box width={60} px={2} py={1}>
                  {toReturn.includes(item._id) ? (
                    <Input
                      type="number"
                      onChange={e => handleQuantity(e, item)}
                      value={quantities[item._id] || ""}
                      min={1}
                      max={item.quantity - item.returned_quantity}
                      defaultValue={item.quantity - item.returned_quantity}
                    />
                  ) : (
                    item.quantity - item.returned_quantity
                  )}
                </Box>
                <Box px={2} py={1}>
                  {item.refundable} {order.currency_code}
                </Box>
              </Flex>
            )
          })}
          {refundable > 0 && (
            <Flex
              sx={{
                borderTop: "hairline",
              }}
              w={1}
              mt={3}
              pt={3}
              justifyContent="space-between"
            >
              <Box px={2}>To refund</Box>
              <Box px={2} width={110}>
                <CurrencyInput
                  currency={order.currency_code}
                  value={refundAmount}
                  onChange={handleRefundUpdated}
                />
              </Box>
            </Flex>
          )}
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

export default ReturnMenu
