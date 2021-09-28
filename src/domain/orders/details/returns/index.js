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
import { filterItems } from "../utils/create-filtering"
import { extractOptionPrice } from "../../../../utils/prices"
import { ReactSelect } from "../../../../components/react-select"

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
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [shippingPrice, setShippingPrice] = useState()
  const [shippingMethod, setShippingMethod] = useState()

  const { register, setValue, handleSubmit } = useForm()

  const [allItems, setAllItems] = useState([])

  const [showCustomPrice, setShowCustomPrice] = useState({
    standard: false,
    return: false,
  })
  const [customOptionPrice, setCustomOptionPrice] = useState({
    standard: 0,
    return: null,
  })

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
    }
  }, [order])

  const calculateShippingPrice = () => {
    return showCustomPrice.return && customOptionPrice.return
      ? customOptionPrice.return * 100
      : Math.round(shippingPrice / (1 + order.tax_rate / 100))
  }

  const handleReturnToggle = item => {
    const id = item.id
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
        [item.id]: item.quantity - item.returned_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  const isLineItemCanceled = item => {
    const { swap_id, claim_order_id } = item
    const travFind = (col, id) =>
      col.filter(f => f.id == id && f.canceled_at).length > 0

    if (swap_id) return travFind(order.swaps, swap_id)
    if (claim_order_id) return travFind(order.claims, claim_order_id)
    return false
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
    const items = toReturn.map(t => allItems.find(i => i.id === t))
    const total =
      items.reduce((acc, next) => {
        return (
          acc +
          (next.refundable / (next.quantity - next.returned_quantity)) *
            quantities[next.id]
        )
      }, 0) - (calculateShippingPrice() || 0)

    setRefundable(total)

    if (!refundEdited || total < refundAmount) {
      setRefundAmount(total)
    }
  }, [toReturn, quantities, shippingPrice, customOptionPrice, showCustomPrice])

  const handleQuantity = (e, item) => {
    const element = e.target
    const newQuantities = {
      ...quantities,
      [item.id]: parseInt(element.value),
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
      refund: Math.round(refundAmount),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod.id,
        price: calculateShippingPrice(),
      }
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
      setRefundAmount(parseFloat(element.value) * 100)
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
          newReturns.push(item.id)
          newQuantities[item.id] = item.quantity - item.returned_quantity
        }
      }
      setQuantities(newQuantities)
      setToReturn(newReturns)
      setReturnAll(true)
    }
  }

  const handleShippingSelected = e => {
    const element = shippingOptions.find(s => e.value === s.id)
    if (element) {
      setShippingMethod(element)
      setShippingPrice(element.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  const handleUpdateShippingPrice = e => {
    const element = e.target
    const value = element.value
    if (value >= 0) {
      setShippingPrice(parseFloat(value) * 100)
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
            {allItems.map(item => {
              // Only show items that have not been returned,
              // and aren't canceled
              if (
                item.returned_quantity === item.quantity ||
                isLineItemCanceled(item)
              ) {
                return
              }

              return (
                <Flex
                  key={item.id}
                  justifyContent="space-between"
                  fontSize={2}
                  py={2}
                >
                  <Box width={30} px={2} py={1}>
                    <input
                      checked={toReturn.includes(item.id)}
                      onChange={() => handleReturnToggle(item)}
                      type="checkbox"
                    />
                  </Box>
                  <Box width={400} px={2} py={1}>
                    <Text fontSize={1} lineHeight={"14px"}>
                      {item.title}
                    </Text>
                    <Text fontSize={0}>{item.variant.sku}</Text>
                  </Box>
                  <Box width={75} px={2} py={1}>
                    {toReturn.includes(item.id) ? (
                      <Input
                        type="number"
                        onChange={e => handleQuantity(e, item)}
                        value={quantities[item.id] || ""}
                        min={1}
                        max={item.quantity - item.returned_quantity}
                      />
                    ) : (
                      item.quantity - item.returned_quantity
                    )}
                  </Box>
                  <Box width={110} px={2} py={1}>
                    <Text fontSize={1}>
                      {(item.refundable / 100).toFixed(2)}{" "}
                      {order.currency_code.toUpperCase()}
                    </Text>
                  </Box>
                </Flex>
              )
            })}
          </Box>

          <Box mb={3}>
            <Text sx={{ fontSize: 1, fontWeight: 600 }}>
              Shipping method for returning items:
            </Text>
            <ReactSelect
              isClearable={false}
              placeholder="Select shipping..."
              onChange={handleShippingSelected}
              options={
                shippingOptions?.map(so => ({
                  value: so.id,
                  label: `${so.name} - ${extractOptionPrice(
                    so.amount,
                    so.region
                  )}`,
                })) || []
              }
            />
            <Flex>
              {shippingMethod ? (
                <>
                  <Text fontStyle="italic" fontSize={1} mt={1} color="#a2a1a1">
                    Shipping to {shippingMethod.region.name}
                  </Text>
                  <Box ml="auto" />
                  <Flex flexDirection="column">
                    {!showCustomPrice.return && (
                      <Button
                        mt={2}
                        fontSize="12px"
                        variant="primary"
                        width="140px"
                        mb={2}
                        disabled={!shippingMethod}
                        onClick={() =>
                          setShowCustomPrice({
                            ...showCustomPrice,
                            return: true,
                          })
                        }
                      >
                        {showCustomPrice.return ? "Submit" : "Set custom price"}
                      </Button>
                    )}
                    {showCustomPrice.return && (
                      <Flex flexDirection="column">
                        <Flex width="140px" mt={3}>
                          <Input
                            type="number"
                            fontSize="12px"
                            onChange={e =>
                              setCustomOptionPrice({
                                ...customOptionPrice,
                                return: e.currentTarget.value,
                              })
                            }
                            value={customOptionPrice.return || null}
                            placeholder={order.currency_code.toUpperCase()}
                            min={0}
                          />
                          <Flex
                            px={2}
                            alignItems="center"
                            onClick={() =>
                              setShowCustomPrice({
                                ...showCustomPrice,
                                return: false,
                              })
                            }
                          >
                            &times;
                          </Flex>
                        </Flex>
                        <Text fontSize="10px" fontStyle="italic">
                          Custom price
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </>
              ) : null}
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
              <Box px={2} width={"170px"}>
                <CurrencyInput
                  currency={order.currency_code}
                  value={refundAmount / 100}
                  onChange={handleRefundUpdated}
                />
              </Box>
            </Flex>
          )}
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
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
          <Button loading={submitting} type="submit" variant="primary">
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReturnMenu
