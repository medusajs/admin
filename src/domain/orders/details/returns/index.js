import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm } from "react-hook-form"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Button from "../../../../components/button"
import Select from "../../../../components/select"
import Medusa from "../../../../services/api"

const ReturnMenu = ({ order, onReturn, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [refundEdited, setRefundEdited] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [refundable, setRefundable] = useState(0)
  const [refundAmount, setRefundAmount] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})

  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()

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
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: true,
      })
      .then(({ data }) => {
        setShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    const items = toReturn.map(t => order.items.find(i => i._id === t))
    const total =
      items.reduce((acc, next) => {
        return acc + (next.refundable / next.quantity) * quantities[next._id]
      }, 0) - (shippingPrice || 0)

    setRefundable(total)

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(total)
    }
  }, [toReturn, quantities, shippingPrice])

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

    let data = {
      items,
      refund: refundAmount,
    }
    if (shippingMethod) {
      data.shipping_method = shippingMethod
      data.shipping_price = shippingPrice / (1 + order.tax_rate)
    }

    if (onReturn) {
      setSubmitting(true)
      return onReturn(data)
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

  const handleShippingSelected = e => {
    const element = e.target
    if (element.value !== "Add a shipping method") {
      setShippingMethod(element.value)
      const method = shippingOptions.find(o => element.value === o._id)
      setShippingPrice(method.price.amount)
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  const handleUpdateShippingPrice = e => {
    const element = e.target
    const value = element.value
    if (value >= 0) {
      setShippingPrice(parseFloat(value))
    }
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Request Return</Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text px={2}>Items to return</Text>
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
              <Box width={400} px={2} py={1}>
                Details
              </Box>
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
                  <Box width={75} px={2} py={1}>
                    {toReturn.includes(item._id) ? (
                      <Input
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
                  <Box width={110} px={2} py={1}>
                    <Text fontSize={1}>
                      {item.refundable.toFixed(2)} {order.currency_code}
                    </Text>
                  </Box>
                </Flex>
              )
            })}
          </Box>

          <Box mb={3}>
            <Text>Shipping method</Text>
            <Flex w={1} pt={2} justifyContent="space-between">
              <Select
                mr={3}
                height={"32px"}
                fontSize={1}
                placeholder={"Add a shipping method"}
                value={shippingMethod}
                onChange={handleShippingSelected}
                options={shippingOptions.map(o => ({
                  label: o.name,
                  value: o._id,
                }))}
              />
              {shippingMethod && (
                <Flex>
                  <Box px={2} fontSize={1}>
                    Shipping price (incl. taxes)
                  </Box>
                  <Box px={2} width={110}>
                    <CurrencyInput
                      currency={order.currency_code}
                      value={shippingPrice}
                      onChange={handleUpdateShippingPrice}
                    />
                  </Box>
                </Flex>
              )}
            </Flex>
          </Box>

          {refundable >= 0 && (
            <Flex
              sx={{
                borderTop: "hairline",
              }}
              w={1}
              mt={3}
              pt={3}
              justifyContent="flex-end"
            >
              <Box px={2} fontSize={1}>
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
          )}
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

export default ReturnMenu
