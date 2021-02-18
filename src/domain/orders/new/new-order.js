import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Checkbox, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Medusa from "../../../services/api"

import Button from "../../../components/button"
import Select from "react-select"
import MultiSelect from "react-multi-select-component"
import Typography from "../../../components/typography"

import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"
import Modal from "../../../components/modal"
import Input from "../../../components/input"
import Items from "./components/items"
import ShippingDetails from "./components/shipping-details"
import Billing from "./components/billing"

import ImagePlaceholder from "../../../assets/svg/image-placeholder.svg"
import Summary from "./components/summary"
import { navigate } from "gatsby"

export const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

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

const StyledSelect = styled(Select)`
  font-size: 14px;
  // color: #454545;
`

const NewOrder = ({ onDismiss, refresh }) => {
  const [searchResults, setSearchResults] = useState([])
  const [customerAddresses, setCustomerAddresses] = useState([])
  const [items, setItems] = useState([])
  const [step, setStep] = useState(0)
  const [selectedRegion, setSelectedRegion] = useState(undefined)
  const [customerId, setCustomerId] = useState("")
  const [email, setEmail] = useState("")
  const [requireShipping, setRequireShipping] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [selectedAddress, setSelectedAddress] = useState({
    shipping_address: {},
  })
  const [billingAddress, setBillingAddress] = useState({
    billing_address: {},
  })
  const [customOptionPrice, setCustomOptionPrice] = useState()
  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [bodyElement, setBodyElement] = useState()
  const [selectedCustomer, setSelectedCustomer] = useState()
  const [selectedShippingOption, setSelectedShippingOption] = useState(
    undefined
  )

  const { register, getValues, reset } = useForm()

  const { products, isLoading: isLoadingProducts } = useMedusa("products")
  const { regions } = useMedusa("regions")

  const handleProductSearch = val => {
    Medusa.variants
      .list({
        q: val,
      })
      .then(({ data }) => {
        setSearchResults(data.variants)
      })
  }

  const addCustomItem = ({ title, price, quantity }) => {
    const item = { title, unit_price: price, quantity: quantity || 1 }
    console.log(item)
    setItems([...items, { title, unit_price: price, quantity: quantity || 1 }])
  }

  const extractPrice = prices => {
    const reg = regions.find(r => r.id === selectedRegion.value)
    let price = prices.find(ma => ma.currency_code === reg.currency_code)

    if (price) {
      return (price.amount * (1 + reg.tax_rate / 100)) / 100
    }

    return 0
  }

  const handleAddItem = variant => {
    console.log(variant)
    setItems([...items, { ...variant, quantity: 1 }])
  }

  const handleAddQuantity = (e, index) => {
    const updated = [...items]
    updated[index] = {
      ...items[index],
      quantity: parseInt(e.target.value),
    }

    setItems(updated)
  }

  const handleRemoveItem = index => {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  const fetchShippingOptions = async () => {
    const r = regions.find(reg => reg.id === selectedRegion.value)

    Medusa.shippingOptions
      .list({
        region_id: r.id,
        is_return: false,
      })
      .then(({ data }) => {
        setShippingOptions(data.shipping_options)
      })
  }

  useEffect(() => {
    setBodyElement(document.body)
  }, [])

  useEffect(() => {
    if (regions) {
      setSelectedRegion({ value: regions[0].id, label: regions[0].name })
    }
  }, [regions])

  useEffect(() => {
    if (selectedRegion && requireShipping) {
      fetchShippingOptions()
    }
  }, [selectedRegion, requireShipping])

  if (isLoadingProducts) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  const extractOptionPrice = price => {
    const r = regions.find(reg => reg.id === selectedRegion.value)
    let amount = price

    amount = (amount * (1 + r.tax_rate / 100)) / 100
    return `${amount} ${r.currency_code.toUpperCase()}`
  }

  const handleAddressChange = (name, value) => {
    setSelectedAddress({
      ...selectedAddress,
      shipping_address: {
        ...selectedAddress.shipping_address,
        [name]: value,
      },
    })
  }

  const handleBillingChange = (name, value) => {
    setBillingAddress({
      ...billingAddress,
      billing_address: {
        ...billingAddress.billing_address,
        [name]: value,
      },
    })
  }

  const handleSubmit = async () => {
    const doItems = items.map(i => {
      const obj = {
        // variant id
        variant_id: i.id || "",
        quantity: i.quantity,
        title: i.title,
      }

      if (i.unit_price) {
        obj.unit_price = i.unit_price * 100
      }

      return obj
    })

    if (customOptionPrice && showCustomPrice) {
      option.price = customOptionPrice * 100
    }

    const draftOrder = {
      region_id: region.id,
      items: doItems,
      requires_shipping: requireShipping,
      email,
    }

    if (customerId) {
      draftOrder.customer_id = customerId
    }

    if (billingAddress.billing_address.id) {
      draftOrder.billing_address_id = billingAddress.billing_address.id
    } else {
      draftOrder.billing_address = billingAddress.billing_address
    }

    if (requireShipping) {
      const shippingMethod = shippingOptions.find(
        so => so.id === selectedShippingOption.value
      )

      const option = {
        option_id: shippingMethod.id,
        data: shippingMethod.data,
      }

      draftOrder.shipping_methods = [option]

      if (selectedAddress.shipping_address.id) {
        draftOrder.shipping_address_id = selectedAddress.shipping_address.id
      } else {
        draftOrder.shipping_address = selectedAddress.shipping_address
      }
    }

    setCreatingOrder(true)
    try {
      await Medusa.draftOrders.create(draftOrder)
      setCreatingOrder(false)
      refresh()
      onDismiss()
    } catch (error) {
      setCreatingOrder(false)
      onDismiss()
    }
  }

  const region = regions.find(reg => reg.id === selectedRegion.value)
  const shippingOption =
    shippingOptions?.find(
      so => selectedShippingOption && so.id === selectedShippingOption.value
    ) || {}

  const selectStyles = {
    menuPortal: base => ({
      ...base,
      zIndex: 9999,
      fontSize: "14px",
      fontFamily:
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Ubuntu,sans-serif;",
    }),
  }

  const decideNextButton = () => {
    switch (true) {
      case step === 0: {
        if (!selectedRegion) {
          return true
        } else {
          return false
        }
      }

      case step === 2: {
        if (!items.length) {
          return true
        } else {
          return false
        }
      }
      case step === 3: {
        if (
          !email ||
          (_.isEmpty(selectedAddress.shipping_address) && requireShipping)
        ) {
          return true
        } else if (!email && !requireShipping) {
          return true
        } else {
          return false
        }
      }
      case step === 4 && requireShipping: {
        if (!selectedShippingOption) {
          return true
        } else {
          return false
        }
      }
      case step === 4 && !requireShipping: {
        if (_.isEmpty(billingAddress.billing_address)) {
          return true
        } else {
          return false
        }
      }
      case step === 5 && requireShipping: {
        if (_.isEmpty(billingAddress.billing_address)) {
          return true
        } else {
          return false
        }
      }
      default:
        return false
    }
  }

  const buttonAction = () => {
    if (step === 5 && !requireShipping) {
      handleSubmit()
    }

    if (step === 6) {
      handleSubmit()
    }

    setStep(step + 1)
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body>
        <Modal.Header>Create draft order</Modal.Header>
        <Modal.Content flexDirection="column" minWidth="600px">
          {step === 0 && (
            <Flex flexDirection="column" minHeight="75px">
              <Text fontSize={1} mb={2}>
                Choose region
              </Text>
              <StyledSelect
                styles={{ ...selectStyles }}
                menuPortalTarget={bodyElement}
                isClearable={false}
                value={selectedRegion}
                placeholder="Select collection..."
                onChange={val => setSelectedRegion(val)}
                options={
                  regions?.map(r => ({
                    value: r.id,
                    label: r.name,
                  })) || []
                }
              />
            </Flex>
          )}
          {step === 1 && (
            <Flex flexDirection="column" minHeight="75px">
              <Label width={"200px"} p={2} fontSize={1}>
                <Checkbox
                  id="true"
                  name="requires_shipping"
                  value="true"
                  checked={requireShipping}
                  onChange={() => setRequireShipping(!requireShipping)}
                />
                Shipping required
              </Label>
            </Flex>
          )}
          {step === 2 && (
            <Items
              handleAddItem={handleAddItem}
              handleAddQuantity={handleAddQuantity}
              handleProductSearch={handleProductSearch}
              handleRemoveItem={handleRemoveItem}
              handleAddCustom={addCustomItem}
              extractPrice={extractPrice}
              selectedRegion={regions.find(r => r.id === selectedRegion.value)}
              searchResults={searchResults}
              items={items}
            />
          )}
          {step === 3 && (
            <ShippingDetails
              register={register}
              region={regions.find(r => r.id === selectedRegion.value)}
              reset={reset}
              setEmail={setEmail}
              email={email}
              setCustomerId={setCustomerId}
              requireShipping={requireShipping}
              setSelectedAddress={setSelectedAddress}
              selectedAddress={selectedAddress}
              customerAddresses={customerAddresses}
              setCustomerAddresses={setCustomerAddresses}
              setSelectedCustomer={setSelectedCustomer}
              selectedCustomer={selectedCustomer}
              handleAddressChange={handleAddressChange}
            />
          )}
          {step === 4 && requireShipping && (
            <Flex flexDirection="column" minHeight="200px">
              <Flex>
                <Text fontSize={1} mb={2} fontWeight="600">
                  Shipping method
                </Text>
              </Flex>
              <Text fontSize={1} mb={2}>
                Choose one
              </Text>
              <StyledSelect
                styles={{ ...selectStyles }}
                menuPortalTarget={bodyElement}
                isClearable={false}
                value={selectedShippingOption}
                placeholder="Select shipping..."
                onChange={val => setSelectedShippingOption(val)}
                options={
                  shippingOptions?.map(so => ({
                    value: so.id,
                    label: `${so.name} - ${extractOptionPrice(so.amount)}`,
                  })) || []
                }
              />
              <Flex>
                <Text fontStyle="italic" fontSize={1} mt={1} color="#a2a1a1">
                  Shipping to Denmark
                </Text>
                <Box ml="auto" />
                <Flex flexDirection="column">
                  {!showCustomPrice && (
                    <Button
                      mt={2}
                      fontSize="12px"
                      variant="primary"
                      width="140px"
                      mb={2}
                      disabled={!selectedShippingOption}
                      onClick={() => setShowCustomPrice(true)}
                    >
                      {showCustomPrice ? "Submit" : "Set custom price"}
                    </Button>
                  )}
                  {showCustomPrice && (
                    <Flex flexDirection="column">
                      <Flex width="140px" mt={3}>
                        <Input
                          type="number"
                          fontSize="12px"
                          onChange={({ currentTarget }) =>
                            setCustomOptionPrice(currentTarget.value)
                          }
                          value={customOptionPrice || null}
                        />
                        <Flex
                          px={2}
                          alignItems="center"
                          onClick={() => setShowCustomPrice(false)}
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
              </Flex>
            </Flex>
          )}
          {step === 4 && !requireShipping && (
            <Billing
              requireShipping={requireShipping}
              billingAddress={billingAddress}
              handleBillingChange={handleBillingChange}
              setBillingAddress={setBillingAddress}
              shippingAddress={selectedAddress}
              region={regions.find(r => r.id === selectedRegion.value)}
            />
          )}
          {step === 5 && requireShipping && (
            <Billing
              requireShipping={requireShipping}
              billingAddress={billingAddress}
              handleBillingChange={handleBillingChange}
              setBillingAddress={setBillingAddress}
              shippingAddress={selectedAddress}
              region={regions.find(r => r.id === selectedRegion.value)}
            />
          )}
          {step === 5 && !requireShipping && (
            <Summary
              billingAddress={billingAddress}
              items={items}
              requireShipping={requireShipping}
              region={region}
              regions={regions}
              handleAddQuantity={handleAddQuantity}
              selectedAddress={selectedAddress}
              shippingOption={shippingOption}
              showCustomPrice={showCustomPrice}
              customOptionPrice={customOptionPrice}
              email={email}
            />
          )}
          {step === 6 && requireShipping && (
            <Summary
              billingAddress={billingAddress}
              items={items}
              requireShipping={requireShipping}
              region={region}
              regions={regions}
              handleAddQuantity={handleAddQuantity}
              selectedAddress={selectedAddress}
              shippingOption={shippingOption}
              showCustomPrice={showCustomPrice}
              customOptionPrice={customOptionPrice}
              email={email}
            />
          )}
        </Modal.Content>
        <Modal.Footer justifyContent="">
          <Button
            loading={false}
            variant="primary"
            disabled={step === 0}
            onClick={() => {
              setStep(step - 1)
            }}
          >
            Back
          </Button>
          <Box ml="auto" />
          <Button
            loading={false}
            variant="cta"
            loading={creatingOrder}
            disabled={decideNextButton()}
            onClick={() => buttonAction()}
          >
            {step === 5 && !requireShipping
              ? "Submit"
              : step === 6
              ? "Submit"
              : "Next"}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default NewOrder
