import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Button from "../../../../components/button"

const ReceiveMenu = ({
  order,
  returnRequest,
  onReceiveReturn,
  onDismiss,
  toaster,
}) => {
  const [submitting, setSubmitting] = useState(false)
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
    let returns = []
    let qty = {}
    returnRequest.items.forEach(i => {
      const item = order.items.find(l => l._id === i.item_id)
      if (
        item &&
        !item.returned &&
        item.quantity - item.returned_quantity > 0
      ) {
        returns.push(i.item_id)
        qty = {
          ...qty,
          [i.item_id]: i.quantity,
        }
      }
    })

    setToReturn(returns)
    setQuantities(qty)
  }, [])

  useEffect(() => {
    const items = toReturn.map(t => order.items.find(i => i._id === t))
    const total =
      items.reduce((acc, next) => {
        return acc + (next.refundable / next.quantity) * quantities[next._id]
      }, 0) -
      ((returnRequest.shipping_method && returnRequest.shipping_method.price) ||
        0)

    setRefundable(total)

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(refundAmount < 0 ? 0 : total)
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

    if (onReceiveReturn) {
      setSubmitting(true)
      return onReceiveReturn(returnRequest._id, {
        items,
        refund: refundAmount,
      })
        .then(() => onDismiss())
        .then(() => toaster("Successfully returned order", "success"))
        .catch(() => toaster("Failed to return order", "error"))
        .finally(() => setSubmitting(false))
    }
  }

  const handleRefundUpdated = e => {
    setRefundEdited(true)
    const element = e.target
    const value = element.value

    if (value < order.refundable_amount && value >= 0) {
      setRefundAmount(parseFloat(element.value))
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
        <Modal.Header>Receive Return</Modal.Header>
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
            <Box width={110} px={2} py={1}>
              Refundable
            </Box>
          </Flex>
          {order.items.map(item => {
            // Only show items that have not been returned
            if (item.returned) {
              return
            }

            return (
              <Flex
                key={item._id}
                justifyContent="space-between"
                fontSize={2}
                py={2}
              >
                <Box width={30} px={2} py={1}>
                  <input
                    checked={toReturn.includes(item._id)}
                    onChange={() => handleReturnToggle(item)}
                    type="checkbox"
                  />
                </Box>
                <Box width={400} px={2} py={1}>
                  <Text fontSize={1} lineHeight={"14px"}>
                    {item.title}
                  </Text>
                  <Text fontSize={0}>{item.content.variant.sku}</Text>
                </Box>
                <Box fontSize={1} width={75} px={2} py={1}>
                  {toReturn.includes(item._id) ? (
                    <Input
                      textAlign={"center"}
                      type="number"
                      onChange={e => handleQuantity(e, item)}
                      value={quantities[item._id] || ""}
                      min={1}
                      max={item.quantity - item.returned_quantity}
                    />
                  ) : (
                    item.quantity - item.returned_quantity
                  )}
                </Box>
                <Box width={110} fontSize={1} px={2} py={1}>
                  {item.refundable.toFixed(2)} {order.currency_code}
                </Box>
              </Flex>
            )
          })}
          {returnRequest.shipping_method &&
            returnRequest.shipping_method.price !== undefined && (
              <Flex
                sx={{
                  borderTop: "hairline",
                }}
                w={1}
                mt={3}
                pt={3}
                justifyContent="flex-end"
              >
                <Box fontSize={1} px={2}>
                  Shipping cost
                </Box>
                <Box px={2} fontSize={1} width={110}>
                  {returnRequest.shipping_method.price.toFixed(2)}{" "}
                  {order.currency_code}
                </Box>
              </Flex>
            )}
          <Flex
            sx={{
              borderTop: "hairline",
            }}
            w={1}
            mt={3}
            pt={3}
            justifyContent="flex-end"
          >
            <Box fontSize={1} px={2}>
              To refund
            </Box>
            <Box px={2} width={110}>
              <CurrencyInput
                currency={order.currency_code}
                value={refundAmount}
                onChange={handleRefundUpdated}
              />
            </Box>
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

export default ReceiveMenu
