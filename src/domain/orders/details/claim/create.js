import React, { useState, useEffect, useRef } from "react"
import { Text, Flex, Box } from "rebass"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"

import Pill from "../../../../components/pill"
import Modal from "../../../../components/modal"
import ImageUpload from "../../../../components/image-upload"
import Input from "../../../../components/input"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import TextArea from "../../../../components/textarea"
import Select from "../../../../components/select"
import AddressForm from "../address-form"
import Medusa from "../../../../services/api"

import { ReactComponent as Trash } from "../../../../assets/svg/trash.svg"
import { ReactComponent as Edit } from "../../../../assets/svg/edit.svg"
import { ReactSelect } from "../../../../components/react-select"
import { extractOptionPrice } from "../../../../utils/prices"

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
  const [shippingAddress, setShippingAddress] = useState({})
  const [countries, setCountries] = useState([])
  const [showAddress, setShowAddress] = useState(false)
  const [isReplace, toggleReplace] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [toPay, setToPay] = useState(0)
  const [toReturn, setToReturn] = useState({})
  const [quantities, setQuantities] = useState({})

  const [itemsToAdd, setItemsToAdd] = useState([])
  const [shippingLoading, setShippingLoading] = useState(true)
  const [returnShippingOptions, setReturnShippingOptions] = useState([])
  const [returnShippingMethod, setReturnShippingMethod] = useState()
  const [returnShippingPrice, setReturnShippingPrice] = useState()
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [showCustomPrice, setShowCustomPrice] = useState({
    standard: false,
    return: false,
  })
  const [customOptionPrice, setCustomOptionPrice] = useState({
    standard: 0,
    return: null,
  })
  const [searchResults, setSearchResults] = useState([])
  const [ready, setReady] = useState(false)

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState([])

  const addressForm = useForm()

  const handleSaveAddress = data => {
    setShippingAddress(data.address)
    setShowAddress(false)
  }

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

  const formatAddress = address => {
    let addr = [address.address_1]
    if (address.address_2) {
      addr.push(address.address_2)
    }

    let city = `${address.postal_code} ${address.city}`

    return `${addr.join(", ")}, ${city}, ${address.country_code?.toUpperCase()}`
  }

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

  useEffect(() => {
    Medusa.regions.retrieve(order.region_id).then(({ data }) => {
      setCountries(data.region.countries.map(c => c.iso_2))
    })
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: true,
      })
      .then(({ data }) => {
        setReturnShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    Medusa.regions.retrieve(order.region_id).then(({ data }) => {
      setCountries(data.region.countries.map(c => c.iso_2))
    })
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: false,
      })
      .then(({ data }) => {
        setShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    if (toReturn) {
      if (
        Object.keys(toReturn).length !== 0 &&
        isReplace &&
        itemsToAdd.length > 0 &&
        shippingMethod
      ) {
        setReady(true)
      } else if (!isReplace && Object.keys(toReturn).length !== 0) {
        setReady(true)
      } else {
        setReady(false)
      }
    } else {
      setReady(false)
    }
  }, [toReturn, isReplace, itemsToAdd, shippingMethod])

  useEffect(() => {
    if (!isReplace) {
      setShippingMethod()
      setShippingPrice()
      setShowCustomPrice({
        ...showCustomPrice,
        standard: false,
      })
    }
  }, [isReplace])

  useEffect(() => {
    setCustomOptionPrice({
      ...customOptionPrice,
      standard: 0,
    })
  }, [shippingMethod, showCustomPrice])

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
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingAddress.address_1) {
      data.shipping_address = shippingAddress
    }

    if (returnShippingMethod) {
      data.return_shipping = {
        option_id: returnShippingMethod.id,
        price:
          showCustomPrice.return && customOptionPrice.return
            ? customOptionPrice.return * 100
            : Math.round(returnShippingPrice / (1 + order.tax_rate / 100)),
      }
    }

    if (shippingMethod) {
      data.shipping_methods = [
        {
          option_id: shippingMethod.id,
          price: customOptionPrice.standard * 100,
        },
      ]
    }

    // data.shipping_methods = order.shipping_methods.map(({ id }) => ({ id }))

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

  const handleReturnShippingSelected = so => {
    const selectSo = returnShippingOptions.find(s => so.value === s.id)
    if (selectSo) {
      setReturnShippingMethod(selectSo)
      setReturnShippingPrice(selectSo.amount * (1 + order.tax_rate / 100))
    } else {
      setReturnShippingMethod()
      setReturnShippingPrice(0)
    }
  }

  const handleShippingSelected = so => {
    const selectSo = shippingOptions.find(s => so.value === s.id)
    if (selectSo) {
      setShippingMethod(selectSo)
      setShippingPrice(selectSo.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  // const handleUpdateShippingPrice = e => {
  //   const element = e.target
  //   const value = element.value
  //   if (value >= 0) {
  //     setShippingPrice(parseFloat(value) * 100)
  //   }
  // }

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
      <Modal.Body
        onSubmit={e => {
          e.preventDefault()
          onSubmit()
        }}
        as="form"
      >
        <Modal.Header>Create Claim</Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text sx={{ fontSize: 1, fontWeight: 600 }}>Items to claim</Text>
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
              if (item.returned_quantity === item.quantity) {
                return
              }

              return (
                <Flex sx={{ flexDirection: "column" }}>
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
                  </Flex>
                  {item.id in toReturn && (
                    <Flex
                      mx={-3}
                      sx={{
                        backgroundColor: "#fafafa",
                        justifyContent: "space-between",
                      }}
                      py={3}
                      px={3}
                    >
                      <Select
                        sx={{ flex: 1 }}
                        selectStyle={{ width: "100%" }}
                        label="Reason"
                        height={"32px"}
                        fontSize={1}
                        placeholder={"Select reason"}
                        value={toReturn[item.id].reason}
                        onChange={e => handleReasonChange(e, item)}
                        options={reasonOptions}
                      />
                      <Box mx={3} sx={{ flex: 1 }}>
                        <TextArea
                          maxWidth="180px"
                          label="Note"
                          value={toReturn[item.id].note}
                          onChange={e => handleNoteChange(e, item)}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <ImageUpload
                          button={toReturn[item.id].images?.length > 0}
                          onChange={e => handleAddImage(e, item)}
                          name="files"
                          label="Images"
                        />
                        <StyledImageBox mt={1}>
                          {toReturn[item.id].images?.map((url, i) => (
                            <ImageCardWrapper mr={1} mt={1} key={i}>
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
                      </Box>
                    </Flex>
                  )}
                </Flex>
              )
            })}
          </Box>

          <Box>
            <Text sx={{ fontSize: 1, fontWeight: 600 }}>
              Shipping method for returning items:
            </Text>
            <ReactSelect
              isClearable={false}
              placeholder="Select shipping..."
              onChange={so => handleReturnShippingSelected(so)}
              options={
                returnShippingOptions?.map(so => ({
                  value: so.id,
                  label: `${so.name} - ${extractOptionPrice(
                    so.amount,
                    so.region
                  )}`,
                })) || []
              }
            />
            <Flex>
              {returnShippingMethod ? (
                <>
                  <Text fontStyle="italic" fontSize={1} mt={1} color="#a2a1a1">
                    Shipping to {returnShippingMethod.region.name}
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
                        disabled={!returnShippingMethod}
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
          <Flex mt={3} alignItems="center">
            <Pill
              height="28px"
              width="50%"
              onClick={() => {
                toggleReplace(true)
              }}
              active={isReplace}
              mr={2}
            >
              Replace
            </Pill>
            <Pill
              height="28px"
              width="50%"
              onClick={() => {
                toggleReplace(false)
              }}
              active={!isReplace}
            >
              Refund
            </Pill>
          </Flex>
          {isReplace && (
            <>
              <Box my={3}>
                <Text sx={{ fontSize: 1, fontWeight: 600 }}>Items to send</Text>
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
                        sx={{ alignItems: "center" }}
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
                        <Box
                          variant={"buttons.link"}
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash />
                        </Box>
                      </Flex>
                    )
                  })}
                </Box>
                {shippingAddress.address_1 ? (
                  <Flex sx={{ alignItems: "center" }}>
                    <Text sx={{ fontSize: 0 }}>
                      Shipping to: {formatAddress(shippingAddress)}
                    </Text>
                    <Text
                      ml={3}
                      onClick={() => setShowAddress(true)}
                      variant={"buttons.link"}
                    >
                      <Edit /> Edit
                    </Text>
                  </Flex>
                ) : (
                  <Text
                    onClick={() => setShowAddress(true)}
                    variant={"buttons.link"}
                    sx={{ display: "inline-block" }}
                  >
                    Ship to a different address
                  </Text>
                )}
              </Box>
              <Box>
                <Text sx={{ fontSize: 1, fontWeight: 600 }} mb={2}>
                  Shipping method for new items:
                </Text>
                <ReactSelect
                  isClearable={false}
                  placeholder="Select shipping..."
                  onChange={so => handleShippingSelected(so)}
                  options={
                    shippingOptions?.map(so => ({
                      value: so.id,
                      label: `${so.name}`,
                    })) || []
                  }
                />
                <Flex>
                  {shippingMethod ? (
                    <>
                      <Text
                        fontStyle="italic"
                        fontSize={1}
                        mt={1}
                        color="#a2a1a1"
                      >
                        Shipping new items is free pr. default. Use custom
                        price, if this is not the case
                      </Text>
                      <Box ml="auto" />
                      <Flex flexDirection="column">
                        {!showCustomPrice.standard && (
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
                                standard: true,
                              })
                            }
                          >
                            {showCustomPrice.standard
                              ? "Submit"
                              : "Set custom price"}
                          </Button>
                        )}
                        {showCustomPrice.standard && (
                          <Flex flexDirection="column">
                            <Flex width="140px" mt={3}>
                              <Input
                                type="number"
                                fontSize="12px"
                                onChange={e =>
                                  setCustomOptionPrice({
                                    ...customOptionPrice,
                                    standard: e.currentTarget.value,
                                  })
                                }
                                value={customOptionPrice.standard || null}
                                placeholder={order.currency_code.toUpperCase()}
                                min={0}
                              />
                              <Flex
                                px={2}
                                alignItems="center"
                                onClick={() =>
                                  setShowCustomPrice({
                                    ...showCustomPrice,
                                    standard: false,
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
            </>
          )}
        </Modal.Content>
        <Modal.Footer>
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
          <Box ml="auto" />
          <Button
            disabled={!ready}
            loading={submitting}
            type="submit"
            variant="primary"
          >
            Complete
          </Button>
        </Modal.Footer>
      </Modal.Body>
      {showAddress && (
        <Modal
          onClick={e => {
            e.stopPropagation()
            setShowAddress(false)
          }}
        >
          <Modal.Body>
            <Modal.Header fontSize={1}>Shipping address</Modal.Header>
            <Modal.Content>
              <AddressForm
                address={shippingAddress}
                country={order.shipping_address.country_code}
                allowedCountries={countries}
                form={addressForm}
              />
            </Modal.Content>
            <Modal.Footer justifyContent="flex-end">
              {shippingAddress.address_1 && (
                <Text
                  mr={3}
                  onClick={() => {
                    setShippingAddress({})
                    setShowAddress(false)
                  }}
                  variant="buttons.link"
                >
                  Clear Address
                </Text>
              )}
              <Button
                onClick={addressForm.handleSubmit(handleSaveAddress)}
                loading={submitting}
                variant="primary"
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
    </Modal>
  )
}

export default ClaimMenu
