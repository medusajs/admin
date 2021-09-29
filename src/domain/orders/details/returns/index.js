import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio, Label } from "@rebass/forms"
import { useForm } from "react-hook-form"
import styled from "@emotion/styled"

import useMedusa from "../../../../hooks/use-medusa"
import ReturnReasonsDropdown from "../../../../components/return-reasons-dropdown"
import Modal from "../../../../components/modal"
import Typography from "../../../../components/typography"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Button from "../../../../components/button"
import Select from "../../../../components/select"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"
import { ReactComponent as TrashIcon } from "../../../../assets/svg/trash.svg"

const StyledLabel = styled(Label)`
  ${Typography.Base}

  input[type="radio"]:checked ~ svg {
    color: #79b28a;
  }
`

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
  const [returnReasons, setReturnReasons] = useState([])

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
    }
  }, [order])

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
      [item.id]: parseInt(element.value),
    }

    setQuantities(newQuantities)
  }

  const handleReturnReason = (returnReason, item) => {
    const newReturnReasons = {
      ...returnReasons,
      [item.id]: returnReason,
    }

    setReturnReasons(newReturnReasons)
  }

  const onSubmit = () => {
    const items = toReturn.map(t => ({
      item_id: t,
      quantity: quantities[t],
      reason_id: returnReasons[t]?.id,
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
        price: shippingPrice / (1 + order.tax_rate / 100),
      }
    }

    console.log(data)
    return

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
    const element = e.target
    if (element.value !== "Add a shipping method") {
      const method = shippingOptions.find(o => element.value === o.id)
      setShippingMethod(method)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
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
        <Modal.Header fontWeight={600}>Create Return</Modal.Header>
        <Modal.Content width="650px" flexDirection="column">
          <Box mb={3}>
            <Flex
              sx={{
                borderBottom: "hairline",
              }}
              justifyContent="space-between"
              fontSize={1}
              py={2}
              mb={2}
            >
              <Box width={30} px={2} py={1}>
                <input
                  checked={returnAll}
                  onChange={handleReturnAll}
                  type="checkbox"
                />
              </Box>
              <Flex
                fontWeight={500}
                justifyContent="space-between"
                width={9 / 10}
              >
                <Box width={1 / 4} px={2} py={1}>
                  DETAILS
                </Box>
                <Box width={1 / 3} px={2} py={1}>
                  REASON
                </Box>
                <Box width={1 / 5} px={2} py={1}>
                  QUANTITY
                </Box>
                <Box width={1 / 4} px={2} justifyContent="flex-end" py={1}>
                  REFUNDABLE
                </Box>
              </Flex>
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
                  mt={1}
                  sx={{ borderBottom: "hairline" }}
                >
                  <Box width={30} px={2} py={1}>
                    <input
                      checked={toReturn.includes(item.id)}
                      onChange={() => handleReturnToggle(item)}
                      type="checkbox"
                    />
                  </Box>
                  <Flex
                    justifyContent="space-between"
                    alignContent="center"
                    width={9 / 10}
                  >
                    <Box
                      width={1 / 4}
                      px={2}
                      py={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Text fontSize={1} lineHeight={"14px"}>
                        {item.title}
                      </Text>
                      <Text fontSize={0}>{item.variant.sku}</Text>
                    </Box>
                    <Box
                      width={1 / 3}
                      py={1}
                      pr={4}
                      sx={{ alignItems: "center" }}
                    >
                      <ReturnReasonsDropdown
                        setReturnReason={rr => handleReturnReason(rr, item)}
                      />
                    </Box>
                    <Box
                      width={1 / 5}
                      px={2}
                      py={1}
                      sx={{ alignItems: "center" }}
                    >
                      {toReturn.includes(item.id) ? (
                        <Input
                          width="50%"
                          type="number"
                          onChange={e => handleQuantity(e, item)}
                          value={quantities[item.id] || ""}
                          min={1}
                          max={item.quantity - item.returned_quantity}
                        />
                      ) : (
                        <Text py={1}>
                          {item.quantity - item.returned_quantity}
                        </Text>
                      )}
                    </Box>
                    <Box
                      width={1 / 4}
                      px={2}
                      py={1}
                      sx={{ alignItems: "center" }}
                    >
                      <Text fontSize={1} py={1}>
                        {(item.refundable / 100).toFixed(2)}{" "}
                        {order.currency_code.toUpperCase()}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
              )
            })}
          </Box>

          <Flex width={1} justifyContent="flex-end">
            <Flex width={2 / 3} flexDirection="column">
              <Flex mb={3} flexDirection="column">
                <Flex width={1} pt={2} justifyContent="space-between">
                  {!shippingMethod ? (
                    <Flex
                      width={1}
                      height="33px"
                      justifyContent="space-between"
                    >
                      <Text fontSize={1}>Shipping method</Text>
                      <Select
                        mr={2}
                        height={"32px"}
                        fontSize={1}
                        selectStyle={{ disabled: true }}
                        placeholder={"Add a shipping method"}
                        value={shippingMethod?.name}
                        onChange={handleShippingSelected}
                        options={shippingOptions.map(o => ({
                          label: o.name,
                          value: o.id,
                        }))}
                      />{" "}
                    </Flex>
                  ) : (
                    <Flex width={1} justifyContent="space-between">
                      <Box fontSize={1}>{shippingMethod.name}</Box>
                      <Flex px={2} alignItems="center" width={"170px"}>
                        <CurrencyInput
                          currency={order.currency_code}
                          value={shippingPrice / 100}
                          onChange={handleUpdateShippingPrice}
                          mr={2}
                        />
                        <TrashIcon
                          onClick={() => {
                            setShippingMethod()
                            setShippingPrice(0)
                          }}
                          fill="#3b77ff"
                          height="20px"
                          width="20px"
                          cursor="pointer"
                        />
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Flex>

              {refundable >= 0 && (
                <Flex
                  sx={{
                    borderTop: "hairline",
                  }}
                  w={1}
                  // mt={1}
                  pt={3}
                  justifyContent="space-between"
                >
                  <Box fontSize={1}>To refund</Box>
                  <Box px={2} width={"170px"}>
                    <CurrencyInput
                      currency={order.currency_code}
                      value={refundAmount / 100}
                      onChange={handleRefundUpdated}
                    />
                  </Box>
                </Flex>
              )}
            </Flex>
          </Flex>
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
          <Flex>
            <Button
              mr={2}
              loading={submitting}
              onClick={onDismiss}
              variant="primary"
            >
              Cancel
            </Button>
            <Button loading={submitting} type="submit" variant="cta">
              Complete
            </Button>
          </Flex>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReturnMenu
