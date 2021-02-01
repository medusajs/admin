import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import MultiSelect from "react-multi-select-component"

import Pill from "../../../../components/pill"
import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import ImageUpload from "../../../../components/image-upload"
import Input from "../../../../components/input"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import TextArea from "../../../../components/textarea"
import Select from "../../../../components/select"
import Typography from "../../../../components/typography"
import Medusa from "../../../../services/api"

const removeNullish = obj =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const Cross = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 5px;
  cursor: pointer;
`

const Dot = styled(Box)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
`

const ImageCardWrapper = styled(Box)`
  position: relative;
  display: inline-block;
  height: 100px;
  width: 100px;
`

const StyledImageCard = styled(Box)`
  height: 100px;
  width: 100px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  object-fit: contain;

  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;

  border-radius: 3px;
`

const StyledImageBox = styled(Flex)`
  flex-wrap: wrap;
  .img-container {
    border: 1px solid black;
    background-color: ${props => props.theme.colors.light};
    height: 50px;
    width: 50px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
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

const ClaimMenu = ({ order, onCreate, onDismiss, toaster }) => {
  const [isReplace, toggleReplace] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [toPay, setToPay] = useState(0)
  const [toReturn, setToReturn] = useState({})
  const [quantities, setQuantities] = useState({})

  const [itemsToAdd, setItemsToAdd] = useState([])
  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [searchResults, setSearchResults] = useState([])

  const { register, setValue, handleSubmit } = useForm()

  const handleAddItemToClaim = variant => {
    setItemsToAdd([...itemsToAdd, { ...variant, quantity: 1 }])
  }

  const handleReturnToggle = item => {
    const id = item.id

    const newReturns = { ...toReturn }

    if (id in toReturn) {
      delete newReturns[id]
    } else {
      newReturns[id] = {
        tags: [],
        images: [],
        reason: null,
        note: "",
        quantity: item.quantity - item.returned_quantity,
      }
    }

    setToReturn(newReturns)
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

  //useEffect(() => {
  //  const items = toReturn.map(t => order.items.find(i => i.id === t))
  //  const returnTotal =
  //    items.reduce((acc, next) => {
  //      return acc + (next.refundable / next.quantity) * quantities[next.id]
  //    }, 0) - (shippingPrice || 0)

  //  const newItemsTotal = itemsToAdd.reduce((acc, next) => {
  //    const price = extractPrice(next.prices, order)
  //    const lineTotal = price * 100 * next.quantity
  //    return acc + lineTotal
  //  }, 0)

  //  setToPay(newItemsTotal - returnTotal)
  //}, [toReturn, quantities, shippingPrice, itemsToAdd])

  const handleQuantity = (e, item) => {
    const element = e.target
    const newReturns = {
      ...toReturn,
      [item.id]: {
        ...toReturn[item.id],
        quantity: parseInt(element.value),
      },
    }

    setToReturn(newReturns)
  }

  const onSubmit = () => {
    const claim_items = Object.entries(toReturn).map(([key, val]) => {
      const clean = removeNullish(val)
      return {
        item_id: key,
        ...clean,
      }
    })

    const data = {
      type: isReplace ? "replace" : "refund",
      claim_items,
      additional_items: itemsToAdd.map(i => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod,
        price: Math.round(shippingPrice / (1 + order.tax_rate / 100)),
      }
    }

    data.shipping_methods = order.shipping_methods.map(({ id }) => ({ id }))

    if (onCreate) {
      setSubmitting(true)
      return onCreate(data)
        .then(() => onDismiss())
        .then(() => toaster("Successfully created claim", "success"))
        .catch(() => toaster("Failed to create claim order", "error"))
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
          newReturns[item.id] = {
            quantity: item.quantity - item.returned_quantity,
          }
        }
      }
      setQuantities(newQuantities)
      setToReturn(newReturns)
      setReturnAll(true)
    }
  }

  const handleNoteChange = (e, item) => {
    const element = e.target

    setToReturn(prev => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        note: element.value,
      },
    }))
  }

  const handleAddImage = (e, item) => {
    Medusa.uploads.create(e.target.files).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => url)

      setToReturn(prev => ({
        ...prev,
        [item.id]: {
          ...(prev[item.id] || {}),
          images: [...prev[item.id].images, ...uploaded],
        },
      }))
    })
  }

  const handleImageDelete = (url, item) => {
    Medusa.uploads.delete(url[0]).then(() => {
      setToReturn({
        ...toReturn,
        [item.id]: {
          ...(toReturn[item.id] || {}),
          images: toReturn[item.id].images.filter(im => im !== url),
        },
      })
    })
  }

  const handleReasonChange = (e, item) => {
    const element = e.target

    setToReturn(prev => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        reason: element.value,
      },
    }))
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

  const reasonOptions = [
    {
      label: "Missing Item",
      value: "missing_item",
    },
    {
      label: "Wrong Item",
      value: "wrong_item",
    },
    {
      label: "Production Failure",
      value: "production_failure",
    },
  ]

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Create Claim</Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text px={2}>Items to claim</Text>
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
            {order.items.map(item => {
              // Only show items that have not been returned
              if (item.returned) {
                return
              }

              return (
                <Flex
                  key={item.id}
                  flexWrap="wrap"
                  justifyContent="space-between"
                  fontSize={2}
                  py={2}
                >
                  <Box width={30} px={2} py={1}>
                    <input
                      checked={item.id in toReturn}
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
                    {item.id in toReturn ? (
                      <Input
                        type="number"
                        onChange={e => handleQuantity(e, item)}
                        value={toReturn[item.id].quantity || ""}
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
                  {item.id in toReturn && (
                    <Flex height="300px" py={3} width="100%">
                      <Flex flexDirection="column">
                        <Box mt={4} px={2}>
                          <Select
                            inline
                            label="Reason"
                            mr={3}
                            height={"32px"}
                            fontSize={1}
                            placeholder={"Select reason"}
                            value={toReturn[item.id].reason}
                            onChange={e => handleReasonChange(e, item)}
                            options={reasonOptions}
                          />
                        </Box>
                        <Box mt={4} px={2}>
                          <TextArea
                            inline
                            label="Note"
                            value={toReturn[item.id].reason}
                            onChange={e => handleNoteChange(e, item)}
                          />
                        </Box>
                      </Flex>
                      <Flex flexDirection="column" height="100%">
                        <Flex
                          height="100%"
                          flexWrap="wrap"
                          flexDirection="column"
                          mb={4}
                        >
                          <Box height="100%">
                            <ImageUpload
                              onChange={e => handleAddImage(e, item)}
                              name="files"
                              label="Images"
                            />
                          </Box>
                          <StyledImageBox p={3}>
                            {toReturn[item.id].images.map((url, i) => (
                              <ImageCardWrapper key={i} m={"5px"}>
                                <StyledImageCard
                                  key={i}
                                  as="img"
                                  src={url}
                                  sx={{}}
                                />
                                <Cross
                                  onClick={() => handleImageDelete(url, item)}
                                >
                                  &#x2715;
                                </Cross>
                              </ImageCardWrapper>
                            ))}
                          </StyledImageBox>
                        </Flex>
                      </Flex>
                    </Flex>
                  )}
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

          <Flex mt={4} alignItems="center">
            <Pill
              width="50%"
              onClick={() => {
                toggleReplace(true)
              }}
              active={isReplace}
              mr={4}
            >
              Replace
            </Pill>
            <Pill
              width="50%"
              onClick={() => {
                toggleReplace(false)
              }}
              active={!isReplace}
            >
              Refund
            </Pill>
          </Flex>
          {isReplace ? (
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
                      onClick={() => handleAddItemToClaim(s)}
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
          ) : (
            <Box my={3}>Refund amount</Box>
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

export default ClaimMenu
