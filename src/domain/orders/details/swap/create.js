import React, { useState, useEffect, useMemo } from "react"
import { Text, Flex, Box } from "rebass"
import { Input as RebassInput } from "@rebass/forms"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import MultiSelect from "react-multi-select-component"

import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import Select from "../../../../components/select"
import Typography from "../../../../components/typography"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"
import InfoTooltip from "../../../../components/info-tooltip"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/cross.svg"

const FREE_SHIPPING_OPTION = {
  label: "Give free shipping",
  value: "free_shipping",
}

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

const computeNewItemsTotal = (items, order) => {
  const total = items.reduce(
    (total, item) => total + extractPrice(item.prices, order) * item.quantity,
    0
  )
  return `${total.toFixed(2)} ${order.currency_code.toUpperCase()}`
}

const prepareCustomShippingOptions = (
  customShippingOptions,
  shippingOptions
) => {
  if (!customShippingOptions.length) return []

  const hasFreeShipping =
    customShippingOptions.findIndex(
      cso => cso.id === FREE_SHIPPING_OPTION.value
    ) > -1

  return hasFreeShipping
    ? shippingOptions.map(so => ({
        option_id: so.id,
        price: 0,
      }))
    : customShippingOptions.map(cso => ({
        option_id: cso.id,
        price: cso.price * 100,
      }))
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
  const [customShippingOptions, setCustomShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [searchResults, setSearchResults] = useState([])

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState([])

  const { register, setValue, handleSubmit } = useForm()

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
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

    // only count the custom shipping total towards the total if there is only one custom shipping option
    const customShippingTotal =
      customShippingOptions.length === 1 ? customShippingOptions[0].price : 0

    setToPay(newItemsTotal + customShippingTotal * 100 - returnTotal)
  }, [toReturn, quantities, shippingPrice, itemsToAdd, customShippingOptions])

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

    data.custom_shipping_options = prepareCustomShippingOptions(
      customShippingOptions,
      shippingOptions
    )

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

  const handleCustomShippingOptionSelected = e => {
    const shippingOption = e.target
    const exists =
      customShippingOptions.findIndex(cso => cso.id === shippingOption.value) >
      -1
    if (exists) return

    if (shippingOption.value === FREE_SHIPPING_OPTION.value) {
      setCustomShippingOptions([
        {
          id: FREE_SHIPPING_OPTION.value,
          name: FREE_SHIPPING_OPTION.label,
          editablePrice: false,
          price: 0,
        },
      ])
    } else if (shippingOption.value !== "Add a shipping method") {
      const method = shippingOptions.find(o => shippingOption.value === o.id)
      const price = (method.amount * (1 + order.tax_rate / 100)) / 100

      // ensure that free shipping is mutually exclusive with all other options
      // in other words: you can't select free shipping AND any other shipping option
      const existingWithoutFreeShipping = customShippingOptions.filter(
        cso => cso.id !== FREE_SHIPPING_OPTION.value
      )
      setCustomShippingOptions([
        ...existingWithoutFreeShipping,
        { price, id: method.id, name: method.name, editablePrice: true },
      ])
    }
  }

  const handleCustomShippingOptionPriceChange = (e, index) => {
    const value = e.target.value
    const newCustomShippingOptions = customShippingOptions.slice()
    newCustomShippingOptions[index].price = value
    setCustomShippingOptions(newCustomShippingOptions)
  }

  const handleRemoveCustomShippingOption = index => {
    const newCustomShippingOptions = customShippingOptions.slice()
    newCustomShippingOptions.splice(index, 1)
    setCustomShippingOptions(newCustomShippingOptions)
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

  const selectCustomOptions = useMemo(() => {
    return [
      FREE_SHIPPING_OPTION,
      ...shippingOptions.map(so => ({ label: so.name, value: so.id })),
    ]
  }, [shippingOptions])

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header
          onDismiss={onDismiss}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text variant="h3">Create Swap</Text>
          <CloseIcon
            style={{ cursor: "pointer" }}
            onClick={onDismiss}
            width={12}
            height={12}
          />
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text variant="small.bold" py={3}>
              Items to return
            </Text>
            <Flex
              sx={{
                borderBottom: "hairline",
              }}
              justifyContent="space-between"
              fontSize={1}
              py={3}
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
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text variant="small.bold" py={3}>
                Items to send
              </Text>
              <Box>
                <Dropdown
                  leftAlign
                  toggleText={"+ Add product"}
                  justifyContent="flex-start"
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
            </Box>
            <Box mt={3}>
              {itemsToAdd.length > 0 && (
                <Flex
                  sx={{
                    borderBottom: "hairline",
                  }}
                  fontSize={1}
                  py={2}
                >
                  <Box
                    sx={{
                      textTransform: "uppercase",
                      flex: 9,
                    }}
                  >
                    Details
                  </Box>
                  <Box
                    sx={{
                      textTransform: "uppercase",
                      flex: 9,
                      textAlign: "center",
                    }}
                  >
                    Quantity
                  </Box>
                  <Box
                    sx={{
                      textTransform: "uppercase",
                      flex: 9,
                      textAlign: "right",
                    }}
                  >
                    Price
                  </Box>
                  <Box sx={{ flex: 1 }}></Box>
                </Flex>
              )}
              {itemsToAdd.map((item, index) => {
                return (
                  <Flex
                    key={item.variant_id}
                    justifyContent="space-between"
                    alignItems="center"
                    fontSize={2}
                    py={2}
                  >
                    <Box flex="9">
                      <Text fontSize={1} lineHeight={"14px"}>
                        {item.title}
                      </Text>
                      <Text fontSize={0}>{item.sku}</Text>
                    </Box>
                    <Box flex="9" display="flex" justifyContent="center">
                      <Input
                        inputStyle={{ color: "black", minHeight: "100%" }}
                        type="number"
                        maxWidth="60px"
                        onChange={e => handleToAddQuantity(e, index)}
                        value={item.quantity || ""}
                        min={1}
                      />
                    </Box>
                    <Box flex="9" display="flex" justifyContent="flex-end">
                      <CurrencyInput
                        step="any"
                        currency={order.currency_code}
                        value={extractPrice(item.prices, order)}
                      />
                    </Box>
                    <Box
                      display="flex"
                      justifyContent="center"
                      flex="1"
                      onClick={() => handleRemoveItem(index)}
                    >
                      &times;
                    </Box>
                  </Flex>
                )
              })}
              {itemsToAdd.length > 0 && (
                <Box
                  maxWidth="410px"
                  marginLeft="auto"
                  sx={{
                    "& > div:not(:last-child)": { borderBottom: "hairline" },
                  }}
                >
                  <Flex
                    py={3}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <Text mr={2} variant="tiny.default">
                        Configure shipping options
                      </Text>
                      <InfoTooltip tooltipText="You can set custom shipping options by choosing one or multiple shipping options" />
                    </Box>
                    <Select
                      height={"32px"}
                      fontSize={1}
                      placeholder={"Add a shipping method"}
                      value={shippingMethod}
                      onChange={handleCustomShippingOptionSelected}
                      options={selectCustomOptions}
                    />
                  </Flex>
                  {customShippingOptions.map((cso, index) => (
                    <Flex
                      py={3}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text mr={2} variant="tiny.default">
                        {cso.name}
                      </Text>
                      <Box display="flex" alignItems="center">
                        {cso.editablePrice && (
                          <CurrencyInput
                            step="any"
                            currency={order.currency_code}
                            onChange={e =>
                              handleCustomShippingOptionPriceChange(e, index)
                            }
                            value={cso.price}
                          />
                        )}
                        <Box
                          ml={2}
                          onClick={() =>
                            handleRemoveCustomShippingOption(index)
                          }
                        >
                          &times;
                        </Box>
                      </Box>
                    </Flex>
                  ))}
                  <Flex
                    py={3}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Text mr={2} variant="tiny.default">
                      New item total
                    </Text>
                    <Text variant="tiny.default">
                      {computeNewItemsTotal(itemsToAdd, order)}
                    </Text>
                  </Flex>
                  <Flex
                    py={3}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center">
                      <Text mr={2} variant="tiny.default">
                        Difference
                      </Text>
                      <InfoTooltip tooltipText="help" />
                    </Box>
                    <Text variant="tiny.default">
                      {(toPay / 100).toFixed(2)}{" "}
                      {order.currency_code.toUpperCase()}
                    </Text>
                  </Flex>
                </Box>
              )}
            </Box>
          </Box>
        </Modal.Content>
        <Modal.Footer sx={{ gap: "8px" }}>
          <Box py={1}>
            <input
              id="noNotification"
              name="noNotification"
              checked={!noNotification}
              onChange={() => setNoNotification(!noNotification)}
              type="checkbox"
            />
          </Box>
          <Box py={1}>
            <Text fontSize={1}>Send notifications</Text>
          </Box>
          <Button ml="auto" onClick={onDismiss} type="button" variant="primary">
            Cancel
          </Button>
          <Button
            disabled={toReturn.length === 0 || itemsToAdd.length === 0}
            loading={submitting}
            type="submit"
            variant="deep-blue"
          >
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const CurrencyInput = ({ value, currency, ...props }) => {
  return (
    <Wrapper>
      <CurrencyBox>
        <CurrencyLabel>{currency}</CurrencyLabel>
      </CurrencyBox>
      <PriceInput value={value} type="number" min="0" {...props} />
    </Wrapper>
  )
}

const Wrapper = styled(Box)`
  display: flex;
  border-radius: 5px;
  box-shadow: ${props => props.theme.shadows.inputBoxShadow};
  overflow: hidden;
  max-width: ${props => props.maxWidth || "120px"};
  &:focus-within {
    box-shadow: ${props => props.theme.shadows.inputBoxShadowHover};
  }
`

const CurrencyBox = styled(Box)`
  ${props => props.theme.text.small.default};
  color: ${props => props.theme.colors["medusa-80"]};
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  border-right: 1px solid ${props => props.theme.colors["medusa-60"]};
`

const CurrencyLabel = styled(Box)`
  flex: 1;
  text-transform: uppercase;
`

const PriceInput = styled(RebassInput)`
  border: none;
  box-shadow: none;
  flex: 1;
  padding: 4px 8px;
  ${props => props.theme.text.small.default};

  &:hover,
  &:focus {
    box-shadow: none;
  }
`

export default SwapMenu
