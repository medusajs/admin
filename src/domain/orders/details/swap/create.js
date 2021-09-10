import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import MultiSelect from "react-multi-select-component"

import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import Select from "../../../../components/select"
import Typography from "../../../../components/typography"
import Medusa from "../../../../services/api"

const Dot = styled(Box)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
`

const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  width: 200px;
  text-overflow: ellipsis;

  line-height: 1.22;

  border: none;
  outline: 0;

  transition: all 0.2s ease;

  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px;

  &:focus: {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }
  &::placeholder: {
    color: #a3acb9;
  }

  .go3433208811 {
    border: none;
    border-radius: 3px;
  }
`

const extractPrice = (prices, order) => {
  let price = prices.find(ma => ma.region_id === order.region_id)

  if (!price) {
    price = prices.find(ma => ma.currency_code === order.currency_code)
  }

  if (price) {
    return (price.amount * (1 + order.tax_rate / 100)) / 100
  }

  return 0
}

const SwapMenu = ({ order, onCreate, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [toPay, setToPay] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})

  const [itemsToAdd, setItemsToAdd] = useState([])
  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [searchResults, setSearchResults] = useState([])

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState([])

  const { register, setValue, handleSubmit } = useForm()

  useEffect(() => {
    if (order) {
      let temp = [...order.items]

      if (order.swaps && order.swaps.length) {
        for (const s of order.swaps) {
          temp = [...temp, ...s.additional_items]
        }
      }

      setAllItems(temp)
    }
  }, [order])

  const handleAddItemToSwap = variant => {
    setItemsToAdd([...itemsToAdd, { ...variant, quantity: 1 }])
  }

  const isLineItemCanceled = item => {
    const { swap_id, claim_order_id } = item
    const travFind = (col, id) =>
      col.filter(f => f.id == id && f.canceled_at).length > 0

    if (swap_id) return travFind(order.swaps, swap_id)
    if (claim_order_id) return travFind(order.claims, claim_order_id)
    return false
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
    const returnTotal =
      items.reduce((acc, next) => {
        return (
          acc +
          (next.refundable / (next.quantity - next.returned_quantity)) *
            quantities[next.id]
        )
      }, 0) - (shippingPrice || 0)

    const newItemsTotal = itemsToAdd.reduce((acc, next) => {
      const price = extractPrice(next.prices, order)
      const lineTotal = price * 100 * next.quantity
      return acc + lineTotal
    }, 0)

    setToPay(newItemsTotal - returnTotal)
  }, [toReturn, quantities, shippingPrice, itemsToAdd])

  const handleQuantity = (e, item) => {
    const element = e.target
    const newQuantities = {
      ...quantities,
      [item.id]: parseInt(element.value),
    }

    setQuantities(newQuantities)
  }

  const onSubmit = () => {
    const data = {
      return_items: toReturn.map(t => ({
        item_id: t,
        quantity: quantities[t],
      })),
      additional_items: itemsToAdd.map(i => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod,
        price: Math.round(shippingPrice / (1 + order.tax_rate / 100)),
      }
    }

    if (onCreate) {
      setSubmitting(true)
      return onCreate(data)
        .then(() => onDismiss())
        .then(() => toaster("Successfully created swap", "success"))
        .catch(() => toaster("Failed to create swap order", "error"))
        .finally(() => setSubmitting(false))
    }
  }

  const handleToAddQuantity = (e, index) => {
    const updated = [...itemsToAdd]
    updated[index] = {
      ...itemsToAdd[index],
      quantity: parseInt(e.target.value),
    }

    setItemsToAdd(updated)
  }

  const handleRemoveItem = index => {
    const updated = [...itemsToAdd]
    updated.splice(index, 1)
    setItemsToAdd(updated)
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
      setShippingMethod(element.value)
      const method = shippingOptions.find(o => element.value === o.id)
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

  const handleProductSearch = val => {
    Medusa.variants
      .list({
        q: val,
      })
      .then(({ data }) => {
        setSearchResults(data.variants)
      })
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Create Swap</Modal.Header>
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
              <Box width={170} px={2} py={1}>
                Refundable
              </Box>
            </Flex>
            {allItems.map(item => {
              // Only show items that have not been returned
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
                  <Box width={170} px={2} py={1}>
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
            <Text>Return shipping method</Text>
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
                  value: o.id,
                }))}
              />
              {shippingMethod && (
                <Flex>
                  <Box px={2} fontSize={1}>
                    Shipping price (incl. taxes)
                  </Box>
                  <Box px={2} width={170}>
                    <CurrencyInput
                      currency={order.currency_code}
                      value={shippingPrice / 100}
                      onChange={handleUpdateShippingPrice}
                    />
                  </Box>
                </Flex>
              )}
            </Flex>
          </Box>

          <Box my={3}>
            <Text>Items to send</Text>
            <Box mt={2}>
              <Dropdown
                leftAlign
                toggleText={"+ Add product"}
                showSearch
                onSearchChange={handleProductSearch}
                searchPlaceholder={"Search by SKU, Name, etch."}
              >
                {searchResults.map(s => (
                  <Flex
                    key={s.variant_id}
                    alignItems="center"
                    onClick={() => handleAddItemToSwap(s)}
                  >
                    <Dot
                      mr={3}
                      bg={s.inventory_quantity > 0 ? "green" : "danger"}
                    />
                    <Box>
                      <Text fontSize={0} mb={0} lineHeight={1}>
                        {s.product.title} - {s.title}
                      </Text>
                      <Flex>
                        <Text width={"100px"} mt={0} fontSize={"10px"}>
                          {s.sku}
                        </Text>
                        <Text ml={2} mt={0} fontSize={"10px"}>
                          In stock: {s.inventory_quantity}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                ))}
              </Dropdown>
            </Box>
            <Box mt={3}>
              {itemsToAdd.length > 0 && (
                <Flex
                  sx={{
                    borderBottom: "hairline",
                  }}
                  justifyContent="space-between"
                  fontSize={1}
                  py={2}
                >
                  <Box width={30} px={2} py={1}></Box>
                  <Box width={400} px={2} py={1}>
                    Details
                  </Box>
                  <Box width={75} px={2} py={1}>
                    Quantity
                  </Box>
                  <Box width={170} px={2} py={1}>
                    Price
                  </Box>
                </Flex>
              )}
              {itemsToAdd.map((item, index) => {
                return (
                  <Flex
                    key={item.variant_id}
                    justifyContent="space-between"
                    fontSize={2}
                    py={2}
                  >
                    <Box width={30} px={2} py={1}></Box>
                    <Box width={400} px={2} py={1}>
                      <Text fontSize={1} lineHeight={"14px"}>
                        {item.title}
                      </Text>
                      <Text fontSize={0}>{item.sku}</Text>
                    </Box>
                    <Box width={75} px={2} py={1}>
                      <Input
                        type="number"
                        onChange={e => handleToAddQuantity(e, index)}
                        value={item.quantity || ""}
                        min={1}
                      />
                    </Box>
                    <Box width={170} px={2} py={1}>
                      <Text fontSize={1}>
                        {extractPrice(item.prices, order).toFixed(2)}{" "}
                        {order.currency_code.toUpperCase()}
                      </Text>
                    </Box>
                    <Box onClick={() => handleRemoveItem(index)}>&times;</Box>
                  </Flex>
                )
              })}
            </Box>
          </Box>
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
              Difference
            </Box>
            <Box px={2} width={170} fontSize={1}>
              {(toPay / 100).toFixed(2)} {order.currency_code.toUpperCase()}
            </Box>
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
          <Button
            disabled={toReturn.length === 0 || itemsToAdd.length === 0}
            loading={submitting}
            type="submit"
            variant="primary"
          >
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default SwapMenu
