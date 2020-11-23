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
    return price.amount * (1 + order.tax_rate)
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
  const [searchResults, setSearchResults] = useState([])

  const { register, setValue, handleSubmit } = useForm()

  const handleAddItemToSwap = variant => {
    setItemsToAdd([...itemsToAdd, { ...variant, quantity: 1 }])
  }

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
    const returnTotal =
      items.reduce((acc, next) => {
        return acc + (next.refundable / next.quantity) * quantities[next._id]
      }, 0) - (shippingPrice || 0)

    const newItemsTotal = itemsToAdd.reduce((acc, next) => {
      const price = extractPrice(next.prices, order)
      const lineTotal = price * next.quantity
      return acc + lineTotal
    }, 0)

    setToPay(newItemsTotal - returnTotal)
  }, [toReturn, quantities, shippingPrice, itemsToAdd])

  const handleQuantity = (e, item) => {
    const element = e.target
    const newQuantities = {
      ...quantities,
      [item._id]: parseInt(element.value),
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
        variant_id: i.variant_id,
        quantity: i.quantity,
      })),
    }

    if (shippingMethod) {
      data.return_shipping = {
        id: shippingMethod,
        price: shippingPrice / (1 + order.tax_rate),
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

  const handleProductSearch = val => {
    Medusa.products
      .list({
        q: val,
      })
      .then(({ data }) => {
        const variants = data.products.reduce((acc, next) => {
          return acc.concat(
            next.variants.map(v => ({
              title: `${next.title} - ${v.title}`,
              prices: v.prices,
              inventory_quantity: v.inventory_quantity,
              sku: v.sku,
              variant_id: v._id,
            }))
          )
        }, [])
        setSearchResults(variants)
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
                        {s.title}
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
                  <Box width={110} px={2} py={1}>
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
                    <Box width={110} px={2} py={1}>
                      <Text fontSize={1}>
                        {extractPrice(item.prices, order)} {order.currency_code}
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
            <Box px={2} width={110} fontSize={1}>
              {toPay} {order.currency_code}
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

export default SwapMenu
