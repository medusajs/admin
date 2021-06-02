import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Checkbox, Label } from "@rebass/forms"
import styled from "@emotion/styled"
import MultiSelect from "react-multi-select-component"

import Medusa from "../../../services/api"
import Button from "../../../components/button"
import Typography from "../../../components/typography"

import useMedusa from "../../../hooks/use-medusa"
import Modal from "../../../components/modal"
import Input from "../../../components/input"
import Items from "./components/items"
import ShippingDetails from "./components/shipping-details"
import Billing from "./components/billing-details"
import Summary from "./components/summary"
import { ReactSelect } from "../../../components/react-select"
import Select from "../../../components/select"
import { extractOptionPrice } from "../../../utils/prices"

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
const defaultFormValues = {
  region: null,
  shipping: null,
  billing: null,
  email: "",
  customerId: "",
  customer: null,
  shippingOption: null,
  requireShipping: true,
}

const removeEmpty = obj =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))

const NewOrder = ({ onDismiss, refresh }) => {
  const [searchResults, setSearchResults] = useState([])
  const [customerAddresses, setCustomerAddresses] = useState([])
  const [items, setItems] = useState([])
  const [step, setStep] = useState(0)
  const [shippingOptions, setShippingOptions] = useState([])
  const [customOptionPrice, setCustomOptionPrice] = useState()
  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [creatingOrder, setCreatingOrder] = useState(false)
  const [bodyElement, setBodyElement] = useState()

  const form = useForm({
    shouldUnregister: false,
    defaultValues: defaultFormValues,
  })

  const {
    shipping,
    billing,
    discount,
    email,
    customerId,
    region,
    shippingOption,
    requireShipping,
  } = form.watch()

  const { regions } = useMedusa("regions")

  const handleProductSearch = async q => {
    try {
      const { data } = await Medusa.variants.list({ q })
      setSearchResults(data.variants)
    } catch (error) {
      throw Error("Could not fetch products")
    }
  }

  const addCustomItem = ({ title, price, quantity }) => {
    const item = { title, unit_price: price, quantity: quantity || 1 }
    setItems([...items, item])
  }

  const handleAddItem = variant => {
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

  const fetchShippingOptions = async adminOnly => {
    try {
      const { data } = await Medusa.shippingOptions.list({
        region_id: region.id,
        is_return: false,
        admin_only: adminOnly,
      })

      setShippingOptions(data.shipping_options)
    } catch (error) {
      throw Error("Could not fetch shipping options")
    }
  }

  const submit = async () => {
    const doItems = items.map(i => {
      const obj = {
        variant_id: i.id || "",
        quantity: i.quantity,
        title: i.title,
      }

      if (i.unit_price) {
        obj.unit_price = i.unit_price * 100
      }

      return obj
    })

    const draftOrder = {
      region_id: region.id,
      items: doItems,
      email,
    }

    if (customerId) {
      draftOrder.customer_id = customerId
    }

    if (billing.id) {
      draftOrder.billing_address_id = billing.id
    } else {
      draftOrder.billing_address = removeEmpty(billing)
    }

    if (discount && discount.code) {
      draftOrder.discounts = [{ code: discount.code }]
    }

    const option = {
      option_id: shippingOption.id,
      data: shippingOption.data,
    }

    if (customOptionPrice && showCustomPrice) {
      option.price = customOptionPrice * 100
    }

    draftOrder.shipping_methods = [option]

    if (shipping.id) {
      draftOrder.shipping_address_id = shipping.id
    } else if (_.isEmpty(shipping)) {
      draftOrder.shipping_address = removeEmpty(billing)
    } else {
      draftOrder.shipping_address = removeEmpty(shipping)
    }

    if (!shipping.id && shipping) {
      draftOrder.shipping_address_id = shipping.id
    }

    setCreatingOrder(true)
    try {
      await Medusa.draftOrders.create(draftOrder)
      refresh()
      onDismiss()
    } catch (error) {
      onDismiss()
    }

    setCreatingOrder(false)
  }

  const isDisabled = () => {
    switch (true) {
      case step === 0: {
        return !region
      }

      case step === 2: {
        return !items.length
      }

      case step === 3: {
        if (!email || (shipping && _.isEmpty(shipping) && requireShipping)) {
          return true
        } else if (!email && !requireShipping) {
          return true
        } else {
          return false
        }
      }

      case step === 4: {
        return !shippingOption
      }

      case step === 5: {
        return _.isEmpty(billing)
      }

      default:
        return false
    }
  }

  const handleNext = async data => {
    if (step === 6) {
      await submit(data)
    } else {
      setStep(step + 1)
    }
  }

  const handleRegionSelect = regId => {
    const reg = regions.find(r => r.id === regId)
    form.setValue("region", reg)
  }

  const handleOptionSelect = so => {
    const selectSo = shippingOptions?.find(s => so.value === s.id)
    form.setValue("shippingOption", selectSo)
  }

  useEffect(() => {
    setBodyElement(document.body)
  }, [])

  useEffect(() => {
    if (regions) {
      form.setValue("region", regions[0])
    }
  }, [regions])

  useEffect(() => {
    if (region && !requireShipping) {
      fetchShippingOptions(true)
    }

    if (region && requireShipping) {
      fetchShippingOptions(false)
    }
  }, [region, requireShipping])

  return (
    <Modal as="form" onSubmit={form.handleSubmit(handleNext)}>
      <Modal.Body>
        <Modal.Header sx={{ justifyContent: "space-between" }}>
          <Text>Create draft order</Text>
          <Text onClick={onDismiss} sx={{ fontSize: [0], cursor: "pointer" }}>
            Close
          </Text>
        </Modal.Header>
        <Modal.Content flexDirection="column" minWidth="600px">
          {step === 0 && (
            <Flex flexDirection="column" minHeight="75px">
              <Text fontSize={1} mb={2}>
                Choose region
              </Text>
              <Select
                value={region?.id}
                placeholder="Select region"
                onChange={e => handleRegionSelect(e.currentTarget.value)}
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
                  id="requireShipping"
                  name="requireShipping"
                  ref={form.register}
                  checked={requireShipping}
                  onChange={() =>
                    form.setValue("requireShipping", !requireShipping)
                  }
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
              selectedRegion={region}
              searchResults={searchResults}
              items={items}
            />
          )}
          {step === 3 && (
            <ShippingDetails
              form={form}
              requireShipping={requireShipping}
              customerAddresses={customerAddresses}
              setCustomerAddresses={setCustomerAddresses}
            />
          )}
          {step === 4 && (
            <Flex flexDirection="column" minHeight="200px">
              <Flex>
                <Text fontSize={1} mb={2} fontWeight="600">
                  Shipping method
                </Text>
              </Flex>
              <Text fontSize={1} mb={2}>
                Choose one
              </Text>
              {!requireShipping && !shippingOptions?.length ? (
                <Text
                  textAlign="center"
                  fontStyle="italic"
                  fontSize={1}
                  mt={1}
                  color="#a2a1a1"
                  maxWidth="500px"
                >
                  You don't have any options for orders without shipping. Please
                  add one (e.g. "In-store fulfillment") with "Show on website"
                  unchecked in region settings and continue.
                </Text>
              ) : (
                <ReactSelect
                  menuPortalTarget={bodyElement}
                  isClearable={false}
                  placeholder="Select shipping..."
                  onChange={so => handleOptionSelect(so)}
                  options={
                    shippingOptions?.map(so => ({
                      value: so.id,
                      label: `${so.name} - ${extractOptionPrice(
                        so.amount,
                        region
                      )}`,
                    })) || []
                  }
                />
              )}
              <Flex>
                {shippingOptions?.length ? (
                  <>
                    <Text
                      fontStyle="italic"
                      fontSize={1}
                      mt={1}
                      color="#a2a1a1"
                    >
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
                          disabled={!shippingOption}
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
                              onChange={e =>
                                setCustomOptionPrice(e.currentTarget.value)
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
                  </>
                ) : null}
              </Flex>
            </Flex>
          )}
          {step === 5 && <Billing form={form} />}
          {step === 6 && (
            <Summary
              items={items}
              regions={regions}
              handleAddQuantity={handleAddQuantity}
              showCustomPrice={showCustomPrice}
              customOptionPrice={customOptionPrice}
              form={form}
            />
          )}
        </Modal.Content>
        <Modal.Footer>
          <Button
            variant="primary"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
          <Box ml="auto" />
          <Button
            variant="cta"
            loading={creatingOrder}
            disabled={isDisabled()}
            type="submit"
          >
            {step === 6 ? "Submit" : "Next"}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default NewOrder
